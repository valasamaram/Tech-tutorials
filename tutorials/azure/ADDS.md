🔹 What is On-Premises Active Directory?
On-Premises Active Directory (often just called Active Directory Domain Services – AD DS) is Microsoft’s directory service that runs on Windows Server.
It’s primarily used by organizations to manage users, computers, groups, and security policies within their internal network.
Think of it as the central brain of an organization’s IT environment, which ensures:
    • Who can log in
    • What resources they can access
    • What security rules apply to them

🔹 Core Components
    1. Domain Controllers (DCs)
        ○ Servers that run AD DS and handle authentication requests (like logging in).
        ○ Store a copy of the Active Directory database (NTDS.dit).
    2. Active Directory Database
        ○ Stores information about objects (users, groups, computers, printers, etc.).
        ○ Uses LDAP (Lightweight Directory Access Protocol) for queries.
    3. Objects
        ○ Users – accounts for people.
        ○ Computers – accounts for machines in the network.
        ○ Groups – collections of users/computers for easier management.
        ○ OUs (Organizational Units) – containers to structure objects (like HR, IT, Finance).
    4. Domains, Trees, and Forests
        ○ Domain – the basic unit (example: company.local).
        ○ Tree – a collection of domains in a hierarchy.
        ○ Forest – the top-level container that can have multiple trees/domains.
    5. Authentication Protocols
        ○ Kerberos – default and secure authentication method.
        ○ NTLM – older method (still supported for compatibility).

🔹 Key Features
    • Centralized Authentication & Authorization (one username/password across company systems).
    • Group Policy – apply rules like password length, disable USB ports, enforce screen locks.
    • Single Sign-On (SSO) – access multiple apps without re-entering credentials.
    • Replication – AD data syncs across multiple domain controllers for redundancy.
    • Trusts – allow access between different domains/forests.

🔹 Benefits of On-Prem AD
✅ Centralized user and resource management
✅ Strong security & access control
✅ Scalable to thousands of users and computers
✅ Integration with legacy on-premises apps

🔹 Limitations
❌ Requires physical servers & maintenance
❌ Doesn’t natively integrate with cloud apps (needs Azure AD Connect for hybrid setup)
❌ Scaling globally is complex (replication & latency issues)
❌ Remote access requires VPN or additional setup

🔹 When Organizations Use On-Prem AD
    • Traditional enterprises with mostly on-premises workloads.
    • Companies needing strict compliance/security controls.
    • Environments where legacy applications require on-prem AD authentication.

👉 In short:
On-Premises Active Directory is like a company’s internal passport system, ensuring that only the right people and devices can access the right resources inside the corporate network.


Let’s go step by step and see how On-Premises Active Directory (AD) actually works in practice. I’ll explain it in a workflow-like way so it’s easy to visualize.

🔹 1. Setup & Structure
    1. Install AD Domain Services (AD DS) on a Windows Server.
    2. Promote the server to a Domain Controller (DC).
    3. Create a Domain (e.g., company.local).
    4. Add Organizational Units (OUs), users, groups, and computers to structure the environment.
    The Domain Controller now holds the central AD database (NTDS.dit) which stores all objects and policies.

🔹 2. User/Computer Join Process
    1. A computer is joined to the domain.
        ○ The computer gets a unique computer account in AD.
    2. A user is created in AD with a username and password.
    3. Both users and computers can now communicate securely with the Domain Controller.

🔹 3. Authentication Workflow
When a user logs in:
    1. User enters username and password on a domain-joined PC.
    2. The computer sends an authentication request to the nearest Domain Controller.
    3. The DC uses Kerberos authentication (or NTLM if needed) to verify credentials.
        ○ Checks username/password against AD database.
    4. If credentials are correct:
        ○ DC issues a Ticket Granting Ticket (TGT).
        ○ User now has access to domain resources according to group membership.
    5. If credentials are wrong → login denied.

🔹 4. Authorization & Access
    • Once authenticated, AD checks group memberships and permissions.
    • For example:
        ○ A user in the HR group can access HR files but not IT files.
        ○ A computer in Finance OU follows specific Group Policies.
    This is controlled via Access Control Lists (ACLs) and Group Policies (GPOs).

🔹 5. Replication
    • If multiple Domain Controllers exist:
        ○ AD data is replicated between them automatically.
        ○ Ensures redundancy and high availability.
    • Example:
        ○ Add a new user on DC1 → DC2 and DC3 also get the updated info.

🔹 6. Group Policy Application
    • DCs push Group Policies to users and computers.
    • Examples of policies:
        ○ Password complexity rules
        ○ Software installation
        ○ Desktop restrictions
        ○ Security settings
    Policies can be applied per user or per computer, based on OU structure.

🔹 7. Trusts & Cross-Domain Access
    • AD can have multiple domains in a tree or forest.
    • Trusts allow users from one domain to access resources in another domain.
    • Kerberos handles secure ticketing across domains.

🔹 Visual Summary

[User/Computer] --> [Domain Controller] --> [AD Database] 
     |                        |
     |---- Authentication ----|
     |---- Authorization -----|
     |---- Group Policies ----|
     |                        |
  Access granted to network resources

✅ In short:
On-Premises AD works as a secure gatekeeper. It authenticates users, authorizes access to resources, enforces policies, and replicates data across multiple servers to ensure reliability.



🔹 On-Premises AD Authentication Workflow
When a user tries to log in to a domain-joined computer, AD ensures that the user is who they say they are (authentication) and grants access to resources based on permissions (authorization).

Step 1: User Logs In
    1. A user enters their username and password on a domain-joined computer.
    2. The computer recognizes that it is part of a domain and knows which Domain Controller (DC) to contact.
        ○ This information is stored in the DNS (the computer queries for _ldap._tcp.dc._msdcs.<domain>).

Step 2: Initial Authentication Request
    1. The computer sends the login credentials to the Domain Controller.
    2. AD uses Kerberos (default) or NTLM (legacy) for authentication.

Kerberos Workflow
Kerberos is the standard protocol in AD. Here’s how it works step by step:
Step 2a: Request Ticket Granting Ticket (TGT)
    1. The computer sends a request to the Key Distribution Center (KDC) on the DC.
        ○ KDC is a service running on the DC.
    2. The KDC verifies the user credentials against the Active Directory database (NTDS.dit).
    3. If the password is correct, the KDC issues a TGT (Ticket Granting Ticket).
        ○ TGT is encrypted with the user’s password hash.
        ○ The TGT proves the user has been authenticated.
Step 2b: User Decrypts TGT
    1. The client computer decrypts the TGT using the user’s password.
    2. If the decryption is successful → user credentials are correct.

Step 3: Requesting Service Tickets
    1. When the user tries to access a network resource (e.g., file server, printer), the client requests a Service Ticket (ST) from the KDC.
    2. KDC verifies the user’s TGT and issues a Service Ticket for that specific resource.
    3. The client sends this Service Ticket to the resource server to gain access.
    Kerberos ensures single sign-on (SSO): user doesn’t need to re-enter credentials for each resource.

NTLM Authentication (Legacy)
If Kerberos isn’t possible:
    1. The client sends a hash of the password to the DC.
    2. DC verifies the hash against AD database.
    3. If it matches → authentication succeeds.
    4. NTLM does not support SSO as smoothly as Kerberos.

Step 4: Authorization
    1. Once authenticated, the DC checks group memberships in AD.
    2. Based on Access Control Lists (ACLs), it decides which resources the user can access.
    3. Example:
        ○ HR group → can access HR folder.
        ○ IT group → cannot access HR folder.

Step 5: Applying Group Policies
    1. The Domain Controller pushes Group Policies (GPOs) to the user/computer.
    2. Policies can control:
        ○ Password complexity
        ○ Software installation
        ○ Desktop restrictions
        ○ Security settings
    3. Policies are applied before or during login to ensure compliance.

Step 6: Access Granted
    1. If authentication is successful and authorization checks pass:
        ○ User gains access to desktop and network resources.
    2. If either fails → access is denied.

🔹 Visual Workflow (Simplified)

User enters credentials
        |
        v
Computer sends credentials to DC
        |
        v
KDC validates credentials
        |
        +--> Issue TGT (Kerberos)
        |
Client requests Service Ticket for resource
        |
KDC issues Service Ticket
        |
Client presents ticket to resource
        |
Resource grants/denies access

🔹 Key Points
    • Authentication = “Are you who you say you are?”
    • Authorization = “What are you allowed to do?”
    • Kerberos = Secure, SSO-enabled authentication.
    • NTLM = Legacy, hash-based authentication.
    • Group Policies = Enforce rules on users/computers.




1. Authentication Protocols: The Foundation
Authentication protocols are sets of rules that ensure only trusted users, computers, or services can access specific resources. They protect sensitive data and IT systems by verifying identities reliably and securely.

2. LDAP (Lightweight Directory Access Protocol)
What is LDAP?
LDAP is a protocol for searching, reading, and updating information in directory services such as Microsoft Active Directory. It’s commonly used to store and retrieve user accounts, passwords, and organizational data.

Why use LDAP?
    • Centralizes identity management: User information and permissions are managed in one place.
    • Enables single sign-on (SSO): One login grants access to multiple applications.
    
How to use LDAP? With an example:
    • Imagine a company has an internal portal. When Alice logs in, the portal asks the LDAP server (AD) to authenticate her username and password.
    • If the credentials match what's in the directory, Alice is granted access; otherwise, she's denied.
    Example command (querying user info with LDAP):
    
    shell
    ldapsearch -x -h ldap.company.com -b "dc=company,dc=com" "(uid=alice)"
    This command searches for Alice’s account info in the directory.


1. NTLM (NT LAN Manager)
    • What is NTLM?
        ○ An older suite of security protocols developed by Microsoft for Windows networks, mostly replaced by Kerberos but still used for backward compatibility.
        
    • How does NTLM work?
    Uses a "challenge-response" mechanism:
        a. Client sends username.
        b. Server responds with a random challenge.
        c. Client encrypts the challenge with the hash of the user's password and returns it.
        d. Server verifies the response by comparing it to what it calculates with the stored credentials.
        
    • No password is sent over the network, but there are known security weaknesses compared to Kerberos.
    
    • Why use NTLM?
    • Mainly for legacy support with old applications or systems not compatible with Kerberos.

2. What is Kerberos Authentication?
Kerberos is a secure, ticket-based network authentication protocol. Instead of sending passwords across the network, Kerberos uses secret keys and temporary "tickets" to allow users to access resources securely. It’s the default authentication method in modern Active Directory (AD) domains on Windows networks and is also widely supported on Linux and Mac.

How Kerberos Works—Step-by-Step with Example
Let’s walk through how Kerberos authentication happens with a real-world example:
Scenario: Alice Logs In and Accesses Email on the Corporate Network
    • Actors:
        ○ Alice (User)
        ○ Client PC
        ○ Domain Controller / Key Distribution Center (KDC) — runs Kerberos services
            § Authentication Service (AS)
            § Ticket Granting Service (TGS)
        ○ Mail Server (Service Alice wants to access)
        
Step 1: Alice Logs in — Getting a Ticket Granting Ticket (TGT)
    1. Alice enters her username and password on her domain-joined Windows PC.
    2. The client uses her password to encrypt a request to the Kerberos Authentication Service (AS).
    3. The AS verifies Alice’s credentials.
    4. If correct, the AS creates a Ticket Granting Ticket (TGT) (encrypted with Alice’s secret key and the KDC’s key).
    5. The TGT is sent back to Alice’s PC.
    Key point: The password is never sent over the network—only encrypted messages.
    
Step 2: Alice Requests Access to the Mail Server
    1. Alice’s PC needs to access the company email server (e.g., Microsoft Exchange).
    2. The PC presents the TGT to the Ticket Granting Service (TGS) on the KDC and requests a service ticket for the mail server.
    3. The TGS verifies the TGT, confirms Alice’s right to request tickets, and validates access permissions.

Step 3: TGS Issues a Service Ticket
    1. The TGS issues a Service Ticket for the email server (encrypted with the server’s secret key).
    2. Alice’s PC receives the service ticket.
    
Step 4: Alice’s PC Accesses the Mail Server
    1. The PC sends the Service Ticket to the mail server as proof of Alice’s identity.
    2. The mail server validates the ticket with its own secret key.
    3. If valid, Alice is granted access to her email—without re-entering her password.

Kerberos Authentication Flow Diagram
Here is a simplified flow:
    1. User enters credentials → Client requests TGT from AS.
    2. AS authenticates and issues TGT.
    3. Client uses TGT to request a Service Ticket from TGS.
    4. TGS validates TGT and issues Service Ticket.
    5. Client uses Service Ticket to access Mail Server.

Key Benefits and Security
    • Single Sign-On (SSO): Alice logs in once and can access many services without further password prompts.
    • Strong Security: Credentials are never sent over the network in plain text—tickets and session keys are used.
    • Mutual Authentication: Both user and service verify each other's identity.

5. Summary: When and Why to Use These Protocols
Protocol	Primary Use	Key Features	Typical Scenarios
LDAP	Directory lookups, authentication	Centralized user data, flexible queries	Managing users/devices in AD, enabling SSO
Kerberos	Secure authentication, SSO	Ticket-based, mutual auth, encryption	Enterprise logins, modern Active Directory
NTLM	Legacy authentication	Challenge-response, password-hash-based	Older Windows apps, backward compatibility


🔹 Authorization & Access in On-Premises AD
Authorization is the process of deciding what resources a user or computer is allowed to access and what operations they can perform. It works hand-in-hand with authentication.

Step 1: Determine User Identity
    • After successful authentication (Kerberos or NTLM), the Domain Controller knows who the user is.
    • This includes:
        ○ User account attributes (username, employee ID, department, etc.)
        ○ Group memberships (e.g., IT group, HR group)
        ○ Organizational Unit (OU) location
    This is the foundation for access control. AD uses identity information to decide what a user can do.

Step 2: Evaluate Group Memberships
    • AD uses groups to manage permissions more efficiently instead of assigning permissions to each user individually.
    • Types of groups:
        1. Security Groups – control access to resources like files, printers, and applications.
        2. Distribution Groups – used for email distribution (not for access control).
    • Example:
        ○ User “Alice” is in groups: HR, VPN Users.
        ○ The system now knows that Alice is allowed access to HR resources and VPN login.

Step 3: Check Access Control Lists (ACLs)
    • Every resource (file, folder, printer, share, etc.) in AD has an ACL.
        ○ ACL = list of users/groups + permissions.
    • Permissions include:
        ○ Read
        ○ Write
        ○ Modify
        ○ Full control
        ○ Execute
    • AD evaluates if the user’s identity or group membership matches an ACL entry for that resource.
Example:
    • Folder: HRDocuments
        ○ ACL: HR group → Read/Write
        ○ ACL: Finance group → Deny access
        ○ Alice → in HR → Access granted

Step 4: Apply Organizational Unit Policies
    • AD organizes users and computers in Organizational Units (OUs).
    • OUs can have Group Policy Objects (GPOs) applied:
        ○ Password policies
        ○ Desktop restrictions
        ○ Software installation
    • When a user logs in, AD checks the OU of the user/computer and applies the relevant policies.
    Policies can further restrict access even after authentication.

Step 5: Resource Access Request
    1. User attempts to access a resource (file, share, printer, application).
    2. The system checks:
        ○ Is the user authenticated? ✅
        ○ Does the user’s group membership match the ACL? ✅
        ○ Does any Group Policy restrict access? ❌
    3. If all checks pass → Access Granted
    4. If any check fails → Access Denied

Step 6: Token Generation
    • Once authentication is done, Windows creates a security token for the user:
        ○ Contains user SID (Security Identifier)
        ○ Contains all group SIDs the user belongs to
        ○ Used by Windows to check access to any resource without asking DC again
Example:
    • Alice’s token contains:

User SID: S-1-5-21-1000
Groups: HR, VPN Users
    • When Alice opens HRDocuments, Windows checks her token vs folder ACL → grants access.

Step 7: Dynamic Access Checks
    • For certain resources (e.g., databases, applications), AD can integrate Role-Based Access Control (RBAC):
        ○ Access is based on roles (like HR Manager) rather than individual accounts.
    • AD ensures fine-grained access using:
        ○ Group memberships
        ○ OU hierarchy
        ○ Inherited permissions

🔹 Summary of Authorization Steps
Step	What Happens
1	Determine user identity & attributes
2	Evaluate user’s group memberships
3	Check resource ACLs against user/group SIDs
4	Apply OU and Group Policy restrictions
5	User requests access → system grants or denies
6	Security token generated for session
7	Dynamic access checks for apps/resources

🔹 Key Concepts
    • Authentication = Who you are
    • Authorization = What you can do
    • Groups & ACLs = Core mechanism for authorization
    • Security Token = Contains all permissions for access checks
    • Group Policy = Enforces policies at OU or domain level


🔹 Domain Controllers (DCs) in Active Directory
A Domain Controller (DC) is a server running Active Directory Domain Services (AD DS) that authenticates and authorizes users and computers in a domain.
Think of it as the gatekeeper and librarian of your network: it knows who you are, what you can access, and what rules apply to you.

1. Role and Purpose of a DC
A Domain Controller is responsible for:
    1. Authentication
        ○ Verifies user and computer credentials (passwords, certificates, Kerberos tickets).
        ○ Grants or denies access to the network.
    2. Authorization
        ○ Determines what resources the user/computer can access based on group memberships and ACLs.
    3. Directory Services
        ○ Stores the Active Directory database (NTDS.dit) containing objects such as:
            § Users
            § Groups
            § Computers
            § Organizational Units (OUs)
            § Security policies
    4. Replication
        ○ Ensures all DCs in the domain/forest have up-to-date directory information.
        ○ Provides high availability and fault tolerance.
    5. Group Policy Management
        ○ DCs enforce Group Policy Objects (GPOs) for users and computers.

2. Types of Domain Controllers
    1. Primary Domain Controller (PDC) Emulator
        ○ Handles legacy NTLM authentication requests.
        ○ Acts as the time source for the domain (important for Kerberos).
        ○ Coordinates password changes and replication.
    2. Additional Domain Controllers
        ○ Backup DCs to provide redundancy.
        ○ Handle authentication and directory requests if the PDC is unavailable.
    Modern Active Directory uses multi-master replication, so all DCs can process authentication and updates. There isn’t a “single master” for most operations, but some roles like PDC Emulator are still special.

3. Components of a DC
    • Active Directory Database (NTDS.dit): Stores all AD objects.
    • SYSVOL folder: Stores Group Policy templates and scripts that need to replicate across DCs.
    • LDAP service: Handles directory queries (Lightweight Directory Access Protocol).
    • Kerberos Key Distribution Center (KDC): Handles Kerberos authentication tickets.
    • DNS: Domain Controllers often run DNS to resolve domain names within the network.

4. How a DC Works (Step by Step)
Step 1: User/Computer Join
    • A computer joins the domain → DC creates a computer account in AD.
Step 2: Authentication
    • User logs in → DC validates credentials using Kerberos/NTLM.
Step 3: Authorization
    • DC evaluates group memberships, ACLs, and OU policies to grant or deny access to resources.
Step 4: Replication
    • Changes on one DC (e.g., password update) are replicated to all other DCs in the domain/forest.
Step 5: Group Policy Enforcement
    • DC pushes policies to domain-joined computers and users.

5. Multi-DC Environment
    • Large organizations have multiple DCs for:
        ○ Load balancing authentication requests
        ○ Fault tolerance (if one DC fails, others take over)
        ○ Geographic distribution (DCs in different offices)
    • DCs replicate changes using:
        ○ Intrasite replication: Fast replication within same site
        ○ Intersite replication: Slower replication between sites to reduce bandwidth usage

6. Key Benefits of Domain Controllers
✅ Centralized user and computer management
✅ High availability through multiple DCs
✅ Security and compliance enforcement
✅ Group Policy management
✅ Reduces administrative overhead

🔹 Summary
A Domain Controller is the backbone of On-Premises Active Directory. It:
    1. Authenticates users and computers
    2. Authorizes access to resources
    3. Stores the directory database
    4. Enforces security and Group Policies
    5. Replicates data to other DCs for redundancy
    Without DCs, a domain cannot function because there is no central authority to validate identities or manage access.


🔹 Active Directory Database (NTDS.dit)
The Active Directory database, also called NTDS.dit, is the heart of AD. It’s a specialized database that stores all the information about users, computers, groups, organizational units, and other objects in a domain.
Think of it as a giant phonebook and rulebook combined, telling the network who exists, who can do what, and how policies are applied.

Step 1: Location and Structure
    1. The database file is located on a Domain Controller:
        ○ Default path: C:\Windows\NTDS\NTDS.dit
    2. The database is extensible and hierarchical, organized into:
        ○ Objects: Users, groups, computers, printers, OUs, etc.
        ○ Attributes: Each object has properties, e.g., username, password, group memberships, email, department.
    Example: User object “Alice”

Object type: User
Attributes:
 - sAMAccountName: alice
 - displayName: Alice Reddy
 - email: alice@company.com
 - memberOf: HR, VPN Users
 - passwordLastSet: 28-Sep-2025

Step 2: Logical Structure
Active Directory uses a hierarchical namespace:
    1. Forest – The top-level container, can contain multiple trees.
    2. Tree – Collection of domains in a hierarchical structure.
    3. Domain – The primary administrative boundary.
    4. Organizational Units (OUs) – Containers for users, groups, and computers.
    5. Objects – Individual entries like a user or computer.
    This hierarchy helps with administration, replication, and Group Policy application.

Step 3: How Objects are Stored
    1. Every object has a unique identifier (GUID) – Globally Unique Identifier.
    2. Security Identifier (SID) – Unique for authentication and authorization.
    3. Attributes are stored for each object in the database.
    4. Indexes are used for fast searching (like a book index).
    Example:
    • Searching for user Alice → AD uses an index instead of scanning the entire database.

Step 4: Database Components
    1. Data Store (NTDS.dit) – Holds all AD objects and attributes.
    2. Transaction Logs – Track every change to the database for reliability.
        ○ Examples: adding a new user, changing a password.
    3. Checkpoint File – Marks which changes have been committed to the database.
    4. SYSVOL Folder – Not part of NTDS.dit, but works alongside it to store Group Policy templates and scripts.

Step 5: How Database is Accessed
    • DCs provide directory services via:
        ○ LDAP (Lightweight Directory Access Protocol) → search and retrieve directory information
        ○ Kerberos/NTLM → authentication
        ○ DNS → resolve domain names to DCs
    Example: User login
    1. User types password
    2. DC checks NTDS.dit for user account and password hash
    3. If correct → authentication succeeds

Step 6: Replication Between DCs
    • AD is often deployed with multiple DCs.
    • NTDS.dit is replicated across DCs to maintain consistency.
    • Replication occurs in two ways:
        1. Intra-site replication – fast, within the same location.
        2. Inter-site replication – slower, optimized for bandwidth across locations.
    Example: Change password on DC1 → replicated to DC2 → users can authenticate on either DC.

Step 7: Security and Integrity
    • Database changes are logged and transactional, preventing corruption.
    • Access to the database is restricted to Domain Controllers only.
    • Backup/restore of NTDS.dit is critical for disaster recovery.

Step 8: Interaction with Other AD Components
    • Group Policies → linked to objects in the database via OUs.
    • Access Control → permissions stored as ACLs on objects.
    • Authentication/Authorization → uses SIDs and attributes in the database.

🔹 Key Points
    • NTDS.dit = central store of all AD objects and attributes
    • Objects = users, computers, groups, OUs
    • Attributes = properties of objects
    • Indexes = for fast searches
    • Replication = keeps all DCs in sync
    • Transaction logs = ensure reliability

🔹 Summary Diagram (Conceptual)

[Domain Controller]
        |
        v
   [NTDS.dit Database]
        |
  -----------------------
  | Objects & Attributes |
  | Users, Groups, OUs   |
  | SIDs, GUIDs, ACLs    |
  -----------------------
        |
Replication <--> Other DCs
        |
LDAP / Kerberos / DNS --> Services for login, access, and policies


🔹 1. Objects in Active Directory
In AD, an object is any item stored in the AD database (NTDS.dit). Every object has:
    • A unique identifier (GUID)
    • A Security Identifier (SID)
    • Attributes (properties like name, email, department)
AD objects can be users, computers, groups, OUs, printers, contacts, etc., but the most important for everyday management are Users, Computers, Groups, and OUs.

Step 1: Users
Definition:
    • User accounts represent people who need access to the network, applications, or resources.
Key Features:
    • Each user has a unique username and password.
    • Attributes include:
        ○ sAMAccountName → login name
        ○ User Principal Name (UPN) → email-like login (alice@company.com)
        ○ Display Name, Email, Department, Title
        ○ PasswordLastSet, AccountExpirationDate
Functionality:
    • Authentication: Validates identity when logging in.
    • Authorization: Grants access to resources based on group memberships and ACLs.
    • Policies: Users can have Group Policies applied via OUs.
Example:

User: Alice
Username: alice
Groups: HR, VPN Users
Department: HR
Email: alice@company.com

Step 2: Computers
Definition:
    • Computer accounts represent machines (desktops, servers, laptops) in the network.
Key Features:
    • Each computer account has a unique name and SID.
    • Attributes include:
        ○ Computer Name
        ○ Operating System
        ○ Last Logon Timestamp
        ○ Description
Functionality:
    • Authentication: Machines authenticate with the DC to join the domain.
    • Policies: Computers receive Group Policies (e.g., software installation, security settings).
    • Security: Ensures only domain-joined computers can access internal resources.
Example:

Computer: Finance-PC-01
OS: Windows 11 Pro
OU: Finance
Last Logon: 27-Sep-2025

Step 3: Groups
Definition:
    • Groups are collections of users and/or computers that simplify administration and permission management.
Key Features:
    • Types of groups:
        1. Security Groups – Control access to resources (files, folders, applications).
        2. Distribution Groups – Used for email distribution (cannot be used for permissions).
    • Scope of groups:
        ○ Domain Local – Assign permissions within a domain.
        ○ Global – Include users from the same domain.
        ○ Universal – Include users from multiple domains in a forest.
Functionality:
    • Simplifies permissions: Instead of giving access to each user individually, assign it to a group.
    • Used in ACLs and Group Policy filtering.
Example:

Group: HR
Members: Alice, Bob, Carol
Access: HR folder read/write
Scope: Global
Type: Security

Step 4: Organizational Units (OUs)
Definition:
    • OUs are containers that help organize objects (users, computers, groups) within a domain.
Key Features:
    • Logical grouping of objects for easier administration.
    • Can have nested OUs (e.g., Finance OU inside Corporate OU).
    • Group Policies can be applied to OUs for specific sets of users/computers.
Functionality:
    • Delegation of administration: Assign admins to manage specific OUs without affecting the whole domain.
    • Policy application: Apply different GPOs to different OUs based on business needs.
Example:

Domain: company.local
OU: Finance
 - Users: Alice, Bob
 - Computers: Finance-PC-01
GPOs Applied: Password Policy, Drive Mapping, Desktop Wallpaper

🔹 Summary Table of Objects
Object	Represents	Key Attributes	Purpose
User	People	Username, UPN, Email, Group Memberships	Authentication & Authorization
Computer	Machines	Computer Name, OS, Last Logon	Domain Join, Policy Application
Group	Collection of Users/Computers	Group Type, Scope, Members	Simplifies permission management
OU	Container for Objects	Name, Nested OUs	Delegation & Policy Application

🔹 Key Points
    1. Every object has a unique identifier (GUID & SID).
    2. Users and computers authenticate, groups simplify access, OUs structure and manage them.
    3. Group Policies are often applied at the OU level, affecting all contained objects.
    4. ACLs reference groups or users to grant/deny access to resources.



Absolutely! Let’s go in-depth into Domains, Trees, and Forests in Active Directory (AD). These are fundamental concepts for understanding AD’s hierarchical structure and how it organizes and manages resources.

🔹 1. Domain
Definition:
    • A Domain is the basic administrative and security unit in Active Directory.
    • It contains a collection of objects (users, computers, groups, OUs) that share:
        ○ A common directory database (NTDS.dit)
        ○ A security policy
        ○ A DNS namespace (e.g., company.local)
Key Points:
    • A domain has at least one Domain Controller (DC) to manage authentication and authorization.
    • Domains are security boundaries: ACLs and permissions are applied within a domain.
    • Users and computers within a domain can authenticate with any DC of that domain.
Example:

Domain: company.local
Objects: Alice (user), Finance-PC-01 (computer), HR (OU)
DCs: DC1.company.local, DC2.company.local

🔹 2. Tree
Definition:
    • A Tree is a collection of one or more domains that share:
        ○ A contiguous namespace
        ○ A hierarchical structure
        ○ Transitive trust relationships
Key Points:
    • Domains in a tree are connected in a parent-child relationship:
        ○ Parent domain: company.local
        ○ Child domain: sales.company.local
    • Trusts are automatic and transitive between parent and child domains → users in parent can access child resources if permissions are granted.
    • Trees are useful for organizing large organizations where multiple domains are needed.
Example Tree:

company.local
│
├── sales.company.local
├── hr.company.local
└── it.company.local


🔹 3. Forest
Definition:
    • A Forest is the top-most container in Active Directory.
    • It can contain one or more trees, which may have different DNS namespaces.
    • Forests provide a security and management boundary for multiple trees.
Key Points:
    • Forests define the schema (object types and attributes) and global catalog (all objects across the forest).
    • Domains in different trees automatically establish trusts via the forest root.
    • Forests are used when organizations need multiple AD namespaces but want a single global administration and security boundary.
Example Forest:

Forest: corp.local
Tree 1: company.local
        ├─ sales.company.local
        └─ hr.company.local
Tree 2: subsidiary.com
        ├─ europe.subsidiary.com
        └─ asia.subsidiary.com


🔹 4. Relationships and Hierarchy
    1. Domain → Tree → Forest
        ○ Domain = basic unit
        ○ Tree = hierarchical collection of domains
        ○ Forest = top-level container of one or more trees
    2. Trusts:
        ○ Domains in a tree automatically trust each other.
        ○ Trees in a forest trust each other via the forest root domain.
    3. Namespace:
        ○ Tree domains share contiguous DNS names (child.domain.com).
        ○ Forests can have disjointed namespaces (different root domains).
    4. Global Catalog (GC):
        ○ Forest-wide searchable directory of all objects.
        ○ Enables users to find resources across domains and trees.

🔹 5. Benefits of Domain, Tree, and Forest Structure
Structure	Purpose/Benefit
Domain	Security boundary, centralized authentication, policy enforcement
Tree	Organize multiple domains, parent-child trusts, contiguous namespace
Forest	Top-level management, schema consistency, multiple trees support, forest-wide trusts

🔹 6. Key Concepts to Remember
    • Domain: “Who you are” and “where you belong.” Basic unit of administration.
    • Tree: “Family of domains” with parent-child hierarchy.
    • Forest: “Entire organization” or multiple trees with global schema and trust.
    • Trusts are automatic between domains in a tree and between trees in a forest.
    • Global Catalog allows searching for any object across the forest.

🔹 Visual Diagram (Conceptual)

Forest: corp.local
│
├── Tree 1: company.local
│   ├── Domain: company.local
│   ├── Domain: sales.company.local
│   └── Domain: hr.company.local
│
└── Tree 2: subsidiary.com
    ├── Domain: europe.subsidiary.com
    └── Domain: asia.subsidiary.com

    Forest = top container
    Tree = collection of domains
    Domain = basic unit with users, computers, and policies


Absolutely! Let’s go step by step in detail on Access Control Lists (ACLs) and Group Policies (GPOs) in Active Directory (AD), because these are key mechanisms for security and management in AD environments.

🔹 1. Access Control Lists (ACLs)
Definition:
    • An Access Control List (ACL) is a list of permissions attached to an object (file, folder, printer, or AD object) that specifies who can access it and what actions they can perform.
    • Each ACL is made up of Access Control Entries (ACEs), which define specific permissions for a user or group.

Step 1: Structure of ACL
    1. Object – The resource being protected (e.g., folder, file, printer, AD user object).
    2. Access Control Entry (ACE) – Each entry specifies:
        ○ Principal → user or group (who the rule applies to)
        ○ Permissions → allowed or denied actions (Read, Write, Modify, Full Control)
        ○ Inheritance → whether permissions are passed to child objects
Example ACL for folder HRDocs:
Principal	Permissions	Inherited
HR Group	Read, Write	Yes
Finance Group	Read	No
Everyone	None	-

Step 2: How ACLs Work in AD
    1. When a user requests access to a resource:
        ○ AD checks the user’s security token (includes user SID + all group SIDs).
    2. AD compares the SIDs in the token against the ACEs in the ACL.
    3. Access is granted only if permissions match; otherwise, it’s denied.
Key Points:
    • Deny permissions override Allow permissions.
    • Permissions can be explicit (directly assigned) or inherited from parent containers (like OUs or folders).
    • ACLs are used on both files/folders (NTFS) and AD objects.

🔹 2. Group Policy Objects (GPOs)
Definition:
    • Group Policy Objects (GPOs) are collections of settings that define how computers and users behave in an AD environment.
    • GPOs are applied at different levels:
        ○ Domain
        ○ Organizational Unit (OU)
        ○ Site

Step 1: Components of GPOs
    1. Computer Configuration – Policies applied to computers, regardless of who logs in:
        ○ Security settings (firewall, password policies)
        ○ Software deployment
        ○ Desktop restrictions
    2. User Configuration – Policies applied to users:
        ○ Start menu settings
        ○ Drive mappings
        ○ Login scripts
        ○ Folder redirection
    3. Administrative Templates – Registry-based settings controlling OS behavior.

Step 2: How GPOs Work
    1. GPOs are linked to AD containers:
        ○ Site → Domain → OU
    2. When a user logs in or a computer starts:
        ○ AD applies all relevant GPOs in this order:
            1. Local GPO
            2. Site-level GPO
            3. Domain-level GPO
            4. OU-level GPOs (from parent OU to child OU)
        ○ Last applied GPO takes precedence in case of conflicts.
    3. Result: User/computer settings are automatically enforced across the network.

Step 3: Interaction with ACLs
    • GPOs can modify ACLs on files, folders, registry keys, or AD objects.
    • Example:
        ○ GPO applied to Finance OU → sets folder permissions for Finance documents.
    • ACLs define who can access a resource, while GPOs define how the resource or system behaves.

Step 4: Key Features of GPOs
    • Centralized management of multiple computers/users.
    • Automatic enforcement of security policies.
    • Ability to deploy software or scripts.
    • Filtering based on Security Groups or WMI queries for specific targeting.
    • Overrides local settings on individual computers for consistency.

Step 5: Example Scenario
Scenario:
    • Alice is in the HR group and logs into a domain-joined PC in the HR OU.
Workflow:
    1. ACLs: AD checks HR group → Alice has access to HR folders.
    2. GPOs:
        ○ Maps HR network drives automatically.
        ○ Sets desktop wallpaper to HR corporate template.
        ○ Enforces password complexity rules.
    3. Result: Alice can access HR resources, and her workstation settings comply with company policies.

🔹 Key Differences: ACLs vs GPOs
Feature	ACL	GPO
Purpose	Control access to resources	Configure behavior of users/computers
Scope	Individual object (file, folder, AD object)	OU, Domain, Site
Enforcement	Security enforcement	Policy enforcement
Mechanism	ACEs with Allow/Deny permissions	Settings applied via registry/OS
Interaction	Checked at resource access time	Applied at login/startup

🔹 Summary
    • ACLs = Who can access what → resource-level permissions.
    • GPOs = How users/computers behave → policy-level configurations.
    • Together, they secure and standardize AD environments, ensuring compliance, usability, and control.
