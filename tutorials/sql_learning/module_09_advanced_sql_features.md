# Module 09 — Advanced SQL Features

## Learning objectives
- Use stored procedures, user-defined functions, triggers, views and materialized views.
- Work with JSON, XML, recursive queries (CTEs), temporal tables, and table partitioning.

## Programmability
- Stored procedures: encapsulate business logic in the DB server.
- Functions: scalar or table-valued; use for reusable logic (note: side-effects restrictions).
- Triggers: fire on DML; use sparingly to avoid hidden side-effects.

## CTEs and recursive queries
- CTE: common table expression for readability and to provide scope for recursive queries (e.g., hierarchical data).

Example recursive CTE (organizational chart):
```sql
WITH RECURSIVE manager_tree AS (
  SELECT employee_id, manager_id, 0 AS depth FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.manager_id, mt.depth + 1
  FROM employees e JOIN manager_tree mt ON e.manager_id = mt.employee_id
)
SELECT * FROM manager_tree;
```

## JSON & semi-structured data
- Many engines support JSON columns and functions to query and index JSON (->> in Postgres, JSON_VALUE in SQL Server).

## Partitioning and materialized views
- Partition large tables by date or hash to improve maintenance and query pruning.
- Materialized views: precomputed results for expensive queries (maintain / refresh strategies).

## Temporal tables
- System-versioned temporal tables store history automatically; useful for auditing and point-in-time queries.

## Lab
- Create a stored procedure for monthly billing and a materialized view for summary stats.
- Use a recursive CTE to flatten a hierarchical category tree.

## Troubleshooting
- Triggers causing performance regressions: profile and consider moving logic to app layer or use asynchronous processing.
- Materialized view stale data: determine refresh policy and consistency requirements.

Here is a **clear, structured, GitHub-ready explanation** of **stored procedures, user-defined functions, triggers, views, and materialized views**.
You can directly include this in your SQL learning module.

---


## 🟦 Using Stored Procedures, User-Defined Functions, Triggers, Views & Materialized Views

Modern relational databases provide several programmable objects that help automate logic, encapsulate queries, enforce rules, and improve performance. This section explains each one clearly with use-cases and sample syntax.

---

# 1️⃣ Stored Procedures (SPs)

A **stored procedure** is a saved block of SQL code that can perform complex operations—multiple queries, loops, conditions, and transaction logic.  
They are commonly used to encapsulate business logic inside the database.

### ⭐ Features
- Can accept input/output parameters  
- Supports control-flow logic (IF, WHILE, CASE)  
- Can modify data (INSERT/UPDATE/DELETE)  
- Used for automation and reusable routines  

### ✔ Use cases
- Batch processing  
- Data validations  
- Scheduled operations  
- Complex multi-step updates  

### 🔹 Example (MySQL style)
```sql
CREATE PROCEDURE IncreaseSalary(IN percent INT)
BEGIN
    UPDATE employees SET salary = salary + (salary * percent / 100);
END;
````

---

# 2️⃣ User-Defined Functions (UDFs)

A **UDF** returns a **single value** or **table** based on input parameters.
Unlike stored procedures, UDFs are **pure functions** (no side effects).

### ⭐ Features

* Cannot modify data in most SQL engines
* Ideal for reusable calculations
* Can be scalar or table-valued

### ✔ Use cases

* Reusable business rules
* String manipulation
* Data transformation
* Calculated columns

### 🔹 Example (Scalar Function)

```sql
CREATE FUNCTION GetFullName(fname VARCHAR(50), lname VARCHAR(50))
RETURNS VARCHAR(100)
RETURN CONCAT(fname, ' ', lname);
```

---

# 3️⃣ Triggers

A **trigger** automatically runs in response to a database event:

* `INSERT`
* `UPDATE`
* `DELETE`

Triggers are tied to a table and execute **before** or **after** these operations.

### ⭐ Features

* Enforce data rules
* Maintain audit logs
* Automatically calculate values

### ✔ Use cases

* Logging changes to an audit table
* Auto-populating timestamps
* Enforcing complex integrity constraints

### 🔹 Example (Audit Trigger)

```sql
CREATE TRIGGER log_changes
AFTER UPDATE ON customers
FOR EACH ROW
INSERT INTO audit_log (customer_id, old_value, new_value, changed_at)
VALUES (OLD.id, OLD.status, NEW.status, NOW());
```

---

# 4️⃣ Views

A **view** is a virtual table created from a stored query.
It does not store actual data (except in some engines when using indexed views).

### ⭐ Features

* Simplifies complex queries
* Provides security by exposing only certain columns
* Behaves like a read-only table (in most cases)

### ✔ Use cases

* Abstracting joins
* Restricting sensitive column exposure
* Providing a stable interface for reporting

### 🔹 Example

```sql
CREATE VIEW active_customers AS
SELECT id, name, email
FROM customers
WHERE status = 'ACTIVE';
```

---

# 5️⃣ Materialized Views (MVs)

A **materialized view** stores query results physically on disk.
Unlike normal views, materialized views must be **refreshed** manually or on a schedule.

### ⭐ Features

* Faster query performance
* Ideal for heavy aggregations
* Useful in data warehousing and analytics

### ✔ Use cases

* Pre-aggregated reporting tables
* OLAP-style dashboards
* Reducing load on core transactional tables

### 🔹 Example (PostgreSQL)

```sql
CREATE MATERIALIZED VIEW sales_summary AS
SELECT product_id, SUM(amount) AS total_sales
FROM sales
GROUP BY product_id;
```

To refresh:

```sql
REFRESH MATERIALIZED VIEW sales_summary;
```

---

# 6️⃣ When to Use What? (Quick Summary)

| Feature               | Stores Data? | Modifies Data?  | Best For                      |
| --------------------- | ------------ | --------------- | ----------------------------- |
| **Stored Procedure**  | ❌            | ✅               | Complex logic & automation    |
| **UDF**               | ❌            | ❌ (usually)     | Reusable computations         |
| **Trigger**           | ❌            | Auto via events | Enforcing rules, auditing     |
| **View**              | ❌            | ❌               | Abstraction & security        |
| **Materialized View** | ✅            | ❌               | Performance for heavy queries |

---

# 7️⃣ Best Practices

* Avoid business logic completely inside triggers (hard to debug).
* Use UDFs for deterministic calculations only.
* Use SPs for workflows, not simple queries.
* Index materialized views if supported (e.g., Oracle, SQL Server).
* Refresh MVs wisely to avoid heavy load.
* Use views to hide sensitive columns (security through abstraction).



---


## 🟦 Working with JSON, XML, Recursive Queries (CTEs), Temporal Tables & Table Partitioning

Modern SQL engines support advanced features to handle semi-structured data, hierarchical queries, historical tracking, and large-scale tables. This section explains each concept clearly with examples and typical use-cases.

---

# 1️⃣ JSON in SQL

Most databases support storing and querying **JSON** directly.  
JSON is useful for semi-structured or dynamic attributes that don’t fit well into strict relational schemas.

### ⭐ Features
- Native JSON column types (PostgreSQL, MySQL, SQL Server)
- Functions to extract, update, and search JSON values
- Indexing options (GIN/JSON indexes)

### ✔ Use cases
- Storing flexible attributes (e.g., user preferences)
- Logging/transient data
- API payload storage

### 🔹 Example (PostgreSQL)
```sql
SELECT
  user_data->>'name' AS name,
  user_data->'address'->>'city' AS city
FROM users
WHERE user_data->>'status' = 'active';
````

---

# 2️⃣ XML in SQL

XML support is older than JSON but still widely used in enterprise systems.

### ⭐ Features

* XML data type
* XQuery / XPath functions
* Schema validation (optional)

### ✔ Use cases

* Integrating with legacy systems
* Document storage
* Configuration data

### 🔹 Example (SQL Server)

```sql
SELECT
  data.value('(/order/customer/name)[1]', 'VARCHAR(100)') AS customer_name
FROM orders;
```

---

# 3️⃣ Recursive CTEs (Common Table Expressions)

A **recursive CTE** allows you to query hierarchical or graph-like data structures.

### ⭐ Features

* Self-referencing queries
* Useful for tree traversal: parent/child, org charts, folder structures

### ✔ Use cases

* Employee hierarchy
* Category → sub-category traversal
* Graph paths

### 🔹 Example: Employee Hierarchy

```sql
WITH RECURSIVE emp_cte AS (
    SELECT id, name, manager_id, 1 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    SELECT e.id, e.name, e.manager_id, c.level + 1
    FROM employees e
    JOIN emp_cte c ON e.manager_id = c.id
)
SELECT * FROM emp_cte;
```

---

# 4️⃣ Temporal Tables (System-Versioned Tables)

**Temporal tables** automatically track the history of data changes.
They allow you to query how the data looked at any point in time.

### ⭐ Features

* Automatically maintain history rows
* Query past snapshots using `FOR SYSTEM_TIME`
* Useful for auditing and regulatory needs

### ✔ Use cases

* Audit trails
* Time-travel queries
* Compliance/regulatory reporting (finance, healthcare)

### 🔹 Example (SQL Server)

```sql
SELECT *
FROM customers
FOR SYSTEM_TIME AS OF '2024-01-01';
```

### Two components:

* **Current table** → active data
* **History table** → automatically managed historical versions

---

# 5️⃣ Table Partitioning

**Partitioning** breaks a large table into smaller, manageable chunks.
Queries automatically read only the relevant partitions ("partition pruning").

### ⭐ Features

* Range, list, hash, composite partitioning
* Faster reads and writes on large datasets
* Improves maintenance (reindex, backup per partition)

### ✔ Use cases

* Time-series data (logs, metrics)
* Financial transactions by month/year
* Large fact tables in data warehouses

### 🔹 Example (PostgreSQL Range Partitioning)

```sql
CREATE TABLE sales (
    id BIGINT,
    amount NUMERIC,
    sale_date DATE
) PARTITION BY RANGE (sale_date);

CREATE TABLE sales_2024 PARTITION OF sales
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

# 6️⃣ Quick Summary Table

| Feature             | Purpose                              | Best For                           |
| ------------------- | ------------------------------------ | ---------------------------------- |
| **JSON**            | Semi-structured flexible data        | API data, logs, dynamic attributes |
| **XML**             | Structured document-based storage    | Legacy systems, configs            |
| **Recursive CTEs**  | Hierarchical/graph querying          | Org charts, trees, graph traversal |
| **Temporal Tables** | Historical tracking & time-travel    | Auditing, compliance               |
| **Partitioning**    | Performance & manageability at scale | Large tables, time-series          |

---

# 7️⃣ Best Practices

* Use JSON for flexible data but avoid overusing it in highly relational systems.
* Index JSON paths for performance on large payloads.
* Recursive CTEs should have clear termination conditions to avoid infinite loops.
* Temporal tables require extra storage—monitor history growth.
* Partition by date/time for most analytical or log-heavy workloads.
* Avoid too many partitions (hundreds = fine, thousands = bad).



---
