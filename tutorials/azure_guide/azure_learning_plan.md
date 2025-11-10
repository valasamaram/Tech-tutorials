# Azure Learning Plan — From Basics to Advanced

Purpose: This learning plan is a guided curriculum you can follow to go from Azure beginner to deep-dive practitioner/architect level. It is structured into modules, hands-on labs, assessments, suggested weekly schedules, and capstone projects. I can be your tutor: run weekly lessons, review labs, grade assignments, and do mock interviews.

Audience: newcomers to cloud computing, engineers moving to Azure, architects preparing for senior interviews, and candidates targeting Azure certifications.

---

## How this plan works (tutoring model)
- Weekly cadence (recommended): 2–3 sessions per week (1.5–2 hours each) + 4–8 hours self-study/labs.
- Session types:
  - Lesson (concept + demo)
  - Lab review (I review your lab code/config and give feedback)
  - Exam/quiz or mock interview
- Deliverables per module: short lab, a one-page architecture diagram, and 1–2 short written answers (STAR story style).
- Progress checkpoints: after each major milestone (Fundamentals, Core Services, Architecture & Governance, Advanced), we run an assessment and plan the next block.

Customization: I’ll tailor pace and depth to your background and goals. Tell me: weekly hours you can commit, target role (admin/architect/devops/security), and any certification goal (AZ-900, AZ-104, AZ-305, AZ-500, etc.).

---

## Learning tracks & timeline options
Choose one based on available time and goals. All timelines assume active weekly practice and labs.

1) Fast-track (intensive) — 8–10 weeks
- 10–15 hours/week (good for switching careers quickly)
- Outcome: solid practical skills, AZ-104 readiness, basic architecture

2) Standard track — 16–20 weeks
- 6–8 hours/week
- Outcome: solid fundamentals, core services mastery, beginner architecture patterns, AZ-900 + AZ-104 readiness

3) Deep-dive architect track — 6–9 months
- 6–10 hours/week
- Outcome: advanced architecture, governance, IaC, networking, security, multi-region resilient systems, AZ-305 readiness

Pick a track and I will adapt the weekly plan.

---

## Module roadmap (progresses from basics to deep topics)
Each module includes learning objectives, hands-on labs, reading/watch resources, and an assessment.

Module 0 — Prep & Fundamentals (1–2 weeks)
- Goals: cloud concepts, Azure overview, subscription/account basics, Azure Portal, CLI & PowerShell basics
- Labs: create a free-tier Azure account (if not available), navigate portal, create resource group, deploy a simple VM via Portal and CLI
- Resources: Microsoft Learn (Azure Fundamentals learning path), AZ-900 study guide
- Assessment: short quiz + one lab submission

Module 1 — Core compute, storage, and networking (3–4 weeks)
- Goals: VMs, VMSS, App Service, Storage accounts (blob, file, table, queue), Managed disks, networking basics (vNet, subnets, NSG, UDR)
- Labs: deploy VM with managed disk + SMB share; create VMSS with autoscale; set up vNet + NSG rules
- Assessment: lab and troubleshooting task (simulate blocked traffic and fix)

Module 2 — Identity & access (2–3 weeks)
- Goals: Azure AD basics, users/groups, applications, service principals, managed identities, RBAC, Conditional Access, PIM
- Hybrid: Azure AD Connect overview, Azure AD DS vs AAD DS
- Labs: create app registration, configure RBAC for resource group, configure system-assigned managed identity for an Azure Function
- Assessment: design RBAC for a hypothetical team and justify choices

Module 3 — Infrastructure as Code & CI/CD (3–4 weeks)
- Goals: ARM templates, Bicep, Terraform basics, GitOps concepts (GitHub Actions / Azure DevOps), deployment pipelines
- Labs: author a Bicep module to deploy a 3-VM Availability Set + LB; set up a GitHub Actions pipeline to deploy to a dev RG
- Assessment: PR review + automated pipeline run and artifact validation

Module 4 — Security & governance (3–4 weeks)
- Goals: Azure Policy, initiatives, management groups, Key Vault, secrets management, network security (Azure Firewall, NVA, WAF), security center
- Labs: write a policy to enforce tags; create a Key Vault with RBAC and a Key Rotation policy; demo secure-storage access from a VM using managed identity
- Assessment: package initiative JSON (3 policies) and show audit vs deny behavior

Module 5 — Networking deep-dive (3–5 weeks)
- Goals: advanced vNet design, ExpressRoute, VPN Gateway, Azure Firewall, Application Gateway (WAF), Traffic Manager, Front Door, DNS considerations
- Labs: build hub-and-spoke with peering, implement UDRs and Azure Firewall, set up VNet-to-VNet VPN
- Assessment: network design for a multi-region application meeting security and latency SLAs

Module 6 — Observability & operations (2–3 weeks)
- Goals: Azure Monitor, Log Analytics, Application Insights, Alerts, Network Watcher, Resource Health, runbooks, automation
- Labs: create Log Analytics workspace, instrument a sample app with App Insights, author alert + action group + automation runbook
- Assessment: build an on-call runbook for an incident scenario and implement alerting

Module 7 — Data & platform services (3–5 weeks)
- Goals: Azure SQL, Cosmos DB (consistency models), Storage options, Data Factory, Synapse basics
- Labs: provision Azure SQL with HA, configure long-term backups; import data with Data Factory; small Cosmos DB app showing consistency trade-offs
- Assessment: design data architecture for an OLTP + analytics pipeline

Module 8 — Containers, serverless & app platforms (3–4 weeks)
- Goals: AKS fundamentals, serverless functions, Logic Apps, App Service, CI/CD for containers, ingress, service mesh basics
- Labs: build a small microservice app on AKS with Helm; deploy a function with managed identity calling Key Vault
- Assessment: run a load test and autoscale configuration

Module 9 — Resilience, DR & multi-region architectures (2–4 weeks)
- Goals: Active-passive vs active-active, replication strategies, traffic failover (Front Door, Traffic Manager), backups, RTO/RPO design
- Labs: implement region failover demo with Traffic Manager or Front Door + geo-replicated storage
- Assessment: produce an architecture and test plan meeting an assigned RTO/RPO

Module 10 — Advanced architecture & patterns (ongoing)
- Topics: event-driven designs, CQRS, eventual consistency, data partitioning, cost optimization, scalability patterns, SRE practices on Azure
- Capstone projects: see below

---

## Hands-on capstone projects (build & present)
1. Landing zone + baseline governance
   - Implement management group structure, a hub VNet, Log Analytics, Key Vault, and baseline policies. Deploy with Bicep/Terraform and CI/CD.
2. Multi-region e-commerce reference app
   - Web frontends, global caching (CDN), DB strategy (read-replicas or Cosmos), failover plan, infra as code, and blue/green deployment demonstration.
3. Migration plan & runbook
   - Assess an on-prem app, produce a phased migration plan, implement lift-and-shift PoC, and execute a mock cutover with minimal downtime.

Deliverables: architecture doc, IaC repo, deployment guide, postmortem and cost analysis.

---

## Assessments & certifications mapping
- Beginner: AZ-900 (Cloud fundamentals)
- Administrator: AZ-104 (Azure Administrator)
- Architect: AZ-305 (Solutions Architect)
- Security: AZ-500 (Azure Security Engineer)
- DevOps: AZ-400 (Azure DevOps)
- Data: DP-900 (Data fundamentals), DP-203/DP-500 depending on focus

We’ll tie module assessments to certification objectives when you want to pursue them.

---

## Example 16-week weekly schedule (standard track)
Weeks 1–2: Module 0 (fundamentals)
Weeks 3–5: Module 1 (compute, storage, networking basics)
Weeks 6–7: Module 2 (identity & access)
Weeks 8–10: Module 3 (IaC & CI/CD)
Weeks 11–12: Module 4 (security & governance)
Weeks 13–14: Module 5 (networking deep-dive)
Week 15: Module 6 (observability & ops)
Week 16: Assessment & capstone kickoff

Each week: 1 lesson + 1 lab + self-study. I’ll review labs and provide feedback.

---

## Resources (official + curated)
- Microsoft Learn: https://learn.microsoft.com/azure — interactive modules mapped to cert objectives
- Azure Architecture Center: https://learn.microsoft.com/azure/architecture
- Bicep docs: https://learn.microsoft.com/azure/azure-resource-manager/bicep
- Azure CLI docs and Az PowerShell docs
- Books & courses: Pluralsight, A Cloud Guru / Linux Academy, Udemy (pick authors with recent 2024/2025 content)
- Community: GitHub, Azure Samples, Azure Friday videos, Channel 9

---

## How I’ll tutor you (suggested plan)
- Weekly plan: pick 2 fixed session slots (e.g., Tues/Thu 18:30–20:00)
- Session structure: 30–45 min lesson/demo, 30–60 min live lab/assignment work + Q&A
- Between-session tasks: lab work, reading, build artifacts for review
- Feedback loop: I’ll review PRs, run the code locally, and provide inline comments and improvements
- Mock interviews: after each major milestone we run 1–2 mock interviews (architectural + hands-on whiteboard)

---

## Next actions I will take if you confirm
1. Finalize this learning plan as a tracked todo and create a baseline schedule file (`azure_learning_plan.md`) — done.
2. Create the first-week lesson material and lab (Module 0): a short lab to create a resource group, deploy a VM with CLI and Portal, and submit artifacts for review.
3. Schedule the first live session (we’ll pick days/times you prefer).

Tell me:
- Which timeline you prefer (fast / standard / deep-dive)?
- Weekly hours you can commit (approx)?
- Target role(s) and any certification goals?
- Preferred session days/times (timezone)?

Once you answer, I’ll mark the todo item as in-progress (already done) and create the week-1 lesson & lab materials and add them to the todo list.