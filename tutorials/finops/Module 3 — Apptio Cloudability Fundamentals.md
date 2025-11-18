# 🌐 **MODULE 3 — Apptio Cloudability Fundamentals**

### 🎯 **Goal:** Learn how Apptio Cloudability (now part of IBM) enables **FinOps visibility, optimization, governance, and showback/chargeback** for Azure.

---

# 🧩 **Section 1 — Introduction to Cloudability**

## ✔ WHAT is Cloudability?

Cloudability is a **FinOps platform** designed to:

* Collect cloud usage & billing data
* Normalize & categorize spend
* Allocate cost to teams
* Provide optimization insights
* Enable budgeting, forecasting, and anomaly detection
* Manage multi-cloud environments (Azure, AWS, GCP)

It is the **industry-standard FinOps tool** widely used for enterprise cloud financial governance.

---

## ✔ WHY Cloudability Exists

Cloud billing is:

* Complex
* High-volume
* Rapidly changing
* Hard to allocate to owners
* Extremely detailed (millions of records per day)

Azure Cost Management alone gives:

* Basic visibility
* Limited business context
* Limited advanced analytics
* No multi-cloud view
* Weak chargeback models

**Cloudability fills this gap** by turning raw cost data into **actionable insights**.

---

## ✔ HOW Cloudability Works (High-Level Flow)

1. **Connect Cloud Accounts**

   * Azure Billing Account (EA or MCA)
   * Azure Subscriptions
   * Azure Management Groups

2. **Ingest Billing Data**

   * Daily & monthly usage files
   * Resource metadata
   * Tags
   * Reservations and Savings Plans data

3. **Normalize Data**

   * Converts into FinOps-friendly structures
   * Standard units (compute hours, GB, vCPU)
   * Cross-cloud standardization

4. **Map Cost to Business**

   * Business Mappings
   * Allocations
   * Shared cost distribution

5. **Analyze Cost**

   * Dashboards
   * Advanced filtering
   * Cost trends
   * Budget burn-down
   * Unit economics

6. **Optimize**

   * Rightsizing recommendations
   * RI & Savings Plans recommendations
   * Idle resource detection
   * Utilization analysis

7. **Operate**

   * Visualize KPIs
   * FinOps reporting
   * Executive dashboards
   * Governance monitoring

---

# 🔌 **Section 2 — Setting Up Cloudability for Azure**

## 🟦 **2.1 What Data Cloudability Needs**

Cloudability requires Azure **billing exports** that include:

* Resource Cost
* Meter Rates
* Resource ID
* Tags
* Reservation info
* Savings Plan usage
* Department/subscription
* Effective price
* Quantity
* Charge type (usage, purchase, refund)

---

## 🟩 **2.2 Marketplace Offerings**

Cloudability integrates with:

* Azure Enterprise Agreement
* Microsoft Customer Agreement
* Management Groups
* Subscriptions
* Azure AD (for role-based import)

---

## 🟧 **2.3 How to Connect Azure Billing → Cloudability**

Cloudability uses:

* **Azure Storage Account** for billing exports
* **Daily automated export schedule**
* **Container access for ingestion**

Steps:

### Step 1 — Create Azure Storage Account

Used for storing cost usage data.

### Step 2 — Enable “Cost Management Export”

Export **daily** & **monthly** cost usage data (CSV/Parquet).

### Step 3 — Grant Cloudability Access

Using SAS token or service principal.

### Step 4 — Cloudability Reads & Processes Billing

Within hours Cloudability dashboards begin populating.

---

# 📊 **Section 3 — Cloudability Interface Overview**

Cloudability UI is divided into **5 major sections**:

---

## 3.1 **Dashboard**

Provides organization-wide view of:

* Total cloud spend
* Spend by provider
* Top cost drivers
* Budget vs actual
* Forecasting projections
* Optimization opportunities
* Business unit cost breakdown

Dashboards can be:

* Shared
* Customized
* Automated
* Embedded into reporting systems

---

## 3.2 **Cost Analytics**

This is where FinOps analysis happens.

### Filters:

* Provider → Azure
* Account → Subscriptions
* Service → VM, SQL, Storage
* Cost type → Usage/RI/SP
* Region
* Tags
* Business mappings

### Common views:

* Monthly cloud spend
* Cost by subscription
* Cost by product
* RI coverage
* Savings Plans utilization
* Cost anomalies

---

## 3.3 **Optimization & Recommendations**

Cloudability uses analytics + Azure metrics to recommend:

### ✔ Rightsizing VMs

Idle or oversized VMs.

### ✔ Shutdown schedules

Non-prod resources.

### ✔ Database optimization

SQL tiers, elastic pools, serverless.

### ✔ Storage optimization

Cheaper tiers, lifecycle, orphaned disks.

### ✔ RI/SP purchases

Amount to buy
Terms (1-yr or 3-yr)
Expected savings
Risk analysis

### ✔ RI/SP utilization

Are reservations being used?

### ✔ Compression & network optimization

Traffic patterns and reduction opportunities.

---

## 3.4 **Business Mapping (The Most Important Feature)**

This is where raw cloud spend becomes **business-aligned**.

Business Mapping lets you allocate cost based on:

* Department
* Project
* Cost Center
* Environment
* Product Team
* Application owner

### WHY?

Azure alone cannot answer questions like:

* “How much is Team X spending?”
* “What is the cost of Application Y?”
* “What should we charge each department?”

Business Mapping solves this via:

### Rules:

* If tag = environment:prod → allocate to Production
* If subscription name contains “SAP” → allocate to SAP Team
* If resource group = team-a-* → map to Team A

This enables **chargeback/showback models**.

---

## 3.5 **Budgets & Forecasting**

Cloudability includes:

* Monthly & annual budgets
* Burn-rate analysis
* Forecast deviation
* Alerts for anomalies
* Trends based on previous spend
* Seasonality detection

Forecasting methods:

* Linear
* Exponential smoothing
* Machine Learning

---

# 🛡️ **Section 4 — Cloudability Data Intelligence**

Cloudability enhances data using:

---

## 🟧 4.1 Normalized Cost

Because different clouds use different units, Cloudability:

* Normalizes compute units
* Normalizes storage GB-month
* Normalizes network egress
* Standardizes cost types

Helps compare AWS vs Azure vs GCP.

---

## 🟦 4.2 Shared Cost Allocation

Example:
A shared resource cost (ExpressRoute) must be split across teams.

Methods:

* Proportional to usage
* Even split
* Based on number of VMs
* Based on custom formula

---

## 🟩 4.3 Unit Economics

Compute cost per:

* Customer
* API call
* Transaction
* Application
* Feature

Allows product teams to justify cost vs revenue.

---

# ⚙️ **Section 5 — Optimization Techniques Cloudability Uncovers**

Cloudability doesn’t only show costs — it provides **improvement actions**.

## 5.1 **Idle Resource Detection**

Idle VM, SQL, AKS, serverless functions.

## 5.2 **Overprovisioning Report**

Too-large VM, storage tier, SQL tier.

## 5.3 **Reservation Planner**

Finds workloads eligible for RI/SP:

* Based on last 30–90 days
* Predicts stable workloads
* Recommends terms (1-year or 3-year)

## 5.4 **RI/SP Utilization**

Shows how effectively discounts are consumed.

## 5.5 **Waste Reports**

Unused disks, networks, IPs, old snapshots.

---

# 🧮 **Section 6 — Role of Cloudability in FinOps Stages**

Cloudability directly supports **all 3 FinOps phases**:

---

## Phase 1 — INFORM

Cloudability provides:

* Transparency
* Cost visibility
* Business mappings
* Cost reporting per team
* Tag analysis
* Budget dashboards
* Forecasting
* Cost anomaly detection

---

## Phase 2 — OPTIMIZE

Cloudability recommends:

* Rightsizing
* Resource cleanup
* Reservation planning
* Savings Plan purchase
* Autoscaling improvements
* Database tier recommendations

---

## Phase 3 — OPERATE

Cloudability helps run FinOps processes by:

* Weekly/monthly reporting
* Governance checks
* KPIs tracking
* Executive reports
* Optimization backlog management
* Team cost accountability

---

# 🔐 **Section 7 — Setting Up Governance in Cloudability**

Governance ensures cost discipline is consistent.

## 7.1 Policy Controls

* Enforce tagging
* Identify untagged resources
* Assign business owners

## 7.2 Anomaly Detection

Detect cost spikes:

* Wrong config
* Misuse
* Security breach
* Data transfer explosion

Cloudability alerts teams instantly via:

* Email
* Slack
* Teams

---

# 🧪 **Section 8 — Cloudability Advanced Features**

## 🟦 8.1 Cost Allocation Automation

Build rules once → cost is auto-allocated daily.

## 🟨 8.2 Multi-Cloud Comparison

Azure, AWS, GCP in one dashboard.

## 🟧 8.3 BI Exports

Can export:

* Daily usage
* Business-mapped cost
* Raw cost
* Optimized cost models

Used in:

* Power BI
* Tableau
* SQL databases

## 🟪 8.4 ApptioOne Integration

Advanced financial planning.

---

# 🎓 **Section 9 — What a Cloudability FinOps Engineer Should Master**

### ✔ Connect Azure billing

### ✔ Configure business mappings

### ✔ Create showback/chargeback models

### ✔ Identify optimization opportunities

### ✔ Read RI/SP analytics

### ✔ Build dashboards for teams

### ✔ Manage governance with tagging policies

### ✔ Build optimization automation backlog

### ✔ Present monthly FinOps report

### ✔ Work with engineering and finance teams

---

# ⭐ **Final Outcome of Module 3**

By the end of this module, you will understand:

✔ How Cloudability works end-to-end
✔ How to integrate Azure billing
✔ How to analyze cost deeply
✔ How to create business mappings
✔ How to manage RI/SP optimization
✔ How to build FinOps dashboards
✔ How Cloudability supports FinOps lifecycle
✔ How to run enterprise-grade cost governance

---
