# Module 7 — Data & Platform Services (From basics to advanced)

Scope: Azure SQL, Cosmos DB, Storage options for data lakes, Data Factory, Synapse Analytics, backup/restore, high availability and scaling patterns.

Learning objectives
- Choose appropriate data services: OLTP vs analytical vs NoSQL workloads.
- Understand Cosmos DB consistency models (strong, bounded staleness, session, eventual) and partitioning strategies.
- Configure Azure SQL for HA (Zone redundant, geo-replication) and long-term backup.
- Build ETL pipelines with Data Factory and orchestrate with Synapse where needed.

Advanced topics
- Synapse dedicated SQL pools vs serverless vs Spark workloads and cost models.
- Cosmos DB multi-region writes and conflict resolution strategies.
- Columnstore index design, partitioning strategies in Azure SQL, and query performance tuning.
- Data governance: Purview, classification, and data residency compliance.

Hands-on labs
- Lab 7.1: Deploy Azure SQL with zone-redundant configuration and configure long-term retention backups.
- Lab 7.2: Create a Cosmos DB account with partition key design, ingest data, and demonstrate read latency across regions.
- Lab 7.3: Build Data Factory pipeline to copy data from blob storage to Azure SQL and schedule incremental loads.

Commands & snippets
- Create Cosmos DB with multi-region writes:
```
az cosmosdb create -n mycosmos -g rg-demo --capabilities EnableMultipleWriteLocations --locations regionName1=EastUS regionName2=WestUS
```

- Export bacpac from Azure SQL (PowerShell sample):
```
# Export database to storage account
New-AzSqlDatabaseExport -ResourceGroupName rg-demo -ServerName sqlsrv-demo -DatabaseName db1 -StorageKeyType StorageAccessKey -StorageKey "<key>" -StorageUri "https://<sa>.blob.core.windows.net/backups/db1.bacpac"
```

Design checklist
- Model RTO/RPO for data services early: backups vs replication vs geo-restore.
- Understand cost trade-offs for multi-region replication and storage performance tiers.
- Use partition keys and throughput provisioning carefully for Cosmos DB to avoid hot partitions.

Study checkpoint
- Deliverable: data architecture for an analytics pipeline ingesting transactional data and exposing aggregated dashboards with Synapse.

Further reading
- Cosmos DB design patterns: https://learn.microsoft.com/azure/cosmos-db/architecture
- Synapse docs: https://learn.microsoft.com/azure/synapse-analytics/

---
