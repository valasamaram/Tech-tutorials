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
