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
