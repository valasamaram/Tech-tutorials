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
