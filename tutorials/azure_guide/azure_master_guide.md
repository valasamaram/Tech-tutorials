# Azure Master Guide — Architecture, Governance, Availability, and Operations

## Purpose
This single-file master reference consolidates detailed material on Azure physical infrastructure, regions & availability, Availability Sets, Availability Zones, Cloud Adoption Framework (CAF), landing zones, governance (Azure Policy, RBAC, Management Groups), examples (CLI, PowerShell, ARM, Bicep), troubleshooting playbooks, design trade-offs, and interview-focused whiteboard exercises.

Use this as a reference, study guide, and paste-ready snippet collection for architecture discussions and senior interviews.

---

## Table of Contents
1. Azure physical infrastructure (data centers & backbone)
2. Regions, Availability Zones (AZs), and Region Pairs
3. Availability Sets — full technical breakdown (FDs & UDs)
   - Examples: CLI, PowerShell, ARM, Bicep
   - Ready-to-adapt ARM template (Availability Set + LB scaffold)
4. Availability Zones & multi-region strategies
5. Cloud Adoption Framework (CAF) & Landing Zones
   - Landing zone checklist
   - Bicep landing-zone skeleton
6. Governance: Management Groups, Azure Policy, Initiatives, and RBAC
   - Sample policy JSON & initiative
7. Best practices, trade-offs, and design guidance
8. Troubleshooting playbooks and diagnostics
9. Whiteboard exercises, STAR examples, and interview tips
10. Diagrams, cheat-sheet, and next steps
11. Additional resources

---

## 1. Azure physical infrastructure
- Microsoft operates Azure on a global network of Microsoft-owned data centers organized into regions and availability zones. Key characteristics:
  - Data center: physical building with servers, storage, networking, power, cooling.
  - Region: logical grouping of data centers in a geographic area.
  - Availability Zone: isolated datacenter within a region, with independent power/network.
  - Global backbone: high-speed fiber links between regions and metro links inside regions.

Why this matters:
- Latency: choose regions close to users.
- Compliance: choose regions that meet legal/data residency requirements.
- Resilience: AZs and region pairs improve fault tolerance.

Interview tip: emphasize the practical consequences (SLA, replication choices, regulatory constraints) rather than describing physical controls.

---

## 2. Regions, Availability Zones, and Region Pairs
- Region: where services are deployed — some services not available in every region.
- Availability Zone: protects against datacenter failure within the same region. Generally 3 AZs where supported.
- Region pair: pre-defined pairing for coordinated recovery and certain data-replication guarantees.

Decision checklist:
- Use single region if latency and cost are paramount and a single-region DR strategy is acceptable.
- Use AZs for datacenter-level isolation with low-latency replication.
- Use region pairs for full DR and compliance with geo-redundancy rules.

Latency guidance:
- AZ interconnects: low-latency (suitable for synchronous replication in many services).
- Inter-region: depends on distance; prefer async replication for cross-region databases.

---

## 3. Availability Sets — full technical breakdown

### What
An Availability Set is an allocation grouping within a single region that instructs Azure to spread VMs across Fault Domains and Update Domains to reduce correlated failures.

### Fault Domain (FD)
- Physical separation by rack/power/network.
- Prevents a single hardware/rack failure from impacting VMs in different FDs.
- Typical FD counts: 2–3 depending on region/hardware.

### Update Domain (UD)
- Logical grouping for platform maintenance reboots.
- Azure cycles UDs during maintenance; only VMs in one UD reboot simultaneously.
- Default UDs: often 5; can be larger (up to 20 in some environments).

### Design guidelines
- Put at least two instances of critical VMs in an Availability Set to qualify for the VM SLA.
- Choose FD/UD counts based on VM count and tolerance for simultaneous failures/reboots.
- Remember Availability Sets are region-scoped (not cross-region, not cross-zone).

### Rule-of-thumb
- Small (1–5 VMs): FD = 2, UD = 5
- Medium (6–20 VMs): FD = 3, UD = 5–10
- Large (>20 VMs): FD = 3+ (if supported), UD increase (towards 20)

### Example distribution
VM | Fault Domain | Update Domain
---|--------------|--------------
VM1 | FD0 | UD0
VM2 | FD1 | UD1
VM3 | FD0 | UD1
VM4 | FD1 | UD0

### When to use Availability Sets
- When you need resilience to hardware failures and planned maintenance inside a region.
- When zones are not available for the region or cross-zone costs/complexity are undesirable.

---

### Availability Set examples — commands and IaC
Azure CLI (PowerShell shell):

```powershell
az group create --name rg-demo --location eastus
az vm availability-set create --resource-group rg-demo --name myAS --platform-fault-domain-count 2 --platform-update-domain-count 5
az vm create --resource-group rg-demo --name vm1 --image UbuntuLTS --admin-username azureuser --generate-ssh-keys --availability-set myAS
az vm create --resource-group rg-demo --name vm2 --image UbuntuLTS --admin-username azureuser --generate-ssh-keys --availability-set myAS
```

PowerShell (Az module):

```powershell
New-AzResourceGroup -Name rg-demo -Location eastus
$as = New-AzAvailabilitySet -ResourceGroupName rg-demo -Location eastus -Name myAS -PlatformFaultDomainCount 2 -PlatformUpdateDomainCount 5 -Sku Aligned
# Use New-AzVM with -AvailabilitySetId $as.Id when creating VMs
```

ARM snippet:

```json
{ "type":"Microsoft.Compute/availabilitySets","apiVersion":"2021-07-01","name":"myAS","location":"eastus","properties":{"platformFaultDomainCount":2,"platformUpdateDomainCount":5} }
```

Bicep snippet:

```bicep
resource myAS 'Microsoft.Compute/availabilitySets@2021-07-01' = {
  name: 'myAS'
  location: 'eastus'
  properties: {
    platformFaultDomainCount: 2
    platformUpdateDomainCount: 5
  }
}
```

---

### Availability Set — ready-to-adapt ARM template (scaffold)
This compact template shows an Availability Set and the shape of LB & public IP resources. In an interview, explain NIC <-> LB backend pool wiring and probe configuration.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Compute/availabilitySets",
      "apiVersion": "2021-07-01",
      "name": "myAS",
      "location": "[resourceGroup().location]",
      "properties": { "platformFaultDomainCount": 2, "platformUpdateDomainCount": 5 }
    },
    {
      "type": "Microsoft.Network/publicIPAddresses",
      "apiVersion": "2021-08-01",
      "name": "myPublicIP",
      "location": "[resourceGroup().location]",
      "properties": { "publicIPAllocationMethod": "Dynamic" }
    },
    {
      "type": "Microsoft.Network/loadBalancers",
      "apiVersion": "2021-08-01",
      "name": "myLB",
      "location": "[resourceGroup().location]",
      "properties": {
        "frontendIPConfigurations": [ { "name": "LoadBalancerFrontEnd", "properties": { "publicIPAddress": { "id": "[resourceId('Microsoft.Network/publicIPAddresses','myPublicIP')]" } } } ]
      }
    }
  ]
}
```

Note: In conversation, show how VM resources reference availability set by ID and NICs attach to LB backend pool.

---

## 4. Availability Zones & multi-region strategies

### Availability Zones
- AZs are physically separate datacenters in a region. Use AZs for datacenter-level failure tolerance.
- AZ trade-offs: stronger isolation; potential cross-zone egress charges and slightly higher complexity for networking and storage.

### Multi-region strategies
- Active-passive: primary serving region + secondary standby; failover via DNS/traffic manager; lower complexity.
- Active-active: multiple regions serve traffic; requires global load balancing and conflict resolution for stateful data.

### Data replication choices
- Synchronous replication: low latency but limited to short distances (typically intra-region/AZ or metro pairs).
- Asynchronous replication: used for cross-region replication where latency is higher.

CAP/consistency trade-offs:
- Choose consistency model based on business requirements: transactional consistency vs eventual consistency.

---

## 5. Cloud Adoption Framework (CAF) & Landing Zones
CAF aligns business strategy with cloud adoption through phases: Strategy → Plan → Ready → Adopt → Govern & Manage.

### Landing zone: what to deliver
- Management groups & subscription design
- Identity baseline (Azure AD, PIM, conditional access)
- Network topology: hub-and-spoke, connectivities (ExpressRoute/VPN)
- Security baseline: Key Vault, Azure Firewall/NVA, NSGs
- Governance: Azure Policy, Initiative pack, RBAC
- Observability: Log Analytics, Application Insights, diagnostic settings
- Cost controls: tags, budgets, reserved instance plan

### Landing zone Bicep skeleton (expanded)

```bicep
param location string = 'eastus'
param prefix string = 'contoso'

resource mgmtRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${prefix}-rg-mgmt'
  location: location
}

resource law 'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: '${prefix}-law-mgmt'
  location: location
  properties: { sku: { name: 'PerGB2018' } }
}

resource kv 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: '${prefix}-kv-mgmt'
  location: location
  properties: { sku: { family: 'A', name: 'standard' } }
}

resource policyAssign 'Microsoft.Authorization/policyAssignments@2021-06-01' = {
  name: '${prefix}-enforce-tags'
  scope: mgmtRg
  properties: {
    displayName: 'Enforce required tags'
    policyDefinitionId: '/providers/Microsoft.Authorization/policyDefinitions/<policy-id>'
  }
}
```

Notes: integrate with CI/CD pipeline (GitHub Actions, Azure DevOps) to deploy landing zones and assign policies at management group scope.

---

## 6. Governance: Management Groups, Azure Policy, Initiatives, and RBAC

### Management Groups & subscriptions
- Model management groups to map to organization structure (root → mgmt → platform → prod/dev).
- Map subscriptions to environments or workload boundaries.

### Azure Policy basics
- Policy effects: Audit, Deny, DeployIfNotExists, Append, Disabled.
- Initiatives: group policies for a compliance posture.
- Test with Audit before enforcing Deny.

### Sample policy: allow-only specific regions

```json
{
  "properties": {
    "displayName": "Allowed locations - Example",
    "policyType": "Custom",
    "mode": "All",
    "parameters": {
      "allowedLocations": { "type": "Array", "metadata": { "displayName": "Allowed locations" } }
    },
    "policyRule": {
      "if": { "field": "location", "notIn": "[parameters('allowedLocations')]" },
      "then": { "effect": "Deny" }
    }
  }
}
```

### Sample initiative (concept)

```json
{ "properties": { "displayName": "Security Baseline", "policyDefinitions": [ {"policyDefinitionId":"/providers/Microsoft.Authorization/policyDefinitions/require-tags"}, {"policyDefinitionId":"/providers/Microsoft.Authorization/policyDefinitions/require-diagnostics"} ] } }
```

### RBAC principles
- Use built-in roles where possible.
- Assign roles to groups, not users.
- Use custom roles sparingly for least privilege.
- Use PIM for just-in-time admin access.

---

## 7. Best practices & design trade-offs

Governance-first approach:
- Establish identity, policy, and management group structure before enabling widespread self-service.

Automation & IaC:
- Use Bicep/ARM/Terraform with CI/CD to provision landing zones and workloads.
- Use automated policy assignment and remediation for repeatability.

Security & network:
- Hub-and-spoke for shared services.
- Private Link for secure PaaS access.
- NSGs and Azure Firewall for layered defense.

Availability:
- Prefer AZs + VMSS for highly available, autoscaling services when region supports zones.
- Use Availability Sets for simpler intra-region resiliency.

Cost controls:
- Tagging strategy, budgets, reserved instances, and automated shutdown for non-prod.

Trade-offs to discuss in interviews:
- Cross-region replication vs latency and cost.
- Deny policies vs developer agility.
- Private Link complexity vs public endpoint risk.

---

## 8. Troubleshooting playbooks & diagnostics

A senior debugging approach:
1) Triage (0–15m): identify impact, affected services, check Azure Service Health, Activity Log.
2) Contain (15–60m): isolate component, redirect traffic, scale resources.
3) Diagnose (60–180m): deep logs, network packet capture, cross-service correlation.
4) Remediate & recover: apply fix, failover, or rollback.
5) Postmortem: RCA, action items, automation to prevent recurrence.

Useful tools & queries:
- Azure Monitor & Log Analytics queries (Kusto) for correlation.
- Network Watcher: connection troubleshoot, IP flow verify, packet capture.
- Resource Health & Activity Log for recent events and root cause hints.

Example Kusto query to find failed VM operations:

```kusto
AzureActivity
| where ResourceProvider == "Microsoft.Compute"
| where ActivityStatusValue == "Failed"
| summarize count() by OperationName, bin(TimeGenerated, 1h)
```

---

## 9. Whiteboard exercises, STAR examples, and interview tips

### STAR example — migration (concise senior answer)
- Situation: Legacy monolith on-prem with strict SLAs and nightly batch workloads.
- Task: Move to Azure with minimal downtime and improve deploy frequency.
- Action: Performed discovery and dependency mapping, phased migration with pilot, used Azure Database Migration Service for DB cutover, containerized stateless services to AKS, implemented CI/CD & IaC, and created runbooks.
- Result: Reduced downtime risk, 30% cost savings, and enabled weekly deployments.

### Whiteboard exercises to practice (model answers available on request)
1) Design a global e-commerce platform (AZs, DB replication, caching, CDN, failover).
2) Landing zone design for regulated customer (identity, network isolation, logging, policy).
3) Migration plan for 20-server on-prem app (discovery, lift-and-shift vs refactor, cutover plan).

Interview tips:
- Prepare 2–3 architectural stories with outcomes.
- Practice concise one-liners for first 30 seconds of answers.
- Keep IaC snippets and policy JSON ready to paste.

---

## 10. Diagrams & cheat-sheet (what to include)
- One-page cheat-sheet: acronyms, common commands, architecture patterns.
- Diagrams to prepare:
  - FD/UD visual for Availability Sets
  - Hub-and-spoke landing zone topology
  - Zone vs region vs pair map

---

## 11. Additional resources
- Microsoft Learn: https://learn.microsoft.com/azure
- CAF: https://learn.microsoft.com/azure/cloud-adoption-framework
- Azure Architecture Center: https://learn.microsoft.com/azure/architecture
- Azure Policy: https://learn.microsoft.com/azure/governance/policy
- Bicep: https://learn.microsoft.com/azure/azure-resource-manager/bicep

---

## Next steps I can implement for you
Pick one and I will add it and update the todo list:
- 3 full whiteboard exercises with model answers and SVG diagrams.
- Runnable Bicep landing zone (management groups, hub VNet, Key Vault, Log Analytics, policies) with simple test deployment instructions.
- Production-ready Initiative JSON (4–6 policies) plus a DeployIfNotExists remediation example and guidance on assigning it safely.


---

