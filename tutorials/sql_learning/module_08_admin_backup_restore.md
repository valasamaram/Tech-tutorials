# Module 08 — Administration: Backup & Restore, HA

## Learning objectives
- Understand backup types and restore operations.
- Learn HA and replication options for production systems.

## Backup types
- Full backup: complete copy of database.
- Differential: changes since last full backup.
- Transaction log (or incremental): log of changes enabling point-in-time restore (PITR).

## Restore scenarios
- Point-in-time restore using logs.
- Restore to alternate server/region for DR testing.

## High availability options
- Log shipping, replication, clustering, database mirroring (legacy), Always On Availability Groups (SQL Server), managed replicas (cloud).
- For cloud-managed DBs: read replicas, zone-redundant configurations, geo-restore.

## Disaster recovery planning
- RTO/RPO mapping: choose backup frequency and replication accordingly.
- Test restores regularly and automate checklists.

## Lab
- Configure automated backups for the sample DB and perform a point-in-time restore.
- Set up a read replica and failover test (engine-dependent).

## Troubleshooting
- Restore fails due to missing log chain: ensure backup sequence complete and logs available.
- Replica lag: check network bandwidth and apply rate limits or change replication topology.

## Interview questions
- How do you choose backup frequency for a transactional OLTP system?
- Explain how point-in-time restore works conceptually.