# Module 4 — Security & Governance (Foundations → Advanced)

Scope: Azure Policy, RBAC, management groups, Key Vault, security center, identity protection, network security, compliance frameworks and continuous compliance.

Learning objectives
- Implement management group hierarchy and inherit policies and role assignments.
- Author custom policies and compose initiatives for baseline compliance.
- Use Key Vault for secrets and keys; integrate with managed identities.
- Harden network and platform using Azure Firewall, WAF, NSGs, and private endpoints.

Advanced topics
- DeployIfNotExists remediations and resource graph-driven remediation strategies.
- Policy exemptions, guest configuration, and guest attestation (Enable remote configuration management).
- Azure Blueprints vs Initiative pipelines for baseline deployments.
- Continuous compliance: detect drift and remediate automatically using Automation tasks and Managed Identity-run remediation.

Hands-on labs
- Lab 4.1: Write a custom policy to enforce allowed VM sizes and create initiative bundling tag and size policies.
- Lab 4.2: Configure Key Vault with RBAC and an Azure Function that uses a system-assigned managed identity to access a secret.
- Lab 4.3: Implement an Azure Firewall with threat intelligence and logging to Log Analytics.

Sample policy snippet (deny public IPs in prod):
```json
{
  "if": {
    "allOf": [
      { "field": "type", "equals": "Microsoft.Network/publicIPAddresses" },
      { "field": "location", "equals": "eastus" },
      { "field": "tags.environment", "equals": "prod" }
    ]
  },
  "then": { "effect": "Deny" }
}
```

Design checklist
- Start with audit mode for new policies and move to deny only after sufficient coverage.
- Use management groups to map policy assignment to organizational units.
- Protect management access with PIM and MFA; limit permanent role assignments.
- Monitor compliance via Policy insights and remediate using DeployIfNotExists where possible.

Study checkpoint
- Deliverable: packaged initiative JSON (3–5 policies) covering tags, diagnostics, and network baseline; provide test plan for staged roll-out.

Further reading
- Azure Policy concepts: https://learn.microsoft.com/azure/governance/policy/
- Key Vault: https://learn.microsoft.com/azure/key-vault/

---
