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

## Interview questions
- How would you restrict a multi-tenant table so each tenant sees only their rows?
- Explain difference between TDE and column-level encryption.