# Module 7 — Data & Platform Services (From basics to advanced)

Scope: Azure SQL, Cosmos DB, Storage options for data lakes, Data Factory, Synapse Analytics, backup/restore, high availability and scaling patterns.

## Learning objectives

- Choose appropriate data services: OLTP vs analytical vs NoSQL workloads.
- Understand Cosmos DB consistency models (strong, bounded staleness, session, eventual) and partitioning strategies.
- Configure Azure SQL for HA (Zone redundant, geo-replication) and long-term backup.
- Build ETL pipelines with Data Factory and orchestrate with Synapse where needed.

---

## Advanced topics (detailed)

### Data lake and storage choices
- ADLS Gen2: hierarchical namespace, suited for analytics workloads with large files and parallelism.
- Use Hot/Cold storage tiers depending on access patterns and cost sensitivity.

### Cosmos DB
- Consistency levels: Strong, Bounded Staleness, Session (default), Consistent Prefix, Eventual — choose by application correctness vs latency.
- Partitioning: choose a partition key that evenly distributes throughput and avoids hot partitions; plan RU allocation.

### Azure SQL & managed options
- Single database vs Elastic Pool vs Managed Instance. For lift-and-shift, Managed Instance provides near-compatibility.
- High availability: zone-redundant configuration, geo-replication and automated backups with long-term retention.

### Synapse & analytics
- Serverless SQL pool for ad-hoc querying over parquet/CSV in ADLS; dedicated SQL pool for predictable high-throughput analytics.
- Databricks or Synapse Spark for large-scale transformations.

---

## Hands-on labs (practical)

- Lab 7.1 — Azure SQL HA & backups:
	1. Deploy Azure SQL with zone-redundant configuration and configure long-term retention policies.
	2. Test geo-restore by restoring to a different region.

- Lab 7.2 — Cosmos DB partitioning experiment:
	1. Create a Cosmos DB account with multi-region writes and a well-chosen partition key.
	2. Ingest sample data, run throughput tests, and observe RU consumption and latency across regions.

- Lab 7.3 — Data Factory to Synapse pipeline:
	1. Create a pipeline that copies incremental data from blob storage to Azure SQL.
	2. Schedule and monitor pipeline runs; implement retry and dead-letter patterns.

### Useful commands & snippets
```powershell
# Create Cosmos DB with multi-region writes
az cosmosdb create -n mycosmos -g rg-demo --capabilities EnableMultipleWriteLocations --locations regionName1=EastUS regionName2=WestUS

# Export bacpac from Azure SQL (PowerShell sample)
# Export database to storage account
New-AzSqlDatabaseExport -ResourceGroupName rg-demo -ServerName sqlsrv-demo -DatabaseName db1 -StorageKeyType StorageAccessKey -StorageKey "<key>" -StorageUri "https://<sa>.blob.core.windows.net/backups/db1.bacpac"
```

---

## Troubleshooting & best practices

- For Cosmos DB hot partition issues: re-evaluate partition key, consider synthetic keys or fan-out design patterns.
- For slow queries in Synapse/SQL: review distribution keys, statistics, and indexing (columnstore where applicable).

---

## Interview & design tips

- Be ready to discuss consistency vs latency trade-offs for Cosmos DB and how to handle conflict resolution for multi-master writes.
- Discuss cost patterns for Synapse — when to choose serverless vs dedicated pools and how to manage pause/resume for cost savings.

---

## References
- Cosmos DB design patterns: https://learn.microsoft.com/azure/cosmos-db/architecture
- Synapse docs: https://learn.microsoft.com/azure/synapse-analytics/

