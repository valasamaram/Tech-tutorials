# 🌐 **MODULE 2 — Azure Cost Optimization (Deep Dive)**

*A Comprehensive, End-to-End Learning Document*

Azure Cost Optimization is the discipline of **reducing cloud spending without impacting performance or reliability**.
This module teaches **how to identify waste, rightsize workloads, use discounts, enforce governance, and automate optimization**.

---

# 🧩 **Section 1 — What is Cost Optimization?**

### ✔ WHAT

Cost Optimization = The process of ensuring cloud spend is:

* **Efficient**
* **Purposeful**
* **Aligned with business value**
* **Predictable & governed**

### ✔ WHY

Azure costs grow fast because:

* Cloud resources run 24/7
* Overprovisioning happens easily
* Unused disks & IPs accumulate
* Lack of governance leads to waste
* Idle workloads = huge cost drain

### ✔ HOW

Cost optimization requires 5 pillars:

1. **Visibility** (analysis, tags, dashboards)
2. **Elimination of waste** (unused/idle resources)
3. **Right-sizing** (proper VM sizes, service tiers)
4. **Purchasing optimization** (RI, Savings Plans)
5. **Automation & Governance** (policies, schedules)

---

# 🧠 **Section 2 — Identify & Eliminate Waste**

Waste = unused resource = instant savings
Most organizations waste **20–40%** of cloud spend.

## 🎯 2.1 Common Waste Categories in Azure

### 🟥 1. Idle VMs

Symptoms:

* Low CPU (<5%)
* No network activity
* Running 24/7 unnecessarily

Fix:

* Scale down
* Shutdown schedule for non-prod
* Migrate to App Service or AKS

---

### 🟧 2. Overprovisioned VMs

Example: D8s_v3 → used CPU is only 10%.

Fix:

* Rightsize to smaller instance
* Adjust memory optimized/general purpose

---

### 🟨 3. Unused Disks

Scenario: VM deleted → disks remain orphaned.

Fix:

* Use cleanup scripts
* Azure Advisor recommendations

---

### 🟩 4. Unused Public IPs

Public IP costs when not attached.

Fix:

* Delete unattached resources

---

### 🟦 5. Old Snapshots & Backups

Backups older than retention policy.

Fix:

* Lifecycle policy enforcement
* Automated cleanup

---

### 🟪 6. Overprovisioned Database Tiers

Azure SQL DB left on Premium tier with low IO.

Fix:

* Downscale tier
* Switch to serverless (auto-pause)
* Use elastic pools

---

### ⬛ 7. Log Analytics Workspace Retention

Default retention = costly for large logs.

Fix:

* Reduce retention
* Use archive tier
* Implement data filtering

---

# ⚙️ **Section 3 — Rightsizing (Most Important Optimization Skill)**

Right-sizing means matching workload requirements to the most cost-efficient resource size.

Benefits:

* 30–70% savings
* Better matching of resources to workloads
* Lower performance bottlenecks when done scientifically

---

## ✔ 3.1 VM Rightsizing

### Metrics to analyze:

* CPU utilization
* Memory utilization
* Network throughput
* Disk IO

### Tools to use:

* Azure Advisor
* Azure Monitor
* Metrics from Log Analytics

### Techniques:

* Scale down VM size
* Move from memory-optimized to general-purpose
* Switch OS if licensing is expensive
* Switch to spot VMs (non-critical workloads)

---

## ✔ 3.2 Azure SQL Rightsizing

Reduce cost by analyzing:

* DTU / vCore usage
* IO per sec
* Log rates
* Query performance
* Connection counts

Options:

* Move to serverless (auto-pause)
* Downscale tier
* Move to elastic pool

---

## ✔ 3.3 Storage Rightsizing

Strategies:

* Convert Premium → Standard
* Convert Hot → Cool or Archive tier
* Enable lifecycle management policies
* Reduce replication (RA-GRS → LRS)

---

# 💼 **Section 4 — Purchasing Optimization (RI, SP, Hybrid Benefit)**

Azure offers deep discounts:

## 🟢 **4.1 Reservations (RI)**

Prepay for 1-year or 3-year commitment.

Discount: **20–65%**

Applicable to:

* VMs
* SQL DB
* Cosmos DB
* App Service
* Cache
* Storage

Best for stable 24×7 workloads.

---

## 🔵 **4.2 Savings Plans (SP)**

Commit to hourly spend.

Discount: **10–65%**

More flexible than RI.

Best for:

* Variable workload that still has predictable baseline
* Organizations with multiple resource types

---

## 🟣 **4.3 Azure Hybrid Benefit**

Use on-prem Windows Server or SQL Server license.

Savings: **up to 85% combined with RI/SP**

---

## 🟠 **4.4 Spot VMs**

Unused Azure capacity → up to 90% cheaper.

Use cases:

* Batch jobs
* Test workloads
* Non-critical jobs

Cannot use for production workloads.

---

# 📉 **Section 5 — Autoscaling & Scheduling Optimization**

## 🕒 5.1 Shutdown Schedules

Non-prod workloads rarely need 24/7 runtime.

Savings: **50–75%**

Tools:

* Automation Account
* Azure DevOps schedules
* Logic Apps
* Third-party tools (Cloudability, CloudHealth)

---

## 📈 5.2 Autoscaling

Used for:

* VMs
* VMSS
* App Service
* AKS

Scale by:

* CPU
* Memory
* Custom metrics
* Queue length

Benefits:

* Pay only for load
* Handle traffic spikes efficiently

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

