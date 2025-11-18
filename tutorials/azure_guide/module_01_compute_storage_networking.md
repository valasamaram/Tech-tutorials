
# 🚀 Module 1 — Core Compute, Storage & Networking (3–4 Weeks)

### 🎯 **Module Goals**

By the end of this module, you will confidently understand and work with:

* **Compute** → VMs, VM Scale Sets, App Service
* **Storage** → Blob, File, Table, Queue, Managed Disks
* **Networking** → VNets, Subnets, NSGs, UDRs

This is the foundation for every cloud architecture, including databases, applications, API gateways, and DevOps automation.

---

# 🧩 **Section 1 — Compute Services**

## 💠 1.1 Virtual Machines (VMs)

Azure VMs provide **IaaS (Infrastructure as a Service)** — full control over OS, applications, and configuration.

### Key Concepts:

* VM Sizes (General Purpose, Compute Optimized, Memory Optimized)
* OS Images (Windows/Linux)
* VM Availability (Availability Sets, Availability Zones)
* VM Agents & Extensions
* Boot diagnostics, serial console

### When to use:

* Full control required
* Custom software
* Legacy applications
* Database servers (SQL, Oracle), except when using managed PaaS

---

## 💠 1.2 VM Scale Sets (VMSS)

VMSS automatically scale VM instances based on CPU, memory, or custom metrics.

### Features:

* Auto-scale (out/in)
* Integrated load balancing
* Supports uniform or flexible orchestration
* Ideal for stateless workloads

### Perfect for:

* Web APIs
* Microservices
* High-load batch processing
* Auto-scaling compute clusters

---

## 💠 1.3 App Service (PaaS)

Azure App Service is a **managed platform** to run web apps, REST APIs, and background jobs.

### Highlights:

* Supports .NET, Node.js, Java, Python, PHP
* Autoscaling
* Deployment slots
* Managed identity
* Zero-maintenance (Microsoft handles patching, scaling, OS)

### When to use:

* Web apps without needing to manage servers
* Scalable APIs
* Enterprise applications
* CI/CD with GitHub Actions or Azure DevOps

---

# 🗄️ **Section 2 — Storage Services**

Azure Storage is massively scalable, highly durable, and cheap.

## 💠 2.1 Storage Accounts

A Storage Account is a **container** for Azure Storage services.

It includes:

* Blob Storage
* File Shares
* Table Storage
* Queue Storage
* (Plus ADLS Gen2 capabilities)

---

## 💠 2.2 Blob Storage

Object storage for **unstructured data**.

### Use cases:

* Images, videos, documents
* Backups
* Logs
* Big data (Data Lake with hierarchical namespace)

### Tiers:

* Hot
* Cool
* Archive

---

## 💠 2.3 File Storage (Azure Files)

Fully managed file shares accessible via SMB or NFS.

### Perfect for:

* Lift-and-shift workloads needing file shares
* Shared folders for apps
* Replacing on-premises file servers

---

## 💠 2.4 Table Storage

NoSQL key–value store.

### Features:

* Schema-less
* Cheap
* Very fast read/write

### Ideal for:

* Metadata
* User profiles
* Inventory
* Lightweight NoSQL storage

---

## 💠 2.5 Queue Storage

A simple reliable messaging service.

### Used for:

* Decoupling microservices
* Background processing
* Async workflow pipelines (e.g., image processing)

---

## 💠 2.6 Managed Disks

Block-level storage used by Azure VMs.

Types:

* Standard HDD
* Standard SSD
* Premium SSD
* Ultra Disk (extreme performance)

Features:

* Snapshots
* Disk encryption
* Zone redundancy

---

# 🌐 **Section 3 — Networking Fundamentals**

## 💠 3.1 Virtual Network (vNet)

A vNet is the private network space for your Azure resources.

### Similar to:

Your own private LAN in the cloud.

### Concepts:

* IP address ranges
* Peering
* Private endpoints
* Service endpoints

---

## 💠 3.2 Subnets

A vNet must be divided into subnets based on functionality.

Examples:

* `subnet-app`
* `subnet-db`
* `subnet-gateway`

Each subnet can have its own NSGs and route tables.

---

## 💠 3.3 Network Security Group (NSG)

NSG controls **inbound and outbound traffic**.

Contains:

* Allow/Deny rules
* Priority-based processing
* Supports ports, IP ranges, protocols

Example:

* Allow 443
* Deny all inbound internet

---

## 💠 3.4 User Defined Routes (UDR)

Custom routing used when you want to control packet flow.

Examples:

* Sending traffic through a firewall (NVA)
* Forcing all outbound traffic to a central appliance
* Routing between subnets for security isolation

---

# 🔥 Summary Table

| Category       | Services                                | Purpose                                 |
| -------------- | --------------------------------------- | --------------------------------------- |
| **Compute**    | VM, VMSS, App Service                   | Host apps, scale workloads              |
| **Storage**    | Blob, File, Table, Queue, Managed Disks | Store data for apps, backups, analytics |
| **Networking** | vNet, Subnets, NSG, UDR                 | Connectivity, security, routing         |

---


---

# 🚀 **Azure Virtual Machines — Complete Detailed Explanation (Beginner → Expert)**

Azure Virtual Machines (VMs) are a core building block of Azure’s **Infrastructure-as-a-Service (IaaS)** compute platform. They allow you to run Windows and Linux servers in Azure’s global datacenters with full control of the OS, applications, configuration, and security.

This document explains **EVERYTHING** you need to know about Azure VMs.

---

# 🔵 1. **Azure VM Fundamentals**

## 🟣 1.1 What is an Azure VM?

An Azure VM is a **virtualized computer** running on Microsoft's cloud hypervisor. Azure handles:

* Physical hardware
* Datacenter networking
* Power/cooling
* Rack redundancy
* Hypervisors
* Physical disk infrastructure

You manage:

* Operating System
* Software and updates
* Security configuration
* Application stack
* Inside-VM networking

This is similar to managing an on-prem server, except the infrastructure is abstracted away.

---

# 🔵 2. **Azure VM Architecture (Internal Components)**

An Azure VM is NOT a single object — it's a combination of multiple dependent resources:

| Component                       | Purpose                               |
| ------------------------------- | ------------------------------------- |
| **VM compute resource**         | Defines vCPU/RAM                      |
| **OS Disk (Managed Disk)**      | Boot disk (Premium/Standard/Ultra)    |
| **Data Disks**                  | Application/database data             |
| **Temporary Disk**              | Fast local SSD storage for temp files |
| **NIC (Network Interface)**     | Network identity                      |
| **Public IP (optional)**        | Exposes RDP/SSH/HTTP if needed        |
| **VNet + Subnet**               | Network boundary                      |
| **NSG**                         | L4 firewall rules                     |
| **Availability Set / Zone**     | High availability                     |
| **Extensions**                  | Agents, scripts, monitoring           |
| **Tags**                        | Metadata for cost/governance          |
| **Identity (Managed Identity)** | Secure access to Azure resources      |

All these parts form a complete VM.

---

# 🔵 3. **VM Size Families (vCPU/RAM Performance Profiles)**

Azure organizes VMs by **family**, optimized for specific workloads.

## 3.1 General Purpose (Balanced)

* Series: **B, Dv2, Dv3, Dv4, Dv5**
* Balanced CPU:RAM ratio
* Best for: Web servers, app servers, domain controllers, dev/test

## 3.2 Compute Optimized (High CPU)

* Series: **F-series**
* High CPU per memory
* Best for: High-performance compute, batch workloads

## 3.3 Memory Optimized (High RAM)

* Series: **E-series, M-series**
* High RAM per CPU
* Best for: Relational databases, SAP HANA, cache layers

## 3.4 Storage Optimized

* Series: **Lsv2**
* High throughput, NVMe
* Best for: NoSQL, Big Data, analytics

## 3.5 GPU Optimized

* Series: **NC, ND, NV**
* Best for: AI/ML training, deep learning, graphics rendering

## 3.6 Confidential Computing

* Series: **DC-series**
* Supports Intel SGX-based secure enclaves

---

# 🔵 4. **OS Images (How Azure Builds a VM)**

Azure VMs can be created from:

### ✔ Marketplace Images

Pre-built OS images:

* Windows Server 2016/2019/2022
* Ubuntu, RHEL, SUSE
* Oracle Linux, Debian

### ✔ Custom Images (Shared Image Gallery)

Your custom VM images.

### ✔ Specialized Images

Captured exactly as-is (with machine identity).

### ✔ Generalized Images

Captured after **sysprep** (Windows) or **waagent/deprovision** (Linux).

### ✔ Community Images

Shared by publishers.

---

# 🔵 5. **Azure VM Storage — Deep Dive**

Every VM depends heavily on Managed Disks:

## 5.1 Disk Types (Performance Tiers)

| Disk Type          | Use Case             | IOPS      | Notes                  |
| ------------------ | -------------------- | --------- | ---------------------- |
| **Standard HDD**   | Backup/dev           | Low       | Cheapest               |
| **Standard SSD**   | Web servers          | Medium    | Good reliability       |
| **Premium SSD**    | Production           | High      | Required for many SLAs |
| **Premium SSD v2** | Enterprise           | Very High | Configurable IOPS/MBps |
| **Ultra Disk**     | Mission-critical DBs | Extreme   | Highest IOPS           |

## 5.2 Shared Disk Support

Used for:

* Clustered applications
* SQL Always On FCI
* Windows Failover Cluster

## 5.3 Encryption Types

### Server-Side Encryption (SSE)

* Default, platform-managed keys (PMK)

### Customer-Managed Keys (CMK)

* Stored in Azure Key Vault
* Full customer-owned encryption

### Host-based Encryption

Encrypts data between VM host and disk.

### Azure Disk Encryption (ADE)

Uses BitLocker (Windows) / DM-Crypt (Linux).

---

# 🔵 6. **Networking — VM Connectivity Internals**

## 6.1 Virtual Network (VNet)

A logical isolated network in Azure.

## 6.2 Subnet

Subnet = IP range, NSG, UDR boundary.

## 6.3 NIC (Network Interface Card)

NIC contains:

* Private IP (Static/Dynamic)
* Public IP association
* Accelerated Networking (SR-IOV)
* NSG association

## 6.4 Public IP (IPv4/IPv6)

Properties:

* Static or dynamic
* Basic or Standard SKU
* DNS label (optional)
* Idle timeout

## 6.5 NSG (Network Security Group)

Layer-4 firewall rules:

* Source/destination
* Ports
* Protocols
* Priority
* Allow/Deny

## 6.6 Inbound Connectivity Options

### Option 1: Public IP (least secure)

RDP/SSH exposed to world.

### Option 2: JIT (Just-in-Time Access)

Opens ports only when needed.

### Option 3: Azure Bastion (best practice)

Browser-based RDP/SSH via Azure Portal.

---

# 🔵 7. **VM Identity & Access Management**

## 7.1 Managed Identity

Allows VM to access:

* Key Vault
* Storage
* SQL
* Event Hub
* Azure Resource Manager

Without credentials stored in code.

## 7.2 RBAC

Controls who can:

* Start/stop VM
* Reset password
* Read disk
* Modify NIC
* Delete VM

## 7.3 Password and SSH Keys

Linux best practice:

* Disable password login
* Use SSH keys only

---

# 🔵 8. **Availability & Resiliency**

## 8.1 Availability Sets (older method)

Protects against:

* Rack failure
* Host failure
* Update domains restarts

Provides **99.95% SLA**.

## 8.2 Availability Zones (current standard)

VMs placed in **physically separate datacenters**.
Provides **99.99% SLA**.

## 8.3 Proximity Placement Groups (PPG)

Used for:

* Ultra-low latency apps
* Multi-tier architectures

Ensures VMs are near each other physically.

---

# 🔵 9. **VM Scale Sets (VMSS)**

VMSS is a **fleet of auto-scaling VMs**.

Features:

* Autoscaling (CPU, Memory, Schedule, Queue depth)
* Spot instances support
* Rolling upgrades
* Automatic OS updates
* Integration with Load Balancer/App Gateway

---

# 🔵 10. **Monitoring & Diagnostics (Deep Level)**

Azure provides **multiple layers** of monitoring for VMs.

## 10.1 Guest OS Monitoring

* CPU, memory, disk I/O
* Requires Azure Monitor Agent / Log Analytics agent

## 10.2 Host Monitoring

You see:

* VM uptime
* CPU credits (B-series)
* Boot diagnostics

## 10.3 Metrics

* Available in Azure Monitor
* Can create alerts and dashboards

## 10.4 Logs

* Activity Logs (control plane)
* Diagnostic Logs (guest OS)
* Security Logs (if enabled)

## 10.5 Boot Diagnostics

Shows:

* Boot sequence logs
* Screenshot of boot screen

Used for troubleshooting broken OS boots.

---

# 🔵 11. **Automation Options**

## 11.1 Azure Automation Update Management

Patches Windows & Linux automatically.

## 11.2 Custom Script Extension

Runs scripts during:

* Startup
* Deployment
* Post-deployment automation

## 11.3 Desired State Configuration (DSC)

Ensures VM meets configuration standards.

## 11.4 Azure Image Builder

Creates golden images for VM pools.

## 11.5 Autoscaling (VMSS only)

---

# 🔵 12. **Backup & Disaster Recovery**

## 12.1 Backup (Azure Backup)

Supports:

* VM-level snapshots
* File-level restore
* App-consistent backup
* Crash-consistent backup

## 12.2 Disaster Recovery (Azure Site Recovery)

Replicates VMs:

* Across regions
* Across availability zones
* From on-prem to Azure

---

# 🔵 13. **VM Lifecycle Management**

## 13.1 VM States

* Starting
* Running
* Stopped (still billed)
* Stopped (deallocated) — **not billed for compute**
* Deallocating
* Updating
* Provisioning
* Deleting

## 13.2 Billing Behavior

| VM State              | Compute Charges? |
| --------------------- | ---------------- |
| Running               | Yes              |
| Stopped (allocated)   | Yes              |
| Stopped (deallocated) | No               |
| Deleted               | No               |

Disks and IPs are still billed unless removed.

---

# 🔵 14. **Advanced Networking Features**

## 14.1 Accelerated Networking (SR-IOV)

* Direct NIC access to VM
* Lower latency
* High throughput
* Lower CPU overhead

## 14.2 IP Forwarding

Used when VM acts as:

* NAT device
* Firewall
* Router

## 14.3 Load Balancers

* Standard LB for HA
* NAT rules for RDP/SSH
* Health probes

## 14.4 Application Gateway

Layer-7 routing for:

* SSL termination
* WAF protection

---

# 🔵 15. **Special VM Types**

## 15.1 Spot VMs

Up to **90% cheaper**
Can be evicted anytime → for:

* Batch jobs
* Dev/test
* Non-critical workloads

## 15.2 Ephemeral OS Disk

OS disk stored on **local** storage:

* Super fast
* No persistence
* Good for scale sets

## 15.3 Confidential Compute

Encrypts memory to protect data in use.

---

# 🔵 16. **Governance & Enterprise Controls**

## 16.1 Policies

Control:

* VM sizes allowed
* VM locations allowed
* Require tags
* Force encryption

## 16.2 Tags

For:

* Cost management
* Automation
* Governance

Examples:

```
env: production
app: hr-system
owner: finance-team
```

## 16.3 Budgets & Cost Alerts

Prevent accidental overspending.

---

# 🔥 **End-to-End Summary**

Azure VMs allow:

* Full OS control
* Custom software
* High security
* High availability
* High performance
* Advanced automation
* Flexible storage
* Strong governance
* Enterprise-grade DR & Backup

This is why VMs are used for:

* Databases
* Legacy apps
* Windows workloads
* SAP HANA
* Custom enterprise software
* Containers (less common now)
* Lift-and-shift migrations

---


---

# 🏗️ **Azure Virtual Machine Scale Sets (VMSS) — Full Detailed Explanation**

VMSS is one of Azure’s most powerful compute services, designed to run **large-scale, auto-scaling, consistent VM deployments**.

---

# 🌍 1. **What is a VMSS?**

A **Virtual Machine Scale Set (VMSS)** is a service that allows you to deploy, manage, and auto-scale a **group of virtual machines** that are:

✔ Identical (same OS, same configuration)
✔ Automatically scaled in/out
✔ Integrated with load balancing
✔ Built for high availability
✔ Managed as a single resource

VMSS lets you operate **hundreds or thousands of VMs** without managing each VM manually.

---

# 🔧 2. **Core Purpose of VMSS**

Use VMSS when you need:

### ✔ Automatic scaling

* More VMs when traffic increases
* Fewer VMs when traffic decreases

### ✔ Uniformity

All VMs follow the same:

* OS image
* VM size
* Configuration
* Extensions
* Identity

### ✔ High availability and reliability

Distribute instances across:

* Fault domains
* Update domains
* Availability Zones

### ✔ Rapid, large-scale deployments

Deploy 1000s of VMs in minutes.

---

# 🧩 3. **VMSS Architecture Components**

A VMSS consists of:

### **1) VMSS Resource**

The "parent" object controlling:

* Instance template
* Auto-scaling rules
* Upgrade policies
* Identity
* Networking

### **2) Instance Group**

A collection of VM instances:

* vmssname_0
* vmssname_1
* vmssname_2
  ...

### **3) Load Balancer / Application Gateway (optional)**

Used to distribute traffic.

### **4) VM Image Source**

Determines the OS template used by all instances.

### **5) Scaling Engine**

Monitors metrics and adjusts VM count.

---

# 🧱 4. **VMSS Modes — Uniform vs Flexible**

Azure provides **two VMSS operating modes**:

---

## 🟦 **4.1 Uniform Mode (Most Common)**

All VMs:

* Same size
* Same image
* Created via a scale set template

**Used for:**

* Web servers
* API servers
* Stateless applications

Scaling is automatic and predictable.

---

## 🟧 **4.2 Flexible Mode**

Supports:

* Different VM sizes
* Custom configs
* Multiple VM types
* Manual instance control

**Used when you need:**

* Mixed instance types (Spot + On-demand)
* HA across zones
* Custom placement

---

# 📦 5. **VM Images for VMSS**

VMSS supports multiple image sources:

### ✔ Marketplace Images

Windows, Linux distributions (Ubuntu, RHEL, etc.).

### ✔ Custom Image from VHD

Upload your own image.

### ✔ Shared Image Gallery (SIG)

Highly recommended for:

* Versioning
* Replication across regions
* Golden image strategy

### ✔ Ephemeral OS disk (optional)

Fast & cheap, but no persistence.

---

# ⚙️ 6. **Autoscaling in VMSS**

Autoscaling is the **heart of VMSS**.

### Autoscale Trigger Types:

### **1. Metric-based:**

* CPU %
* Memory %
* Network In/Out
* Disk Queue length
* Custom metrics from Log Analytics

Example rule:

* Scale Out: CPU > 70% for 10 minutes
* Scale In: CPU < 30% for 15 minutes

### **2. Schedule-based:**

* Peak hours: scale up
* Nights/weekends: scale down

### **3. Manual scaling**

Override anytime.

### Autoscale Actions:

* Add N instances
* Remove N instances
* Send alerts

---

# 🔄 7. **Scaling Behavior**

### 🟢 Scale Out (Add VMs)

Steps:

1. Image prepared
2. Instance provisioned
3. Extensions installed
4. Health check passed
5. Added to load balancer

### 🔴 Scale In (Remove VMs)

Steps:

1. VM removed from LB
2. Graceful shutdown
3. Deallocation
4. Deletion

---

# 🧮 8. **Instance Distribution & High Availability**

VMSS distributes VMs across:

* **Fault Domains** → physical rack failures
* **Update Domains** → OS/software updates
* **Availability Zones** → separate buildings

In *Uniform mode*, Azure automatically balances instances across FDs and UDs.

---

# 🌐 9. **Networking in VMSS**

VMSS networking is powerful and customizable.

---

## **9.1 NIC Configuration**

Each VM instance gets its own NIC(s):

* Private IP
* Public IP (optional per VM)
* Accelerated networking (optional)
* NSG (NIC-level or subnet-level)

---

## **9.2 Load Balancing Options**

### **Option 1 — Azure Load Balancer (Layer 4)**

Used for:

* Web traffic
* TCP/UDP workloads

LB components:

* Frontend IP
* Backend pool (all VMSS VMs)
* Health probe
* Load-balancing rule

---

### **Option 2 — Application Gateway (Layer 7)**

Used for:

* WAF (Web Application Firewall)
* SSL termination
* URL routing

---

### **Option 3 — No Load Balancer**

Used for:

* Worker roles
* Batch jobs
* Message processing

---

# 🛡️ 10. **Security in VMSS**

### ✔ Identity

* System-assigned Managed Identity
* User-assigned Managed Identity

### ✔ Disk Encryption

* Azure Disk Encryption
* Encryption at host
* SSE at rest

### ✔ Network Security

* NSGs
* Custom routes
* Private endpoints

### ✔ Health Extension

Ensures health monitoring during:

* Scaling
* Rolling upgrades

---

# 🧪 11. **Monitoring & Diagnostics**

### VMSS logs include:

### ✔ Metrics

* CPU %
* Memory (via AMA)
* Network IO

### ✔ Diagnostics

* Boot diagnostics
* Serial console output

### ✔ Logs

* Autoscale events
* Upgrade history
* Instance lifecycle
* Health probe statuses

### ✔ VM Insights

Deep monitoring via Log Analytics.

---

# 🔧 12. **Upgrade Policies (Image Updates)**

VMSS supports automated image upgrades.

Modes:

---

## 🟦 12.1 Manual Upgrade

Admins trigger updates manually.

---

## 🟦 12.2 Automatic Upgrade

VMSS automatically rolls out new image versions.

---

## 🟦 12.3 Rolling Upgrade (Safe Mode)

Upgrades X% instances at a time
Example: 20% per batch

* Removes from LB
* Updates instance
* Re-adds to LB

Ensures zero/low downtime.

---

# 🗂️ 13. **VMSS Extensions**

Extensions run scripts or install agents.

Common extensions:

* Custom Script Extension
* Log Analytics Agent
* Azure Monitor Agent
* Anti-malware agent
* DSC configuration
* Domain Join Extension

Extension execution order can be defined.

---

# ⚙️ 14. **Instance Lifecycle**

A VMSS instance goes through these states:

1. **Creating**
2. **Provisioning**
3. **Running**
4. **Scaling out/in**
5. **Updating**
6. **Reimaging**
7. **Deleting**

---

# 🌟 15. **Advanced VMSS Features**

### ✔ **15.1 Spot instances support**

80–90% cheaper
Auto-evicted → good for:

* Batch jobs
* Non-critical tasks

---

### ✔ **15.2 Proximity Placement Groups (PPG)**

Keep VMs physically close → low latency
Useful for:

* Databases
* HPC
* High-speed trading

---

### ✔ **15.3 Mixed VM sizes**

Only in Flexible Mode.

---

### ✔ **15.4 Termination Notices**

Alerts before Azure evicts a Spot VM.

---

### ✔ **15.5 Custom Autoscaler (KEDA, Functions, Logic Apps)**

Use external triggers (queue length, storage events).

---

# 🏁 **Summary — Why VMSS?**

VMSS is the best solution for:

### ✔ Scalable Web Applications

### ✔ Distributed APIs

### ✔ Worker Nodes

### ✔ Gaming Servers

### ✔ Big compute workloads

### ✔ High Availability & Auto-healing

### ✔ Cost Optimization via Spot VMs

---

