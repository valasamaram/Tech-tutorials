# Module 9 — Resilience & Disaster Recovery (Design → Operate)

Scope: RTO/RPO planning, backup strategies, Azure Site Recovery (ASR), multi-region architectures, traffic failover, DR runbooks, and testing practices.

## Learning objectives

- Define RTO and RPO and map them to architectural choices and cost implications.
- Implement backups and restores for VMs, databases, and storage (application-consistent where required).
- Configure Azure Site Recovery for VM replication and perform test failovers and planned failovers.
- Design multi-region active-active and active-passive topologies and plan traffic failover using Front Door or Traffic Manager.

---

## Core concepts (detailed)

### RPO / RTO and SLAs
- RPO: maximum acceptable data loss; RTO: maximum acceptable downtime. Determine these with stakeholders and map to replication and backup frequency.

### Backup strategies
- Snapshot vs backup: snapshots are quick point-in-time copies; backups provide retention, application consistency and cataloging.
- Use Recovery Services vault for centralized backup management (VMs, SQL, and Azure Files support).

### Azure Site Recovery (ASR)
- ASR replicates VMs to a target region; supports test failovers (no data loss), planned failovers (with replication sync) and unplanned failovers.
- Recovery Plans: orchestrate multi-VM failovers with sequencing, scripts, and manual actions.

### Multi-region patterns
- Active-Active: both regions serve traffic; requires data replication and conflict resolution.
- Active-Passive: primary serves traffic; passive region is warm/cold and promoted during failover.

---

## Labs (practical)

- Lab 9.1 — VM backup & restore:
  1. Configure Recovery Services vault and enable VM backup with application-aware snapshot.
  2. Perform an on-demand backup and test restore to a recovery VM in the same region.

- Lab 9.2 — ASR test failover:
  1. Configure ASR for a test VM, enable replication to secondary region.
  2. Perform a test failover and validate applications; clean up test resources.

- Lab 9.3 — Traffic failover with Front Door:
  1. Deploy app in two regions and configure Azure Front Door with health probes and priority routing.
  2. Simulate region failure by stopping backend in primary and validate Front Door failover.

### Useful commands & snippets
```powershell
# Show backup items in a vault
Get-AzRecoveryServicesBackupItem -VaultId $vault.Id

# Trigger ASR test failover via CLI (conceptual)
az site-recovery job start --name <jobName> --resource-group rg-recovery
```

---

## DR runbooks & testing cadence

- Create runbooks for test failover, actual failover, and failback. Include steps for DNS change, IP updates, and verification checks.
- Test DR at least annually (quarterly for critical workloads) and automate smoke tests that verify app health after failover.

---

## Troubleshooting & validation

- Replication health: monitor ASR replication health dashboards and alerts; investigate replication errors (storage account limits, network issues).
- Post-failover validation: check database integrity, connectivity, and service endpoints.

---

## Interview & design tips

- Be prepared to justify why active-active is chosen vs active-passive (consistency complexity vs lower RTO) and how DNS/Traffic Manager aids cutover.

---

## References
- Azure Site Recovery: https://learn.microsoft.com/azure/site-recovery/
- Azure Backup: https://learn.microsoft.com/azure/backup/
# Module 9 — Resilience, Disaster Recovery & Multi-Region Architectures

Scope: DR strategies, active-passive and active-active patterns, geo-replication, traffic management (Front Door, Traffic Manager), backups, RTO/RPO design, failover automation and runbooks.

Learning objectives
- Design DR strategy aligned to RTO/RPO targets and business constraints.
- Implement geo-replication for storage, databases, and stateful services.
- Use Front Door and Traffic Manager for global traffic management and failover.
- Automate failover procedures and validate runbooks with simulated failures.

Advanced topics
- Cross-region latency, consistency models, and split-brain avoidance for active-active databases.
- Automation of failback and data reconciliation strategies.
- Chaos engineering principles applied to cloud resiliency testing.
- Multi-region networking considerations: private connectivity, VPN/ExpressRoute failover patterns.

Hands-on labs
- Lab 9.1: Implement geo-replication for Azure SQL and perform a failover to the secondary region.
- Lab 9.2: Set up Front Door with health probes and a backend pool across regions; simulate primary region failure and observe failover.
- Lab 9.3: Build an automated runbook that triggers DB failover, updates DNS/traffic rules, and notifies on-call teams.

Commands & snippets
- Initiate Azure SQL failover (CLI):
```
az sql failover-group set-primary --name myfailovergroup --resource-group rg-demo --server myserver-secondary
```

- Front Door health probe configuration example (ARM/Bicep snippet provided in lab materials).

Design checklist
- Map business RTO/RPO to service-level capabilities (e.g., Cosmos DB multi-write vs read-replica patterns).
- Test DR annually and after significant changes; automate test runs where possible.
- Keep runbooks versioned and stored in source control; use automation to execute them safely.

Study checkpoint
- Deliverable: DR runbook and tested failover playbook for a 3-tier application meeting assigned RTO/RPO.

Further reading
- Resiliency patterns: https://learn.microsoft.com/azure/architecture/patterns/resiliency

---
