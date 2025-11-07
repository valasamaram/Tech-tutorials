# Active Directory Domain Services (AD DS) — Detailed Guide

## Purpose
This guide expands on the AD DS notes you provided and turns them into a detailed, practical reference for architects and senior engineers. It covers core concepts, Domain Controllers (DCs), FSMO roles, replication and sites, DNS and time synchronization, Group Policy (GPO) and ACLs, backup & recovery, troubleshooting playbooks, hybrid identity with Azure (Azure AD Connect, Azure AD Domain Services), deployment considerations for DCs in Azure IaaS, and best practices.

Audience: on-premise and hybrid cloud architects, system engineers, SREs, and senior interview candidates.

---

## Table of Contents
1. AD DS overview — why it matters
2. Core components (DCs, NTDS.dit, SYSVOL, LDAP, KDC)
3. Objects: Users, Computers, Groups, OUs
4. Domains, Trees & Forests
5. Authentication protocols (Kerberos, NTLM) and LDAP
6. Domain Controller roles & FSMO
7. Replication, Sites and Services
8. DNS, time sync, and Kerberos requirements
9. Group Policy and ACLs
10. Backup, restore, and disaster recovery
11. Monitoring, health checks and diagnostics
12. Troubleshooting playbooks (common scenarios)
13. Hybrid identity & Azure integration
14. Running DCs in Azure (IaaS) vs Azure AD DS
15. Security hardening & operational best practices
16. Useful commands & scripts (PowerShell / CLI / tools)
17. Diagrams and quick cheat-sheet
18. Further reading

---

## 1. AD DS overview
Active Directory Domain Services (AD DS) is Microsoft’s directory service that provides centralized authentication, authorization, and identity-based management for Windows domains. It stores directory data (NTDS.dit) and enforces security policies via Group Policy.

Why it matters:
- Single source of truth for identities and policies.
- Foundation for authentication (Kerberos) and authorization (ACLs/GPOs).
- Critical for many legacy and enterprise applications.

---

## 2. Core components
- Domain Controller (DC): Server running AD DS that handles authentication/authorization and hosts a writable copy of the AD database.
- NTDS.dit: AD database file (C:\Windows\NTDS\NTDS.dit).
- SYSVOL: Files folder for GPO templates and scripts that must be replicated between DCs.
- LDAP: Protocol for querying and modifying directory objects.
- KDC (Key Distribution Center): Service on DCs that issues Kerberos tickets (TGT and service tickets).
- Global Catalog (GC): Partial read-only copy of objects from all domains in a forest — used for logon and universal group membership.

---

## 3. Objects: Users, Computers, Groups, OUs
- Users represent people; Computers represent machines; Groups simplify access control; OUs provide delegation and policy scoping.
- Security groups are used for ACLs; Distribution groups for email lists.

Design tips:
- Use groups for permissions, not users.
- Use nested groups carefully: prefer Universal/Global/Domain Local (the AGDLP model).
- Keep OU structure aligned with administrative/delegation boundaries, not necessarily org chart.

---

## 4. Domains, Trees & Forests
- Domain: administrative and authentication boundary with its own NTDS database.
- Tree: collection of domains with contiguous namespace (parent-child).
- Forest: top-level container defining schema, global catalog, and trust boundary.

Architectural advice:
- Use separate forests only when strong separation of administration and schema is required.
- Plan DNS and namespace carefully — renaming domains is hard.

---

## 5. Authentication protocols and LDAP
Kerberos (default): secure, ticket-based, supports SSO and mutual authentication.
NTLM (legacy): challenge-response, used for backward compatibility.
LDAP: used by applications and tools to query and update AD.

Kerberos requirements:
- Accurate time sync (default max skew 5 minutes).
- Properly registered SPNs for services.
- DNS must resolve DCs and service names.

---

## 6. Domain Controller roles & FSMO
Five FSMO roles (per forest/domain):
- Schema Master (forest)
- Domain Naming Master (forest)
- RID Master (domain)
- PDC Emulator (domain)
- Infrastructure Master (domain)

Notes:
- The PDC emulator is the authoritative time source for the domain and handles certain compatibility operations.
- For small single-domain forests, infrastructure master can be colocated with GC; in multi-domain forests avoid colocating infra master on GC if possible.

When to seize a role: only when original role holder is permanently unavailable and recovery is impossible.

---

## 7. Replication, Sites and Services
- AD uses multi-master replication. Changes can be made at any DC and are replicated.
- Sites and Services controls replication topology and schedule to optimize bandwidth between datacenters.
- Intrasite replication is frequent and fast; intersite replication may be scheduled and compressed.

Key design points:
- Define AD sites to match your physical network topology and latency.
- Place DCs in sites where clients are; avoid excessive cross-site logon traffic.
- Use bridgehead servers and site links tuning for WAN environments.

---

## 8. DNS, time sync, and Kerberos
DNS:
- AD heavily depends on DNS; each DC registers SRV records (_ldap._tcp.dc._msdcs.<domain>).
- Use AD-integrated DNS for easier replication and security.

Time sync:
- PDC Emulator should point to a reliable external time source; all DCs sync from PDC or from their site hierarchy.
- Kerberos fails if clock skew exceeds allowable limit (default 5 minutes).

Ports (common):
- TCP/UDP 53 DNS
- TCP/UDP 88 Kerberos
- TCP/UDP 135 RPC Endpoint Mapper
- TCP/UDP 389 LDAP
- TCP 636 LDAPS
- TCP 445 SMB (SYSVOL replication if using DFSR/older NETLOGON)
- TCP/UDP 3268/3269 Global Catalog

Firewall guidance: open the minimum set of ports between DCs and domain-joined clients based on role and replication topology.

---

## 9. Group Policy and ACLs
Group Policy Objects (GPOs): centralized configuration and security enforcement.
- Order: local → site → domain → OU (last applied wins).
- Use Security Filtering and WMI filtering sparingly.
- Prefer centralized change management for GPOs (document and version control).

ACLs:
- Access Control Lists on resources determine who can do what.
- Use groups in ACLs to reduce complexity.

Troubleshooting GPOs:
- gpresult /r (on client) to see applied GPOs.
- gpupdate /force to refresh policies.
- Check SYSVOL replication for missing scripts/policies.

---

## 10. Backup, restore, and disaster recovery
Backups:
- Backup System State (includes AD database) using Windows Server Backup or third-party tools.
- Regularly test restores in an isolated lab.

Authoritative vs non-authoritative restore:
- Non-authoritative restore: DC restored then accepts replication updates from peers.
- Authoritative restore: used to roll back a deleted object — mark restored objects authoritative with ntdsutil so they overwrite replication partners.

Seizing FSMO roles and metadata cleanup:
- If a DC is permanently lost, seize FSMO roles and run metadata cleanup for the failed DC.
- Use ntdsutil to remove metadata and clean up DNS/AD entries.

Disaster recovery checklist:
1. Identify failure domain (one DC, site, forest).
2. If DC hardware failure and restore available, perform system-state restore.
3. If DC permanently lost, remove metadata, seize FSMO if necessary, and bring new DCs online.

---

## 11. Monitoring, health checks and diagnostics
Useful tools:
- dcdiag (built-in) — general DC health checks.
- repadmin /replsummary, /showrepl — replication status and latency.
- Event Viewer (Directory Service, DNS, System)
- Performance Monitor counters for SYSVOL, NTDS, and network
- Windows Server Update Services (WSUS) and patch tracking for DCs

Recommended checks:
- Daily/weekly replication summary (repadmin /replsummary)
- DC availability and time sync monitoring
- SYSVOL/DFS replication health

---

## 12. Troubleshooting playbooks (common scenarios)
A. Authentication failures (Kerberos failures)
- Symptoms: Event ID 4768/4771, users unable to logon, "KRB_AP_ERR_SKEW" errors.
- Quick checks:
  - Check time sync across clients and DCs (within 5 minutes).
  - Verify DNS resolves DC hostnames and SRV records.
  - Validate SPNs with setspn -L <account>.
  - Use klist to inspect tickets on client.

B. Replication failures
- Symptoms: repadmin /replsummary shows errors, lingering objects.
- Steps:
  - Run repadmin /showrepl and repadmin /replsummary.
  - Check Event Viewer for Directory Service errors.
  - Verify network connectivity and RPC ports.
  - If metadata of a failed DC remains, run ntdsutil to clean up.

C. GPO not applying
- Symptoms: group policy changes not visible on a client.
- Steps:
  - gpresult /r on client to see applied policies.
  - Check SYSVOL share and file contents on DCs.
  - Verify replication of SYSVOL/DFS between DCs.

D. DNS issues
- Symptoms: clients can't find DCs or domain controllers.
- Steps:
  - nslookup and nltest /dsgetdc:<domain> to find DCs.
  - Ensure SRV records exist in DNS and that DNS replication is healthy.

---

## 13. Hybrid identity & Azure integration
Common patterns:
- Azure AD Connect: synchronize identities from AD DS to Azure AD. Supports Password Hash Sync (PHS), Pass-through Authentication (PTA), and Federation (AD FS).
- Azure AD Join & Hybrid Azure AD Join: combine device management with Azure AD.
- Azure AD Domain Services (Azure AD DS): managed domain service for lift-and-shift VMs without running DCs in Azure.

Azure AD Connect modes:
- Password Hash Sync (PHS): hashes of passwords are synchronized to Azure AD (recommended for reliability and simplicity).
- Pass-Through Authentication (PTA): authentication validated against on-prem AD without storing hashes in cloud.
- Federation (AD FS): on-premises federation for SSO with claims; more complex and requires infrastructure.

Design guidance:
- Use PHS for most scenarios unless regulatory constraints require on-prem auth.
- For critical availability, design Azure AD Connect with staging server and high availability.

Azure AD DS vs IaaS DCs in Azure:
- Azure AD DS provides managed domain (no domain admin access, limited schema changes) — good for lift-and-shift apps that need LDAP/NTLM/Kerberos but not full AD management.
- Running DCs as IaaS VMs gives full control but requires patching, backup, and AD maintenance.

---

## 14. Running DCs in Azure (IaaS) — considerations
When deploying DCs in Azure VMs:
- Prefer availability sets or Availability Zones to ensure VM-level redundancy.
- Use managed disks and separate storage for logs and DB.
- Place at least two DCs per domain across fault domains and update domains (or zones) for high availability.
- Networking: avoid exposing RPC/LDAP directly to the public internet; use VPN/ExpressRoute for hybrid connectivity.
- Backups: enable system-state backups and snapshot-based backups carefully (coordinate with AD-consistent backup tooling).

---

## 15. Security hardening & operational best practices
- Least privilege: use delegated admin roles and avoid giving domain admins broad access.
- Privileged Access Workstations (PAWs) for sensitive admin work.
- Use LAPS (Local Administrator Password Solution) to manage local admin passwords.
- Enable SMB signing and secure LDAP (LDAPS) where possible.
- Regularly patch DCs in a controlled maintenance window; stagger reboots across update domains.
- Monitor for unusual authentications and use Conditional Access (in Azure) for risky sign-ins.

---

## 16. Useful commands & scripts
PowerShell (AD module):
```powershell
# Install AD module (if needed)
Install-WindowsFeature RSAT-AD-PowerShell

# Create a new user
New-ADUser -Name "Alice Reddy" -SamAccountName alice -AccountPassword (ConvertTo-SecureString 'P@ssw0rd!' -AsPlainText -Force) -Enabled $true

# Get a domain controller list
Get-ADDomainController -Filter * | Select-Object Name,Site,IPv4Address

# FSMO role holders
Get-ADForest | Select-Object SchemaMaster,DomainNamingMaster
Get-ADDomain | Select-Object RIDMaster,PDCEmulator,InfrastructureMaster

# Replication health
repadmin /replsummary
repadmin /showrepl * /csv > replication.csv

# Force Group Policy update on a client from server
Invoke-Command -ComputerName client01 -ScriptBlock { gpupdate /force }

# Start AD Sync (Azure AD Connect)
Import-Module ADSync
Start-ADSyncSyncCycle -PolicyType Delta
```

Classic tools:
- dcdiag
- repadmin
- nltest /dsgetdc:<domain>
- klist (Kerberos ticket viewer)
- setspn -L <account>
- wbadmin for system-state backups (or use Windows Server Backup GUI)

Backup example (Windows Server Backup CLI):
```powershell
# One-time system state backup
wbadmin start systemstatebackup -backuptarget:D: -quiet
```

Authoritative restore: high-level steps
1. Take DC offline and boot into Directory Services Restore Mode (DSRM).
2. Restore system state from backup.
3. Use ntdsutil to mark restored objects authoritative if you need to overwrite replication partners.
4. Reboot normally and allow replication to converge.

---

## 17. Diagrams & quick cheat-sheet
Suggested diagrams to include in documentation:
- Authentication flow (Kerberos: AS → TGT → TGS → Service Ticket)
- FD/UD concept (if using virtualization/Availability Sets discussion in Azure)
- AD topology diagram (sites, DCs, replication links)
- Hybrid identity architecture (on-prem AD → Azure AD Connect → Azure AD and Azure AD DS)

Quick cheat-sheet (one page):
- Key ports: 53, 88, 135, 389, 445, 3268
- Common commands: dcdiag, repadmin, nltest, gpresult, klist
- Time skew limit: default 5 minutes

---

## 18. Further reading
- Microsoft docs: Active Directory Domain Services
  https://learn.microsoft.com/windows-server/identity/ad-ds
- Azure hybrid identity:
  https://learn.microsoft.com/azure/active-directory/hybrid
- AD backup and restore:
  https://learn.microsoft.com/windows-server/identity/ad-ds/plan/backup-and-restore

---

## Next steps I can take for you
- Add SVG diagrams and embed them into `ADDS_guide.md`.
- Create a small test lab deployment script (PowerShell) that provisions two DC VMs in Azure with a virtual network and validates replication.
- Add a troubleshooting playbook with exact Event IDs and automated Kusto/Log Analytics queries for hybrid monitoring.

If you want me to proceed with any of those, tell me which and I will update the todo list and start it.
