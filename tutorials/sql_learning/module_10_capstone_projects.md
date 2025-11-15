# Module 10 — Capstone Projects & Assessment

## Capstone overview
- Build a complete data-backed application with design, implementation, testing, monitoring and runbooks. Deliverables include schema, sample data scripts, queries, indexing strategy, backup plan, and a short architecture document.

## Example capstone projects
1. E-commerce analytics pipeline
  - Schema design for orders, products, customers.
  - OLAP summary tables or materialized views for daily sales.
  - Stored procedures for nightly ETL and a set of analytics queries.

2. Multi-tenant SaaS baseline
  - Multi-tenant model (shared schema with tenant_id) with row-level security and tenant-aware indexing.
  - Automated provisioning script for new tenants.

3. Real-time order processing with auditing and DR
  - Implement transactional processing, audit logs, backup/restore tests and ASR-style DR runbook (simulate failover).

## Grading rubric
- Schema & normalization (20%)
- Query correctness & performance (30%)
- Security & data protection (15%)
- Backup/DR & operations (15%)
- Documentation & automation (20%)

## Submission checklist
- SQL scripts to create schema and sample data.
- README with architecture diagram and justification for design choices.
- Example queries and performance notes (EXPLAIN plans before/after tuning).
- Cleanup script.

## Next steps
- I can generate starter SQL scripts and a small dataset for any chosen engine (PostgreSQL, MySQL, SQL Server). Tell me which engine you want and I will scaffold the project.




* Short architecture doc (Azure-specific)
* Schema (T-SQL) — `schema.sql`
* Sample data script — `sample_data.sql`
* Essential queries (CRUD + analytics) — `queries.md` (T-SQL examples)
* Indexing strategy + T-SQL index statements — `indexes.sql`
* Backup & restore plan tailored to Azure SQL (point-in-time, geo-restore)
* Testing strategy (unit/integration/load + sample checks)
* Monitoring & alerting (Azure Monitor, Metrics, diagnostics settings)
* Runbooks for common incidents (PITR restore, failover, single-table restore, index add)
* Repo layout and next steps

If you want, I can generate each file content as individual text files ready for your repo. For now I include full contents inline so you can copy-paste.

---

# 1 — Short Architecture Document (Azure-specific)

**Project:** E-commerce — Orders & Inventory (Azure SQL DB + T-SQL)

**Purpose:** Transactional backend for ordering, inventory, customers, payments.

**Azure Components**

* **Azure SQL Database (Managed)** — primary DB (single DB / elastic pool). Use **Business Critical** or **General Purpose** tier depending on I/O/latency needs. Enable zone-redundant configuration if required.
* **Read replicas** (Active Geo-Replication / Read Scale Out on Managed Instance Hyperscale if needed) for analytics/read scaling.
* **App Service / AKS / VM Scale Set** for API servers behind Application Gateway (WAF) or Azure Front Door.
* **Azure Cache for Redis** for sessions and product cache.
* **Azure Blob Storage** for product images.
* **Azure Key Vault** for secrets & certificate management.
* **Azure Monitor + Log Analytics + Application Insights** for telemetry and alerts.
* **Azure Backup** not required for PaaS; use built-in PITR + Geo-restore + long-term backup (if configured).
* **Network**: App VNet + Private Endpoint for Azure SQL (recommended). Use VNet Integration for App Service.
* **CI/CD**: GitHub Actions or Azure DevOps for migrations (SqlPackage, DACPAC, Liquibase for SQL) and deployment.
* **Security & Governance**: Azure Policy, RBAC, Managed Identities for connections.

**HA / DR**

* Built-in **service managed HA** for Azure SQL.
* **PITR** enabled by default (retention configurable: 7–35 days typical).
* **Geo-restore/Geo-replication** for region failure scenarios.

**RPO/RTO**

* RPO: near 0 using automatic backups + geo-replication (depends on tier).
* RTO: minutes with Active Geo-Replication failover; minutes-to-hours for full restore depending on DB size.

---

# 2 — Schema (T-SQL) — `schema.sql`

Save and run on Azure SQL DB (use appropriate DB user with DDL rights).

```sql
-- schema.sql (T-SQL for Azure SQL Database)
SET NOCOUNT ON;

-- Customers
CREATE TABLE dbo.Customers (
    CustomerId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    Email NVARCHAR(320) NOT NULL UNIQUE,
    FullName NVARCHAR(200) NOT NULL,
    Phone NVARCHAR(50) NULL,
    CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Addresses
CREATE TABLE dbo.Addresses (
    AddressId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    Line1 NVARCHAR(250) NOT NULL,
    Line2 NVARCHAR(250) NULL,
    City NVARCHAR(100) NULL,
    State NVARCHAR(100) NULL,
    PostalCode NVARCHAR(50) NULL,
    Country NVARCHAR(100) NULL,
    IsDefault BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Addresses_Customers FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(CustomerId) ON DELETE CASCADE
);

-- Products
CREATE TABLE dbo.Products (
    ProductId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    SKU NVARCHAR(100) NOT NULL UNIQUE,
    Name NVARCHAR(250) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Price DECIMAL(12,2) NOT NULL CHECK (Price >= 0),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Warehouses
CREATE TABLE dbo.Warehouses (
    WarehouseId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Location NVARCHAR(200) NULL
);

-- Inventory
CREATE TABLE dbo.Inventory (
    InventoryId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    ProductId UNIQUEIDENTIFIER NOT NULL,
    WarehouseId UNIQUEIDENTIFIER NOT NULL,
    Qty INT NOT NULL DEFAULT 0 CHECK (Qty >= 0),
    LastUpdated DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Inventory_Product_Warehouse UNIQUE (ProductId, WarehouseId),
    CONSTRAINT FK_Inventory_Product FOREIGN KEY (ProductId) REFERENCES dbo.Products(ProductId) ON DELETE CASCADE,
    CONSTRAINT FK_Inventory_Warehouse FOREIGN KEY (WarehouseId) REFERENCES dbo.Warehouses(WarehouseId) ON DELETE CASCADE
);

-- Orders (header)
CREATE TABLE dbo.Orders (
    OrderId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    OrderStatus NVARCHAR(50) NOT NULL DEFAULT 'PENDING',
    TotalAmount DECIMAL(12,2) NOT NULL DEFAULT 0,
    Currency CHAR(3) NOT NULL DEFAULT 'USD',
    CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
    ShippingAddressId UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(CustomerId) ON DELETE NO ACTION
);

-- Order items
CREATE TABLE dbo.OrderItems (
    OrderItemId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    OrderId UNIQUEIDENTIFIER NOT NULL,
    ProductId UNIQUEIDENTIFIER NOT NULL,
    SKU NVARCHAR(100) NOT NULL,
    Qty INT NOT NULL CHECK (Qty > 0),
    UnitPrice DECIMAL(12,2) NOT NULL CHECK (UnitPrice >= 0),
    LineTotal AS (Qty * UnitPrice) PERSISTED,
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(ProductId) ON DELETE NO ACTION
);

-- Payments
CREATE TABLE dbo.Payments (
    PaymentId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    OrderId UNIQUEIDENTIFIER NOT NULL,
    Provider NVARCHAR(100) NOT NULL,
    Amount DECIMAL(12,2) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'PENDING',
    ProcessedAt DATETIME2(7) NULL,
    CONSTRAINT FK_Payments_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId) ON DELETE CASCADE
);

-- AuditLog (JSON)
CREATE TABLE dbo.AuditLog (
    AuditId BIGINT IDENTITY(1,1) PRIMARY KEY,
    TableName NVARCHAR(128) NOT NULL,
    Operation NVARCHAR(20) NOT NULL,
    ChangedBy NVARCHAR(128) NULL,
    ChangedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
    RowData NVARCHAR(MAX) NULL -- JSON
);

GO

-- UpdatedAt trigger (T-SQL)
CREATE OR ALTER TRIGGER trg_Products_Update
ON dbo.Products
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p
    SET UpdatedAt = SYSUTCDATETIME()
    FROM dbo.Products p
    JOIN inserted i ON p.ProductId = i.ProductId;
END;
GO

CREATE OR ALTER TRIGGER trg_Orders_Update
ON dbo.Orders
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE o
    SET UpdatedAt = SYSUTCDATETIME()
    FROM dbo.Orders o
    JOIN inserted i ON o.OrderId = i.OrderId;
END;
GO

-- Simple audit trigger for Orders and Payments
CREATE OR ALTER PROCEDURE dbo.sp_AuditInsert
    @TableName NVARCHAR(128),
    @Operation NVARCHAR(20),
    @ChangedBy NVARCHAR(128),
    @RowData NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO dbo.AuditLog (TableName, Operation, ChangedBy, RowData)
    VALUES (@TableName, @Operation, @ChangedBy, @RowData);
END;
GO

CREATE OR ALTER TRIGGER trg_Orders_Audit
ON dbo.Orders
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @json NVARCHAR(MAX) = (SELECT * FROM inserted FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
    IF (@json IS NULL)
        SET @json = (SELECT * FROM deleted FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
    EXEC dbo.sp_AuditInsert 'Orders',
        CASE WHEN EXISTS(SELECT 1 FROM inserted) AND EXISTS(SELECT 1 FROM deleted) THEN 'UPDATE'
             WHEN EXISTS(SELECT 1 FROM inserted) THEN 'INSERT'
             ELSE 'DELETE' END,
        SUSER_SNAME(),
        @json;
END;
GO

CREATE OR ALTER TRIGGER trg_Payments_Audit
ON dbo.Payments
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @json NVARCHAR(MAX) = (SELECT * FROM inserted FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
    IF (@json IS NULL)
        SET @json = (SELECT * FROM deleted FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
    EXEC dbo.sp_AuditInsert 'Payments',
        CASE WHEN EXISTS(SELECT 1 FROM inserted) AND EXISTS(SELECT 1 FROM deleted) THEN 'UPDATE'
             WHEN EXISTS(SELECT 1 FROM inserted) THEN 'INSERT'
             ELSE 'DELETE' END,
        SUSER_SNAME(),
        @json;
END;
GO
```

---

# 3 — Sample Data Script — `sample_data.sql`

```sql
-- sample_data.sql
SET NOCOUNT ON;

-- Customers
INSERT INTO dbo.Customers (Email, FullName, Phone)
VALUES
('alice@example.com','Alice Ramos','+1-555-0101'),
('bob@example.com','Bob Chen','+1-555-0202'),
('carol@example.com','Carol Singh','+91-99999-00001');

-- Addresses
INSERT INTO dbo.Addresses (CustomerId, Line1, City, State, PostalCode, Country, IsDefault)
SELECT CustomerId, '12 Main St', 'Seattle', 'WA', '98101', 'USA', 1 FROM dbo.Customers WHERE Email='alice@example.com';

-- Warehouses
INSERT INTO dbo.Warehouses (Name, Location) VALUES ('US-West','oregon-az1'), ('US-East','virginia-az1');

-- Products
INSERT INTO dbo.Products (SKU, Name, Description, Price)
VALUES
('SKU-1001','Wireless Mouse','Ergonomic wireless mouse', 25.99),
('SKU-1002','Mechanical Keyboard','RGB mechanical keyboard', 89.50),
('SKU-1003','USB-C Charger','65W charger', 29.99);

-- Inventory example per warehouse
INSERT INTO dbo.Inventory (ProductId, WarehouseId, Qty)
SELECT p.ProductId, w.WarehouseId,
    CASE WHEN p.SKU='SKU-1001' AND w.Name='US-West' THEN 100
         WHEN p.SKU='SKU-1002' AND w.Name='US-East' THEN 50
         ELSE 200 END
FROM dbo.Products p
CROSS JOIN dbo.Warehouses w
WHERE (p.SKU='SKU-1001' AND w.Name='US-West')
   OR (p.SKU='SKU-1002' AND w.Name='US-East')
   OR (p.SKU='SKU-1003');

-- Simple order for Alice
DECLARE @custId UNIQUEIDENTIFIER = (SELECT TOP (1) CustomerId FROM dbo.Customers WHERE Email='alice@example.com');
DECLARE @addrId UNIQUEIDENTIFIER = (SELECT TOP (1) AddressId FROM dbo.Addresses WHERE CustomerId = @custId AND IsDefault = 1);

DECLARE @orderId UNIQUEIDENTIFIER = NEWID();
INSERT INTO dbo.Orders (OrderId, CustomerId, OrderStatus, TotalAmount, Currency, ShippingAddressId)
VALUES (@orderId, @custId, 'PENDING', 0.00, 'USD', @addrId);

INSERT INTO dbo.OrderItems (OrderItemId, OrderId, ProductId, SKU, Qty, UnitPrice)
SELECT NEWID(), @orderId, p.ProductId, p.SKU, 2, p.Price FROM dbo.Products p WHERE p.SKU='SKU-1001';

-- Update total
UPDATE dbo.Orders
SET TotalAmount = ISNULL(t.SumLine,0)
FROM dbo.Orders o
JOIN (SELECT OrderId, SUM(LineTotal) AS SumLine FROM dbo.OrderItems GROUP BY OrderId) t
  ON o.OrderId = t.OrderId
WHERE o.OrderId = @orderId;

-- Payments
INSERT INTO dbo.Payments (OrderId, Provider, Amount, Status, ProcessedAt)
VALUES (@orderId, 'stripe', (SELECT TotalAmount FROM dbo.Orders WHERE OrderId=@orderId), 'COMPLETED', SYSUTCDATETIME());
```

---

# 4 — Essential Queries & Reporting — `queries.md` (T-SQL)

Include CRUD examples, analytics, and maintenance queries.

```sql
-- CRUD: Create product
INSERT INTO dbo.Products (SKU, Name, Description, Price) VALUES ('SKU-1004','Webcam','HD webcam',49.99);

-- Read order with items (T-SQL)
SELECT o.OrderId, o.TotalAmount, o.OrderStatus, oi.SKU, oi.Qty, oi.UnitPrice
FROM dbo.Orders o
JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
WHERE o.OrderId = 'PUT-ORDER-GUID-HERE';

-- Update order status
UPDATE dbo.Orders SET OrderStatus='SHIPPED', UpdatedAt = SYSUTCDATETIME() WHERE OrderId = '...';

-- Delete a product (careful)
DELETE FROM dbo.Products WHERE ProductId = '...';
```

Analytics:

```sql
-- Total revenue last 30 days
SELECT SUM(TotalAmount) AS RevenueLast30D
FROM dbo.Orders
WHERE CreatedAt >= DATEADD(DAY, -30, SYSUTCDATETIME())
  AND OrderStatus IN ('PAID','SHIPPED','COMPLETED');

-- Top 10 products by units sold last 90 days
SELECT p.SKU, p.Name, SUM(oi.Qty) AS UnitsSold
FROM dbo.OrderItems oi
JOIN dbo.Products p ON p.ProductId = oi.ProductId
JOIN dbo.Orders o ON o.OrderId = oi.OrderId
WHERE o.CreatedAt >= DATEADD(DAY, -90, SYSUTCDATETIME())
GROUP BY p.SKU, p.Name
ORDER BY UnitsSold DESC
OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;

-- Running total (daily revenue)
WITH Daily AS (
    SELECT CAST(CreatedAt AS DATE) AS SaleDate,
           SUM(TotalAmount) AS DailyTotal
    FROM dbo.Orders
    WHERE CreatedAt >= DATEADD(DAY, -90, SYSUTCDATETIME())
    GROUP BY CAST(CreatedAt AS DATE)
)
SELECT SaleDate, DailyTotal,
       SUM(DailyTotal) OVER (ORDER BY SaleDate ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningTotal
FROM Daily
ORDER BY SaleDate;
```

Inventory:

```sql
-- Current stock across warehouses
SELECT p.SKU, p.Name, w.Name AS Warehouse, i.Qty
FROM dbo.Products p
JOIN dbo.Inventory i ON i.ProductId = p.ProductId
JOIN dbo.Warehouses w ON w.WarehouseId = i.WarehouseId
WHERE p.SKU = 'SKU-1001';

-- Low-stock products (threshold 20)
SELECT p.SKU, p.Name, SUM(i.Qty) AS TotalQty
FROM dbo.Products p
JOIN dbo.Inventory i ON i.ProductId = p.ProductId
GROUP BY p.SKU, p.Name
HAVING SUM(i.Qty) < 20;
```

Maintenance / Troubleshooting:

```sql
-- Long-running queries
SELECT session_id, status, start_time, command, text
FROM sys.dm_exec_requests r
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle)
WHERE r.status = 'running'
ORDER BY start_time;

-- Index fragmentation (if using managed instance or on-prem)
SELECT dbschemas.[name] AS 'Schema',
       dbtables.[name] AS 'Table',
       dbindexes.[name] AS 'Index',
       avg_fragmentation_in_percent
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') s
JOIN sys.indexes dbindexes ON s.object_id = dbindexes.object_id AND s.index_id = dbindexes.index_id
JOIN sys.tables dbtables ON s.object_id = dbtables.object_id
JOIN sys.schemas dbschemas ON dbtables.schema_id = dbschemas.schema_id
WHERE avg_fragmentation_in_percent > 20;
```

````

---

# 5 — Indexing Strategy (T-SQL) — `indexes.sql`

Create indexes aligned with query patterns. In Azure SQL, create nonclustered indexes; clustered index by PK defaults to clustered if not specified (we used PK as GUID so consider clustered vs nonclustered trade-offs — GUID cluster causes fragmentation; consider using clustered columnstore or surrogate INT if high insert rate).

```sql
-- indexes.sql

-- Consider whether PK should be clustered; NEWID() GUID as clustered can fragment.
-- Option: create clustered index on CreatedAt for Orders if heavy time-range queries needed:
-- CREATE CLUSTERED INDEX CX_Orders_CreatedAt ON dbo.Orders (CreatedAt DESC);

-- Indexes for lookups
CREATE UNIQUE INDEX IDX_Products_SKU ON dbo.Products (SKU);

-- Composite for finding recent orders per customer
CREATE NONCLUSTERED INDEX IDX_Orders_Customer_CreatedAt ON dbo.Orders (CustomerId, CreatedAt DESC);

-- Index on OrderItems for joins to Products
CREATE NONCLUSTERED INDEX IDX_OrderItems_Product ON dbo.OrderItems (ProductId);

-- Inventory lookup by product
CREATE NONCLUSTERED INDEX IDX_Inventory_Product ON dbo.Inventory (ProductId);

-- Payments lookup by OrderId
CREATE NONCLUSTERED INDEX IDX_Payments_Order ON dbo.Payments (OrderId);

-- Covering index example to support Top Products by units (include Qty in index)
CREATE NONCLUSTERED INDEX IDX_OrderItems_Product_Order_Qty
ON dbo.OrderItems (ProductId, OrderId)
INCLUDE (Qty);

-- Partial indexing not natively supported in SQL Server pre-2016; use filtered index for active products
CREATE NONCLUSTERED INDEX IDX_Products_Active_SKU ON dbo.Products (SKU) WHERE IsActive = 1;

-- Consider Columnstore for large fact table analytics (if heavy analytical workloads)
-- CREATE CLUSTERED COLUMNSTORE INDEX CCI_OrderItems ON dbo.OrderItems;
````

**Notes / Rationale**

* Composite index `(CustomerId, CreatedAt)` supports queries for recent orders for a customer.
* Filtered index reduces index size for active products.
* Covering indexes help avoid lookups to base table — improves read latency at cost of write overhead.
* Monitor index usage (sys.dm_db_index_usage_stats) and drop unused indexes.

---

# 6 — Backup & Restore Plan (Azure SQL specific) — `backup_plan.md`

Azure SQL Database is PaaS: Microsoft manages backups; you configure retention and geo-replication.

**Key features**

* **Automated backups**: full/ differential/ transaction log — automatic.
* **Point-in-time Restore (PITR)**: restore to any time within retention period (configurable 7–35 days).
* **Long-term retention (LTR)**: keep full backups for weeks/years in Azure Blob.
* **Geo-restore / Geo-replication**:

  * **Geo-restore**: restore to a server in another region from automatic backups (for region outage).
  * **Active Geo-Replication** (for Single DB): create readable secondary in another region; failover manually.
  * **Auto-Failover Groups**: failover group across servers for app-level failover.

**Recommended configuration**

* Choose service tier & configure PITR retention (e.g., 14–35 days).
* Enable **Auto-Failover Groups** with readable secondary for high availability across regions.
* Configure **LTR** policy (monthly/weekly/yearly) for compliance (examples: keep monthly full backups for 12 months).
* Use **Transparent Data Encryption (TDE)** (enabled by default)—keys managed by MS or customer-managed in Azure Key Vault for CMK.
* Use **Private Endpoint** and restrict access to management endpoints via firewall/VNet.

**Restore procedures**

1. **PITR restore** (to new database):

   * From Azure Portal or `az sql db restore` CLI:

     ```bash
     az sql db restore --dest-name mydb-restore --name mydb \
       --resource-group rg --server myserver --time "2025-11-14T18:30:00Z"
     ```
2. **Geo-restore**:

   * In region outage, you can geo-restore from backups to any server in any region.
3. **Failover (Auto-Failover Group)**:

   * If using Auto-Failover Group, initiate failover via portal or CLI:

     ```bash
     az sql failover-group set-primary --name myfgroup --server mysecondary
     ```
4. **Restore single table**: Azure SQL does not support native table-level PITR. Procedure:

   * Restore database to temporary database (PITR) in same or different server.
   * Extract table via `SELECT INTO` or `bcp`/`bacpac`/`sqlpackage`.
   * Transfer data back to primary via transactional window.

**Test restores**

* Schedule monthly restore drills:

  * Perform PITR restore to test server
  * Validate row counts, critical queries
  * Test application connectivity

**Security**

* Backups encrypted at rest using TDE; if CMK used, manage key lifecycle in Key Vault.
* Limit who can initiate restores via RBAC.

---

# 7 — Testing Strategy

**Unit tests (T-SQL / DB-level)**

* Use tSQLt (unit test framework for T-SQL) or SQL Server unit test harnesses.
* Tests:

  * Constraint enforcement (e.g., negative qty fails).
  * Trigger/audit behavior (inserts produce audit record).
  * Stored proc behavior (if you add SPs).

**Integration tests**

* Use ephemeral DB instance or a restored backup in CI pipeline.
* Test end-to-end flows: place order → reduce inventory → payment recorded → order status updated.

**Load tests**

* Use tools like **k6**, **JMeter**, or **Azure Load Testing** (managed) to simulate:

  * Concurrent order creations (write heavy)
  * Read-heavy analytics
* Observe blocking, deadlocks, DTU/ vCore saturation.

**Chaos / Failover tests**

* Validate application behavior during failover of Auto-Failover Group.
* Test reading from read-replicas.

**Performance regression**

* Add CI gate: run key reporting queries on representative dataset and fail build if > threshold.
* Capture `EXPLAIN`/actual execution stats and store baseline.

---

# 8 — Monitoring & Alerting (Azure Monitor + SQL Insights)

**Enable**

* **Azure SQL Auditing** → send to Log Analytics / Storage / Event Hub.
* **Diagnostic settings**: collect `SQLInsights`, `Errors`, `Timeouts`, `Deadlocks`, `WaitStats`.
* **Query Store**: enable to capture query performance + plans (great for regressing queries).
* **Azure Monitor metrics**: DTU/vCore CPU, DTU percentage, storage used, deadlocks, blocked sessions, long-running queries.

**Key metrics & alerts**

* CPU% > 80% (warning)
* DTU/ vCore saturation (warning/critical)
* Storage used > 80% (critical)
* Failed connections > threshold (critical)
* Long-running queries > 30s (warning)
* Deadlocks > 0 (critical)
* Replication lag (for geo-replication / replicas)

**Dashboards**

* Azure Portal workbook: CPU, sessions, reads/writes, long-running queries, Top N queries from Query Store.
* Application Insights for app-level metrics (orders/sec, request failures).

**Log Alerts**

* Alert on unusual admin login (suspicious IP).
* Alert on schema changes (DDL audit).

---

# 9 — Runbooks (operational playbooks) — `runbooks.md` (abridged)

### Runbook A — Restore DB to point-in-time (PITR)

**When:** Major data corruption or mass-delete.

1. Identify the required restore time (UTC).
2. In Portal → SQL databases → select DB → Restore → Point in time → specify time → create new DB (e.g., `mydb-restored-20251114`).
   OR CLI:

   ```bash
   az sql db restore --dest-name mydb-restored --name mydb \
     --resource-group rg --server myserver --time "2025-11-14T18:30:00Z"
   ```
3. Wait for restore completion.
4. Validate (row counts, business queries).
5. Extract required data (e.g., table or rows) and copy back using `INSERT ... SELECT` or `BACPAC`/`sqlpackage`.
6. If replacing prod, coordinate downtime and switchover after verification.

### Runbook B — Failover to readable secondary (Auto-Failover Group)

**When:** Primary region outage or planned failover.

1. Ensure secondary is healthy.
2. Initiate failover (portal or CLI):

   ```bash
   az sql failover-group set-primary --name myfgroup --server secondary-server
   ```
3. Update connection strings if not using failover group listener.
4. Monitor application and DB metrics.

### Runbook C — Restore single table

1. Restore PITR to temp DB.
2. Export table:

   * Use `bcp` or `sqlpackage` or `SELECT INTO`.
3. Import to production in maintenance window (transactionally as needed).
4. Verify data integrity.

### Runbook D — Add index with minimal impact

1. Use online index creation where supported (Azure SQL supports ONLINE = ON):

   ```sql
   CREATE NONCLUSTERED INDEX IDX_Name ON dbo.BigTable (Col1) WITH (ONLINE = ON);
   ```
2. Monitor impact: DTU/CPU, transaction log growth.
3. If heavy, schedule during low traffic.

### Runbook E — Resolve long blocking or deadlocks

1. Query sys.dm_tran_locks, sys.dm_exec_requests, sys.dm_os_waiting_tasks.
2. Identify blocking session and query:

   ```sql
   SELECT blocking_session_id, session_id, wait_type, wait_time, resource_description
   FROM sys.dm_os_waiting_tasks WHERE blocking_session_id IS NOT NULL;
   ```
3. If safe, kill session:

   ```sql
   KILL <session_id>;
   ```
4. Investigate root cause and implement fix (index, rewrite, split transaction).

---

# 10 — Security Checklist

* Use **Azure AD authentication** for admin/DB access (disable SQL admin where possible).
* Enforce **private endpoints** and firewall rules.
* **Managed Identity** for app → Azure SQL via Azure AD auth.
* **TDE** enabled and optional CMK in Key Vault.
* **Always Encrypted** for sensitive columns (PII/SSN/payment data) if needed.
* **Auditing** to Log Analytics for signins, role changes, and DDL.
* Enforce **least privilege** via contained database users and Azure RBAC.

---

# 11 — Suggested Repo Layout

```
/azure-sql-ecommerce/
  README.md                -- this overview
  schema.sql
  sample_data.sql
  queries.md
  indexes.sql
  backup_plan.md
  monitoring.md
  runbooks.md
  testing.md
  architecture.md
  azure-deploy/            -- optional: ARM/Bicep or Terraform for infra (DB server, firewall, private endpoint)
    main.bicep
    params.json
  ci/
    workflow.yml           -- sample GitHub Actions for migrations + tests
```

---

