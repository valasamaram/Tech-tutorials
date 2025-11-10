# Module 10 — Advanced Architecture & Patterns (Expert)

Scope: event-driven architectures, CQRS, data partitioning, eventual consistency, SRE practices, cost optimization, large-scale system patterns, and governance at scale.

Learning objectives
- Design event-driven, decoupled systems using Event Grid, Service Bus, and Functions.
- Apply CQRS and event sourcing where appropriate, weigh trade-offs in complexity vs scalability.
- Partition data effectively across Cosmos DB / Synapse and design scalable query patterns.
- Apply SRE principles: SLIs/SLOs, error budgets, capacity planning, and chaos testing.

Advanced topics
- Multi-tenant architectures: shard key strategies, tenant isolation, billing, and scaling.
- Cost modeling at scale: reserved capacity, committed use, and autoscale strategies to control spend.
- Governance at scale: centralized platforms, dev self-service, guardrails, and platform engineering concepts.
- Observability at scale: high-cardinality metrics, distributed tracing across services, and correlated logs for forensic analysis.

Hands-on labs / capstone
- Capstone 1: Build an event-driven order processing pipeline with Service Bus, Functions, Cosmos DB, and an AKS-based reporting service; include retries and dead-letter handling.
- Capstone 2: Build a landing zone with management groups, policy initiative, CI/CD pipeline, and a demo workload that follows the platform's constraints.

Architectural checklist
- Evaluate trade-offs between synchronous and asynchronous communication.
- Plan for operational complexity: monitoring, cost, security, and data governance from day one.
- Create platform patterns and templates to reduce duplicated effort and increase compliance.

Study checkpoint
- Deliverable: capstone architecture repo with IaC, CI/CD, monitoring dashboards, policy initiative and runbooks.

Further reading
- Azure Architecture Center — large-scale system patterns: https://learn.microsoft.com/azure/architecture
- SRE book & patterns: https://sre.google/

---
