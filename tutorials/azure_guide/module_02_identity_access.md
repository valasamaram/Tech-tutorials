# Module 2 — Identity & Access (Foundations → Advanced)

Scope: Azure AD fundamentals, identities, authentication protocols, service principals, managed identities, RBAC, Conditional Access, PIM, hybrid identity (Azure AD Connect), and secure app access patterns.

## Learning objectives
- Explain Azure AD tenant model, app registrations, service principals, and managed identities.
- Implement RBAC for least-privilege and assign roles at proper scopes (resource, RG, subscription, management group).
- Configure Conditional Access policies and PIM for just-in-time privileged access.
- Design hybrid identity with Azure AD Connect, and decide between Password Hash Sync (PHS), Pass-through Authentication (PTA), or federation.

---

## Core concepts (detailed)

### Azure AD fundamentals
- Tenant: directory containing users, groups, applications, and identity configuration.
- Objects: users, groups, devices, service principals, application objects.

### Authentication flows & protocols
- OAuth2 (client credentials, auth code), OpenID Connect (ID tokens), SAML (legacy federated apps).
- Token lifetime concepts and refresh tokens; monitor token usage for suspicious patterns.

### App registrations & service principals
- App registration = application object; service principal = identity in a tenant used to assign RBAC.
- Use certificate or client-secret for service principals; prefer certificates and short-lived credentials.

### Managed identities
- System-assigned vs user-assigned: use for VMs, Functions, App Service to access Key Vault or other resources without secrets.

### RBAC & Permission design
- Principle of least privilege: assign roles at the smallest necessary scope.
- Built-in roles vs custom roles (use custom for minimal permissions that don't exist out-of-the-box).

### Conditional Access & MFA
- Evaluate conditions (user risk, sign-in risk, location, device compliance) and require controls (MFA, compliant device).
- Test policies in Report-only mode before enforcement.

### Privileged Identity Management (PIM)
- Just-in-time elevation, approval workflows, access reviews, and assignment duration controls.

### Hybrid identity (Azure AD Connect)
- Sync options: PHS (Password Hash Sync), PTA (Pass-through Authentication), ADFS (federation).
- Consider high-availability for Azure AD Connect and staging mode for migration testing.

---

## Labs (hands-on)

- Lab 2.1 — Service principal for automation:
  - Create app registration and service principal.
  - Grant `Contributor` or least-privilege role scoped to a RG.
  - Test client-credentials OAuth flow to call ARM API.

- Lab 2.2 — Managed identity with Key Vault:
  - Create a system-assigned MI for a VM or Function and grant `Key Vault Secrets User` access.
  - Read a secret from the app using the managed identity token.

- Lab 2.3 — Conditional Access and PIM:
  - Create a conditional access policy requiring MFA for legacy protocol sign-ins or risky locations.
  - Configure a PIM role for Global Admin with Approval and justification.

Commands & snippets (examples)
```powershell
# Create service principal
az ad app create --display-name "my-app"
az ad sp create --id <appId>

# Create a service principal for rbac and retrieve credentials
az ad sp create-for-rbac --name http://my-app-sp --role Contributor --scopes /subscriptions/<sub>/resourceGroups/rg-demo

# Grant Key Vault access policy (Azure CLI uses RBAC for KeyVault; example using az keyvault set-policy)
az keyvault set-policy -n kv-demo --spn <clientId> --secret-permissions get list
```

---

## Security & operational best practices

- Use managed identities instead of client secrets where possible.
- Use Conditional Access in layered mode: block legacy auth, require compliant devices for sensitive apps, and require MFA for sensitive roles.
- Implement PIM for all privileged roles and configure access reviews on a schedule.
- Log and stream sign-in and audit logs to Log Analytics for alerting and investigation.

## Troubleshooting

- Sync errors in Azure AD Connect: check sync scheduler, run `Start-ADSyncSyncCycle`, review event logs on the sync server.
- Failed service principal auth: check credential expiration, app role assignments, and whether the SP has the required API permissions.

---

## Assessment & interview prep

- Deliverable: design a hybrid identity architecture for a 5k-user org, including HA for Azure AD Connect, conditional access strategy, and CI/CD automation accounts.

Sample interview questions:
- Explain differences between PHS and PTA and when you'd choose each.
- How would you secure a CI/CD pipeline that needs to deploy resources to multiple subscriptions?

---

## Further reading
- Azure AD developer docs: https://learn.microsoft.com/azure/active-directory/develop/
- Conditional Access documentation: https://learn.microsoft.com/azure/active-directory/conditional-access/
# Module 2 — Identity & Access (Foundations → Advanced)

Scope: Azure AD fundamentals, identities, authentication protocols, service principals, managed identities, RBAC, Conditional Access, PIM, hybrid identity (Azure AD Connect), and secure app access patterns.

Learning objectives
- Explain Azure AD tenant model, app registrations, service principals, and managed identities.
- Implement RBAC for least-privilege and assign roles at proper scopes (resource, RG, subscription, mgmt group).
- Configure Conditional Access policies and PIM for just-in-time privileged access.
- Design hybrid identity with Azure AD Connect, understand sync options (PHS/PTA/Federation) and password writeback.

Advanced topics
- Token lifetimes, OAuth 2.0 flows (client credentials, authorization code), OpenID Connect and claims.
- App roles, role-based access for APIs, consent frameworks and minimizing high-privilege consent.
- Azure AD entitlement management, access reviews, and lifecycle automation.
- Authentication strengthening: FIDO2, passwordless, MFA in break-glass scenarios.

Hands-on labs
- Lab 2.1: Create an app registration and service principal, grant a role to the SP, and use client credentials to access Azure Resource Manager API.
- Lab 2.2: Configure a system-assigned managed identity on an Azure Function and grant access to Key Vault secrets.
- Lab 2.3: Implement a Conditional Access policy requiring MFA for risky sign-ins and create a PIM role activation flow.

Commands & snippets
- Create service principal and assign role:
```
az ad sp create-for-rbac --name http://my-app-sp --role Contributor --scopes /subscriptions/<sub>/resourceGroups/rg-demo
```

- Assign role to group via CLI (preview):
```
az role assignment create --assignee-object-id <group-object-id> --role "Contributor" --scope /subscriptions/<sub>/resourceGroups/rg-demo
```

Design checklist
- Use groups for role assignments. Avoid assigning roles to individual user accounts.
- Prefer managed identities for Azure services rather than client secrets.
- Isolate high-privilege roles and protect them with PIM and conditional access.
- For hybrid identity, design for high availability of Azure AD Connect (staging mode) and monitor sync errors.

Study checkpoint
- Deliverable: design and document an identity architecture for a hybrid organization with on-prem AD, Azure AD Connect, PIM, and service principals for CI/CD pipelines.

Further reading
- Azure AD application model: https://learn.microsoft.com/azure/active-directory/develop/
- Conditional Access & PIM: https://learn.microsoft.com/azure/active-directory/privileged-identity-management/

---
