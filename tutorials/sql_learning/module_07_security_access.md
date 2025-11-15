# Module 07 — Security & Access Control

## Learning objectives
- Implement authentication and authorization best practices.
- Apply row-level security, data masking, and encryption strategies.

## Authentication & authorization
- Use integrated authentication (AD) when possible; avoid shared SQL credentials.
- Prefer roles/groups for permission assignment; follow least privilege.

## Row-Level Security (RLS)
- Define predicate functions to restrict row visibility per user/role.
- Useful for multi-tenant scenarios.

## Dynamic Data Masking & Encryption
- Dynamic Data Masking hides sensitive values at query time (not true encryption).
- Transparent Data Encryption (TDE) for encryption at rest; use CMKs in Key Vault for customer-managed keys.
- Always use TLS/SSL for in-transit encryption.

## Auditing & compliance
- Enable auditing to capture DDL/DML changes and access patterns.
- Use managed auditing features and ship logs to SIEM/Log Analytics.

## Lab
- Configure RLS to restrict employees to their own department rows.
- Enable TDE and demonstrate backup/restore with CMK (conceptual steps).

## Troubleshooting
- Permission denied errors: verify role memberships and object-level grants.
- RLS unexpected blocking: check predicate function logic and test with user context.


---


## 🔐 Authentication & Authorization — Best Practices (Azure-focused)

This section covers practical, actionable best practices for **authentication (who you are)** and **authorization (what you can do)** on Azure. Follow these guidelines to reduce risk, simplify operations, and meet compliance requirements.

---

### 🎯 Principles to follow (short)
- **Least privilege** — grant the minimum permissions required, and nothing more.  
- **Defense-in-depth** — combine identity controls (MFA, conditional access), secrets protection, and RBAC.  
- **Don't store secrets in source** — use Key Vault and managed identities.  
- **Prefer managed identities over app secrets** — remove secret rotation pain.  
- **Audit everything** — log sign-ins, role assignments, and privileged activity.

---

## 1) Authentication best practices

### 1.1 Use Azure AD as the identity source
- Centralize identity in **Azure Active Directory (AAD)** for users and apps.
- Single Sign-On (SSO) across Microsoft services reduces password sprawl.

### 1.2 Enforce strong authentication
- **MFA for all privileged accounts** (global admins, subscription owners).
- Prefer **passwordless** options (FIDO2 security keys, Microsoft Authenticator) where possible.

### 1.3 Use Conditional Access
- Apply Conditional Access policies to require MFA, block legacy auth, require compliant devices, or restrict access by network/location.
- Example policies:
  - Block legacy protocol authentication.
  - Require MFA for all admin roles.
  - Require device compliance for high-risk apps.

> Tip: Start with “report-only” or narrow-scoped policies to measure impact before broad rollout.

### 1.4 Prefer modern OAuth flows for apps
- **Public clients (mobile/SPA):** use **PKCE** (Proof Key for Code Exchange).  
- **Confidential clients (server-side):** prefer **client certificate** over client secret.  
- Use MSAL (Microsoft Authentication Library) SDKs for token acquisition and caching.

### 1.5 Short-lived tokens & refresh controls
- Accept short-lived access tokens; use refresh tokens as designed.
- Revoke/expire refresh tokens on suspicious sign-ins or compromise.

---

## 2) Authorization best practices (RBAC & least privilege)

### 2.1 Use Azure RBAC (not subscription owner)
- Use built-in roles (Owner, Contributor, Reader) sparingly. Prefer **more specific built-in roles** (e.g., `Storage Blob Data Reader`, `Virtual Machine Contributor`).
- Assign roles at the **smallest sensible scope** (resource > resource group > subscription).

### 2.2 Assign to groups or service principals, not individual users
- Manage access by **AAD groups** or **enterprise applications** to simplify lifecycle when people join/leave.

### 2.3 Create custom roles only when necessary
- If built-in roles are too broad, create **custom roles** containing only the required permissions.
- Keep custom roles narrow and document them.

### 2.4 Use Privileged Identity Management (PIM)
- For high-privilege roles (e.g., Owner, Global Admin), use **Just-In-Time (JIT)** elevation with Azure AD PIM:
  - Require approval or MFA for elevation
  - Time-bound role assignments
  - Record justifications and audit logs

### 2.5 Use deny assignments & policy guardrails
- Use **Azure Policy** to prevent risky resource creation (e.g., public storage containers, untagged resources).
- Use **Deny** effects for enforcement where necessary (e.g., requiring private endpoints for storage).

---

## 3) Application identities: Service Principals vs Managed Identities

### 3.1 Prefer Managed Identities
- **System-assigned** or **user-assigned managed identities** eliminate credentials:
  - Use for VMs, App Services, Functions, Logic Apps, AKS, etc.
  - Access Key Vault, Storage, and other Azure services using the identity.
- Assign minimum-required RBAC roles to the managed identity.

#### Example — assign a system-managed identity to a VM (CLI):
```bash
az vm identity assign \
  --resource-group my-rg \
  --name my-vm
````

### 3.2 Use Service Principals carefully

* Use **service principals** for external automation/CI where managed identity isn’t possible.
* Prefer **certificate-based auth** over secrets for SPs.
* Scope SP permissions to the minimum (resource group or resource).
* Rotate secrets and certificates frequently.

#### Example — create a service principal for a CI pipeline (CLI):

```bash
az ad sp create-for-rbac \
  --name "ci-cd-myapp" \
  --role "Contributor" \
  --scopes /subscriptions/<sub-id>/resourceGroups/my-rg
```

> After creation, **immediately record** credentials securely (Key Vault). Replace client secret with certificate when possible.

---

## 4) Secrets & Key Management

### 4.1 Use Azure Key Vault for secrets, keys, certificates

* Store secrets, connection strings, keys and certificates in Key Vault.
* Require RBAC or Access Policies (depending on vault model) that restrict who can read secrets.
* Enable Key Vault soft-delete and purge protection.

### 4.2 Access Key Vault via Managed Identity (no secrets in code)

* Assign `Key Vault Secrets User` or specific role to the managed identity so apps can `GET` secrets.

#### Example — granting access (RBAC style):

```bash
# assign Reader + Key Vault Secrets User (example)
az role assignment create \
  --assignee <principal-id> \
  --role "Key Vault Secrets User" \
  --scope /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.KeyVault/vaults/<vault-name>
```

### 4.3 Automate secret rotation

* Rotate keys/secrets regularly and automate rotation for service principals if supported.
* Use certificate-based authentication to simplify rotation.

---

## 5) Token & Credential Security

* Enforce **short lifetimes** for tokens and secrets.
* Use **session management** & conditional policies to block long-lived sessions.
* Monitor and revoke leaked credentials immediately.
* Require **MFA for risky sign-ins** and use Identity Protection for risk detections.

---

## 6) Logging, Monitoring & Alerting

* Enable **Azure AD sign-in logs** and **audit logs**. Retain per policy for compliance.
* Monitor:

  * Failed sign-ins, impossible travel, risky sign-ins
  * Role assignment changes
  * PIM activations
  * App registrations and secret creations
* Forward logs to **Azure Monitor / Log Analytics** and create alerts for suspicious activity.
* Periodically review **access review** for group membership and role assignments.

---

## 7) CI/CD & DevOps Considerations

* Store only references to Key Vault secrets in pipelines — never raw secrets in repo.
* Use managed identities or service connections with minimal scopes for agent pools.
* Use ephemeral credentials for automation where possible.
* Review pipeline logs for secret exposure.

---

## 8) Practical Checklist (implementable)

**Authentication**

* [ ] Enforce MFA for all privileged users
* [ ] Block legacy auth
* [ ] Set up Conditional Access policies (MFA, compliant devices)
* [ ] Enable passwordless or FIDO2 where possible

**Authorization**

* [ ] Use RBAC, assign to groups, not users
* [ ] Scope roles to resource group/resource
* [ ] Use PIM for privileged roles (time-bound)
* [ ] Create and document custom roles only when necessary
* [ ] Enforce policies to deny risky configurations

**Secrets & Apps**

* [ ] Prefer Managed Identities
* [ ] Use Key Vault and restrict access
* [ ] Use certificate auth for long-lived app identities
* [ ] Rotate credentials frequently

**Monitoring**

* [ ] Enable sign-in & audit logs to Log Analytics
* [ ] Alerts for unusual sign-in patterns, mass role assignment, new app registrations
* [ ] Quarterly access reviews

---

## 9) Common pitfalls & how to avoid them

* **Over-permissive roles** — avoid giving Contributor/Owner unless necessary (use role combinations instead).
* **Assigning roles to individuals** — use groups and automation for lifecycle.
* **Secrets in code/CI logs** — always reference Key Vault; restrict logs that may leak secrets.
* **Not monitoring app registrations** — clean up unused SPs and app registrations regularly.
* **Skipping PIM** — without JIT, privileged accounts are continuously exposed.

---

## 10) Example patterns (short snippets)

**A. Grant a managed identity minimal storage access**

```bash
az role assignment create \
  --assignee <msi-principal-id> \
  --role "Storage Blob Data Reader" \
  --scope /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.Storage/storageAccounts/<sa-name>
```

**B. Create a service principal with limited scope**

```bash
az ad sp create-for-rbac \
  --name "ci-pipeline-sp" \
  --role "Contributor" \
  --scopes /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.Web/sites/<app-name>
```

**C. Revoke a service principal (disable)**

```bash
az ad sp update --id <appId-or-objectId> --set accountEnabled=false
```

---

## 11) Further reading & tools (recommended)

* Use **MSAL** libraries for secure token flows.
* Use **Azure AD PIM**, **Identity Protection**, and **Conditional Access** features for enterprise controls.
* Use **Azure Policy** + RBAC + Key Vault to enforce guardrails.
* Automate **access reviews**, and use **Azure Monitor** / **Sentinel** for detection.

---

### ✅ Final note

Security is a continuous process: enforce the basics (MFA, least privilege), eliminate secrets in code (Key Vault + managed identities), and monitor/audit constantly. Start with a few high-impact controls (MFA for admins, restrict owner-level assignments, Key Vault usage) and iterate.



---


## 🛡️ Row-Level Security (RLS), Data Masking & Encryption Strategies

Modern database systems require fine-grained control over **who can see what data**. RLS, masking, and encryption form the three core pillars of data protection. Below is a concise, practical guide covering all three.

---

# 1️⃣ Row-Level Security (RLS)

### 🔍 What is RLS?
Row-Level Security restricts which **rows** a user can read or modify, based on their identity, role, or context.

Instead of giving each user a separate table or schema, RLS filters rows **automatically**.

### 🎯 Why use it?
- Enforces **tenant isolation** in multi-tenant apps  
- Prevents accidental overexposure of data  
- Moves security logic into the database (centralized and consistent)

### 🧠 How it works
1. You create a **predicate function** that returns TRUE/FALSE for visibility  
2. You create an **RLS policy** that applies the filter automatically  
3. The database ensures the user only sees allowed rows

### 📝 Example (PostgreSQL)
```sql
-- 1. Add a tenant_id column (required for filtering)
ALTER TABLE orders ADD COLUMN tenant_id INT;

-- 2. Create policy
CREATE POLICY tenant_isolation ON orders
    USING (tenant_id = current_setting('app.current_tenant')::INT);

-- 3. Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
````

### ✔ Result

No matter what SQL the app runs, users only see rows matching their tenant or permission.

---

# 2️⃣ Data Masking

### 🕶️ What is data masking?

Masking hides sensitive data **for non-privileged users** while keeping the data format intact.

Useful for:

* Dev/test environments
* Support teams
* Analytics with non-sensitive fields

### Types of masking

| Type                   | Example                                                         |
| ---------------------- | --------------------------------------------------------------- |
| **Static masking**     | Permanently obfuscates a copy (e.g., anonymized backup for dev) |
| **Dynamic masking**    | On-the-fly masking based on user role                           |
| **Partial masking**    | Show last 4 digits of card number                               |
| **Randomized masking** | Replace with random but valid-looking values                    |

### 📝 Example (SQL Server Dynamic Masking)

```sql
ALTER TABLE Customers
ALTER COLUMN Email ADD MASKED WITH (FUNCTION = 'email()');

ALTER TABLE Customers
ALTER COLUMN Phone ADD MASKED WITH (FUNCTION = 'partial(0,"XXX-XXX-",4)');
```

### ✔ Result

Privileged users see full data; others see masked content.

---

# 3️⃣ Encryption Strategies

Encryption ensures that data cannot be read without proper keys. Databases use it at multiple layers:

---

## 3.1 🔐 Encryption at Rest

Protects data stored on disk (data files, backups, snapshots).

### Examples

* **TDE (Transparent Data Encryption)** in SQL Server/PostgreSQL/MySQL/Azure SQL
* Storage-level encryption (Azure Storage, AWS S3, etc.)

### Benefits

* Protects from disk theft, snapshot leakage, or unauthorized OS-level access
* Fully transparent to applications

### 📝 Example (Azure SQL TDE is auto-enabled)

```sql
-- Typically done in portal, but can be verified:
SELECT * FROM sys.dm_database_encryption_keys;
```

---

## 3.2 ✉️ Encryption In Transit (TLS/SSL)

Protects data as it flows between:

* App → DB
* DB → DB (replicas, backups)

Always require:

* TLS enforcement
* Certificate validation
* No plaintext connections

### Example (PostgreSQL)

```txt
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file  = 'server.key'
```

---

## 3.3 🔒 Column-Level Encryption (CLE)

Used for highly sensitive fields:

* Card numbers
* SSNs
* Personal Identifiers

Provides stronger protection than TDE because data stays encrypted even if someone queries the database directly.

### Key strategies:

* **Deterministic encryption** → same plaintext → same ciphertext (usable for equality queries)
* **Randomized encryption** → stronger, but not query-friendly

### 📝 Example (SQL Server Always Encrypted)

```sql
CREATE COLUMN MASTER KEY MyCMK
WITH (KEY_STORE_PROVIDER_NAME='MSSQL_CERTIFICATE_STORE', KEY_PATH='CurrentUser/My/Key1');

CREATE COLUMN ENCRYPTION KEY MyCEK
WITH VALUES (COLUMN_MASTER_KEY = MyCMK, ALGORITHM = 'RSA_OAEP');

ALTER TABLE Customers
ALTER COLUMN SSN ADD ENCRYPTED WITH
    (ENCRYPTION_TYPE = RANDOMIZED, ALGORITHM = 'AES_256', COLUMN_ENCRYPTION_KEY = MyCEK);
```

---

# 4️⃣ Putting It All Together — Defense in Depth

| Layer                     | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| **RLS**                   | Controls *which rows* a user can see        |
| **Masking**               | Controls *what format of data* they can see |
| **Encryption at rest**    | Protects storage files/snapshots            |
| **Encryption in transit** | Protects network traffic                    |
| **Column encryption**     | Protects specific sensitive fields          |

These mechanisms complement each other.

---

# 5️⃣ Best Practices (Actionable)

### ✔ Row-Level Security

* Store tenant/user identifiers in each row
* Do not trust application filtering alone
* Keep RLS logic simple (avoid slow predicates)
* Audit policy usage regularly

### ✔ Data Masking

* Use *dynamic masking* for production environments
* Use *static masking* before giving data to dev/test
* Never share live personal data with non-privileged teams

### ✔ Encryption

* Enable TDE for all production databases
* Enforce TLS 1.2+ for all connections
* Use column-level encryption for PCI/GDPR sensitive fields
* Store encryption keys in:

  * Azure Key Vault
  * AWS KMS
  * HashiCorp Vault
* Rotate keys periodically
* Use Hardware Security Modules (HSM) where required

---

# 6️⃣ Common Pitfalls & How to Avoid Them

❌ Relying only on application-side filtering → **always enforce RLS at DB**
❌ Masking without RBAC → users with elevated roles see full data
❌ Using outdated TLS versions → block TLS 1.0/1.1
❌ Not rotating encryption keys → long-term exposure risk
❌ Using deterministic encryption everywhere → vulnerable to pattern analysis

---

# 7️⃣ Quick Recap (1-Parag Summary)

**RLS** controls *who sees which rows*,
**data masking** controls *how sensitive fields appear*,
and **encryption** protects data *at rest, in motion, and at column-level* using strong cryptography and secure key management. When used together, these provide strong, layered protection for modern applications.



---

