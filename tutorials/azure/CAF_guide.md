# Cloud Adoption Framework (CAF) — Detailed Guide

## Overview
The Microsoft Cloud Adoption Framework (CAF) is a set of guidance, best practices, and prescriptive patterns to help organizations plan, adopt, govern, and manage cloud technologies on Azure. This guide expands on `CAF.md` and provides actionable checklists, governance examples (Azure Policy), a landing zone skeleton in Bicep, and operational recommendations.

---

## Table of Contents
1. [CAF Phases Summary](#caf-phases-summary)
2. [Landing Zones and Foundations](#landing-zones-and-foundations)
3. [Governance: Policy, RBAC, and Management Groups](#governance)
4. [Sample Azure Policy (JSON) and Initiative](#sample-policy)
5. [Landing Zone Skeleton (Bicep)](#bicep-landing-zone)
6. [Operational Controls & Tooling](#operational-controls)
7. [Adoption Checklist (practical)](#adoption-checklist)
8. [Common Pitfalls and Remediations](#pitfalls)
9. [Additional Resources](#resources)

---

## CAF Phases Summary
CAF breaks adoption into phases. Each phase drives distinct deliverables and artifacts.

- Strategy
  - Business drivers, expected outcomes, TCO, ROI, success metrics
- Plan
  - Workload discovery, prioritization, migration wave plans, skills assessments
- Ready
  - Landing zones, identity, network, security baselines, subscription structure
- Adopt
  - Migrate and modernize: lift-and-shift, refactor, re-platform, or re-architect
- Govern & Manage
  - Policies, cost controls, monitoring, operational runbooks, continuous improvement

Each phase should produce artifacts (documents, templates, automations) so the organization can repeat and scale adoption safely.

---

## Landing Zones and Foundations
Landing zones are the secure, governed Azure environments where workloads are deployed. A landing zone typically includes:

- Management groups and subscription strategy (management, shared services, connectivity, platform, workload)
- Networking: hub-and-spoke topology, VPN/ExpressRoute, DNS, network security
- Identity: Azure AD tenant design, conditional access, Privileged Identity Management (PIM)
- Security: baseline NSGs, Azure Firewall or third-party firewall, Key Vault baseline
- Governance: Azure Policy, initiatives, role assignments, tag enforcement
- Observability: Azure Monitor, Log Analytics, Application Insights, diagnostic settings
- Cost management: tagging, budgets, alerts, reserved instance planning

Landing zones can be implemented incrementally. Start with a minimal secure foundation (identity, management groups, core policies) and iterate.

---

## Governance: Policy, RBAC, and Management Groups
A pragmatic governance model often includes:

- Management Groups: mirror organizational structure and apply policies at scale (e.g., `mgmt`, `platform`, `prod`, `dev`).
- Subscriptions: map to environments or teams (e.g., `platform-*`, `workload-prod-*`, `workload-nonprod-*`).
- Azure Policy & Initiatives: enforce standards (location, allowed SKUs, security controls). Use `deny` for hard blocks and `audit`/`deployIfNotExists` for posture checks and remediation.
- RBAC: assign roles to Azure AD groups, follow least privilege, use Privileged Identity Management (PIM) for high privilege roles.

Example governance rule set:
- Deny public IPs on storage accounts
- Enforce resource tags (Owner, Environment, CostCenter)
- Require encryption-at-rest for services
- Enforce allowed regions for compliance

---

## Sample Azure Policy (JSON) and Initiative
Below is a concise policy that enforces allowed locations for resources. Use as a building block for an initiative.

```json
{
  "properties": {
    "displayName": "Allowed locations - Example",
    "policyType": "Custom",
    "mode": "All",
    "parameters": {
      "allowedLocations": {
        "type": "Array",
        "metadata": { "displayName": "Allowed locations" }
      }
    },
    "policyRule": {
      "if": { "field": "location", "notIn": "[parameters('allowedLocations')]" },
      "then": { "effect": "Deny" }
    }
  }
}
```

An Initiative groups related policies. Example initiative could include: enforce locations, require tags, ensure diagnostics on storage accounts, and require secure transfer for storage.

Remediation example (DeployIfNotExists): auto-deploy diagnostic settings to storage accounts that lack them. Use `deployIfNotExists` sparingly because it requires a remediation task and identity with sufficient permissions.

---

## Landing Zone Skeleton (Bicep)
This minimal Bicep skeleton shows how to create a management resource group, a policy assignment, and a resource group for workloads. It is a starting point — expand to include networking, Key Vault, monitoring, and automation.

```bicep
param location string = 'eastus'
param managementRgName string = 'rg-platform-mgmt'
param workloadRgName string = 'rg-workloads-prod'

resource mgmtRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: managementRgName
  location: location
}

resource policyAssignment 'Microsoft.Authorization/policyAssignments@2021-06-01' = {
  name: 'enforce-tags'
  scope: mgmtRg
  properties: {
    policyDefinitionId: '/providers/Microsoft.Authorization/policyDefinitions/your-policy-id'
    parameters: {
      requiredTags: { value: ['Owner', 'Environment', 'CostCenter'] }
    }
  }
}

resource workloadRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: workloadRgName
  location: location
  dependsOn: [ policyAssignment ]
}

output mgmtRgName string = mgmtRg.name
```

Notes:
- Replace `your-policy-id` with the policy definition resource id or create the policy in the same deployment.
- Real landing zones should also provision a VNet, Azure Firewall, Log Analytics workspace, Key Vault, and diagnostic settings.

---

## Operational Controls & Tooling
Use the following tooling as part of the operating model:

- Azure Blueprints or Terraform modules for repeatable landing zone deployments
- Azure Policy for enforcement and remediation
- Azure Monitor & Log Analytics for telemetry and alerting
- Azure Security Center (Microsoft Defender for Cloud) for posture and recommendations
- Azure Cost Management for budgets, cost reports and anomaly detection
- Azure Migrate, Database Migration Service for assessment and migration

---

## Adoption Checklist (practical)
Use this checklist when moving from Ready → Adopt:

1. Strategy & Plan
   - Document business outcomes and migration priorities
   - Create migration waves
2. Ready (Baseline Landing Zone)
   - Provision management groups and subscription structure
   - Deploy core policies (allowed locations, tag requirements)
   - Establish identity baseline (Azure AD, conditional access)
   - Provision central logging (Log Analytics)
3. Adopt (Pilot)
   - Migrate a small, representative workload
   - Validate operational runbooks (backup, DR, patching)
   - Verify SLA, performance, and cost profile
4. Govern & Manage
   - Assign ownership and runbook owners
   - Enable automated remediation where safe
   - Set budgets and alerts

---

## Common Pitfalls and Remediations
- Pitfall: No tagging strategy → remediation: enforce tag policy with `deny` or `append` and educate teams.
- Pitfall: Overly aggressive `deny` policies that block automation → remediation: use `audit` first, then `deployIfNotExists` or `deny` after testing.
- Pitfall: Poor subscription structure → remediation: align subscriptions to business or security boundaries and migrate workloads using tenant-to-tenant or subscription migration guidance.

---

## Additional Resources
- Microsoft CAF home: https://learn.microsoft.com/azure/cloud-adoption-framework
- Landing zones: https://learn.microsoft.com/azure/cloud-adoption-framework/landing-zones
- Azure policy documentation: https://learn.microsoft.com/azure/governance/policy
- Bicep: https://learn.microsoft.com/azure/azure-resource-manager/bicep

---

## Next Steps I can take for you
- Create a full, runnable Bicep landing zone that provisions management groups, a hub VNet, Key Vault, Log Analytics, and policy assignments.
- Provide a sample Initiative JSON that bundles 4–6 production-ready policies.
- Generate a simple SVG diagram showing management group → subscriptions → landing zones.

Tell me which one you want next and I will implement it and update the todo list accordingly.