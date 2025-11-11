# Module 4 — Security & Governance (Foundations → Advanced)

Scope: Azure Policy, RBAC, management groups, Key Vault, Defender for Cloud, identity protection, network security, compliance frameworks and continuous compliance.

## Learning objectives

- Design a management-group hierarchy and assign policies and role assignments at scale.
- Author and test Azure Policy definitions and initiatives, including deployIfNotExists remediation.
- Implement secrets and key management with Key Vault and integrate with managed identities.
- Harden networking and platform using Azure Firewall, WAF, NSGs, Private Endpoints and DDoS Protection.

---

## Core concepts (detailed)

### Governance building blocks
- Management groups: apply policies and RBAC higher in the hierarchy to enforce organization-wide controls.
- Azure Policy: policy definitions, initiatives (grouped policies), assignments, and policy effects (audit, deny, append, deployIfNotExists).
- RBAC: scope (subscription, resource group, resource), built-in roles vs custom roles.

### Policy effects and common patterns
- AuditWhenNotExists / Audit: surface non-compliant resources.
- Deny: blocks creation of non-compliant resources (use with care).
- Append: injects properties (tags) into resource during creation.
- DeployIfNotExists: run remediation ARM template when resource missing (often used to deploy diagnostic settings).

Sample policy — enforce tags (append):
```json
{
  "properties": {
    "displayName": "Append required tags",
    "policyType": "Custom",
    "mode": "Indexed",
    "parameters": {
      "tagName": { "type": "String" },
      "tagValue": { "type": "String" }
    },
    "policyRule": {
      "if": { "field": "tags[concat(parameters('tagName'))]", "exists": "false" },
      "then": { "effect": "append", "details": { "field": "tags[concat(parameters('tagName'))]", "value": "[parameters('tagValue')]" } }
    }
  }
}
```

### Key Vault & secrets management
- Use RBAC for Key Vault or access policies depending on tenant configuration. Enable soft-delete and purge protection for production.
- Recommended: store secrets in Key Vault and grant access via managed identities to avoid long-lived credentials.

### Defender for Cloud & Secure Score
- Defender (formerly Security Center) provides posture assessments, recommendations and integrated vulnerability scanning. Use Secure Score to prioritize improvements.

### Network & platform hardening
- Apply NSGs, Azure Firewall in hub topology, and use Private Endpoints to remove public exposure of PaaS services.
- DDoS Protection Standard for internet-facing endpoints; WAF on Application Gateway or Front Door for HTTP protections.

---

## Hands-on labs (practical)

- Lab 4.1 — Policy & Initiative:
  1. Create a custom policy to deny public IPs for resources tagged `environment=prod`.
  2. Bundle policies into an initiative: tag enforcement, diagnostics setting enforcement, allowed locations.
  3. Assign initiative to a management group in audit mode, validate non-compliant resources, then move to deny mode after testing.

- Lab 4.2 — Key Vault integration:
  1. Create a Key Vault with soft-delete and purge protection enabled.
  2. Create a system-assigned managed identity on an Azure Function and grant the identity `Key Vault Secrets User` role.
  3. Demonstrate retrieving a secret from the Function code using the managed identity.

- Lab 4.3 — Firewall & logging:
  1. Deploy Azure Firewall in hub VNet and create application/network rules for outbound traffic.
  2. Enable diagnostic settings on Firewall to send logs to Log Analytics and Storage account.

Example CLI: assign policy (audit)
```powershell
az policy assignment create --name 'enforce-tags-audit' --scope /providers/Microsoft.Management/managementGroups/contoso --policy ./policies/enforce-tags.json
```

Example: deployIfNotExists snippet (diagnostic settings)
```json
{
  "if": { "field": "type", "equals": "Microsoft.Sql/servers" },
  "then": {
    "effect": "deployIfNotExists",
    "details": {
      "type": "Microsoft.Insights/diagnosticSettings",
      "roleDefinitionIds": ["<role-id>"] ,
      "deployment": {
        "properties": {
          "mode": "incremental",
          "template": { /* ARM template to deploy diagnostics */ }
        }
      }
    }
  }
}
```

---

## Operational playbook & troubleshooting

- Start new policy at Audit mode. Use Policy Insights and `az policy state list` to enumerate non-compliant resources.
- For DeployIfNotExists failures: check the managed identity used for remediation has correct RBAC and the template parameters are valid.
- Key Vault access denied: verify Key Vault firewall, network rules, and that the managed identity or service principal has a role or access policy.

---

## Interview & design tips

- Explain phased policy rollout: Audit -> Remediate with DeployIfNotExists -> Enforce (Deny/Append).
- When designing a landing zone, map policies to management group scopes and document exception processes.

---

## References & tools

- Azure Policy: https://learn.microsoft.com/azure/governance/policy/
- Key Vault: https://learn.microsoft.com/azure/key-vault/
- Defender for Cloud: https://learn.microsoft.com/azure/defender-for-cloud/

