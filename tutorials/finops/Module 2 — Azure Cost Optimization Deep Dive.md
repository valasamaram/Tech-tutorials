# 🌐 **MODULE 2 — Azure Cost Optimization (Deep Dive)**

*A Comprehensive, End-to-End Learning Document*

Azure Cost Optimization is the discipline of **reducing cloud spending without impacting performance or reliability**.
This module teaches **how to identify waste, rightsize workloads, use discounts, enforce governance, and automate optimization**.



---

# 🧩 **Section 1 — What is Cost Optimization?**

A foundational FinOps concept for Azure, Cloudability, and all cloud environments.

---

# ✔ **WHAT is Cost Optimization?**

Cost Optimization is the **structured and continuous** practice of ensuring your cloud consumption is:

### **1️⃣ Efficient**

Resources must use the **right size, right SKU, right configuration**—not over-provisioned or under-utilized.

### **2️⃣ Purposeful**

Every deployed resource must serve a business need.
No idle, unused, orphaned, or test resources running unnecessarily.

### **3️⃣ Aligned With Business Value**

Spending must directly map to:

* Business units
* Applications
* Teams
* Projects
* Products

This helps understand **ROI, unit economics, and cost-to-serve**.

### **4️⃣ Predictable**

Costs must be:

* Forecastable
* Controlled
* Measurable
* Budgeted

Avoid surprise bills and month-end shocks.

### **5️⃣ Governed**

Policies, tagging standards, approval workflows, and budgets prevent uncontrolled growth.

### **In simple terms:**

✔ You get maximum performance & value at minimum cost.
✔ Without impacting availability, reliability, or user experience.

---

# ✔ **WHY Cost Optimization Is Critical**

Cloud is elastic → cost easily increases without control.

### **Reasons costs grow quickly:**

### 🔹 **1. Cloud resources run 24/7**

VMs, Databases, AKS nodes, and App Services continue charging even when idle.

### 🔹 **2. Overprovisioning is common**

Teams often choose:

* Bigger VMs (D8 → D32)
* Higher tiers (Premium → Business Critical)
* Larger storage (1TB → 4TB)

Even when workload doesn’t need that capacity.

### 🔹 **3. Unused resources accumulate**

Example:

* Disks detached from deleted VMs
* Public IPs not in use
* Snapshots not required
* Old Load Balancers still present
* NSGs, Route Tables, VNets unused

These continue billing monthly.

### 🔹 **4. Lack of governance = uncontrolled waste**

Without:

✔ Tagging
✔ Approvals
✔ Naming standards
✔ Budgets
✔ Alerts

Resources get created without cost visibility.

### 🔹 **5. Idle workloads are expensive**

Non-production environments (dev/test) often run 24/7 but are needed only 8–10 hours.

This creates massive loss.

### **Result:**

⚠ Cloud spend doubles or triples within months
⚠ Finance teams lose visibility
⚠ CIO/CTO sees bills increasing with no clear business value

---

# ✔ **HOW Cost Optimization Works (5 Core FinOps Pillars)**

Cost optimization is NOT a one-time task — it is a continuous lifecycle.

---

# **1️⃣ Visibility**

You can’t optimize what you can’t see.

Includes:

* Cost Analysis
* Tagging strategy
* Dashboards (Azure, PowerBI, Cloudability)
* Cost visibility by:

  * Subscription
  * Resource group
  * Application
  * Environment
  * Team
  * Tag (CostCenter, AppName, Owner)
  * Region
  * Service

**Goal:** Show where money is going.

---

# **2️⃣ Elimination of Waste**

Common wastes:

* Unused VMs
* Idle VMs (CPU <5%)
* Unattached Managed Disks
* Orphaned Public IPs
* Unused Load Balancers
* Over-retained backups
* Over-retained logs
* Old snapshots
* Unused Application Gateways
* Stopped but allocated VMs

**Goal:** Delete what is not needed → **instant savings**.

---

# **3️⃣ Right-Sizing**

Matching resource capacity to actual usage.

Examples:

* D16 → D4
* P30 disk → P15
* App Service Premium → Standard
* SQL Hyperscale → General Purpose
* AKS nodepool 8 nodes → 3 nodes

Uses:

* Azure Monitor Metrics
* Cloudability rightsizing engine
* Advisor recommendations

**Goal:** Reduce cost WITHOUT reducing performance.

---

# **4️⃣ Purchasing Optimization**

Pay-as-you-go is the most expensive model.

Better purchasing:

### ✔ Reservations (1-year, 3-year)

Perfect for predictable workloads.

### ✔ Savings Plans

Flexible—applies across compute (VMs, App Service, AKS).

### ✔ Spot VMs

Up to 90% cheaper for interruptible workloads.

**Goal:** Commit to capacity to get discounts.

---

# **5️⃣ Automation & Governance**

Manual optimization is not scalable.

Automation examples:

* Auto-shutdown schedules
* Serverless autoscaling
* AKS auto-scaler
* Logic Apps for cost alerts
* Azure Policy to prevent expensive SKUs
* Dev/Test labs auto-stop
* Budgets to enforce limits
* Tagging enforcement

**Goal:** Make cost optimization a continuous, automated process.

---

# ✔ SUMMARY (Simple & Powerful)

### **Cost Optimization =**

👉 Continuous
👉 Automated
👉 Data-driven
👉 Owned by FinOps + Engineering

### **Purpose:**

Reduce cloud spend
Increase efficiency
Ensure business-aligned spending


---

# 🧠 **Section 2 — Identify & Eliminate Waste (Deep Dive)**

**Waste = unnecessary cloud spend.**
Eliminating waste gives the **fastest and largest** cost savings in Azure — *often 20–40% immediately*.

Waste is the easiest optimization because:
✔ No redesign
✔ No downtime (mostly)
✔ Immediate savings
✔ Purely operational improvements

---

# 🎯 **2.1 Common Waste Categories in Azure (Detailed Breakdown)**

Below is an expanded explanation of each waste category: signs, why it happens, how to detect it, how to fix it, and best practices.

---

# 🟥 **1. Idle VMs (Virtual Machines)**

### ✔ WHAT is the problem?

VMs that **run 24/7 but aren’t doing any real work**.

Typical symptoms:

* CPU < **5% average**
* Very low memory usage
* No inbound/outbound network traffic
* No attached workloads
* Dev/Test systems left running at night/weekends

### ✔ WHY does it happen?

* Developers forget to turn off test environments
* Over-provisioned servers never scaled down
* Business units leave POCs running
* Lack of auto-shutdown schedule
* No governance or policies

### ✔ HOW to detect idle VMs?

Use:

#### 🔹 Azure Monitor → Metrics → CPU, Network

Check last **30 days** usage.

#### 🔹 Azure Advisor

Shows "Idle Virtual Machines detected" recommendations.

#### 🔹 Cloudability / Cost Management

Idle VM → high cost but very low utilization.

### ✔ HOW to fix?

1. **Shutdown schedule**

   * Automation account
   * Logic App
   * Dev/Test automatic shutdown (built-in)

2. **Scale down**

   * Example: D8 → D2 or B-series

3. **Migrate**

   * If workload is intermittent → move to:

     * App Service
     * AKS
     * Azure Functions
     * Serverless SQL

4. **Delete if unused**

### ✔ Best practice

💡 **Set auto-shutdown for all non-production VMs.**

---

# 🟧 **2. Overprovisioned VMs**

### ✔ WHAT is the problem?

VM size is **larger than workload needs**.

Example:
D8s_v3 (8 vCPU, 32 GB RAM)
Actual CPU usage = **10%**
Memory usage = **20%**

This causes unnecessary cost.

### ✔ WHY does it happen?

* Teams pick large sizes “just to be safe”
* Legacy on-prem sizing carried to cloud
* No monitoring of utilization after deployment

### ✔ HOW to detect?

Azure Monitor → CPU / Memory → 30-day trend
Azure Advisor → Right-size recommendations
Cloudability → Rightsizing engine (more accurate)

### ✔ HOW to fix?

* Reduce VM size (D8 → D4 → D2)
* Switch to B-series (burstable) for low CPU workloads
* Move to App Service if it’s a web app
* Move to AKS for containers

### ✔ Best practice

💡 **Implement mandatory periodic VM rightsizing review every 30 days.**

---

# 🟨 **3. Unused Managed Disks**

### ✔ WHAT is the problem?

When a VM is deleted, the **OS disk & data disks** remain in the subscription.

They continue charging monthly even though unused.

### ✔ WHY?

* Azure does not delete attached storage automatically
* Engineers forget to clean up
* Snapshots created during troubleshooting remain

### ✔ HOW to detect?

* Azure Portal → Disks → Filter: “Unattached”
* Azure Advisor → Orphaned Disk recommendations
* Cloudability → Orphaned resources report

### ✔ HOW to fix?

Delete unused disks manually or automate:

#### 🔹 Automation Script (Azure CLI)

```bash
az disk list --query "[?managedBy==null].name" -o tsv
```

#### 🔹 Logic App + schedule

Triggers weekly to delete unattached disks after X days.

### ✔ Best practice

💡 **Delete any disk that remains unattached for >7 days.**

---

# 🟩 **4. Unused Public IPs**

### ✔ WHAT is the problem?

Public IPs cost money **even when not used**.
Premium IPs cost even more.

### ✔ WHY?

* IPs reserved but never attached
* Load balancers removed but IP remained
* Engineers attach and detach during testing

### ✔ HOW to detect?

Azure Portal → Public IPs → Filter: “Unassociated”

### ✔ HOW to fix?

Delete unattached IP addresses.

### ✔ Best practice

💡 **Restrict public IP creation via Azure Policy unless justified.**

---

# 🟦 **5. Old Snapshots & Backups**

### ✔ WHAT is the problem?

Backups retained beyond retention policies consume storage (premium if disk was premium).

Also expensive when:

* Daily snapshots accumulate
* No lifecycle policies
* Old DR backups kept for years

### ✔ WHY?

* Default retention not changed
* Manual snapshots during troubleshooting not deleted
* Backup admins forget cleanup

### ✔ HOW to detect?

Azure Backup Reports
Azure Storage → Check Blob containers
Azure Policy compliance

### ✔ HOW to fix?

* Implement lifecycle management (delete after X days)
* Move old snapshots to Archive tier
* Delete unnecessary backups

### ✔ Best practice

💡 **Use Azure Backup retention rules with automated lifecycle deletion.**

---

# 🟪 **6. Overprovisioned Database Tiers (Azure SQL, MySQL, PostgreSQL)**

### ✔ WHAT is the problem?

Databases run on expensive tiers like:

* SQL Premium
* Business Critical
* Hyperscale
* General Purpose with too many vCores
* Provisioned compute when serverless is enough

### ✔ WHY?

* Workload is mostly idle
* Teams over-estimate performance needs
* Legacy migration without benchmarking

### ✔ HOW to detect?

* Query performance insight
* IO metrics (Read/Write)
* DTU/vCore utilization
* Advisor recommendations

### ✔ HOW to fix?

* Downscale tier (Premium → Standard, BC → GP)
* Switch to **serverless** (auto-pause when idle)
* Use **elastic pools** for multiple small DBs
* Use Hyperscale only when required

### ✔ Best practice

💡 **Always test database performance before assigning high-cost tier.**

---

# ⬛ **7. Log Analytics Workspace Over-Retention**

### ✔ WHAT is the problem?

Log Analytics charges heavily for:

* Data ingestion
* Retention

Default retention may be 30–90 days, but teams often keep:

* Application logs
* Metrics
* Diagnostic logs

for years.

Huge cost impact.

### ✔ WHY?

* Lack of log governance
* Teams don’t understand pricing
* Copying every log from every resource

### ✔ HOW to detect?

Log Analytics workspace → Usage and estimated costs
Monitor ingestion per table

### ✔ HOW to fix?

* Reduce retention to 30 days unless required
* Move old logs to:

  * Storage Archive
  * ADLS
* Filter unnecessary logs (disable verbose logs)

### ✔ Best practice

💡 **Log only what is required — avoid enabling diagnostic logs for all categories.**

---

# 🎯 Summary Table (Quick View)

| Waste Category            | Symptoms             | Tools to Identify              | Actions              |
| ------------------------- | -------------------- | ------------------------------ | -------------------- |
| Idle VMs                  | Low CPU, low network | Monitor, Advisor, Cloudability | Shutdown, scale down |
| Overprovisioned VMs       | VM too big           | Advisor, Cloudability          | Rightsize            |
| Unused Disks              | Disks unattached     | Portal, CLI                    | Delete               |
| Unused Public IPs         | IP not associated    | Portal                         | Delete               |
| Old Snapshots             | Many old backups     | Storage, Backup Reports        | Lifecycle            |
| Overprovisioned Databases | High SKU             | Metrics, Advisor               | Scale down           |
| Log Analytics Retention   | High ingestion       | Workspace metrics              | Reduce retention     |



---

# ⚙️ **Section 3 — Rightsizing (Most Important Optimization Skill)**

**Rightsizing = Matching resource capacity to actual workload needs.**
Not bigger than needed ✔
Not smaller than needed ✔
Just the right size → **Maximum performance per dollar**

---

# 🎯 **Why Rightsizing Matters?**

Rightsizing delivers:

* **30–70% cost savings** instantly
* Improved resource utilization
* Lower performance bottlenecks (counterintuitive but true)
* Ability to forecast cost more accurately
* Reduced cloud waste
* Better sustainability (lower carbon footprint)

---

# 🧠 Rightsizing Philosophy

Rightsizing is not just “make it smaller”.
It is:

> **A systematic, data-driven process of aligning workload demand with optimal resource configuration.**

You analyze workload patterns → use metrics → evaluate service limits → pick best SKU.

---

# ✔ **3.1 VM Rightsizing (Deep Dive)**

## 🧩 **What is VM Rightsizing?**

Adjusting VM size, family, OS, or pricing model based on **actual** CPU, Memory, Disk, and Network usage.

---

## 🧪 Metrics Required (Collect Minimum 14–30 Days)

### 1️⃣ **CPU Utilization**

* Avg CPU < 40% → VM likely oversized
* Avg CPU > 70% → VM likely undersized
* CPU spikes are okay → check percentiles (P95/P99)

### 2️⃣ **Memory Utilization**

* High memory = bottleneck even if CPU is low
* If Memory < 40% consistently → consider smaller VM

### 3️⃣ **Network Throughput**

* Some VMs hit NIC limits
* E.g., D2s_v3 supports 3,500 Mbps, D8s_v3 supports 6,000 Mbps

### 4️⃣ **Disk IOPS & Throughput**

* If disk IO never exceeds 200 IOPS → premium storage wasted
* Look for storage throttling

---

# 🛠 Tools to Use

### 🔹 **Azure Advisor (Rightsizing Recommendations)**

Shows idle & underutilized VMs.

### 🔹 **Azure Monitor Metrics**

CPU, Memory, Network, Disk charts (30-day view).

### 🔹 **Log Analytics Query**

Query helper:

```kusto
Perf
| where ObjectName == "Processor"
| summarize AvgCPU = avg(CounterValue) by bin(TimeGenerated, 1h), Computer
```

### 🔹 **Cloudability (Most Accurate)**

Uses AI + historical data
Considers burst patterns
Provides confidence score

---

# 🧰 Rightsizing Techniques

### 1️⃣ **Scale Down VM Size**

Examples:

* D8s_v3 → D4s_v3 → D2s_v3
* E-series → D-series

### 2️⃣ **Change VM Family**

Examples:

* Memory-heavy workload? → E-series
* Low CPU average? → B-series (burstable)
* High throughput? → F-series

### 3️⃣ **Switch OS Licensing**

Windows Licensing is costly.
Switch to Linux when possible.

Savings example:
Windows VM = 2× cost of Linux VM.

### 4️⃣ **Move to Spot VMs for Non-Critical Workloads**

Great for:

* Batch jobs
* CI/CD runners
* Dev/Test

Cost reduction: **70–90%**

---

# 🧠 Pro Tip: VM Rightsizing Decision Tree

```text
Is VM idle (>12 hours per day)?
    Yes → Stop or schedule auto-shutdown
    No → Continue

Is CPU < 40% and Memory < 40% for 14+ days?
    Yes → Scale down one size
    No → Continue

Is VM family unsuitable (E vs D vs F)?
    Yes → Change family
    No → Continue

Can workload run on B-series?
    Yes → Switch to B-series
    No → Continue

Can workload run on PaaS (App Service / AKS / Functions)?
    Yes → Migrate
    No → keep VM
```

---

# ✔ **3.2 Azure SQL Rightsizing (Deep Dive)**

## 🧩 What is SQL Rightsizing?

Optimizing cost by resizing compute/storage or switching pricing models.

---

# 🧪 Metrics Required (Collect 7–30 Days)

### 1️⃣ **vCore Utilization**

If average compute < 30% → overprovisioned

### 2️⃣ **DTU Consumption**

Check DTU % over time → < 20% = oversized

### 3️⃣ **IOPS & Log Write Rate**

* IO < 20% → high tier wasted
* Look at data IO vs log IO

### 4️⃣ **Active Connections**

Very small apps often don’t need high tiers.

---

# 🛠 Tools for SQL Rightsizing

### 🔹 **Query Performance Insight**

Shows slow queries and expensive plans.

### 🔹 **SQL Analytics (Azure Monitor)**

detailed IOPS, CPU, and storage metrics.

### 🔹 **Azure Advisor**

Shows cost-saving recommendations.

### 🔹 **Cloudability SQL Analyzer**

Checks:

* Memory pressure
* vCore underutilization
* Compute waste

---

# 🧰 Rightsizing Techniques

### 1️⃣ **Move to Serverless (Auto-Pause)**

Perfect for:

* Dev/Test
* Low-traffic systems
* Intermittent workloads

Auto-pause = **zero compute cost** when idle.

### 2️⃣ **Downscale Tier**

Examples:

* Business Critical → General Purpose
* Premium → Standard
* GP 8 vCore → GP 4 vCore

Typical savings: **30–50%**

### 3️⃣ **Move to Elastic Pools**

For multiple small DBs.

Savings: up to **70%** compared to standalone.

### 4️⃣ **Switch Backup Redundancy**

* GRS → LRS reduces cost by ~35%.

---

# 🧠 SQL Rightsizing Decision Tree

```text
Is SQL DB idle >50% of the time?
    Yes → Switch to Serverless
    No → Continue

Is DTU or vCore usage <30%?
    Yes → Downscale tier
    No → Continue

Multiple small DBs (<1 vCore usage)?
    Yes → Move to Elastic Pool
    No → Continue

Is IO low (<20%)?
    Yes → Switch storage tier
    No → Continue
```

---

# ✔ **3.3 Storage Rightsizing (Deep Dive)**

## 🧩 What is Storage Rightsizing?

Matching storage tier, redundancy, and performance to workload needs.

---

# 🔍 Common Storage Waste Areas

### 1️⃣ **Too many Premium Disks**

Premium SSD is costly but often unnecessary.

### 2️⃣ **Incorrect Storage Tier**

Hot → Cool or Archive
Huge savings:

* Cool = 60% cheaper
* Archive = 90% cheaper

### 3️⃣ **Over-replication**

RA-GRS ≈ 2× the cost of LRS
GZRS ≈ 3× cost of LRS

---

# 🛠 Tools for Storage Optimization

### 🔹 Storage Explorer

Find unused blobs, old data.

### 🔹 Azure Monitor

Shows IOPS usage on disks.

### 🔹 Azure Advisor

Recommendations for storage waste.

### 🔹 Cloudability

Hot → Cool and Premium → Standard recommendations.

---

# 🧰 Storage Rightsizing Techniques

### 1️⃣ **Premium → Standard SSD / HDD**

If disk IOPS < 1000 → premium is waste.

### 2️⃣ **Tiering Hot → Cool → Archive**

Rules:

* Access once every 30 days? → Cool
* Access once every 180 days? → Archive

### 3️⃣ **Lifecycle Management**

Policies:

* Move after 30 days to Cool
* Delete after 365 days

### 4️⃣ **Reduce Redundancy**

RA-GRS → LRS

Savings: **~35–50%**

### 5️⃣ **Shrink Disk Size**

A 128GB disk costs the same even if only 5GB is used → resize to smaller SKU if possible.

---

# 🧠 Storage Rightsizing Decision Tree

```text
Disk IOPS < 10% of limit?
    Yes → Switch to Standard SSD/HDD

Blob not accessed in 30+ days?
    Yes → Move to Cool

Blob not accessed in 180+ days?
    Yes → Move to Archive

Replication required?
    No → Switch to LRS
```

---

# ✅ Summary Table

| Category | What to Analyze                    | Tools                          | Optimization Actions                      |
| -------- | ---------------------------------- | ------------------------------ | ----------------------------------------- |
| VM       | CPU, Memory, IO, Network           | Advisor, Monitor, Cloudability | Scale down, switch family, Spot, B-series |
| SQL      | vCore, DTU, IO, Connections        | Query Insight, Advisor         | Serverless, tier down, elastic pool       |
| Storage  | IOPS, access frequency, redundancy | Monitor, Advisor               | Tiering, shrink disks, LRS                |



---


# 💼 **Section 4 — Purchasing Optimization (RI, SP, Hybrid Benefit)**

Purchasing optimization is the **highest-impact** cost-saving technique after rightsizing.
Azure provides multiple commitment-based and licensing-based discounts that can bring **30–90% savings** when used properly.

---

# 🟢 **4.1 Azure Reservations (RI – Reserved Instances)**

**WHAT:** Commit to using specific Azure resources for **1-year or 3-year**.
**DISCOUNT:** **20–65%**
**BEST FOR:** Predictable, steady 24/7 workloads.

### ✔ Resources Eligible:

* Virtual Machines (VMs)
* Azure SQL (Single DB, MI)
* Cosmos DB
* App Service
* Redis Cache
* Storage (Reserved Capacity)
* AKS Node Pools (via VM reservations)

### ✔ Benefits:

* Massive discount
* Guarantees capacity
* Simple to track utilization (RI Utilization %)

### ⚠ Limitations:

* Less flexible
* Commitment is resource-specific
* Changing VM family/region may require "exchange" or "refund" processing

---

# 🔵 **4.2 Azure Savings Plans (SP)**

**WHAT:** Commit to **hourly spending amount** instead of a specific resource.
**DISCOUNT:** **10–65%**
**FLEXIBILITY:** Much higher than RI.

### ✔ Recommended When:

* Workloads vary
* You use multiple VM series
* Frequent scaling (AKS, VMSS)
* You want commitment but do not know exact resource types

### ✔ Example:

Commit ₹100/hr → Azure gives discount until ₹100/hr is consumed → rest billed normally.

### ✔ Differences vs RI:

| Reservations                         | Savings Plans                       |
| ------------------------------------ | ----------------------------------- |
| Resource-specific                    | Spend-specific                      |
| Higher discount for stable workloads | Good discount with flexibility      |
| Best for steady VMs                  | Best for mixed or dynamic workloads |

---

# 🟣 **4.3 Azure Hybrid Benefit (AHB)**

**WHAT:** Use **existing on-prem licenses** (Windows Server, SQL Server) on Azure.
**SAVINGS:** Up to **85%** when combined with RI/SP.

### ✔ Applies to:

* Windows Server
* SQL Server
* Azure SQL (DB + MI)
* VMs
* AKS node pools (Windows)

### ✔ Benefits:

* No need to pay OS license on Azure (big cost reduction)
* Useful for enterprises with Software Assurance (SA)

---

# 🟠 **4.4 Spot VMs**

**WHAT:** Use unused Azure capacity at **80–90% lower cost**.
**BUT:** Can be evicted anytime if Azure needs capacity.

### ✔ Best Use Cases:

* Batch processing
* CI/CD runners
* Rendering workloads
* Testing environments
* AKS spot nodes (cheap autoscaling)

### ⚠ NOT recommended for:

* Production workloads
* State-heavy workloads
* Long-running critical applications

---

# 🧩 Combined Optimization Strategy

Most enterprises use all purchasing models together for max savings:

| Workload Type               | Best Discount Model                  |
| --------------------------- | ------------------------------------ |
| 24/7 predictable workload   | **RI + AHB**                         |
| Dynamic workload (AKS/VMSS) | **Savings Plan**                     |
| Dev/Test                    | **Spot**                             |
| SQL-heavy workloads         | **RI + AHB**                         |
| Baseline + burst            | **SP for baseline + PAYG for burst** |



---

# 📉 **Section 5 — Autoscaling & Scheduling Optimization**

Autoscaling and scheduling directly reduce cost by ensuring you only run resources **when needed** and at the **right size**.
These optimizations typically save **40–80%** depending on workload patterns.

---

## 🕒 **5.1 Shutdown Schedules (Start/Stop Scheduling)**

Most **non-production** workloads (Dev/Test/UAT) do **not** need 24×7 uptime.
Automatically stopping them outside office hours gives **50–75% savings instantly**.

### ✔ Why It Saves Money:

* VM cost = running hours
* Reducing runtime from **168 hrs → 40 hrs** weekly saves **~76%**
* Applies also to App Service, SQL, AKS node pools (via automation)

### ✔ Tools to implement schedules:

| Tool                                                      | Use Case                                         |
| --------------------------------------------------------- | ------------------------------------------------ |
| **Azure Automation Account (Runbooks)**                   | Start/Stop VMs, schedules, PowerShell automation |
| **Azure DevOps Pipelines (Cron schedules)**               | Start/stop via scripts for specific environments |
| **Logic Apps**                                            | No-code scheduling with connectors               |
| **Functions + Timer Trigger**                             | Lightweight custom scheduling                    |
| **Third-party tools (Cloudability, CloudHealth, Apptio)** | Enterprise scheduling & policies                 |

### ✔ Which Resources to Schedule:

* Dev/Test VMs
* App Service Plans (scale to 0 or stop)
* VM Scale Sets (min instance = 0)
* AKS Node Pools (non-prod pools)
* SQL DB (serverless: auto-pause)
* Analytics workloads
* Batch processors
* Bastion hosts (rarely needed 24×7)

---

## 📈 **5.2 Autoscaling (Scale Up/Down or Scale Out/In)**

Autoscaling ensures resources adjust capacity based on load, keeping performance stable while minimizing cost.

### ✔ Applies to:

* **Virtual Machines (VMSS)**
* **App Service Plans**
* **AKS (Cluster Autoscaler + HPA + KEDA)**
* **Functions Premium Plan**
* **Container Apps with autoscaling (KEDA)**

---

## ⚙️ Types of Autoscaling

### **1️⃣ Metric-based Scaling**

Triggers when metrics exceed thresholds:

Metrics used:

* CPU %
* Memory %
* Disk IO
* Network
* Queue length
* Request count
* Custom Application Insights metrics

**Example:**
Scale out VMSS when CPU > 70% for 10 minutes.

---

### **2️⃣ Schedule-based Scaling**

Different scale settings for different times.

**Example:**

* Scale out to 5 instances during business hours
* Scale in to 1 instance at night

---

### **3️⃣ Event-driven Scaling (KEDA, Azure Functions)**

Scale based on events:

* Queue length
* Kafka messages
* Service Bus queue
* HTTP traffic
* Cron patterns

Huge savings for bursty workloads.

---

## 🎯 Benefits of Autoscaling

* **Pay only for required capacity**
* Automatically scale during peak traffic
* Prevent overprovisioning
* Improve performance during unexpected spikes
* Massive savings for seasonal or variable workloads

---

## 🟩 Real-World Cost Benefits

| Scenario                | Savings |
| ----------------------- | ------- |
| Dev/Test VMs shutdown   | 50–75%  |
| App Service autoscaling | 30–60%  |
| AKS cluster autoscaler  | 40–70%  |
| VMSS scaling            | 25–55%  |



---

# 🔍 **Section 6 — Deep Dive: Azure Advisor Recommendations**

Azure Advisor Categories:

### ✔ Cost

* Rightsize VMs
* Delete unused disks
* Buy reservations
* Scale database down

### ✔ High Availability

* VM redundancy mistakes

### ✔ Security

* Security hardening

### ✔ Performance

* VM sizing
* Storage IO optimization

Important: Not all recommendations are perfect.
FinOps must validate using monitoring & business input.

---

# 📦 **Section 7 — Storage Optimization (Huge Savings Area)**

### 7.1 Blob Storage

Optimize using:

* Lifecycle policies
* Cool/Archive tier
* Compression
* Delete orphaned blobs
* Reduce replication

### 7.2 Disk Storage

Choose correct disk type:

* Ultra
* Premium SSD v2
* Premium SSD
* Standard SSD
* Standard HDD

### 7.3 Backup Storage

Limit retention where possible.

---

# 🧭 **Section 8 — Network Cost Optimization**

Network egress traffic = hidden cost.

Optimization ways:

* Use Azure CDN
* Keep resources in same region
* Minimize cross-region replication
* Use Private Endpoints to reduce NAT traffic
* Use ExpressRoute over open internet

---

# 📈 **Section 9 — Advanced Cost Optimization Techniques**

### 9.1 Amortization Analysis

Understand RI/SP discount distribution.

### 9.2 KPI Creation

Track:

* Cost per subscription
* Cost per environment
* Cost per application
* RI utilization
* RI coverage

### 9.3 Unit Economics

Cost per:

* customer
* API call
* transaction
* environment

This is **advanced FinOps maturity**.

---

# 🛡️ **Section 10 — Governance & Automation**

Automation ensures costs stay optimized.

Tools:

* Azure Policy
* Management Groups
* Cost Anomaly Alerts
* Azure Lighthouse (MSP)
* DevOps approvals for new resource creation
* Policy as Code
* Scheduled jobs for shutdown

---

# 💥 **Section 11 — Common Optimization Mistakes**

* Buying reservations without workload analysis
* Overoptimizing and degrading performance
* Not automating shutdown schedules
* No tagging strategy
* Ignoring storage lifecycle management
* No budget alerts

---

# ⭐ **Final Outcome: What You Will Master**

By completing Module 2, you gain expertise in:

✔ Finding & removing waste
✔ Rightsizing VMs, SQL, storage
✔ Using RI/SP/Hybrid Benefit smartly
✔ Autoscaling & schedules
✔ Storage cost optimization
✔ Networking optimization
✔ Using Advisor for real savings
✔ Building automation & governance
✔ Advanced FinOps & cost modeling
✔ Integration with Cloudability for deeper optimization

---

