# ⭐ **Module 4 — Cloudability for Azure (FULL Detailed Explanation)**

This module teaches how Apptio Cloudability works **specifically with Azure**, how to connect Azure billing data, how cost data flows, how to optimize Azure spend, and how to operate Cloudability as a FinOps engineer.

---

# 🔷 **SECTION 1 — How Cloudability Integrates With Azure**

## ✅ **What it means**

Cloudability becomes the “FinOps lens” across your Azure environment by ingesting cost, usage, and allocation data from your Azure tenant/subscription and transforming it into dashboards, insights, recommendations, and chargeback/showback reports.

## ✅ **Why it matters**

Without proper integration:

* You **cannot** see Azure spend in Cloudability
* Tags won’t be recognized
* No rightsizing or anomaly detection
* No business-level cost allocation

Integration is the **foundation** for all FinOps actions.

---

# 🧩 **1.1 Azure Cost Data Sources Cloudability Uses**

Cloudability uses **three primary Azure data feeds**:

### **1️⃣ Azure Enterprise Billing Data (EA / MCA / MPA)**

Includes:

* Cost details per service
* Discounts and negotiated pricing
* Reservation charges
* Marketplace costs

### **2️⃣ Azure Consumption & Usage Data**

Includes:

* Daily usage details
* Meter-level consumption
* Resource IDs
* Tags

This is the *core input* for optimization analysis.

### **3️⃣ Azure Reservation & Savings Plan Data**

Includes:

* SP / RI (Savings Plans, Reserved Instances)
* Utilization
* Coverage gaps
* Expiry dates

These enable deep optimization.

---

# 🧩 **1.2 How Data Moves From Azure → Cloudability**

### **Step-by-step data flow**

1. Cloudability connects to Azure via **Enterprise Billing API** or **Cost Management Exports**
2. Azure aggregates consumption + pricing daily
3. Data is exported to a storage location (Azure Storage Account)
4. Cloudability fetches and ingests the exported files
5. Cloudability processes metadata, tags, invoice adjustments
6. Cloudability enriches + normalizes the data
7. Final data becomes available for:

   * Dashboards
   * TCO views
   * Optimization insights
   * Showback/chargeback
   * Unit economics

---

# 🔷 **SECTION 2 — Connecting Azure to Cloudability**

## ⭐ 2.1 Prerequisites

You need the following Azure permissions:

| Requirement                              | Purpose                         |
| ---------------------------------------- | ------------------------------- |
| **Enrollment Reader / Billing Reader**   | Access billing exports          |
| **Cost Management Reader**               | See usage and cost data         |
| **Storage Account Contributor**          | Create or access export storage |
| **Service Principal (App Registration)** | API access Cloudability uses    |
| **Tags on Azure resources**              | Cost allocation                 |

---

# ⭐ 2.2 Step-by-Step Setup

### **Step 1 — Create a Service Principal**

Cloudability uses this identity to read Azure billing data.

### **Step 2 — Assign Billing Reader Role**

Ensures access to billing exports.

### **Step 3 — Create an Azure Storage Account**

For cost exports:

* Standard LRS
* Hot tier
* Blob container

### **Step 4 — Enable Cost Export in Azure**

Azure portal → Cost Management → Exports
Choose:

* Daily export
* CSV
* Billing account or subscription

### **Step 5 — Configure Cloudability to Ingest**

In Cloudability:

* Provide storage key
* Link service principal
* Select data type (usage / marketplace / amortized costs)

---

# 🔷 **SECTION 3 — Understanding Azure Data Inside Cloudability**

After ingesting, Cloudability processes data into several internal datasets.

## ⭐ 3.1 Core Data Types

### **1️⃣ Unblended Cost**

Raw cost before amortization — good for reconciling invoices.

### **2️⃣ Amortized Cost**

Spreads:

* Reserved Instance costs
* Savings Plans
* Prepaid charges

Useful for FinOps showback/chargeback.

### **3️⃣ Usage Data**

Meters such as:

* vCPU hours
* Storage GB-month
* SQL DTU/vCore usage

Used for optimization algorithms.

---

# ⭐ 3.2 Azure-Specific Data Mapping

Cloudability maps Azure fields:

| Azure Field        | Cloudability Equivalent |
| ------------------ | ----------------------- |
| `resourceId`       | `Resource Name`         |
| `tags`             | `Tag Columns`           |
| `meterId`          | `Usage Type`            |
| `subscriptionGuid` | `Account Name`          |
| `productName`      | `Service`               |

This mapping enables:

* Business grouping
* TCO models
* Cost breakdowns
* Trend dashboards

---

# 🔷 **SECTION 4 — Cloudability Azure Optimization Features**

This is the most important part for a FinOps engineer.

## ⭐ **4.1 Rightsizing Recommendations**

Cloudability analyzes:

* VM CPU usage
* Memory usage
* IOPS
* OS / Series / Region pairing
* SKU availability

Produces suggestions:

* Downsize B-series → D-series
* Move from D8s_v4 → D4s_v4
* Change disk types (P30 → P20)

It provides:

* Potential savings
* Performance risk score
* Confidence level
* Implementation instructions

---

## ⭐ **4.2 Reserved Instance & Savings Plan Optimization**

Cloudability analyzes Azure consumption to optimize commitments.

### Recommendations include:

* Buy 1-year or 3-year RIs
* Purchase VM-level or instance-family SPs
* Reduce unused commitments
* Rebalance over-purchased RIs
* Shifting workloads to RI-covered regions

Cloudability provides:

* Coverage %
* Utilization %
* Monthly waste
* Expiry dates

---

## ⭐ **4.3 Container & Kubernetes Cost Optimization**

For AKS workloads:

* Container-level cost allocation
* Namespace/Pod cost analysis
* Node pool right-sizing

Supports:

* Spot node recommendations
* Idle resource detection

---

## ⭐ **4.4 Storage Optimization**

Cloudability analyzes:

* Unused managed disks
* Premium disks with low IOPS
* Underutilized databases
* Cold blob tiers
* Snapshot sprawl

---

## ⭐ **4.5 Anomaly Detection**

Detects sudden spend changes across:

* Subscriptions
* Resource groups
* Products
* SKUs
* Tags

With:

* Sensitivity levels
* Alerting to Slack/Email/MS Teams

---

# 🔷 **SECTION 5 — Cost Allocation & Chargeback**

Cloudability helps allocate Azure spend to:

* Departments
* Projects
* Cost centers
* Applications
* Environments

Using:

* Tags
* Cloudability Business Mappings
* Custom rules
* Shared cost allocations

Examples:

* Split ExpressRoute 50/50 across two business units
* Allocate Hub VNet costs proportionally to VM count
* Assign 10% management overhead across all teams

---

# 🔷 **SECTION 6 — Dashboards & Reporting**

## Key Azure dashboards:

* **Azure Unblended vs Amortized Cost**
* **Azure Spend by Subscription**
* **Service-wise Cost (VMs, Storage, SQL)**
* **Savings Plan & RI Utilization**
* **AKS Cost Report**

## Custom dashboards:

* Per-product cost trends
* Unit economics (cost per user, per GB, per API call)
* Forecasting

---

# 🔷 **SECTION 7 — Advanced FinOps with Cloudability**

## 7.1 Forecasting

Cloudability provides:

* Seasonal forecasting
* Anomaly-aware predictive models
* Azure spend projections

## 7.2 Business Mapping Automation

Rules like:

* If tag `env = prod` → Business Unit A
* If subscription = DevSub → Engineering

## 7.3 Unit Economics

Measure:

* Cost per transaction
* Cost per customer
* Cost per cluster

---

# 🔷 **SECTION 8 — Real-World Cloudability Azure Workflow**

Here is exactly how a FinOps engineer uses Cloudability daily.

### **Daily tasks**

* Check total Azure spend
* Check anomalies
* Review provisioning/daily cost change

### **Weekly tasks**

* Optimization recommendations
* Savings Plan utilization
* Waste identification (idle disks, stale VMs)

### **Monthly tasks**

* Chargeback reports
* Budget vs actual analysis
* Cost forecasting
* Executive summary

---

# 🔷 **SECTION 9 — Deliverables for Module 4**

You should be able to:

✔ Set up Cloudability-Azure integration
✔ Create business mappings
✔ Build optimization dashboards
✔ Produce monthly Azure cost reports
✔ Implement tag hygiene governance
✔ Generate SP/RI recommendations
✔ Create a chargeback model
✔ Build anomaly alerting rules

---

