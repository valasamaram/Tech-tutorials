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

## 🧭 Appendix — Deep Dive: Practical Setup, Patterns & Troubleshooting

This appendix provides the hands-on details and patterns a Cloudability FinOps engineer needs to successfully integrate, operate and optimize Azure with Cloudability. Use this as a runbook and checklist.

### A1 — Architecture & Data Flow (detailed)

- Azure billing & usage sources: Billing exports (EA/MCA), Cost Management exports (usage), Marketplace invoices, Reservation/Savings Plan records.
- Export target: Azure Storage Account (blob container) where daily and monthly exports are written (CSV/Parquet). Cloudability ingests from this storage container.
- Enrichment: Cloudability enriches with tags, subscription/management group metadata, and business mappings.
- Processing: normalization → amortization (RIs/SP) → allocation → dashboards/recommendations.

Deployment pattern (recommended):
- Centralized billing export storage account per billing scope (EA/MCA) with least-privilege access for ingestion.
- Use a dedicated ingestion service principal or SAS token rotated regularly.
- Tag enforcement upstream (CI, policy) to ensure resource metadata quality.

Security considerations:
- Restrict storage account network access (private endpoints) when possible.
- Use managed identities or service principal with narrow RBAC scopes for ingestion.
- Protect secrets (SAS tokens, client secrets) in Key Vault and rotate regularly.

### A2 — Practical Azure CLI / PowerShell snippets (examples)

Note: replace placeholders (<>). These snippets show common steps: create SP, create storage, assign roles, create container, generate SAS (where needed). Run in PowerShell/CLI with appropriate subscription context.

1) Create a service principal for ingestion (least-privilege):

```powershell
# Create a service principal
az ad sp create-for-rbac --name "cloudability-ingest-$(Get-Random)" --skip-assignment
```

2) Create a storage account and container for billing exports:

```powershell
$rg = "rg-finops-exports"
$loc = "eastus"
$sa = "finopsexports$([System.Guid]::NewGuid().ToString('N').Substring(0,8))"
az group create --name $rg --location $loc
az storage account create -n $sa -g $rg -l $loc --sku Standard_LRS --kind StorageV2
az storage container create --account-name $sa --name billing-exports
```

3) Grant the ingestion principal access to the storage container (Storage Blob Data Reader/Contributor) — using scope at resource level:

```powershell
# Get SP objectId and storage account resource id
$sp = az ad sp show --id http://cloudability-ingest --query objectId -o tsv
$saId = az storage account show -n $sa -g $rg --query id -o tsv

az role assignment create --assignee-object-id $sp --role "Storage Blob Data Reader" --scope $saId
```

4) (Portal) Configure Cost Management export to storage account: Azure Portal → Cost Management → Exports → Create (daily/monthly) → target container `billing-exports`.

Practical notes:
- If using EA/MCA, configure the export at billing account scope so all subscriptions under the billing account write to the same container.
- For highly regulated environments, put the storage account behind a private endpoint and permit Cloudability access via private peering or host-level ingestion options if supported.

### A3 — Business Mapping & Allocation Examples (practical rules)

Use these sample rules to map costs to teams/products. Implement incrementally and validate against finance expectations.

- Rule: Tag `owner` → allocate to Owner team. (highest priority)
- Rule: Subscription name contains `prod-` → environment = prod → apply Production business mapping
- Rule: ResourceGroup matches `rg-app-` → allocate 100% to Application team
- Shared cost example: ExpressRoute monthly bill → allocate 50/50 to BusinessUnit A/B by VM count in each BU

Sample mapping policy (pseudocode):

```
if tag.owner exists -> allocate cost to tag.owner
else if subscription.name contains 'sap' -> allocate to 'SAP Team'
else if resourcegroup startswith 'rg-app-' -> allocate to 'App Team'
else -> allocate to 'Platform / Shared'
```

Verification: run monthly reconciliation comparing Cloudability allocations with Azure invoice totals (unblended) and amortized numbers.

### A4 — Optimization Scenarios (examples with estimated savings)

Scenario 1 — Rightsize VMs (non-prod):
- 20 VMs sized D4s_v3 running at 8% CPU → recommended D2s_v3. Estimated saving: 50% on compute (~$3,000/mo).

Scenario 2 — Clean up orphaned disks & snapshots:
- 150 unattached disks (P10 equivalence) costing $0.10/GB → cleanup saves ~$450/mo.

Scenario 3 — Reservation planning:
- Stable baseline of 200 vCPU-equivalent workloads → purchase 1-yr RIs for 60% coverage; expected savings 30-40% vs on-demand. Model payback in Cloudability.

Scenario 4 — Storage tiering:
- Move 10TB of cold blob data to cool/archive → expected cost reduction 50–70% depending on access pattern.

Use Cloudability features to model each scenario before implementing; capture performance risk & rollback plan.

### A5 — Automation & Integration Patterns

1) Scheduled exports & ingestion
- Ensure daily exports are pushed to the storage container and Cloudability ingestion is validated by checking record counts and last-run timestamps.

2) Alerting & webhook integration
- Configure budget alerts and anomaly alerts in Cloudability to fire webhooks to Slack, Teams, or an automation runbook (Azure Automation / Logic App) to create a ticket.

3) Programmatic actions
- Export recommendations from Cloudability via API (if available) and create a PR/issue for engineering to apply changes (resize, schedule shutdown).

4) CI/CD for tagging hygiene
- Use GitHub Actions or Azure DevOps pipeline to run policy-as-code checks (ARM/Bicep linter) and validate required tags on resource templates before deployment.

### A6 — Dashboards & Report Examples (what to include)

- Executive summary: total spend, month-on-month delta, top 5 cost drivers, forecast vs budget
- Engineering dashboard: cost by service, rightsizing candidates, top 10 idle resources
- Finance dashboard: amortized vs unblended cost, chargeback per BU, trendline and forecast
- RI/SP dashboard: coverage %, utilization %, expiry calendar

### A7 — Troubleshooting & Runbook (common issues)

Checklist:
- No data in Cloudability: verify storage container exports exist and Cloudability ingestion logs show success
- Missing tags: run a tag inventory and identify untagged resources; apply policy and remediation
- Discrepancies between Azure invoice and Cloudability: compare unblended cost, check amortization settings and marketplace adjustments
- Service principal auth failures: verify SP credentials, check role assignments and expiry, rotate secrets
- Large anomalous spend: check recent deployments, deployment pipelines, and misconfigured autoscale (e.g., min/max values)

Helpful commands:

```powershell
# List storage blobs (validate export files)
az storage blob list --account-name <sa> --container-name billing-exports -o table

# Check role assignments for SP
az role assignment list --assignee <sp-object-id> --scope <scope-id> -o table

# Check subscription usage (sample)
az consumption usage list --subscription <sub-id> --top 10
```

### A8 — Governance: Tagging & Policy Templates

Quick policy ideas:
- Enforce required tags (owner, cost-center, environment) with `deny` or `audit` effect
- Auto-apply resource lock for production RGs
- Deny public access to storage containers unless explicitly allowed

Sample Azure Policy (brief):

```json
{
   "if": { "field": "tags.owner", "exists": "false" },
   "then": { "effect": "audit" }
}
```

### A9 — Interview Questions & Practical Assessments

Suggested interview questions for a Cloudability FinOps engineer role:
- Explain the difference between unblended and amortized cost. When would you use each?
- How do you map cloud costs to business owners when tags are missing on many resources?
- Walk me through setting up a storage-based billing export for Cloudability on an EA.
- Describe a recent rightsizing recommendation and how you'd validate it before implementing.

Practical assessment idea:
- Give candidate 1 month of sample billing exports and ask them to create 3 business mappings, identify top 5 optimization opportunities, and produce a short remediation plan with estimated savings.

### A10 — Deliverables / Checklist for Module Completion

- Storage export configured and validated for daily files
- Ingestion service principal or SAS configured and RBAC validated
- Business mappings created for at least 3 teams
- Two dashboards (executive + engineering) published
- One automation flow for anomaly alerting wired to Slack/Teams
- Runbook with troubleshooting commands and ownership

---

If you'd like, I can:
- convert the above runbook into an actionable checklist Bicep/ARM template to create the storage+container and RBAC assignments,
- produce a sample GitHub Action that validates tags on PRs,
- or create a one-page printable runbook PDF.

Tell me which of those you'd like next and I will add it to the todo list and implement it.

---

