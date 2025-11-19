# 📘 **Module — Cloud Basics, Billing Fundamentals & FinOps Principles**

### 🎯 **Goal: Understand cloud basics, billing fundamentals, and FinOps principles (Beginner → Intermediate)**

---

# 🌥️ **1. Cloud Computing Basics**

Cloud computing is the on-demand delivery of computing services—servers, storage, databases, networking, analytics, and software—over the internet with pay-as-you-go pricing.

### 🔑 Key Characteristics

* **On-demand self-service** – Provision resources instantly.
* **Scalability & elasticity** – Scale up/down automatically based on load.
* **Measured service** – Pay only for what you use.
* **Resource pooling** – Shared infrastructure; multi-tenant.
* **Broad network access** – Accessible via internet or private networks.

---

## 🟦 1.1 Cloud Service Models

### **IaaS (Infrastructure as a Service)**

You manage: OS, applications, middleware.
Provider manages: hardware, network, virtualization.
Examples: Azure VMs, Azure Networking, Azure Storage.

### **PaaS (Platform as a Service)**

Provider manages: OS, patches, runtime.
You manage: applications & data.
Examples: App Service, Azure SQL Database, Functions.

### **SaaS (Software as a Service)**

Fully managed applications delivered over the internet.
Examples: Microsoft 365, Salesforce, Dynamics 365.

---

## 🟦 1.2 Cloud Deployment Models

### **Public Cloud**

Third-party provider delivers services (Azure, AWS, GCP).

### **Private Cloud**

Cloud environment dedicated to one organization.

### **Hybrid Cloud**

Mix of on-prem + cloud, integrated via networking.

### **Multi-Cloud**

Using more than one cloud provider for redundancy or cost optimization.

---

# 🧱 **2. Azure Billing Fundamentals**

To optimize cloud cost, understanding Azure billing is mandatory. Azure uses a **consumption-based billing model** with multiple components:

---

## 🟦 2.1 Azure Account Structure

### **Tenant**

* Identity boundary (Microsoft Entra ID).
* Manages users, groups, roles.

### **Subscription**

* Billing boundary.
* All resources *must* belong to a subscription.

### **Resource Groups**

* Logical grouping of related resources.

### **Management Groups**

* Govern multiple subscriptions.

---

## 🟦 2.2 Azure Cost Model

Azure charges based on:

### **✔ Compute**

* Price based on **vCPU, memory, region, OS, reservation term**

### **✔ Storage**

* Capacity used (GB), redundancy type, performance tier

### **✔ Networking**

* Outbound data transfer
* Public IP, VPN, ExpressRoute

### **✔ Databases**

* DTU/vCore, storage, backup retention, geographic redundancy

### **✔ Platform Services**

* Function execution units
* Logic App actions
* API management requests

### 🔹 Charges are **per-minute or per-second**, depending on service.

---

## 🟦 2.3 Cost Drivers

The largest cost consumers in Azure:

1. Virtual Machines & Scale Sets
2. Managed Disks
3. Database Services (SQL, Cosmos DB)
4. Networking (data egress)
5. Storage
6. Kubernetes node pools

---

## 🟦 2.4 Azure Cost Management Tools

Azure provides built-in tools for cost visibility and governance:

* **Cost Analysis** – visual dashboards
* **Cost Alerts** – based on thresholds
* **Budgets** – monthly/annual budget controls
* **Advisor Recommendations** – rightsizing, reservations
* **Usage Data Export** – push billing files every day
* **Pricing Calculator** – estimate future resources
* **TCO Calculator** – migration modeling

---

## 🟦 2.5 Cost Data File (EA / MCA)

Azure produces daily/monthly usage files containing:

* Resource ID
* Meter Category
* Unit cost
* Quantity
* Effective price
* Tags
* Subscription & Billing Account

This data feeds:

* Cloudability
* Power BI reporting
* Internal cost showback/chargeback models

---

# 💰 **3. Cloud Cost Optimization Fundamentals**

Before learning FinOps, you must understand the sources of waste:

### 🔥 **Common Cost Wastes in Azure**

* Idle VMs
* Over-sized compute
* Underutilized databases
* Orphaned disks & NICs
* Misconfigured scaling
* Unused public IPs
* Always-on dev/test environments
* High egress traffic
* Premium storage used unnecessarily

---

# 🏛️ **4. Introduction to FinOps**

FinOps = *Cloud Financial Operations*
A discipline and culture that combines **financial accountability + engineering ownership** to manage cloud costs.

FinOps is not only cost cutting. It is:

### ✔ Cost visibility

### ✔ Cost optimization

### ✔ Operational excellence

### ✔ Value optimization

### ✔ Strong collaboration between teams

---

# 🌀 **5. The FinOps Lifecycle (Core Framework)**

The FinOps Foundation defines 3 phases:

---

## 🟦 **Phase 1: Inform**

Goal: *“Show where money is going.”*

Activities:

* Tagging strategy  -   A structured approach for labeling cloud resources using tags (e.g., CostCenter=Finance, Env=Prod).
* Cost allocation   -   Process of assigning cloud spend to the right teams, applications, environments, or business units.
* Shared cost modeling  -   Method of distributing costs for shared infrastructure (e.g., VPN gateways, firewalls, hub networks). Approaches: proportional allocation, fixed percentage, usage-based.
* Budgeting -   Defining spending limits per team, application, or environment.
* Unit economics    -   Measuring cost efficiency in meaningful business units. Ex: cost per user, cost per API call, cost per VM hour, cost per environment
* Forecasting   -   Predicting future cloud spend based on historical trends, usage patterns, and upcoming changes.
* Usage data export -   Exporting raw consumption and cost data from Azure (or other clouds) into tools like:Azure Cost Management exports, Storage accounts, Data Lake, Storage accounts, Data Lake
* Cloudability integration  -   Connecting Azure billing data to Apptio Cloudability to enrich cost visibility.

Outputs:

* Dashboards
* Visibility reports
* Cost allocation model

---

## 🟦 **Phase 2: Optimize**

Goal: *“Get the best value for money.”*

Activities:

* Rightsizing workloads -   Adjusting compute, storage, and database resources to match actual usage.
* Scaling policies  -   Implementing autoscaling rules that grow or shrink capacity based on demand.
* Optimize data transfer    -   Reducing network egress fees by optimizing communication patterns
* Optimize storage  -   Choosing correct storage tiers and eliminating unused volumes.
* Reservation purchases (1Y/3Y) -   Commitment-based discounts for predictable workloads.
* Savings Plans -   Flexible commitment to compute spend instead of specific VM types.
* Spot workloads    -   Using surplus Azure capacity at deep discounts (up to 90%).
* Deleting unused resources -   Systematically identifying and removing unused or idle cloud assets.
* Architectural improvements    -   Re-designing systems to be inherently cost-efficient.

Outputs:

* Savings realized
* Optimization backlog
* Monthly savings report

---

## 🟦 **Phase 3: Operate**

Goal: *“Create processes and governance to manage cost at scale.”*

Activities:

* Governance via policy -   Establishing rules to enforce compliant and cost-efficient cloud usage.
* Continuous cost monitoring    -   Daily or weekly monitoring of usage, anomalies, and budget trends.
* Monthly FinOps reviews    -   Regular reviews with engineering, product, and finance teams.
* KPI reporting -   Tracking metrics that measure financial performance of cloud usage.
* Budget enforcement    -   Ensuring no one exceeds approved spending limits.
* Team accountability   -   Assigning spend ownership to each product/service/team.
* Process automation    -   Automating repetitive FinOps workflows so cost control scales.

Outputs:

* FinOps dashboard
* Root cause analysis
* Consistent KPIs

---

# 🧰 **6. FinOps Roles & Stakeholders**

FinOps is cross-functional:

### 👨‍💻 Engineering Teams

* Optimize architecture
* Right-size resources
* Automate environments

### 💼 Finance

* Budget planning
* Forecasting
* Chargeback

### 🔐 Cloud Governance

* Enforce policies
* Tag compliance

### 👥 Executives / Product Owners

* Cost accountability
* Funding decisions

### 🛠 FinOps Engineer (YOU)

* Build dashboards
* Integrate Cloudability
* Analyze cost data
* Recommend optimization
* Maintain governance

---

# 🧮 **7. Key FinOps Metrics & KPIs**

* Cost per workload
* Cost per environment
* Cost per customer
* Cost per transaction
* Utilization rate
* RI coverage & utilization
* Percentage of wasted spend
* Cost vs forecast

These feed decision-making.

---

# 🧩 **8. Cloudability Role in FinOps**

Apptio Cloudability integrates with Azure to provide:

* Cost normalization
* Detailed analytics
* Business mappings (cost allocation rules)
* Chargeback/showback
* RI recommendations
* Unit cost analysis
* Multi-cloud governance
* Cost anomaly detection

Azure Cost Management is limited; Cloudability extends insights using **FinOps-aligned analytics**.

---

# 📚 **9. Summary — What You Should Now Understand**

By the end of this module, you should be able to:

### ✔ Explain cloud service & deployment models

### ✔ Understand Azure billing structure

### ✔ Identify major cloud cost drivers

### ✔ Read Azure cost & usage data

### ✔ Know the FinOps lifecycle (Inform–Optimize–Operate)

### ✔ Understand the role of Cloudability in FinOps

### ✔ Explain why tagging and cost governance matters

---

