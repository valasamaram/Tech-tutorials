# Module 0 — Prep & Fundamentals (Cloud + Azure basics → Advanced)

This lesson takes you from zero to confident in the core cloud and Azure fundamentals. It includes conceptual material, hands-on labs (Portal, Azure CLI, PowerShell, Bicep validation), a troubleshooting checklist, small quizzes, and assignments.

Estimated time: 1–2 weeks (standard track). Adjust pace if you're on the fast or deep track.

---

## Learning objectives
By the end of this module you will be able to:
- Explain cloud computing models (IaaS, PaaS, SaaS) and deployment models (public, private, hybrid).
- Describe Azure components: subscriptions, management groups, resource groups, resources, regions, availability zones, and pricing model basics.
- Use the Azure Portal, Azure CLI, and Azure PowerShell to create and manage a resource group and simple resources (VM, storage account).
- Understand identity basics (Azure AD → user vs service principal vs managed identity) and basic RBAC concepts.
- Apply tags and cost-control basics (budgets, cost analysis) and implement basic policies.
- Validate, troubleshoot, and clean up resources.

---

## Concepts — from basics to deeper understanding

### 1. Cloud computing models (short)
- IaaS (Infrastructure as a Service): raw VMs, network, and storage you manage (OS updates, patching). Example: Azure Virtual Machines.
- PaaS (Platform as a Service): platform-managed runtime and scaling, you manage application code. Example: Azure App Service.
- SaaS (Software as a Service): fully managed applications. Example: Office 365.

Why it matters: choose the right level of control vs operational overhead.

### 2. Deployment models (public/hybrid/private)
- Public cloud: infrastructure run by Azure; shared multi-tenant model.
- Private cloud: single-tenant; dedicated hardware (on-prem or hosted).
- Hybrid cloud: combination, often using VPN/ExpressRoute and identity integration.

### 3. Azure organizational constructs
- Tenant (Azure AD): identity boundary for an organization.
- Subscription: billing boundary and resource quota container.
- Management groups: group subscriptions for governance and policy assignment.
- Resource groups: logical container to group related resources for lifecycle and RBAC.
- Resources: any service deployed in Azure (VM, storage, SQL, function).

Deeper: understand tenant vs subscription vs management groups for governance and policy inheritance.

### 4. Regions, availability zones & pairs
- Region: geographic area where Azure services are hosted.
- Availability Zone: physically separate datacenters within a region.
- Region pair: pre-defined pair for disaster recovery guarantees and coordinated updates.

Deeper: region selection affects latency, data residency, and available services. Availability zones vs availability sets trade-offs.

### 5. Azure pricing basics & cost controls
- Pricing model: pay-as-you-go, reserved instances (1/3-year), spot instances.
- Cost controls: tags, budgets, Cost Management, reservations, Azure Hybrid Benefit.

Deeper: understand pricing calculators, TCO considerations, and cost-saving patterns (auto-shutdown non-prod, reserved instances, right-sizing).

### 6. Identity basics
- Azure AD vs AD DS: Azure AD is an identity and access management service for cloud resources (OAuth, OpenID Connect, SAML). AD DS is traditional on-premises directory.
- Users vs service principals vs managed identities:
  - User: human identity.
  - Service principal: application identity in Azure AD (used for automation/CI).
  - Managed identity: platform-managed identity tied to a resource (VM, Function) with automatic credential rotation.

Deeper: tokens, OAuth flows, and when to use managed identity vs SP.

### 7. RBAC & least privilege
- Roles: Owner, Contributor, Reader, and many built-in roles.
- Assign to groups, not individual users.
- Use custom roles only when necessary.

Deeper: resource-scoped RBAC vs management-group scoped assignments; role assignment evaluation and deny policies.

### 8. Tools & IaC basics
- Azure Portal: GUI for exploration and quick tasks.
- Azure CLI: cross-platform command-line tool.
- Azure PowerShell (Az module): PowerShell-oriented commands.
- IaC: ARM templates, Bicep (recommended) — author declarative resource definitions.

Deeper: authoring Bicep modules and parameter files; local validation with "bicep build" and `az deployment group create --template-file`.

---

## Hands-on labs (practical)
Each lab includes step-by-step commands and validation. Perform them in a sandbox subscription or a free trial.

### Lab 0.1 — Setup & tools (15–30m)
Goals: install Azure CLI, login, and set default subscription.

Install Azure CLI (Windows PowerShell):
```powershell
# Install (if not installed already)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'

# Login
az login

# List subscriptions
az account list -o table

# Set default subscription
az account set --subscription "<subscription-id-or-name>"
```

Install Az PowerShell module (optional):
```powershell
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
Connect-AzAccount
```

Validation:
```powershell
az account show -o table
```

### Lab 0.2 — Create resource group & simple VM (Portal + CLI)
Goals: create RG, create a Linux VM using CLI, open SSH port, and verify connectivity.

CLI steps:
```powershell
## Module 0 — Prep & Fundamentals (Cloud + Azure basics → Advanced)

This module brings you from core cloud concepts through practical Azure operations. The material below expands each topic with: What it is, Why it matters, How to use it (short examples), Benefits, and Pros/Cons. Labs include Portal, Azure CLI, and Azure PowerShell steps plus Bicep validation and cleanup.

Estimated time: 1–2 weeks (standard track). Adjust pace for fast or deep track.

---

## Learning objectives
By the end of this module you will be able to:
- Explain cloud computing models (IaaS, PaaS, SaaS) and deployment models (public, private, hybrid) with trade-offs.
- Describe Azure components: subscriptions, management groups, resource groups, resources, regions, availability zones, and pricing basics.
- Use the Azure Portal, Azure CLI, and Azure PowerShell to create and manage a resource group and simple resources (VM, storage account).
- Understand identity basics (Azure AD → user vs service principal vs managed identity) and basic RBAC concepts and patterns.
- Apply tags and cost-control basics (budgets, cost analysis) and implement a simple policy.
- Validate, troubleshoot, and clean up resources safely.

---

## Concepts — detailed (what / why / how / benefits / pros & cons)

### 1. Cloud computing models
- What: different service layers that abstract infrastructure to varying degrees.
- Why: choosing the right model balances control, operational overhead, and time-to-market.
- How (examples):
  - IaaS: you provision VMs, storage, and networking (Azure Virtual Machines). You install OS and manage updates.
  - PaaS: platform handles OS and runtime (Azure App Service, Azure SQL managed instance). You deploy app code.
  - SaaS: provider runs the entire application stack (Microsoft 365, Salesforce).
- Benefits:
  - IaaS: maximum control, lift-and-shift support.
  - PaaS: reduced ops, built-in scalability and patching.
  - SaaS: minimal ops, quick adoption.
- Pros / Cons:
  - IaaS pros: flexible, familiar; cons: you must manage OS & middleware.
  - PaaS pros: less ops, built-in features; cons: less control and possible vendor constraints.
  - SaaS pros: minimal maintenance; cons: limited customization and integration constraints.

### 2. Deployment models (public / private / hybrid)
- What: where and how infrastructure is hosted.
- Why: compliance, latency, and integration needs drive model choice.
- How:
  - Public: consume Azure services in Microsoft-operated datacenters.
  - Private: dedicated infrastructure (on-premises or hosted private cloud).
  - Hybrid: combine on-prem and cloud with connectivity (VPN, ExpressRoute) and identity integration (Azure AD Connect).
- Benefits: hybrid enables phased cloud adoption and data residency control.
- Pros / Cons:
  - Public pros: cost efficiency, scale; cons: shared tenancy concerns for some regulations.
  - Private pros: isolation and control; cons: higher capital and ops costs.
  - Hybrid pros: best of both; cons: complexity in networking and identity.

### 3. Azure organizational constructs (tenant, subscription, management groups, resource groups)
- What & Why (short):
  - Tenant (Azure AD): identity boundary and directory for users/apps — important for auth and B2B/B2C scenarios.
  - Subscription: billing and quota boundary — resources are billed to a subscription.
  - Management groups: let you group subscriptions for policy and RBAC inheritance.
  - Resource groups: logical container to manage lifecycle and apply RBAC/locks/policies at a smaller scope.
- How (practical): create resource groups to group related resources (e.g., app + database + networking). Use management groups for enterprise governance.
- Benefits: tidy lifecycle management, targeted RBAC and policies, and clear billing separation.
- Pros / Cons:
  - Management groups pros: scalable governance; cons: complexity at scale.
  - Resource groups pros: simple lifecycle operations; cons: not a security boundary by itself (RBAC and locks still apply).

### 4. Regions, availability zones & region pairs
- What: physical and logical grouping of Azure datacenters.
- Why: affects latency, compliance, resilience, and service availability.
- How:
  - Choose region based on user proximity, legal requirements, and service availability.
  - Use Availability Zones (AZs) within region to deploy resilient workloads across physically separate datacenters. Use region pairs for DR strategy.
- Benefits: improved availability and lower latency when planned correctly.
- Pros / Cons:
  - AZ pros: high availability within region; cons: not every service supports AZs in every region.
  - Cross-region replication pros: strong DR; cons: higher cost and possible data egress fees.

### 5. Azure pricing basics & cost controls
- What: pay-for-what-you-use model with options to reserve capacity.
- Why: cost is a first-class operational concern; planning saves money.
- How:
  - Pricing models: pay-as-you-go, Reserved Instances (1yr/3yr), Spot VMs for transient workloads.
  - Controls: tagging, budgets, Azure Cost Management in Portal, reservations, auto-shutdown for VMs.
- Benefits: cost transparency and optimization opportunities.
- Pros / Cons:
  - Reserved Instances pros: big cost savings; cons: commitment and less flexibility.
  - Spot VMs pros: cheapest for batch; cons: eviction risk.

### 6. Identity basics (Azure AD: users, service principals, managed identities)
- What:
  - User: interactive/human identity (can be in Azure AD or external).
  - Service principal (SP): identity for applications and automation; credentials are client secret or certificate.
  - Managed identity: platform-managed identity for Azure resources, no credential management.
- Why: use appropriate identity type to minimize secrets and follow least privilege.
- How (examples):
  - Create service principal (CLI):
    az ad sp create-for-rbac --name "my-app-sp" --role Contributor --scopes /subscriptions/<sub-id>/resourceGroups/<rg>
  - Create system-assigned managed identity (on VM or Function): via Portal or Bicep (resource identity block) or CLI when creating VM (see lab).
- Benefits: managed identities remove secret rotation burden; SPs are flexible for CI/CD.
- Pros / Cons:
  - SP pros: works anywhere (including external apps); cons: you must manage credentials.
  - Managed identity pros: no credentials to manage; cons: limited to Azure resources.

### 7. RBAC & least privilege
- What: role-based access control for Azure resources.
- Why: secure operations with least-privilege principle.
- How (examples):
  - Built-in roles: Owner, Contributor, Reader, plus many resource-specific roles.
  - Assign role to group rather than individual user: use Azure AD groups.
  - CLI example to assign Reader to a user at resource group scope:
    az role assignment create --assignee <user-or-sp-id> --role Reader --resource-group <rg>
- Benefits: centralized permission model and clear audit trails.
- Pros / Cons:
  - Pros: flexible scoping and auditability; cons: role explosion if not managed (use groups and naming conventions).

### 8. Tools & IaC basics (Portal, CLI, PowerShell, Bicep)
- What: different interfaces to manage Azure.
- Why: use the right tool for the job — Portal for discovery, CLI/PowerShell for scripting, IaC for repeatability.
- How (examples):
  - Portal: GUI to create, inspect, and configure resources.
  - Azure CLI (cross-platform): az group create --name myrg --location eastus
  - Azure PowerShell: New-AzResourceGroup -Name myrg -Location eastus
  - Bicep: declarative templates; validate locally with bicep build and deploy with az deployment group create.
- Benefits: repeatability & automation with IaC; ad-hoc testing with CLI/Portal.
- Pros / Cons:
  - IaC pros: reproducible, versionable; cons: initial authoring overhead.

---

  ## Fundamental concepts: cloud, data, data centers, and flows

  ### What is "the cloud"?
  - What: "The cloud" means on-demand computing resources (compute, storage, network, platform services) delivered over the internet by a provider (Azure, AWS, GCP). Resources run in provider datacenters and are consumed remotely.
  - Why: to avoid up-front capital costs, speed time-to-market, scale elastically, and shift operational overhead to the provider.
  - How: you request resources via a web console, CLI, SDK, or API. The provider allocates capacity from its datacenters, exposes endpoints and management interfaces, and charges for consumption.
  - Benefits:
    - Elasticity: scale up/down quickly to match demand.
    - Agility: fast provisioning, experimentation.
    - Lower ops: providers manage physical infra (power, cooling, hardware).
    - Global reach: deploy near users (regions).
    - Pay-as-you-go and many managed services.
  - Pros / Cons:
    - Pros: cost flexibility, operational simplification, managed security features, broad ecosystem.
    - Cons: potential vendor lock-in, ongoing operating cost vs one-time capex (depends), data residency/compliance complexity, less direct hardware control, possible latency for some workloads.

  ### What are cloud services?
  - What: discrete managed offerings the cloud provider exposes — from raw VMs to fully managed services (databases, message brokers, AI).
  - Categories & examples:
    - Compute: VMs, containers, serverless (Azure Functions).
    - Storage: object (Blob Storage), block disks, file services.
    - Databases: managed relational (Azure SQL), NoSQL (Cosmos DB).
    - Networking: VNets, Load Balancers, Gateways, CDN.
    - Identity & Security: Azure AD, Key Vault, Firewall.
    - Platform services: App Service, Service Bus, Event Grid, Logic Apps.
    - Management: Azure Policy, Monitor, Cost Management.
  - How used: select a service that matches functional and non-functional needs (control, scalability, cost). E.g., choose PaaS DB to reduce ops; choose IaaS VM for full OS control.

  ### What is "data"?
  - What: information stored, processed, or transmitted by systems (customer records, logs, images, telemetry).
  - Types:
    - Structured: relational tables (SQL).
    - Semi-structured: JSON, XML, logs.
    - Unstructured: images, video, documents (blobs).
  - Lifecycle (typical): ingest → store → process → serve → retain/archive/delete.
  - Considerations: retention requirements, encryption at rest/in-transit, backups, indexing, and cost for hot vs cold storage.

  ### What is a data center?
  - What: a physical facility housing servers, storage, networking, power/cooling and operations staff. Cloud providers operate many datacenters grouped into regions and availability zones.
  - Key components: compute servers, storage arrays, network fabric, power (UPS/generators), cooling, physical security, and orchestration/management systems.
  - Why it matters: physical redundancy, geographic distribution, and operational practices determine availability, latency, and compliance.

  ### How a typical cloud data flow works (end-to-end)
  High-level steps (web app example):
  1. User (browser/app) sends HTTPS request over the Internet.
  2. Request may hit a CDN or global front door for static content and routing.
  3. Edge/global load balancer forwards to the closest region or to an application gateway (WAF).
  4. Traffic enters the application tier (App Service, VM Scale Set, or containers) inside a VNet.
  5. App tier calls backend services:
     - Managed DB (Azure SQL, Cosmos DB) for transactional data.
     - Blob Storage for files and media.
     - Service Bus/Event Grid for async events.
  6. Workers (Functions, worker VMs) process events and write results to analytics stores or data lake.
  7. Monitoring and logging agents forward telemetry to Log Analytics / Monitor.
  8. Backups and geo-replication protect data for DR.
  9. IAM, network rules, and Key Vault control access and secrets.

  Azure-specific mapping: Client → Azure Front Door → Application Gateway (WAF) → App Service / VMSS in VNet → Azure SQL / Cosmos DB → Blob Storage → Azure Functions → Azure Monitor + Log Analytics → Backup/Recovery services.

  ### Security, identity, and access flow
  - Authentication: users authenticate to Azure AD (OAuth/OIDC); apps use service principals or managed identities.
  - Authorization: RBAC controls who/what may perform actions.
  - Network security: VNets, subnets, NSGs, firewalls, Private Endpoints.
  - Secrets: Key Vault for keys/secrets/certificates; managed identities avoid static credentials.
  - Encryption: TLS in transit; provider-managed or customer-managed keys for at-rest encryption.

  ### Resilience, availability & DR notes
  - Use Availability Zones for intra-region resilience; use geo-replication and paired regions for full DR.
  - Backup flow: scheduled full/differential/log backups, retention policies, and periodic restore drills.
  - Monitoring & runbooks: alerts, automated remediation where possible, and documented runbooks for failover.

  ### Operational & compliance concerns
  - Data residency and sovereignty: choose compliant regions (GDPR, HIPAA).
  - Cost flow: ingress free; egress and cross-region data transfer often cost — optimize placement.
  - Vendor lock-in: heavy use of managed services increases migration cost; mitigate with abstractions where feasible.
  - Latency: deploy near users or use edge services.

  ### Practical checklist for designing flows
  - Classify data (public/internal/confidential/regulated) and apply matching controls.
  - Choose cloud model: IaaS for control, PaaS for lower ops, SaaS to offload all infra.
  - Pick region(s) for latency & compliance; use AZs for resiliency.
  - Prefer managed identities over secrets; use Key Vault for sensitive data.
  - Use private endpoints and network isolation for sensitive services.
  - Apply tags early for cost allocation and set budgets/alerts.
  - Automate infra with IaC (Bicep/ARM/Terraform) and validate via CI/CD.
  - Include backups and DR runbooks; test restores.

  ### Glossary (short)
  - Region: geographic area of datacenters.
  - Availability Zone: isolated datacenter within a region.
  - VNet: virtual network segment.
  - Blob storage: object store for unstructured data.
  - Managed identity: Azure-assigned identity for a resource.
  - Service principal: app identity in Azure AD.
  - CDN: content delivery network for edge caching.

  ---

## Conceptual deep-dive: architecture, networking, storage, compute, identity, governance, observability, and operations

This section replaces hands-on step-by-step labs with a thorough conceptual guide aimed at learning and understanding core Azure architecture and operational patterns. It focuses on principles, trade-offs, and how components fit together.

### Architecture fundamentals and design principles
- Design for failure: assume any single component can fail; plan retries, idempotency, and degradations.
- Design for scale: separate stateless compute and stateful storage; use autoscaling and partitioning.
- Security-first: network isolation, principle of least privilege, strong identity controls, and encryption in transit/at rest.
- Observability: instrument for metrics, logs, and traces from the start to enable fault diagnosis and capacity planning.

### Networking: VNets, subnets, connectivity and security
- Virtual Network (VNet): logical network boundary. Use subnets to segment workloads (front-end, app, data).
- Subnet-level controls: NSGs (stateless packet filters) and ASGs (grouping by app role) to manage security rules.
- Connectivity patterns:
  - VNet peering: low-latency private connectivity within Azure between VNets.
  - VPN Gateway / ExpressRoute: secure connectivity to on-premises; ExpressRoute offers private, high-throughput links.
  - Service endpoints & Private Endpoints: secure access to PaaS services over private network paths.
- Load balancing and ingress:
  - Azure Load Balancer (L4) for internal/external TCP/UDP.
  - Application Gateway (L7) with WAF for HTTP/HTTPS.
  - Azure Front Door for global routing, caching, and SSL-offload.
- Network design considerations: minimize blast radius, use segmentation, centralize shared services in a hub VNet (hub-and-spoke), and manage egress via NAT or Firewall.

### Compute: VMs, scale sets, containers, and orchestration
- Virtual Machines (IaaS): full OS control. Use for legacy apps or when kernel-level access required.
- Virtual Machine Scale Sets (VMSS): group of identical VMs that scale automatically and integrate with load balancers.
- Availability Sets vs Availability Zones:
  - Availability Set: protects against rack-level failures within a single datacenter by spreading VMs across fault and update domains.
  - Availability Zone: physically separate datacenters within a region; better resilience than Availability Sets but requires region support.
- Containers and orchestration:
  - Azure Kubernetes Service (AKS) for orchestrating containers.
  - Container Instances for simple container runs without orchestration.
- Serverless compute:
  - Azure Functions for event-driven code with automatic scale. Best for short-lived tasks and integration scenarios.

### Storage: accounts, types, tiers, and redundancy
- Storage account kinds: StorageV2 (general purpose v2) supports blobs, files, queues, tables.
- Data access patterns and tiers:
  - Hot: frequent access (higher cost)
  - Cool: infrequent access (lower storage cost, higher access cost)
  - Archive: long-term retention (lowest storage cost, high retrieval latency/cost)
- Redundancy options:
  - LRS (Locally redundant storage): 3 copies in single datacenter.
  - ZRS (Zone-redundant): copies across zones in a region.
  - GRS / RA-GRS (Geo-redundant): replicate to paired region for DR (asynchronous replication). RA-GRS allows read access in secondary region.
- Access control: Shared Key, SAS tokens, Azure AD (role-based) for blobs; prefer AD-based auth and Private Endpoints for sensitive data.

### Databases and data platforms
- Azure SQL (PaaS): managed relational database with automated patching, backups, and high-availability options (zone-redundant, geo-restore).
- Managed Instance: near 100% compatibility with SQL Server for lift-and-shift.
- Cosmos DB: multi-model, globally distributed NoSQL with tunable consistency levels (strong, bounded staleness, session, consistent prefix, eventual).
- Analytical stores: Synapse Analytics, Data Lake (ADLS Gen2) for big data workloads; separate OLTP/OLAP concerns.

### Identity, authentication, and authorization (detailed)
- Azure AD: cloud identity provider supporting OAuth2, OpenID Connect, and SAML. Central to authentication for users and apps.
- App registrations & service principals:
  - App Registration: application object in tenant (metadata, reply URLs, permissions).
  - Service Principal: concrete instance of app usable to assign roles and obtain tokens.
- Authentication flows:
  - Authorization Code (interactive web apps)
  - Client Credentials (server-to-server, uses client secret or certificate)
  - Device Code, Resource Owner Password (legacy/limited use)
- Managed Identities:
  - System-assigned: lifecycle tied to a resource; no credential management.
  - User-assigned: reusable identity assignable to multiple resources.
- Tokens & lifetime: access tokens (short-lived), refresh tokens (if applicable); use MSAL libraries for token acquisition and caching.
- Advanced identity controls: Conditional Access (MFA, location/device-based), Identity Protection (risk detections), and Privileged Identity Management (PIM) for just-in-time elevation.

### RBAC and governance
- RBAC model: role definitions (set of permissions), role assignments (who/what, scope), and scopes (subscription, resource group, resource).
- Built-in roles vs custom roles: use built-in for common needs; create custom roles for narrow least-privilege needs.
- Scoped assignments: prefer assigning at resource group level to reduce sprawl; prefer groups over individuals.
- Deny assignments & policy: Azure Policy enforces configuration compliance (deny, audit, append, deployIfNotExists). Use initiatives to group policies.
- Management groups: organize subscriptions for inheritance of policies and controls.

### Security controls and data protection
- Network security: NSGs, Azure Firewall, WAF, DDoS Protection Standard, Private Endpoints.
- Secrets management: Key Vault for keys, secrets, certificates; integrate with managed identities for retrieval.
- Encryption: storage and DB encryption (TDE), encryption at rest (platform-managed or customer-managed keys), TLS for in-transit.
- Compliance controls: Azure Blueprints (deprecated in favor of initiatives/landing zones) and policy-driven guardrails.

### Observability: monitoring, logging and tracing
- Azure Monitor: metrics, alerts, autoscale rules.
- Log Analytics (Workspace): central store for logs and queryable via Kusto Query Language (KQL).
- Application Insights: telemetry for application performance, distributed tracing, and exception tracking.
- Best practices: instrument code (traces, metrics), set sensible retention and alerts, create dashboards for runbook visibility.

### Backup, disaster recovery, and business continuity
- Backup solutions: Recovery Services vault for VM and workload backups; database PITR for managed DBs.
- Replication & failover: geo-replication for storage and DBs; ASR (Azure Site Recovery) for VM replication and orchestrated failover.
- RTO/RPO planning: align backup frequency and replication to business requirements; test restores regularly.

### Cost management and optimization (deep)
- Pricing models: pay-as-you-go, reserved capacity (1/3 year), spot instances, savings plans where available.
- Cost governance:
  - Tagging strategy: enforce required tags (cost-center, owner, environment) via policy.
  - Budgets & alerts: detect overspend and notify owners.
  - Rightsizing: use Advisor recommendations, monitor utilization, and downsize or change SKUs.
- Storage cost patterns: move cold data to archive, use lifecycle management policies.

### IaC, CI/CD and operational practices
- IaC choices: Bicep/ARM (native), Terraform (multi-cloud). Store templates in Git and review changes via pull requests.
- CI/CD: use GitHub Actions, Azure Pipelines to validate templates (`bicep build`, `az deployment validate`) and apply deployments with service principals or managed identities.
- Environment promotion: keep separate state for dev/test/prod; use parameterization and secure secrets in Key Vault.

### Common design patterns and anti-patterns
- Patterns: circuit breaker, queue-based load leveling, bulkhead isolation, green/blue or canary deployments, immutable infrastructure.
- Anti-patterns: monolithic stateful apps in single VM, excessive permission grants, lack of telemetry, manual-only deployments.

### Learning path & recommended sequence
1. Core concepts: cloud models, deployment models, and Azure organizational constructs.
2. Identity & RBAC: app registrations, service principals, managed identities, PIM.
3. Networking & security: VNets, NSGs, Private Endpoints, Firewall.
4. Compute & storage: VMs, VMSS, AKS, storage tiers and redundancy.
5. Databases & analytics: Azure SQL, Cosmos DB, Synapse, ADLS Gen2.
6. Observability & operations: Monitor, Log Analytics, App Insights, runbooks.
7. Governance & cost: Policy, management groups, tagging, budgets, reservations.

---

## References & further reading
- Azure architecture center: https://learn.microsoft.com/azure/architecture/
- Azure Well-Architected Framework: https://learn.microsoft.com/azure/architecture/framework/
- Azure networking docs: https://learn.microsoft.com/azure/networking
- Azure security docs: https://learn.microsoft.com/azure/security
- Azure cost management: https://learn.microsoft.com/azure/cost-management

### Architecture diagram (visual)

![End-to-end architecture](./module_00_architecture.svg)

## Appendix — Cheat sheet (concepts & key commands)

Quick conceptual reminders
- IaaS: VM-level control; you manage OS and middleware.
- PaaS: platform-managed; you deploy code and config.
- SaaS: consumed application; minimal operational burden.
- VNet: virtual network; subnets segment workloads; NSGs control traffic.
- Managed identity: resource-assigned identity; avoids credential management.

Azure CLI (common commands)
```
az account show
az group create --name <rg> --location <location>
az vm create --resource-group <rg> --name <vm> --image UbuntuLTS --admin-username <user> --ssh-key-value <pubkey>
az storage account create -n <sa> -g <rg> -l <location> --sku Standard_LRS
az role assignment create --assignee <principalId> --role Reader --resource-group <rg>
az policy definition create --name <name> --rules ./policy.json --mode All
az deployment group create --resource-group <rg> --template-file ./template.json --parameters @params.json
```

Azure PowerShell equivalents (examples)
```
Connect-AzAccount
New-AzResourceGroup -Name <rg> -Location <location>
New-AzVM -ResourceGroupName <rg> -Name <vm> -Image "UbuntuLTS" -Credential (Get-Credential)
New-AzStorageAccount -ResourceGroupName <rg> -Name <sa> -SkuName Standard_LRS -Kind StorageV2 -Location <location>
New-AzRoleAssignment -ObjectId <principalId> -RoleDefinitionName Reader -Scope "/subscriptions/<sub>/resourceGroups/<rg>"
```

Quick policy & tagging patterns
- Enforce tag requirements with policy (audit/deny) and use initiatives for groupings.
- Deny public blob access policy snippet (see body above).

Observability quick checks
- Check VM health: az vm get-instance-view -g <rg> -n <vm>
- Query logs: go to Log Analytics workspace and use KQL: `AzureDiagnostics | where TimeGenerated > ago(1h)`

Cleanup reminder
- To remove sandbox resources quickly: `az group delete --name <rg> --yes --no-wait` (removes everything in the RG).


Service principal (SP) example (CLI) — for automation:
```powershell
az ad sp create-for-rbac --name "ci-cd-myapp" --role Contributor --scopes /subscriptions/<sub-id>/resourceGroups/<rg>
```
- What: SP is an app identity. Why: use in CI/CD pipelines to authenticate without user creds. How to secure: limit scope (resource-group or resource), give minimal role, prefer certificate over client secret when possible.

Managed identity example (assign VM a system-assigned identity):
```powershell
az vm identity assign --resource-group $rg --name $vmName --identities [system]
```
- Why: avoids secret management. Use for accessing Key Vault, Storage, etc.

RBAC example (assign Reader role to a group at resource group scope):
```powershell
az role assignment create --assignee-object-id <group-object-id> --role Reader --resource-group $rg
```

Best practices:
- Assign roles to groups or service principals, not individual users.
- Use least privilege and custom roles only when necessary.

---

## Tags, cost controls, and basic policy

Tags:
- What: metadata (key/value) applied to resources to organize and filter billing and inventory (e.g., cost-center, environment).
- Apply tag via CLI:
```powershell
az tag create --name cost-center
az resource tag --tags cost-center=platform environment=dev --resource-id /subscriptions/<sub-id>/resourceGroups/<rg>
```

Cost controls (Portal and CLI notes):
- Budgets: configure in Azure Portal under Cost Management -> Budgets to alert when spend approaches thresholds. CLI: `az consumption budget` commands may require the consumption extension (depends on CLI version).
- Cost analysis: use Cost Management in Portal to slice by tags, resource type, or service.

Policy (simple example: deny public access to storage containers)
- Why: enforce governance and prevent risky configurations.
- Policy definition (JSON snippet):
```json
{
  "mode": "All",
  "policyRule": {
    "if": {
      "allOf": [
        { "field": "type", "equals": "Microsoft.Storage/storageAccounts" },
        { "field": "Microsoft.Storage/storageAccounts/allowBlobPublicAccess", "equals": true }
      ]
    },
    "then": { "effect": "deny" }
  },
  "metadata": { "category": "Storage" }
}
```

Create & assign via CLI:
```powershell
az policy definition create --name 'deny-public-blob' --display-name 'Deny public blob' --description 'Deny allowBlobPublicAccess true' --rules ./deny-public-blob.json --mode All
az policy assignment create --name 'deny-public-blob-assignment' --policy 'deny-public-blob' --scope /subscriptions/<sub-id>/resourceGroups/<rg>
```

Note: Policy effects vary (deny, audit, append, deployIfNotExists).

---

## Validation, monitoring & troubleshooting (quick checklist)

- Check resource existence and properties:
  - az group show --name $rg
  - az resource show --ids <resource-id>
- Verify VM health and logs:
  - az vm get-instance-view --resource-group $rg --name $vmName
- Network troubleshooting:
  - az network nic show-effective-nsg --resource-group $rg --name <nic-name>
  - Use Network Watcher (connection troubleshoot) in Portal.
- Policy compliance:
  - az policy state list --scope /subscriptions/<sub-id>
- Cost & budget checks:
  - Check Cost Management in Portal and alerts for budgets.

Common issues and fixes:
- az login/select subscription errors: ensure correct tenant and that your account has permissions.
- Quota/limit errors: request quota increases or choose another region.
- NSG blocking traffic: inspect effective security rules and NSG flow logs.

---

## Cleanup (always clean sandbox resources)

Delete resource group (removes all contained resources):
```powershell
az group delete --name $rg --yes --no-wait
```

If you need to retain certain resources, delete them individually with `az resource delete`.

---

## Quick quizzes & practical assessment
1. What is the difference between a tenant and a subscription? Why does it matter for governance?
2. When would you choose a PaaS database vs managing SQL on a VM? List at least three trade-offs.
3. Create a short script (CLI or PowerShell) that creates a resource group, storage account, applies tags, and then tears them down.

Practical assessment deliverable:
- Submit your script, the Bicep file (if used), `az deployment group show` output(s), and a 1-page explanation of why you selected region/SKU and the security controls you applied.

---

## Further reading & references
- Azure fundamentals learning path: https://learn.microsoft.com/learn/paths/azure-fundamentals/
- Bicep docs: https://learn.microsoft.com/azure/azure-resource-manager/bicep
- Azure CLI docs: https://learn.microsoft.com/cli/azure
- Azure Policy docs: https://learn.microsoft.com/azure/governance/policy/

---

## Next actions (pick one)
- I will add a graded rubric and automated GitHub Actions workflow to deploy the lab.
- Or I will add only the rubric and leave deployment automation for later.

Tell me which option you prefer and I will (a) add the GitHub Actions workflow + parameterized Bicep and test it locally, or (b) add the rubric only. 
az account show -o table
```

### Lab 0.2 — Create resource group & simple VM (Portal + CLI)
Goals: create RG, create a Linux VM using CLI, open SSH port, and verify connectivity.

CLI steps:
```powershell
# Variables
$rg = 'rg-fundamentals'
$location = 'eastus'

# Create RG
az group create --name $rg --location $location

# Create SSH key (if not exists)
if (-not (Test-Path "$env:USERPROFILE\.ssh\id_rsa.pub")) { ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\id_rsa" -N "" }

# Create VM
az vm create --resource-group $rg --name demoVM --image UbuntuLTS --admin-username azureuser --ssh-key-value "$env:USERPROFILE\.ssh\id_rsa.pub"

# Open SSH port (NSG rule)
az vm open-port --resource-group $rg --name demoVM --port 22

# Get public IP
az vm list-ip-addresses --name demoVM -g $rg -o table
```

Portal steps: show how to create RG, VM, and check NSG inbound rules.

Validation:
- SSH into public IP.
- Verify VM is running in Portal and shows resource group.

Cleanup:
```powershell
az group delete --name $rg --yes --no-wait
```

### Lab 0.3 — Create Storage account and blob container (CLI)
Goals: create storage account, container, upload a small file, and view properties in Portal.

Commands:
```powershell
$rg = 'rg-fundamentals'
$location = 'eastus'
$sa = 'fundamentalsa'$([System.Guid]::NewGuid().ToString('N').Substring(0,8))

az group create --name $rg --location $location
az storage account create --name $sa --resource-group $rg --location $location --sku Standard_LRS --kind StorageV2

# Get keys
$key = az storage account keys list --resource-group $rg --account-name $sa --query "[0].value" -o tsv

# Create container and upload
az storage container create --account-name $sa --name demo --account-key $key
az storage blob upload --account-name $sa --container-name demo --name hello.txt --file README.md --account-key $key

# List blobs
az storage blob list --account-name $sa --container-name demo --account-key $key -o table
```

Cleanup:
```powershell
az group delete --name $rg --yes --no-wait
```

### Lab 0.4 — Bicep: Validate a simple template (resource group + storage)
Goals: author a small Bicep file to create a storage account and deploy it.

`storage.bicep`:
```bicep
param location string = resourceGroup().location
param storageName string

resource sa 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: storageName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

output storageId string = sa.id
```

Deploy:
```powershell
az deployment group create --resource-group $rg --template-file storage.bicep --parameters storageName='fundamentalsa123'
```

Validation:
- Check deployment status in Portal and outputs.

Cleanup:
```powershell
az group delete --name $rg --yes --no-wait
```

---

## Troubleshooting checklist (common starter issues)
- Login errors: ensure `az login` succeeded and subscription selected.
- Quota errors: check subscription quotas and region availability.
- NSG blocking: verify effective security rules for VM NIC; use `az network nic show-effective-nsg`.
- DNS resolution: check Azure DNS/private DNS zones if using custom names.
- Bicep validation: run `bicep build` to detect compile-time errors and `az deployment group validate` for template validation.

---

## Quizzes & Assessments
Short quiz (conceptual):
1. Explain difference between subscription and tenant.
2. When to use Availability Zones vs Availability Sets?
3. Describe the use-cases for managed identity vs service principal.

Practical assessment:
- Deploy a VM and a storage account using CLI and Bicep; submit a screenshot of both resources in the Portal and paste the deployment output.

---

## Further reading & references
- Azure fundamentals learning path: https://learn.microsoft.com/learn/paths/azure-fundamentals/
- Bicep docs: https://learn.microsoft.com/azure/azure-resource-manager/bicep
- Azure CLI docs: https://learn.microsoft.com/cli/azure

---

## Next actions (if you confirm)
- I will add a grading rubric for Module 0 labs and create the week-1 schedule and session notes.
- I can also generate a parameterized Bicep file and a GitHub Actions workflow to deploy the lab automatically.

Choose: add grading rubric only, or add rubric + automated lab deploy pipeline (GitHub Actions).