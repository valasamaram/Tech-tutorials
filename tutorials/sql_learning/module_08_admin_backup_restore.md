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

Here is a **clean, GitHub-ready Markdown section** explaining **backup types and restore operations**, perfect for your SQL/Database learning module README.

---


## 💾 Backup Types & Restore Operations

Reliable data protection requires understanding how backups work and how to restore data when failures occur. Modern databases support multiple backup types, each suited for different recovery needs.

---

# 1️⃣ Backup Types

Databases typically support **three core backup types**:

---

## 1. Full Backup 🟦  
A complete copy of the entire database at a specific point in time.

### ✔ Pros  
- Simple to restore  
- Baseline for other backups  
- Reliable snapshot of the system  

### ❗ Cons  
- Largest backup size  
- Longest backup duration  

### When to use  
- Weekly schedules  
- Before major upgrades  

---

## 2. Differential Backup 🟩  
Contains **changes since the last full backup**.

### ✔ Pros  
- Smaller & faster than full backups  
- Faster restore than many incrementals  

### ❗ Cons  
- Grows in size over time until next full backup  
- Still requires the last full backup to restore  

### When to use  
- Daily schedules between weekly full backups  

---

## 3. Transaction Log Backup 🟧  
Captures every change recorded in the **transaction log** since the last log backup.

### ✔ Pros  
- Enables **point-in-time recovery**  
- Very small and quick  
- Ideal for high-availability scenarios  

### ❗ Cons  
- Requires careful log chain management  
- Must store many small backups  

### When to use  
- High-transaction environments  
- Mission-critical systems  
- Point-in-time recovery requirements  

---

# 2️⃣ Other Specialized Backup Types (Optional)

### 🔹 Snapshot / Copy-only Backup  
A backup that **does not affect** the normal backup chain.  
Useful for ad-hoc or testing backups.

### 🔹 File / Filegroup Backup  
Back up individual database files; useful for **very large databases** (VLDBs).

### 🔹 Tail-Log Backup  
Captures any remaining log records **after a failure**, before restoring.  
Important for minimizing data loss.

---

# 3️⃣ Restore Operations

Restoring a database depends on the backup strategy. A typical restore sequence follows a structured order:

---

## 🔁 1. Restore Full Backup  
Rebuilds the database from the last complete backup.

```sql
RESTORE DATABASE MyDB
FROM DISK = 'full_backup.bak'
WITH NORECOVERY;
````

`NORECOVERY` keeps the DB in a restoring state to apply more backups.

---

## 🔁 2. Restore Differential Backup (if available)

Applies changes recorded since the full backup.

```sql
RESTORE DATABASE MyDB
FROM DISK = 'diff_backup.bak'
WITH NORECOVERY;
```

---

## 🔁 3. Restore Log Backups (one by one)

Apply each log backup in correct order.

```sql
RESTORE LOG MyDB
FROM DISK = 'log_backup_01.trn'
WITH NORECOVERY;

RESTORE LOG MyDB
FROM DISK = 'log_backup_02.trn'
WITH NORECOVERY;
```

---

## 🔁 4. Recover the Database

Final step — makes the database available.

```sql
RESTORE DATABASE MyDB WITH RECOVERY;
```

---

# 4️⃣ Point-in-Time Restore ⏱️

If your system supports log backups, you can restore to a specific moment.

```sql
RESTORE LOG MyDB
FROM DISK='log_backup.trn'
WITH STOPAT = '2025-01-10 10:15:00',
     RECOVERY;
```

### Useful for:

* Fixing accidental deletes
* Undoing incorrect updates
* Recovering from application bugs

---

# 5️⃣ Backup & Restore Best Practices

### ✔ Backup Strategy

* Weekly **Full** + Daily **Differential** + Frequent **Log** backups
* Store backups on **separate storage** (cloud, NAS, external)
* Maintain **retention policies** based on compliance

### ✔ Security

* Encrypt backups
* Protect encryption keys
* Store offsite copies for disaster recovery

### ✔ Restore Readiness

* Regular **test restores** (quarterly or monthly)
* Document restore procedures
* Verify backup integrity using checksum/validation features

---

# 6️⃣ Common Mistakes to Avoid ❌

* Only using full backups (slow & risky)
* Not backing up the transaction log (log file may grow indefinitely)
* Storing backups on the same server as the database
* Not knowing restore order
* Not testing restores
* Losing encryption keys → backups become unusable

---

# 7️⃣ Quick Recap (1-Liner)

**Full backups capture everything, differential backups capture changes since the last full backup, and log backups capture every transaction — restoring requires applying them in order to return the database to a specific point in time.**


---

---

```markdown
## 🟦 High Availability (HA) & Replication Options for Production Systems

High Availability ensures your database stays online despite hardware failures, software issues, or network outages. Replication creates multiple copies of your data across nodes or regions to increase reliability, reduce downtime, and improve read performance.

This section covers core HA concepts and the major replication architectures used in modern relational databases.

---

# 1️⃣ What is High Availability (HA)?

High Availability refers to systems that are designed to maintain operational uptime with minimal service disruption.

### Key components:
- **Redundancy** → Multiple instances/copies  
- **Failover mechanisms** → Automatic switching  
- **Replication** → Data copied to another node  
- **Monitoring & health checks**  
- **No single point of failure (SPOF)**  

### Common HA goals:
- 99.9% (three-nines)  
- 99.99% (four-nines)  
- 99.999% (five-nines) availability  

---

# 2️⃣ Replication Models

Replication is how data gets copied from one node to another. Different DB engines support specific strategies.

---

## 🟧 1. Synchronous Replication
Writes are committed on **both primary and replica** before success is returned.

### ✔ Pros
- Zero (or near-zero) data loss (RPO ≈ 0)  
- Perfect for financial and mission-critical systems  

### ❗ Cons
- Slower writes due to network round trips  
- Replica must always be online  

### Use cases
- Banking, payments  
- Multi-node clusters inside same data center  

### Examples
- PostgreSQL synchronous standby  
- MySQL Group Replication (majority-write mode)  
- SQL Server AlwaysOn Synchronous Commit  

---

## 🟩 2. Asynchronous Replication
Primary returns success immediately; replica updates later.

### ✔ Pros
- High performance  
- Ideal for read scaling  
- Can replicate across regions  

### ❗ Cons
- Possible data loss on primary failure (RPO > 0)  

### Use cases
- Read replicas for analytics  
- Geographically distributed replicas  

### Examples
- PostgreSQL async streaming replication  
- MySQL async replication  
- SQL Server Log Shipping  

---

## 🟦 3. Semi-Synchronous Replication
Primary waits for **at least one replica** to acknowledge receipt (not commit), then completes the transaction.

### ✔ Pros
- Less data loss than async  
- Faster than full synchronous  

### ❗ Cons
- Replica still might fall behind  

### Examples
- MySQL semi-sync plugin  

---

# 3️⃣ HA Deployment Architectures

---

## 🟨 1. Primary–Replica (Master–Slave)
One primary node handles writes; replicas handle reads.

### ✔ Pros
- Simple  
- Great for read scaling  
- Easy to implement  

### ❗ Cons
- Failover may be manual  
- Primary = single write bottleneck  

### Examples
- PostgreSQL streaming replicas  
- MySQL read replicas  

---

## 🟩 2. Multi-Primary (Multi-Master)
Multiple nodes accept writes.

### ✔ Pros
- High write availability  
- Global write distribution  

### ❗ Cons
- Conflict resolution required  
- Complex to operate  

### Examples
- MySQL NDB Cluster  
- Postgres BDR (Bidirectional replication)  
- CockroachDB / YugabyteDB (NewSQL, built-in multi-master)  

---

## 🟧 3. Clustered HA (Shared-Nothing Architecture)
Many nodes share data via replication and coordinated quorum.

### ✔ Pros
- Automatic failover  
- Strong consistency  
- High resilience  

### ❗ Cons
- Requires quorum majority  
- Network sensitive  

### Examples
- PostgreSQL Patroni / Stolon  
- MySQL InnoDB Cluster  
- SQL Server AlwaysOn Availability Groups  

---

## 🟫 4. Shared-Storage Architectures (Older HA Design)
Multiple DB servers share a SAN/NAS disk.

### ✔ Pros
- Simple failover  
- Data is always consistent (single storage)  

### ❗ Cons
- Storage is a **single point of failure**  
- Old-fashioned (rare in cloud era)  

### Examples
- Oracle RAC (mixed/shared)  
- SQL Server Failover Cluster Instances (FCI)  

---

# 4️⃣ Cloud-Native Replication / HA Options

---

## ☁️ AWS
- **RDS Multi-AZ** (synchronous)  
- **RDS Read Replicas** (async)  
- **Aurora**: 6-copy quorum, auto-failover, storage-level replication  

## ☁️ Azure
- **Azure SQL Geo-Replication**  
- **Zone/Region redundant deployments**  

## ☁️ GCP
- **Cloud SQL high availability**  
- **Spanner global replication (TrueTime)**  

---

# 5️⃣ Failover Types

---

## 1. Automatic Failover
Triggered by the system when the primary fails.

Requires:
- Health checks  
- Consensus/quorum  

Example: Aurora, Patroni, MySQL InnoDB Cluster

---

## 2. Manual Failover
Admin decides when to promote replica to primary.

Used when:
- Avoiding split-brain  
- Maintenance windows  

---

## 3. Planned Switchover
Switch roles cleanly with no data loss.

Used during:
- Upgrades  
- Patching  
- Load balancing  

---

# 6️⃣ RPO, RTO & How They Influence Design

### **RPO (Recovery Point Objective)**  
How much data loss is acceptable?  
- Zero → synchronous replication  
- Minutes → async log shipping  
- Hours → snapshot-based backups  

### **RTO (Recovery Time Objective)**  
How fast must the system recover?  
- Seconds → automated failover  
- Minutes → manual failover  
- Hours → backup restore  

---

# 7️⃣ Common Mistakes in HA/Replication

- Assuming replicas are automatic failover nodes  
- Using async replication without understanding data-loss risks  
- Deploying replicas in same rack/availability zone  
- Not testing failover regularly  
- Split-brain situations due to misconfigured quorum  
- Ignoring network latency for cross-region writes  

---

# 8️⃣ Quick Summary (1-Minute)

- **Synchronous = zero data loss, slower**  
- **Async = high performance, possible data loss**  
- **Primary–Replica = most common**  
- **Multi-Master = complex but powerful**  
- **Clusters = auto-failover, quorum-based**  
- **Cloud HA = easier but adds abstraction**  
- **RPO/RTO decide everything**  



---

