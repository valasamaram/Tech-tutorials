# Module 10 — Advanced Architecture & Capstone (Architect → Delivery)

Scope: enterprise landing zones, Cloud Adoption Framework patterns, FinOps, multi-region architecture, governance at scale, CI/CD for infra at enterprise scale, and capstone project guidance.

## Learning objectives

- Design an enterprise landing zone that maps to CAF principles and supports guardrails for security, compliance and cost control.
- Implement automated subscription provisioning, policy assignments, and RBAC in a safe, auditable manner.
- Apply FinOps practices to optimize cost for compute, storage, and network at scale.
- Deliver a capstone project: an end-to-end landing zone + sample application with monitoring, security, and DR.

---

## Enterprise landing zones & CAF

### Management group & subscription strategy
- Map business units and environments (prod/non-prod/shared) to management groups and subscriptions. Use delegated subscription creation via ARM/Bicep and a service catalog.

### Guardrails & automation
- Enforce guardrails using Azure Policy initiatives and automatic remediation for diagnostics and tagging. Use GitOps for policy and infra manifests.

### Subscription and resource provisioning
- Automate subscription enrollment and RG creation with parameterized Bicep templates and an approval workflow (Logic Apps or GitHub Actions with approvals).

---

## Security & compliance at scale

- Centralized monitoring and logging: route diagnostics to central Log Analytics and use Azure Monitor metrics for SRE dashboards.
- Secure baseline: PIM, conditional access, Key Vault centralization, and network micro-segmentation via hub.

---

## FinOps & cost governance

- Tagging and chargeback: enforce tags via policy, export cost data, and build dashboards for cost owners.
- Rightsizing and reserved instances: automate recommendations and reservation purchases via APIs or scripts.

---

## Patterns & cross-cutting concerns

- Microservices vs modular monolith: choose based on team autonomy and operational maturity.
- Event-driven architecture patterns and eventual consistency trade-offs.
- Observability-first design: instrument early, keep SLOs and error budgets central to design decisions.

---

## Capstone project guidance

- Deliverable: landing zone repo with Bicep modules for management group, policy assignment, subscription bootstrap, a sample application (AKS or App Service), CI/CD workflows and runbooks for DR and monitoring.
- Grading rubric: architecture quality, automation completeness, security posture, cost optimization, and testing/validation artifacts.

---

## Interview & design tips

- Practice system design at scale: explain trade-offs for multi-region data placement, caching, leader election and failover strategies.
- Be able to present a 10–15 minute architecture walkthrough with diagrams and a one-page risk & cost summary.

---

## References
- CAF and landing zone guidance: https://learn.microsoft.com/azure/cloud-adoption-framework/
- FinOps: https://www.finops.org/
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
