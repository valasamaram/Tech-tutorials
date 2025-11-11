# Module 3 — Infrastructure as Code & CI/CD (Beginner → Advanced)

Scope: ARM, Bicep, Terraform for IaC; GitOps patterns; CI/CD pipelines using GitHub Actions and Azure DevOps; testing, policy-as-code, and immutable infrastructure.

## Learning objectives
- Write modular Bicep code and parameterize deployments for environments.
- Implement GitOps workflows: PR → validation → pipeline deploy.
- Use Terraform for multi-cloud scenarios and Bicep for Azure-native deployments.
- Integrate policy-as-code checks and implement safe deployment gates.

---

## Core topics (detailed)

### IaC fundamentals
- Declarative vs imperative: declarative describes desired state (Bicep/ARM), imperative describes step-by-step actions (CLI/PowerShell).
- Idempotency: ensure repeated deployments produce the same end-state.
- Drift: detect and remediate drift between deployed state and IaC definitions.

### Bicep & ARM
- Bicep is the recommended authoring language for Azure-native IaC. Use modules, parameter files, and outputs.
- Best practices: small modules, parameter validation, default values, and meaningful outputs.
- Validation: use `bicep build` and `az deployment group validate` or `what-if` for safe previews.

### Terraform
- Use when you need multi-cloud management. Manage remote state securely (Azure Blob Storage with locking).
- Be cautious: some Azure features change semantics in Terraform providers vs ARM.

### CI/CD & GitOps
- GitOps: use Git as the single source of truth and drive deployments from repo events.
- Pipeline flow: PR lint/build/test -> what-if -> approval -> deploy.
- Use short-lived credentials: prefer OIDC or managed identity integrations over static secrets.

### Policy as code & gating
- Enforce policy at mgmt group but also implement policy-as-code checks in pipelines (conftest, az policy). Combine audit/deny with staged rollout.

### Testing & quality
- Unit tests: use bicep linter and arm-ttk for template testing.
- Integration: use `what-if` and `az deployment validate` in CI to prevent accidental destructive changes.

---

## Hands-on labs

- Lab 3.1 — Bicep module for 3-VM availability set + LB:
  - Write modular Bicep files: network.bicep, vm.bicep, main.bicep. Create parameter files for dev/stage/prod.
  - Validate with `bicep build` and `az deployment group what-if`.

- Lab 3.2 — GitHub Actions pipeline:
  - Build an action that lints Bicep, runs `bicep build`, executes `az deployment group what-if` on PR and deploys to sandbox on merge.
  - Use OIDC or service principal with least privilege.

- Lab 3.3 — Policy gate:
  - Add a pipeline gate that uses `az policy state` or `conftest` to ensure no resources with public IPs in production.

Example GitHub Actions snippet (deploy on merge):
```yaml
name: Deploy Bicep
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          client-secret: ${{ secrets.AZURE_CLIENT_SECRET }}
      - name: Deploy
        run: az deployment group create --resource-group rg-dev --template-file main.bicep --parameters @dev.parameters.json
```

---

## Security & secrets

- Use Key Vault or pipeline secret management for credentials and sensitive parameters.
- Prefer workload identity/OIDC where supported to avoid long-lived secrets.

---

## Testing, observability and rollbacks

- Use `what-if` and deployment tests to validate changes before applying.
- Implement smoke tests post-deploy; if smoke fails, trigger rollback plan (runbook or infra automation to redeploy previous proven state).

---

## Interview & design tips

- Be prepared to walk through a pipeline: how PRs are validated, how secrets are protected, and how policies are enforced early.
- Discuss trade-offs between Terraform and Bicep for an organization: multi-cloud needs vs Azure-native features/support.

---

## References
- Bicep best practices: https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices
- arm-ttk tests: https://github.com/Azure/arm-ttk
# Module 3 — Infrastructure as Code & CI/CD (Beginner → Advanced)

Scope: ARM, Bicep, Terraform for IaC; GitOps patterns; CI/CD pipelines using GitHub Actions and Azure DevOps; testing, policy-as-code, and immutable infrastructure.

Learning objectives
- Write modular Bicep code and parameterize deployments for environments.
- Implement GitOps workflows: PR → validation → pipeline deploy.
- Use Terraform for cross-cloud IaC and Bicep for Azure-native deployments.
- Integrate Policy as Code checks in pipelines (Az Policy / Conftest / OPA).

Advanced topics
- Module composition, nested modules, and deployment scopes (subscription mgmt group level).
- Blue/green and canary deployments with ARM/Bicep and feature flags.
- Drift detection and remediation: policy DeployIfNotExists and automatic remediation scripts.
- Secure secrets in pipelines: use GitHub Actions OIDC to avoid long-lived secrets, use Key Vault references.

Hands-on labs
- Lab 3.1: Author a Bicep module for a 3-VM availability set + internal LB; create parameter files for dev/stage/prod and validate with bicep lint.
- Lab 3.2: Build a GitHub Actions pipeline that validates Bicep (bicep build), runs az deployment group create in a sandbox subscription, and triggers post-deploy smoke tests.
- Lab 3.3: Add a policy-as-code gate that prevents deploys with public IPs in production (Audit then Deny after testing).

Commands & snippets
- Bicep build & validate:
```
bicep build main.bicep
az deployment group validate --resource-group rg-dev --template-file ./main.json --parameters @dev.parameters.json
```

- GitHub Actions example (deploy on merge):
```yaml
name: Deploy Bicep
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          client-secret: ${{ secrets.AZURE_CLIENT_SECRET }}
      - name: Deploy
        run: az deployment group create --resource-group rg-dev --template-file main.bicep --parameters @dev.parameters.json
```

Design checklist
- Keep modules small and composable.
- Use parameter files and secure secrets via Key Vault or pipeline secrets.
- Implement CI validation: lint, build, static analysis, and unit tests (where possible).
- Enforce policies at mgmt group scope to prevent non-compliant resources.

Study checkpoint
- Deliverable: produce an IaC repo with Bicep modules, a GitHub Actions pipeline, and PR template with checklist for reviewers.

Further reading
- Bicep best practices: https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices
- GitOps with Azure: https://learn.microsoft.com/azure/azure-arc/kubernetes/flux-overview

---
