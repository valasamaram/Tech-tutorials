
---

# **📘 Module 0 — Prep & Fundamentals (1–2 Weeks)**

### *Foundational Cloud & Azure Concepts for Azure SQL Learning Path*

---


# 🌤️ Module 0 — Prep & Fundamentals (1–2 Weeks)

## 🎯 Goals
By the end of this module, learners will:
- Understand core cloud computing concepts and terminology.
- Navigate Azure effectively using the Portal, Azure CLI, and PowerShell.
- Understand Azure subscription hierarchy (Tenant → Subscription → Resource Groups → Resources).
- Be familiar with essential Azure services related to Azure SQL Database.
- Build confidence to move into deeper Azure SQL DB architecture & development modules.

---

# 📦 Section 1 — Cloud Computing Basics

### 🌐 Key Topics
- What is Cloud Computing?
- Benefits of Cloud (Elasticity, Availability, Cost Model, Global Reach)
- Cloud Service Models  
  - **IaaS** (VMs, Networks)  
  - **PaaS** (Azure SQL DB, App Service)  
  - **SaaS** (Office 365, Dynamics)  
- Deployment Types  
  - **Public**, **Private**, **Hybrid**, **Multi-Cloud**

### 🎯 Outcome
Learner clearly understands cloud models and where **Azure SQL DB** fits in (PaaS).

---

# 🔷 Section 2 — Azure Overview

### 🧩 Key Topics
- What is Azure?  
- Azure global infrastructure  
  - Regions, Availability Zones, Paired Regions
- Azure Resource Manager (ARM)  
- Azure Logical Structure  
  - Tenants  
  - Management Groups  
  - Subscriptions  
  - Resource Groups  
  - Resources

### 🎯 Outcome
Learner can explain how Azure organizes and manages resources.

---

# 🖥️ Section 3 — Subscription & Account Basics

### 🧩 Key Topics
- Azure AD vs Microsoft Entra ID  
- Accounts, roles, and tenants  
- RBAC (Reader, Contributor, Owner)  
- Cost Management basics  
- Subscription governance  
- Naming conventions & tagging strategy

### 🎯 Outcome
Learner knows how identity, billing, and governance work before deploying Azure SQL.

---

# 🧭 Section 4 — Azure Portal Fundamentals

### 🧩 Key Topics
- Navigating the Azure Portal  
- Working with dashboards  
- Resource browsing, search & filters  
- Viewing metrics, logs & activity  
- Using Cloud Shell

### 🎯 Outcome
Learners are comfortable with Azure Portal navigation and resource exploration.

---

# ⌨️ Section 5 — Azure CLI & PowerShell Basics

### 🧩 Key Topics
- What is Azure CLI?  
- What is Az PowerShell Module?  
- Login, set context, switch subscriptions  
- Create/view/delete resources  
- Working with:  
  - Resource groups  
  - Storage accounts  
  - Virtual networks  
  - Azure SQL server (basic overview, no deep configuration)

### 🎯 Outcome
Learners can perform basic operations and feel comfortable with automation tooling.

---

# 🔗 Section 6 — Azure Networking Fundamentals (Light Introduction)

### 🧩 Key Topics
- Virtual Networks (VNet) concept  
- Subnets, private endpoints  
- IP addressing basics  
- Azure DNS basics  
- How Azure SQL DB connects to VNets (brief PaaS networking overview)

### 🎯 Outcome
Learner understands high-level networking concepts needed for Azure SQL security modules later.

---

# 🔍 Section 7 — Introduction to Azure SQL Ecosystem

### 🧩 Key Topics
- What is Azure SQL Database (PaaS)?  
- Azure SQL Managed Instance (PaaS with compatibility)  
- SQL Server on Azure Virtual Machines  
- Deployment comparisons & use-cases  
- Azure SQL Pricing Models (DTU vs vCore, Hyperscale overview)  
- Basic security posture (firewalls, auth basics)

### 🎯 Outcome
Learner can differentiate Azure SQL options and understands high-level architecture.

---

# 📘 Section 8 — Foundational Terminology

- Resource Group  
- ARM Template / Bicep (overview only)  
- Logical SQL Server vs SQL Database  
- Azure Policy  
- Service Levels (Basic, Standard, Premium, Business Critical)  
- SLA, RPO, RTO (for upcoming Backup & HA modules)

---

# 🧠 Module Summary

After completing Module 0, the learner will be prepared to:
- Start working confidently with Azure resources.
- Understand cloud fundamentals needed for Azure SQL architecture.
- Move into **Module 1: Azure SQL Database Architecture** with clarity.

---

# 📦 Deliverables (No labs, only learning assets)

- 📄 **Cheat sheet:** Azure concepts & hierarchy  
- 📄 **Role glossary:** Azure built-in RBAC roles  
- 📄 **Command reference:** Basic Azure CLI & PowerShell list  
- 📄 **Service comparison matrix:** Azure SQL DB vs MI vs SQL VM  
- 🔖 **Bookmark list:** Documentation & reference links  


---



---

# 📦 **Section 1 — Cloud Computing Basics**

This section introduces the foundational concepts of cloud computing—what it is, why it matters, and how cloud services are structured and delivered. These fundamentals are essential before working with Azure SQL or any Azure service.

---

## 🌐 **What is Cloud Computing?**

Cloud computing is the delivery of computing resources—like servers, databases, storage, networking, analytics, and applications—**over the internet (“the cloud”)** instead of running them on your own physical hardware.

In simple terms:
➡️ *You use IT resources hosted in large, global data centers owned by cloud providers (like Microsoft Azure), and you pay only for what you use.*

Cloud computing removes the need to maintain physical infrastructure and enables rapid scaling, flexible usage, and global access.

---

## 🎯 **Benefits of Cloud Computing**

### 1️⃣ **Elasticity**

Ability to **scale resources up or down automatically** based on demand.

* Example: A website that gets more traffic during festivals can auto-scale without downtime.

### 2️⃣ **High Availability**

Cloud services run on globally distributed data centers, supported by redundant infrastructure.

* If one server fails, another takes over automatically.
* Azure offers SLAs like 99.99% uptime for certain services.

### 3️⃣ **Cost Model (Pay-as-you-go)**

You only pay for what you use.
No upfront hardware cost, no maintenance cost.

* You can stop paying instantly by stopping or deleting a resource.

### 4️⃣ **Global Reach**

Cloud providers have data centers all over the world.
You can deploy your application close to customers for faster performance.

* Azure has 60+ regions worldwide.

### 5️⃣ **Security**

Enterprise-grade security, compliance, encryption, monitoring, and DDoS protection built-in.

### 6️⃣ **Agility & Speed**

You can deploy databases, apps, and VMs in minutes—not days.

---

## 🧩 **Cloud Service Models**

Cloud services are grouped into **IaaS, PaaS, and SaaS**, each offering a different level of control and responsibility.

---

### 🔹 **IaaS (Infrastructure as a Service)**

Cloud provider manages:

* Physical hardware
* Networking
* Storage

You manage:

* OS
* Application runtime
* Applications

#### Examples:

* Azure Virtual Machines (VMs)
* Azure Storage
* Virtual Networks (VNet)

➡️ *Useful when you want high customization, similar to on-prem servers.*

---

### 🔹 **PaaS (Platform as a Service)**

Cloud provider manages:

* Hardware
* OS
* Patching
* Backups
* Runtime
* Scaling
* High availability

You manage:

* Data
* Applications
* Logic

#### Examples:

* **Azure SQL Database**
* Azure App Service
* Azure Functions

➡️ *Ideal for developers: focus on the app, not infrastructure.*

---

### 🔹 **SaaS (Software as a Service)**

Cloud provider hosts and fully manages the entire application.
Users simply log in and use it.

#### Examples:

* Office 365
* Dynamics 365
* Azure DevOps (partly SaaS)

➡️ *Most user-friendly—you just consume the software.*

---

## 🏗️ Cloud Deployment Types

Deployment models define **where** your cloud resources run and **who owns the infrastructure**.

---

### 🔹 **Public Cloud**

* Infrastructure is shared across customers but logically isolated.
* Resources run in Azure data centers.
* Most common deployment model.

Examples: Azure SQL DB, Azure Functions

---

### 🔹 **Private Cloud**

* Infrastructure is dedicated to one organization.
* Runs on-premises or in a dedicated cloud environment.
* More control but higher cost.

Examples: VMware private cloud, Azure Stack

---

### 🔹 **Hybrid Cloud**

* Mix of on-premises + public cloud.
* Allows secure communication between your local datacenter and Azure.

Examples:

* Azure Arc enabled SQL Server
* VPN/ExpressRoute connections

➡️ Most enterprises use hybrid for flexibility + compliance.

---

### 🔹 **Multi-Cloud**

* Using **multiple cloud providers** (Azure + AWS + GCP).
* Avoid vendor lock-in
* Improve global flexibility
* Increase resilience

Examples:

* Disaster recovery site in AWS
* Primary workloads in Azure

---

# ✅ **Quick Summary**

* Cloud computing = on-demand IT resources over the internet.
* Benefits include elasticity, high availability, cost efficiency, and global reach.
* Service Models:
  **IaaS = You manage most, cloud manages hardware**
  **PaaS = Cloud handles platform, you handle data & app**
  **SaaS = Cloud manages everything**
* Deployment Types: Public, Private, Hybrid, Multi-cloud.

---




---

# 🔷 **Section 2 — Azure Overview**

This section explains what Azure is, how its global infrastructure is organized, and how Azure logically structures and manages resources. These fundamentals are essential before diving into Azure SQL or any other Azure service.

---

## 🧩 **What is Azure?**

**Microsoft Azure** is a cloud computing platform that provides hundreds of services—compute, databases, networking, storage, analytics, AI, security, and DevOps tools.
It allows organizations to **build, deploy, and manage applications** in a scalable, secure, and cost-efficient way.

In short:
➡️ *Azure is Microsoft’s public cloud where you can run your workloads without owning physical hardware.*

---

# 🌍 Azure Global Infrastructure

Azure operates one of the world’s largest cloud networks. Its physical infrastructure is divided into **Regions**, **Availability Zones**, and **Paired Regions**.

---

## 🗺️ **1. Regions**

A **Region** is a geographical area containing one or more data centers.
Example regions:

* East US
* West Europe
* Central India
* Southeast Asia

Each region has independent power, cooling, and networking.

### Why regions matter:

* Data residency requirements
* Latency optimization (deploy near users)
* Service availability (not all services exist in every region)

---

## 🏢 **2. Availability Zones (AZs)**

Availability Zones are **physically separate data centers** within a region.

Each zone has:

* Independent power
* Independent cooling
* Independent networking
* Separate buildings

Azure typically provides **3 zones per region**.

### Purpose:

Availability Zones provide *higher availability and fault tolerance* by protecting against:

* Data center failures
* Power outages
* Hardware failures

Example: Deploying Azure SQL Managed Instance or VMs across multiple zones for resilience.

---

## 🔁 **3. Paired Regions**

Every Azure region is paired with another region at least 300 miles away (when possible).

### Benefits:

* Geo-redundancy support
* Prioritized recovery during disasters
* Safe patch rollout (Azure updates one region at a time)

Examples:

* East US ↔ West US
* North Europe ↔ West Europe
* Central India ↔ South India

Paired regions are essential for disaster recovery and backups.

---

# 🛠️ Azure Resource Manager (ARM)

**ARM** is Azure's deployment and management layer.
It provides a consistent way to create, update, and delete Azure resources through:

* Azure Portal
* Azure CLI
* Azure PowerShell
* ARM/Bicep templates
* REST APIs

### What ARM does:

* Enforces role-based access control (RBAC)
* Applies policies (Azure Policy)
* Manages deployments and resource locks
* Ensures templates are repeatable and idempotent

➡️ ARM is the engine behind how Azure organizes, secures, and deploys resources.

---

# 🏗️ Azure Logical Structure

Azure organizes accounts and resources using a well-defined hierarchy. Understanding this hierarchy is critical before deploying any Azure SQL environment.

---

## 1️⃣ **Tenants**

A **Tenant** represents an organization’s identity boundary in Azure.
It is tied to Microsoft Entra ID (Azure AD).

A tenant contains:

* Users & groups
* Service principals
* Role assignments
* Enterprise apps

Every Azure account belongs to exactly one tenant.

---

## 2️⃣ **Management Groups**

Used to organize **multiple subscriptions** under a hierarchy.

### Why management groups exist:

* Apply governance at scale (e.g., security or compliance rules)
* Group subscriptions by departments, environments, or teams
* Enforce policies top-down

---

## 3️⃣ **Subscriptions**

A subscription is a billing boundary and a container for resources.

### A subscription defines:

* Costs & invoices
* Spending limits
* Access management
* Quotas (e.g., number of cores)

Organizations may use multiple subscriptions:

* Separate dev/test/prod
* Isolate business units
* Achieve compliance separation

---

## 4️⃣ **Resource Groups (RGs)**

A Resource Group is a **logical container** that holds resources that share the same lifecycle.

Characteristics:

* Resources must belong to exactly one RG
* Deleting an RG deletes all contained resources
* Useful for grouping related items (e.g., an app + database + network)

Best practice:
➡️ Group resources that share lifecycle, ownership, or purpose.

---

## 5️⃣ **Resources**

These are the actual services you deploy, such as:

* Azure SQL Database
* Virtual Machines
* Storage Accounts
* Key Vault
* App Service

Resources belong to a Resource Group and a subscription, and they are managed through ARM.

---

# 📌 Quick Visual Summary

**Tenant → Management Groups → Subscriptions → Resource Groups → Resources**

This hierarchy helps Azure enforce:

* Security
* Governance
* Billing
* Scalability
* Organization

---


---

# 🖥️ Section 3 — Subscription & Account Basics

A strong foundation in Azure identity, access, and subscription governance ensures that everything you deploy is secure, organized, and cost-efficient. This section covers how accounts, roles, and subscriptions work together within Azure.

---

## 🔐 Azure AD vs Microsoft Entra ID

* **Azure Active Directory (Azure AD)** was the identity and access management service used across Microsoft cloud.
* It is now rebranded as **Microsoft Entra ID**, but the core functionality remains the same.
* Entra ID handles authentication and authorization for:

  * Users
  * Groups
  * Applications
  * Service principals & managed identities
* It is the **identity backbone** for Azure and many Microsoft services.

### 🔑 What Entra ID Provides

* **Single Sign-On (SSO)**
* **MFA (Multi-Factor Authentication)**
* **Conditional Access**
* **Role assignment and access control**
* **Identity protection & governance**

---

## 👤 Accounts, Roles, and Tenants

### 🏢 **Tenant**

* A **tenant** represents an **organization** in Microsoft Entra ID.
* Each tenant is a dedicated instance that holds:

  * Users
  * Groups
  * Policies
  * Applications

### 👥 **Accounts**

* An **account** refers to the identity (user or service) used to log in to Azure.
* Accounts belong to a **tenant** and can access **subscriptions** as long as they have assigned roles.

### 🧑‍💼 **Roles**

Roles determine **what you can do** in Azure.

Two systems handle permissions:

1. **Azure RBAC (Resource-based)** — controls access to Azure resources.
2. **Entra ID roles (Identity-based)** — control identity management tasks.

---

## 🔒 RBAC (Role-Based Access Control)

RBAC decides **who can perform which actions** on Azure resources.

### 🌟 Core Built-in Roles

| Role            | What It Means                                           |
| --------------- | ------------------------------------------------------- |
| **Reader**      | Can view resources only; *no changes allowed*.          |
| **Contributor** | Can create and modify resources; *cannot assign roles*. |
| **Owner**       | Full control of resources, including IAM permissions.   |

### 🔧 Custom Roles

You can create custom roles for more granular access (e.g., “Can restart VMs but cannot delete”).

---

## 💰 Cost Management Basics

Understanding your cost structure early prevents shocks later.

### Key Concepts

* **Cost Analysis**: Visualizes spending over time.
* **Budgets**: Alerts when spending reaches thresholds.
* **Cost allocation** using **tags** and **resource groups**.
* **Pricing tiers** for services (Basic, Standard, Premium).
* **Reserved instances** and **Savings Plans** for long-term cost reductions.

---

## 🛡️ Subscription Governance

### Why Governance Matters

It helps ensure:

* Compliance
* Cost control
* Security
* Organized resource hierarchy

### Governance Components

* **Management Groups**: Group subscriptions for centralized policies.
* **Azure Policy**: Enforce standards (e.g., allowed locations, VM sizes).
* **Blueprints** (retired but replaced via templates): Deploy standard patterns repeatedly.
* **Resource Locks**: Prevent accidental deletion.

---

## 🏷️ Naming Conventions & Tagging Strategy

### 🪪 Naming Conventions

Consistent naming helps with:

* Identification
* Automation
* Organization
* Lower operational confusion

*A good name contains:*

```
<resource-type>-<workload>-<env>-<region>
```

Example:
`sql-myapp-prod-eastus`

### 🏷️ Tagging Strategy

Tags = metadata assigned to resources.
Useful for:

* Cost tracking (`costCenter=Finance`)
* Ownership (`owner=TeamA`)
* Environment (`env=Dev`)
* Compliance (`dataClass=Confidential`)

---



---

# 🧭 Section 4 — Azure Portal Fundamentals

The **Azure Portal** is the primary web-based interface for managing, deploying, and monitoring Azure resources. It provides a powerful, user-friendly way to work with everything in your cloud environment—without needing command-line tools.

---

## 🖥️ Navigating the Azure Portal

### 🏠 Home Page

When you log into the Azure Portal, you land on the **Home** or **Dashboard** screen. This page includes:

* Shortcuts to commonly used services (VMs, SQL DB, Storage)
* Recently accessed resources
* Quick links to documentation, cost management, help, and support

### 🔍 Global Search Bar

The **search bar at the top** is your best friend.
You can search for:

* Resources
* Resource groups
* Services
* Marketplace items
* Settings

It’s the fastest way to navigate large environments.

### 📚 Sidebar Menu

On the left, you’ll find:

* **All services** — full list of Azure services
* **Resource groups** — groupings of related resources
* **Dashboard** — customizable workspace
* **Subscriptions**, **Cost Management**, **Azure Active Directory**, etc.

You can **pin services** you use frequently for quicker access.

---

## 📊 Working with Dashboards

Dashboards help you create a **personalized workspace** to view important information at a glance.

### ✨ Dashboard Features

* Drag-and-drop tiles (resources, charts, metrics)
* Multiple dashboards (e.g., “Prod Monitoring”, “Dev Workbench”)
* Share dashboards with your team
* Add tiles for:

  * Metrics charts
  * Logs
  * Cost summary
  * Resource lists
  * Quick actions (Create VM, Create DB)

Dashboards are great for **high-level monitoring** without opening each resource individually.

---

## 📂 Resource Browsing, Search & Filters

### 🔎 Browsing Resources

There are two primary ways:

1. **By Resource Type** (e.g., Virtual Machines → MyVM01)
2. **By Resource Group** (e.g., `rg-app-prod` → contains app-related resources)

### 🧹 Filter & Sort

Azure provides powerful filtering based on:

* Subscription
* Location
* Resource type
* Tags
* Name
* Status (Running, Stopped, Failed)

Filtering is extremely helpful in large environments with hundreds of resources.

---

## 📈 Viewing Metrics, Logs & Activity

Every resource in Azure includes observability features:

### 📊 Metrics

* Display performance and usage data (CPU, DTU, IOPS, latency, etc.)
* View real-time or historical charts
* Export metrics to dashboards
* Set up **alerts** when thresholds are exceeded

### 📝 Logs (Azure Monitor / Log Analytics)

Logs provide deeper insights:

* Security logs
* Application logs
* Diagnostic logs
* Audit logs

Logs can be queried using **Kusto Query Language (KQL)**.

### 📜 Activity Log

Tracks all **control-plane operations** in your subscription:

* Who created or deleted resources
* Who changed configurations
* Whether deployments succeeded or failed

It’s essential for **audit**, **governance**, and **troubleshooting**.

---

## 🖥️ Using Cloud Shell

**Azure Cloud Shell** is an integrated command-line environment available directly in the Portal.

### 🚀 Features

* Runs in the browser—no installation required
* Supports **Bash** and **PowerShell**
* Comes with pre-installed Azure CLI, Azure PowerShell modules, Git, Terraform, kubectl, etc.
* Automatically mounts a storage account for persistence

### 💡 When to Use Cloud Shell

* Quickly running Azure CLI/PowerShell commands
* Managing resources through scripts
* Using Git inside Azure
* Running small automations without local tools

It’s perfect for learners who want to try CLI commands without configuring their machine.

---



---

# ⌨️ Section 5 — Azure CLI & PowerShell Basics

Azure provides two major command-line tools to automate, script, and manage cloud resources:
**Azure CLI** and **Azure PowerShell (Az Module)**.
Both achieve similar tasks but cater to different scripting preferences.

---

## 🟦 What is Azure CLI?

**Azure CLI** is a **cross-platform**, command-line tool designed for developers and administrators who prefer **Bash-style**, command-based syntax.

### ✨ Key Features

* Works on **Windows, macOS, and Linux**
* Supported in **Azure Cloud Shell**
* Uses **simple, concise commands** (`az group create`, `az vm start`)
* Great for automation and shell scripting

### 🧪 Example

```bash
az group list
```

Lists all resource groups in your subscription.

---

## 🟪 What is Azure PowerShell (Az Module)?

The **Az PowerShell Module** is a set of PowerShell cmdlets for Azure management.

### ✨ Key Features

* Best for **Windows admins** familiar with PowerShell
* Verb–noun command structure (`Get-AzVM`, `New-AzResourceGroup`)
* Excellent support for automation scripts
* Fully integrated into **Cloud Shell**

### 🧪 Example

```powershell
Get-AzResourceGroup
```

Retrieves all resource groups.

---

## 🔐 Login, Set Context, Switch Subscriptions

### 🔑 Login (CLI)

```bash
az login
```

### 🔑 Login (PowerShell)

```powershell
Connect-AzAccount
```

### 🗂️ View Subscriptions

```bash
az account list -o table
```

```powershell
Get-AzSubscription
```

### 🔄 Switch Subscription

```bash
az account set --subscription "<subscription-id>"
```

```powershell
Set-AzContext -Subscription "<subscription-id>"
```

Setting context ensures commands run under the correct subscription.

---

## ⚙️ Create / View / Delete Resources

### ▶️ Create a Resource (Example: resource group)

**CLI:**

```bash
az group create --name rg-demo --location eastus
```

**PowerShell:**

```powershell
New-AzResourceGroup -Name rg-demo -Location eastus
```

---

### 👁️ View Resources

**CLI:**

```bash
az resource list
```

**PowerShell:**

```powershell
Get-AzResource
```

---

### ❌ Delete Resources

**CLI:**

```bash
az group delete --name rg-demo --yes
```

**PowerShell:**

```powershell
Remove-AzResourceGroup -Name rg-demo -Force
```

---

## 📁 Working with Resource Groups

### Create

```bash
az group create --name rg-app --location westus
```

```powershell
New-AzResourceGroup -Name rg-app -Location westus
```

### List

```bash
az group list -o table
```

```powershell
Get-AzResourceGroup
```

---

## ☁️ Working with Storage Accounts

### Create Storage Account

```bash
az storage account create \
  --name mystorage123 \
  --resource-group rg-app \
  --location eastus \
  --sku Standard_LRS
```

```powershell
New-AzStorageAccount `
  -Name mystorage123 `
  -ResourceGroupName rg-app `
  -Location eastus `
  -SkuName Standard_LRS
```

### List Storage Accounts

```bash
az storage account list -o table
```

```powershell
Get-AzStorageAccount
```

---

## 🌐 Working with Virtual Networks

### Create a VNet

**CLI:**

```bash
az network vnet create \
  --name vnet-app \
  --resource-group rg-app \
  --address-prefix 10.0.0.0/16
```

**PowerShell:**

```powershell
New-AzVirtualNetwork `
  -Name vnet-app `
  -ResourceGroupName rg-app `
  -Location eastus `
  -AddressPrefix 10.0.0.0/16
```

### View VNets

```bash
az network vnet list -o table
```

```powershell
Get-AzVirtualNetwork
```

---

## 💠 Working with Azure SQL Server (Basic Overview)

Not deep configuration—just essentials.

### Create SQL Server (logical server)

**CLI:**

```bash
az sql server create \
  --name my-sql-server \
  --resource-group rg-app \
  --location eastus \
  --admin-user adminuser \
  --admin-password MyP@ssword123
```

**PowerShell:**

```powershell
New-AzSqlServer `
  -ServerName my-sql-server `
  -ResourceGroupName rg-app `
  -Location eastus `
  -SqlAdministratorCredentials (Get-Credential)
```

### List SQL Servers

```bash
az sql server list -o table
```

```powershell
Get-AzSqlServer
```

### Delete SQL Server

```bash
az sql server delete --name my-sql-server --resource-group rg-app
```

```powershell
Remove-AzSqlServer -ServerName my-sql-server -ResourceGroupName rg-app
```

---


---

# 🔗 Section 6 — Azure Networking Fundamentals (Light Introduction)

Azure networking determines **how resources communicate** securely—both within Azure and with on-premises systems. This section gives a gentle introduction to the basic building blocks without deep networking complexity.

---

## 🌐 Virtual Networks (VNet) Concept

A **Virtual Network (VNet)** is the fundamental building block of Azure networking.
Think of it as your **private network** in the cloud—similar to a corporate LAN.

### 🧩 What VNets Provide

* Private IP space for your Azure resources
* Network segmentation (subnets)
* Secure communication between resources
* Connectivity to on-premises (VPN/ExpressRoute)
* Control over traffic using NSGs (firewalls for subnets/VMs)

### 💡 Resources that live inside VNets

* Virtual Machines
* Application Gateways
* Kubernetes clusters (AKS)
* Virtual Appliances
* Private Endpoints for PaaS services

---

## 🧱 Subnets & Private Endpoints

### 📦 Subnets

A **subnet** is a logical partition inside a VNet.
You break your VNet into subnets to organize and isolate workloads.

Example:

* `subnet-web`
* `subnet-app`
* `subnet-db`

### 🔒 Private Endpoints

A **Private Endpoint** lets you connect to PaaS services over a **private IP** inside your VNet.
This is critical for security—no public internet path is used.

Used commonly by:

* Azure SQL Database
* Storage accounts
* Key Vault
* Web apps (Private Link)

**Private Link = Secure PaaS access inside your VNet.**

---

## 🔢 IP Addressing Basics

Azure VNets use **RFC 1918 private IP ranges**, such as:

* `10.0.0.0/8`
* `172.16.0.0/12`
* `192.168.0.0/16`

Key concepts:

* **CIDR notation**: `/24`, `/16`, etc.
* **Address space**: Range assigned to your VNet
* **Subnet prefix**: Range assigned to each subnet

Example:

* VNet: `10.0.0.0/16`
* Subnet1: `10.0.1.0/24`
* Subnet2: `10.0.2.0/24`

Azure automatically allocates the first 5 IPs in every subnet for system usage.

---

## 🌐 Azure DNS Basics

**Azure DNS** hosts your DNS zones in Azure so your resources can resolve domain names without external DNS servers.

### 🔍 What Azure DNS provides

* Hosting public DNS zones
* Hosting private DNS zones
* Automatic name resolution inside VNets
* Integration with Private Endpoints

  * Creates a DNS entry that maps PaaS service to a private IP

Example:
A private endpoint for Azure SQL might create DNS record:

```
myserver.privatelink.database.windows.net → 10.0.2.5
```

---

## 🏗️ How Azure SQL DB Connects to VNets (PaaS Networking Overview)

Azure SQL is a **PaaS** service, so it does not live *inside* a VNet by default.
However, you can securely connect it to your VNet using:

### 🔒 Option 1: Private Endpoints (recommended)

* SQL server gets a private IP in your VNet
* No public internet exposure
* Works with NSGs, firewalls, routing
* Uses Azure Private DNS zones

### 🌍 Option 2: Service Endpoints (older option)

* Keeps SQL as public but limits access to specific VNets
* Less secure than Private Link
* Still supported, but not preferred anymore

### 🚫 Without VNet Integration

In default configuration:

* SQL DB is reachable publicly
* Protected by firewalls + authentication
* Can restrict to certain IP ranges

---

## 📝 Summary (Quick Takeaway)

| Concept                       | Meaning                                              |
| ----------------------------- | ---------------------------------------------------- |
| **VNet**                      | Your private cloud network                           |
| **Subnets**                   | Logical segments inside VNets                        |
| **Private Endpoints**         | Secure private IP access to PaaS services            |
| **IP Addressing**             | CIDR-based private ranges                            |
| **Azure DNS**                 | Resolves names for Azure resources                   |
| **Azure SQL PaaS Networking** | Connected via Private Endpoint, not natively in VNet |

---


---

# 🔍 Section 7 — Introduction to Azure SQL Ecosystem

Azure offers multiple ways to run SQL Server in the cloud—ranging from fully managed PaaS databases to complete control with IaaS VMs. Understanding these options helps you choose the right model for performance, cost, and compatibility needs.

---

## 🟦 What is Azure SQL Database (PaaS)?

**Azure SQL Database** is Microsoft’s flagship **fully managed PaaS offering** for relational databases.

### ✨ Key Features

* Microsoft handles **backups, patching, updates, HA, failover**
* Built-in **scaling**, **intelligent tuning**, and **security features**
* Ideal for **modern, cloud-first applications**
* No OS management, no SQL Server installation

### 🔧 Best For

* New cloud applications
* Microservices
* Serverless workloads
* Dev/Test environments
* Applications that don’t require SQL Server instance-level features

---

## 🟩 Azure SQL Managed Instance (PaaS with compatibility)

**Azure SQL Managed Instance (MI)** bridges the gap between full PaaS and traditional SQL Server.
It provides **almost full SQL Server instance compatibility**, but still remains a **managed service**.

### ✨ Key Features

* Supports **SQL Agent**, cross-database queries, linked servers, CLR, Service Broker
* Highly compatible with **on-prem SQL Server**
* Fully managed backups/patching like SQL DB
* Virtual network integration by default

### 🔧 Best For

* Lift-and-shift migrations
* Applications dependent on instance-level features
* Large databases
* Environments requiring VNet isolation

---

## 🟥 SQL Server on Azure Virtual Machines (IaaS)

This option installs **full SQL Server** on a **Windows or Linux VM** you control entirely.

### ✨ Key Features

* Full administrative control (OS + SQL Server)
* You handle:

  * Patches
  * Backups
  * HA/DR architecture
* Supports **every SQL Server feature**

### 🔧 Best For

* Legacy applications requiring full control
* Custom HA/DR architectures
* Non-standard SQL Server configurations
* Apps requiring features unavailable in PaaS

---

## 🔄 Deployment Comparisons & Use-Cases

| Feature              | Azure SQL DB         | SQL Managed Instance                | SQL on VM             |
| -------------------- | -------------------- | ----------------------------------- | --------------------- |
| **Service Type**     | Fully managed PaaS   | Managed PaaS with instance features | IaaS                  |
| **Admin Control**    | Low                  | Medium                              | High                  |
| **Compatibility**    | Moderate             | Very high                           | Full                  |
| **Best For**         | Modern apps          | Lift-and-shift                      | Legacy/custom systems |
| **VNet Integration** | Via Private Endpoint | Native                              | Native                |
| **Maintenance**      | Microsoft-managed    | Microsoft-managed                   | Customer-managed      |

---

## 💰 Azure SQL Pricing Models

Azure SQL offers flexible pricing depending on performance needs.

---

### 🔵 DTU Model (Basic / Standard / Premium)

* DTU = Database Transaction Unit (CPU + memory + IO bundled)
* Simpler but less transparent
* Suitable for small to medium workloads

---

### 🟣 vCore Model (General Purpose / Business Critical)

* Compute measured in **virtual cores (vCores)**
* Storage & compute billed separately
* Easier to compare with on-prem SQL licenses
* Supports:

  * **Serverless compute** (auto-scale)
  * **Hyperscale** (massively scalable storage)

---

### ⚡ Hyperscale Overview

Hyperscale is a specialized architecture designed for very large and very fast workloads.

Key capabilities:

* Up to **100 TB** storage
* Rapid backup & restore
* Instant scaling
* Multiple read replicas

Best for:

* Large OLTP systems
* High-throughput applications
* Analytics-heavy workloads

---

## 🛡️ Basic Security Posture

Every Azure SQL deployment begins with a few core security layers:

---

### 🔥 Firewalls

Control who can connect:

* Server-level firewall rules
* Database-level firewall rules
* IP allowlists
* VNet integration via **Private Endpoint**
* Public network access toggle

---

### 👤 Authentication Basics

Azure SQL supports:

#### 1️⃣ **SQL Authentication**

* Username + password
* Works everywhere
* Should be secured with strong passwords + auditing

#### 2️⃣ **Azure AD Authentication** (recommended)

* Managed identity-based access
* Enforces MFA/Conditional Access
* Centralized identity management

---

### 🔒 Encryption

* **TDE (Transparent Data Encryption)** → enabled by default
* **TLS** for data in transit
* **Always Encrypted** (optional) for sensitive columns

---

## 📝 Summary (Quick Takeaway)

| Concept                | Meaning                                     |
| ---------------------- | ------------------------------------------- |
| **Azure SQL Database** | Fully managed cloud database (PaaS)         |
| **Managed Instance**   | PaaS + near-full SQL Server compatibility   |
| **SQL on VM**          | Full control, but you manage everything     |
| **DTU/vCore**          | Two pricing models for workload flexibility |
| **Hyperscale**         | Massive, fast, cloud-native storage engine  |
| **Security**           | Firewalls, AAD auth, encryption             |

---



---

# 📘 Section 8 — Foundational Terminology  

This section builds essential vocabulary you'll repeatedly encounter when working with Azure and Azure SQL. Understanding these terms early helps you grasp architecture, deployment, security, and governance concepts throughout your Azure journey.

---

## 📦 Resource Group (RG)

A **Resource Group** is a **logical container** that holds related Azure resources.

### 🧩 Purpose  
- Organize resources (VMs, VNets, SQL DBs, storage, etc.)  
- Apply **RBAC**, **policies**, and **tags**  
- Deploy, manage, and delete resources as a unit  
- Simplify automation templates (ARM/Bicep)

### 💡 Example  
`rg-app-prod` might contain:
- SQL database  
- App Service  
- Storage Account  
- VNet for the app  

Deleting the RG deletes *everything inside it*.

---

## 🏗️ ARM Template / Bicep (Overview Only)

Azure provides **Infrastructure-as-Code (IaC)** options for deploying resources consistently and repeatedly.

### 🧱 ARM Templates  
- JSON-based declarative deployment files  
- Define resources, properties, relationships  
- Used by automation pipelines and Azure Portal deployments  

### 🪄 Bicep (modern, recommended)  
- A simpler, cleaner language that **compiles into ARM templates**  
- Easier to write and maintain  
- Supports modularity and reusable components  

**Think:**  
ARM = machine-friendly  
Bicep = human-friendly

Both let you deploy:
- Resource groups  
- Networks  
- Databases  
- Full architectures

---

## 🖥️ Logical SQL Server vs SQL Database

### 🟦 SQL Database (actual database)
- A **single database** hosted on Azure SQL platform  
- Has its own compute & storage  
- Lives under a logical server  

### 🟩 Logical SQL Server  
Despite its name, it is **not a real SQL Server instance**.  
It is a *management container* for databases.

It provides:
- Firewall rules  
- Authentication settings  
- Auditing and security configs  
- Endpoint for connections  
- Logical organization of multiple SQL DBs  

### 📌 Important  
You do **not** install or manage a real SQL Server engine here.  
Azure manages all the compute and SQL internals for you.

---

## 🛡️ Azure Policy

**Azure Policy** enforces governance rules across your subscriptions or resource groups.

### Examples of what Azure Policy can control:
- Allowed VM sizes  
- Allowed regions  
- Enforce tagging standards  
- Require TLS version  
- Restrict public network access  
- Enforce private endpoints  

### Why it matters  
Helps maintain:
- Compliance  
- Security  
- Cost governance  
- Organizational standards  

Policies are evaluated continuously and can **deny**, **audit**, or **remediate** resources.

---

## 🔢 Service Levels (Basic, Standard, Premium, Business Critical)

Azure SQL pricing tiers determine performance, redundancy, and features.

### 🟦 Basic  
- Entry-level  
- Small workloads  
- Minimal performance needs  

### 🟨 Standard  
- General-purpose workloads  
- Balanced compute + storage  
- Most business apps fit here  

### 🟪 Premium  
- High performance  
- Low latency  
- Heavy transactional workloads  

### 🔴 Business Critical (vCore equivalent of Premium)  
- Highest performance & lowest latency  
- Built on **Always On** architecture  
- Multiple replicas  
- Best for mission-critical apps  

Service levels vary slightly between **DTU** and **vCore** models, but the concepts remain similar.

---

## 📉 SLA, RPO, RTO (for Backup & HA Modules)

These are key reliability and disaster recovery terms used in cloud architecture.

---

### 🟢 SLA — Service Level Agreement  
Guarantee from Azure about **uptime**.

Examples:  
- SQL DB Business Critical: **99.995%**  
- SQL DB General Purpose: **99.99%**

Higher SLA → better availability → higher cost.

---

### 🟡 RPO — Recovery Point Objective  
**How much data you can afford to lose** during a failure.

Example:  
RPO = 5 minutes  
→ backups/log shipping ensure no more than 5 minutes of data loss.

---

### 🔴 RTO — Recovery Time Objective  
**How long it should take to restore service** after a failure.

Example:  
RTO = 30 minutes  
→ system must be operational within 30 minutes of outage.

---

## 📝 Quick Summary Table

| Term | Meaning |
|------|---------|
| **Resource Group** | Container for organizing and managing resources |
| **ARM Template/Bicep** | IaC for automated deployments |
| **Logical SQL Server** | Management layer for Azure SQL DB |
| **Azure SQL Database** | Actual cloud database service |
| **Azure Policy** | Enforces rules for governance & compliance |
| **Service Levels** | Different performance tiers |
| **SLA** | Guaranteed uptime |
| **RPO/RTO** | Data-loss tolerance & recovery time targets |

---

