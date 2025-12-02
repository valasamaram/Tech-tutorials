Reserved instances and savings plans are both discount mechanisms for Azure compute, but they work differently: reservations commit to specific resources, while savings plans commit to a spend amount per hour across many resources. For interviews, think “capacity‑style commitment” (Reservations) vs “money‑per‑hour commitment” (Savings Plan).[1][2][3][4]

## Azure Reserved Instances (Reservations)

Azure Reservations are a 1‑ or 3‑year commitment to specific resources (like a VM family/size/region), giving significant discounts versus pay‑as‑you‑go (PAYG).[2][1]

- Scope & matching: You choose scope (single subscription, shared across tenant, etc.); the discount auto‑applies when running VMs match the reservation’s properties (region, SKU, term).[5][6]
- Billing behavior: You pay for the reserved capacity regardless of whether it’s fully used each hour (“use it or lose it”); unused capacity in an hour is not carried forward.[7][8]
- Coverage: Reservations typically cover only the compute meter; Windows licensing and other meters are billed separately.[9][8]
- Changes: Azure allows some exchanges/changes and partial refunds for reservations (subject to rules and limits), which gives some flexibility if you picked the wrong size or region.[10][1]

## Azure Savings Plan for Compute

Savings Plans give discounts by committing to a fixed hourly spend (for example, 10 USD/hour) on eligible compute for 1 or 3 years.[3][4]

- Commitment model: You choose a dollar‑per‑hour commitment and a 1‑ or 3‑year term; that amount is billed every hour whether or not you fully use it.[11][3]
- Discount application: Each hour, eligible compute (VMs, AKS, App Service Premium, Functions Premium, Dedicated Hosts, etc.) is billed at discounted rates until the committed amount is consumed; any extra usage above the commitment is billed at PAYG.[12][4]
- Flexibility: Savings Plans are not tied to a specific VM size or region and can automatically follow changes (scale up/down, move regions, change VM families) within the eligible services.[13][3][12]
- Limits: You cannot cancel or exchange Savings Plans the way you can with reservations; unused commitment in any hour is lost.[14][15][16]

## How discounts are applied together

When you have both Reservations and a Savings Plan, Azure applies them in a priority order.[17][14]

- Priority: Reservation discounts apply first to matching resources because they are more rigid; Savings Plan discounts then apply to remaining eligible usage up to the hourly commitment.[4][14]
- Residual usage: Any compute not covered by either (above reservations and savings‑plan commitment) is charged at PAYG rates.[14][4]

## When to use which (interview angle)

You can summarize the difference like this in an interview.[18][2][13]

| Aspect              | Reservations (RIs)                                         | Savings Plan for Compute                                              |
|---------------------|-----------------------------------------------------------|------------------------------------------------------------------------|
| Commitment type     | Specific resource type/size/region capacity.[1][2] | Fixed hourly spend on eligible compute.[3][4]               |
| Term                | 1 or 3 years.[1][2]                              | 1 or 3 years.[3][16]                                         |
| Flexibility         | Less (tied to SKU/region; some exchange options).[1][6] | More (applies across regions, SKUs, services).[3][13][12] |
| Best for            | Very stable, predictable workloads.[2][13]       | Dynamic workloads that still have a baseline spend.[11][18]   |
| Discount mechanism  | Hourly capacity; use it or lose it.[7][8]       | Hourly spend; use it or lose it.[11][4]                       |

A strong interview answer:  
- “Use Reservations for long‑running, stable VMs you don’t expect to change much; use a Savings Plan to cover your variable compute baseline across regions and services, then let PAYG handle occasional spikes.”

For Azure, Reservations (RIs) are quite flexible (cancel/exchange/trade‑in), but Savings Plans are almost “write‑once” (no cancel/modify), with only limited management changes allowed. Thinking in terms of interview language: RIs = “some escape hatches”, Savings Plans = “locked financial commitment”.[1][2][3]

## Reserved Instances (Azure Reservations)

- Can they be canceled?  
  - Yes, you can cancel Azure Reservations and get a pro‑rated refund for the remaining term, subject to limits (for example, a total canceled commitment cap per 12‑month period).[4][1]
  - Refund is calculated based on remaining days in the term; there is an overall monetary limit per billing profile/enrollment on how much you can refund in a rolling 12‑month window.[5][1]

- Can they be exchanged / upgraded / downgraded?  
  - Yes, you can exchange a reservation for another reservation of the same type (for example, different VM size/region), using the remaining monetary value as credit; the new reservation’s total value must be equal or higher than the returned one.[6][7][1]
  - Azure also supports “trade‑in” of eligible compute reservations into a Savings Plan, where the remaining commitment is converted into a new Savings Plan commitment (no early termination fee currently, but that could change).[8][9]
  - In practice, you “upgrade” by exchanging for a bigger/more expensive reservation; you effectively “downgrade” only within the constraints of the refund/exchange rules and monetary limits, not by editing the existing RI.[7][1]

- What cannot be changed?  
  - You cannot directly edit term length or split a reservation arbitrarily; changes are via cancel+refund or exchange flows.[10][1]

## Savings Plans for Compute

- Can they be canceled or refunded?  
  - No. All Azure Savings Plan purchases are final; you cannot cancel, exchange, or get a refund once bought.[11][3][12]

- Can you downgrade or upgrade the commitment?  
  - You cannot change the hourly commitment, term length, or billing frequency of an existing Savings Plan.[2][13][14]
  - To effectively “upgrade” (increase commitment), you buy an additional Savings Plan at the same scope; the commitments add up.[15][14]
  - To “downgrade”, there is no direct option; you must ride out the existing plan and possibly buy a smaller plan next time, so any over‑commitment becomes wasted discount.[12][2]

- What can you modify?  
  - You can change scope (for example, from single subscription to shared scope within allowed agreements), adjust auto‑renewal, and manage RBAC, but none of these change the financial commitment or term.[14][16][17]

## One‑glance interview cheat table

| Feature                         | Reservations (RIs)                                             | Savings Plans for Compute                                     |
|---------------------------------|----------------------------------------------------------------|----------------------------------------------------------------|
| Cancel allowed?                 | Yes, with pro‑rated refund and monetary limits.[1][5] | No; purchases are final.[3][12]                      |
| Exchange allowed?               | Yes, same‑type reservations; and trade‑in to Savings Plan.[1][8][9] | No exchanges or trade‑ins to RIs.[11][3]            |
| Change hourly commitment?       | Not directly; buy/exchange reservations instead.[1][10] | No; commitment is immutable.[2][14]                 |
| Upgrade capacity?               | Exchange for larger/more expensive reservation.[1][7] | Buy additional Savings Plan(s) to increase total commit.[15][14] |
| Downgrade capacity?             | Limited: cancel part (within refund limits) or exchange to cheaper.[1][7] | Not possible; excess commitment is wasted.[2][12]   |

Reserved Instances (RI) and Savings Plans (SP) are configured with different key parameters, and the creation flows in the portal are very structured. Thinking interview‑wise: RIs are about *resource attributes* (SKU/region/scope), SPs are about *money per hour* (commit, scope, term).[1][2][3][4]

## 1. What applies to Reservations vs Savings Plans

### Reservations (RIs) – main parameters

When you buy an Azure Reservation, you must choose:[5][2][1]

- Billing subscription / billing scope (who pays)  
- Scope (where the discount applies):  
  - Shared (billing context), single subscription, or single resource group.[6]
- Resource type:  
  - VM, Azure SQL Database, Cosmos DB, App Service, etc.[2][7]
- Region: e.g., East US, West Europe (reservations are region‑specific).[2]
- SKU / instance details (for VMs: family/size, series, OS, etc.).[8][2]
- Term: 1 year or 3 years.[9][8]
- Quantity: number of instances covered.[6][2]
- Payment option: all upfront or monthly.[9][8]

The discount then auto‑applies to matching running resources (same type, region, scope, and compatible sizes where instance‑size flexibility is supported).[7][1]

### Savings Plans – main parameters

When you buy an Azure Savings Plan for compute, you must choose:[10][3][4]

- Billing subscription / billing scope (the “billingScopeId”)  
- Scope for benefit:  
  - Apply to any eligible resource in tenant/billing context, or to specific subscription(s).[4][10]
- Commitment amount:  
  - Fixed hourly commitment (e.g., 5 USD/hour).[3][4]
- Term: 1 year or 3 years.[3][4]
- Billing frequency:  
  - All upfront or monthly (cost is same; just cash‑flow difference).[10][3]
- Auto‑renew: on/off.[11][10]

The discount then applies every hour to eligible compute usage (VMs, AKS, App Service, Functions Premium, etc.) across selected scope up to the hourly commitment.[12][4]

## 2. Portal steps – create a Reservation (VM example)

High‑level steps for a Reserved VM Instance via portal:[1][8][6]

1. Sign in:  
   - Go to Azure portal with an account that has **Owner** or **Reservation Purchaser** on a supported subscription (EA/MCA/Pay‑as‑you‑go).[5][8]

2. Open Reservations blade:  
   - In the search bar, type **“Reservations”** and open **Reservations** (under Cost Management + Billing).[8][1]

3. Start purchase:  
   - Click **Add** to create a new reservation.[13][8]
   - Choose **Virtual machine** (or other resource type like SQL, Cosmos DB).[8][2]

4. Configure basics:  
   - **Billing subscription**: select which subscription is charged.[5][6]
   - **Scope**: pick **Shared**, **Single subscription**, or **Resource group**.[6]
   - **Region**: choose the Azure region where your VMs run.[2][6]

5. Configure SKU and term:  
   - **Instance size/family**: choose the VM family and size that matches your workload.[8][2]
   - **Term**: select **1 year** or **3 years**.[9][8]
   - **Quantity**: number of VMs to cover.[2][6]

6. Payment and review:  
   - **Payment option**: **Upfront** or **Monthly**.[9][8]
   - Review estimated savings and ensure usage matches planned workload.  
   - Click **Review + buy**, then **Purchase**.

After purchase, the RI discount automatically applies to any running VM that matches type/region/scope until capacity is fully used each hour.[7][1]

## 3. Portal steps – create a Savings Plan

High‑level steps for an Azure Savings Plan for compute:[4][10]

1. Sign in with proper permissions:  
   - EA/MCA billing roles or **Savings plan purchaser** / **Owner** on at least one subscription in the billing context.[14][10]

2. Open Savings Plans blade:  
   - In the search bar, type **“Savings plans”** and open **Savings plans** under Cost Management + Billing or from Home.[10][4]

3. Start purchase:  
   - Click **Add** to purchase a new savings plan.[10]

4. Configure basics:  
   - **Name**: friendly name for the plan.[10]
   - **Billing subscription**: which subscription pays.[10]
   - **Scope**:  
     - “Apply to any eligible resource” (usually best, tenant‑wide or billing‑wide),  
     - or restrict to specific subscription(s).[4][10]

5. Choose term and commitment:  
   - **Term**: 1‑year or 3‑year.[3][4]
   - **Hourly commitment**: select the hourly spend amount (portal shows estimated % coverage and savings vs PAYG).[4][10]

6. Billing and renew:  
   - **Billing frequency**: **All upfront** or **Monthly**.[3][10]
   - **Auto‑renew**: toggle on/off as needed.[11][10]

7. Review + buy:  
   - Validate scope, commitment, and savings projection.  
   - Click **Review + buy**, then **Purchase**.

Once active, Azure automatically applies the savings plan discount each hour to the most expensive eligible compute usage first, up to your commitment amount.[12][4]

## 4. Quick table – what you actually “set”

| Dimension         | Reservation (RI) – you set…                            | Savings Plan – you set…                                       |
|------------------|---------------------------------------------------------|----------------------------------------------------------------|
| Who pays         | Billing subscription.[5][8]                   | Billing subscription.[10]                                  |
| Where it applies | Scope: RG / subscription / shared.[1][6]      | Scope: billing context / specific subscriptions.[4][10] |
| What you commit  | Specific resource type, region, SKU, quantity.[2][7] | Dollar per hour of eligible compute.[3][4]          |
| Term             | 1 or 3 years.[9][8]                            | 1 or 3 years.[3][4]                                 |
| Payment          | Upfront or monthly.[9][8]                      | Upfront or monthly.[3][10]                           |




“Upfront or monthly” is just about HOW you pay for the 1‑ or 3‑year commitment, not about the discount level.

- Upfront: You pay the full cost of the reservation or savings plan in one big charge at the start of the term (for example, entire 3‑year RI cost on day 1). The discount you get on usage is then applied for the whole term; there is no extra discount just because you paid upfront.[1][4][7]
- Monthly: The same total cost is split evenly across the months in the term (for example, 36 equal monthly charges for a 3‑year commitment). Azure states that the total you pay is the same as upfront, with no extra fees for choosing monthly.[3][4][7][1]

So, in simple terms: same committed term, same total price and discount; upfront is “pay all now”, monthly is “pay the same total in equal installments over the term.”[2][7][1]


Multiple Savings Plans are applied together each hour, but Azure has rules about which plan is used first and how the hourly commitments are consumed.

## Basic idea with multiple plans

- Each plan has its own hourly commitment (for example, 5 USD/hour + 3 USD/hour = 8 USD/hour total discount “budget” per hour).[1][2]
- Every hour, Azure looks at all eligible compute usage in each plan’s scope and applies discounts until each plan’s commitment is fully used; anything above that is billed at PAYG (or covered by reservations if present).[3][1]
- Discounts are “use it or lose it” per hour; unused commitment from any plan does not roll over.[4][3]

## Order Azure uses when multiple plans exist

Azure tries to maximize your benefit by choosing which plan and which resources to discount first.[5][3]

- By discount size per resource: Within a single plan, Azure applies the discount first to the usage that has the highest percentage savings compared to PAYG (the most expensive eligible meters), then moves to the next usage until that plan’s commitment is exhausted.[3][4]
- By term length: If you have multiple plans with different terms (1‑year and 3‑year), Azure consumes the 3‑year plan first because it usually has better rates.[6][5][3]
- By scope: When multiple plans exist with different scopes, Azure applies benefits from more restrictive scopes first (to avoid waste):  
  1) Resource‑group‑scoped plans  
  2) Subscription‑scoped plans  
  3) Management‑group‑scoped plans  
  4) Shared‑scope plans[7][8]

So if a VM belongs to a resource group that has its own savings plan and you also have a tenant‑wide shared plan, the resource‑group plan is applied first to that VM; any remaining usage can then be discounted by broader‑scoped plans.[8][7]

## Putting it together with an example

Imagine you have:  
- SP‑A: 3‑year, 2 USD/hour, shared scope (tenant‑wide).  
- SP‑B: 1‑year, 1 USD/hour, subscription scope.  

In a given hour, Azure will:  
- First apply 3‑year plan benefit (SP‑A) to the highest‑discount eligible usage in its scope, up to 2 USD/hour.[5][3]
- Then apply 1‑year plan (SP‑B) to remaining eligible usage in its subscription scope, up to 1 USD/hour.[7][3]
- Any extra compute cost beyond 3 USD/hour total commitment is charged at PAYG, or covered by reservations if they match and have priority.[2][9][3]



---

# ✅ **Examples for Each Reservable Resource (RI)**

Below is **each Azure service that supports RI** + **a real example of how you would purchase it**.

---

## **1️⃣ Virtual Machines (VMs) — Reserved Instance Example**

**Scenario:** You run a production web app on a **D4s_v3 VM** in Central India, always running 24/7.

**Purchase Example:**

* Resource: **D4s_v3 VM**
* Region: **Central India**
* Term: **3 years**
* Scope: **Shared**
* Billing: **Monthly**

**Outcome:** Saves ~60–72% compared to pay-as-you-go.

---

## **2️⃣ Azure SQL Database — Reserved Capacity Example**

**Scenario:** A SQL P2 database runs your application continuously.

**Purchase Example:**

* Resource: **SQL DB – General Purpose – Gen5 – 4 vCore**
* Term: **3 years**
* Region: **East US**
* Scope: **Single subscription**

**Outcome:** Around 40–55% savings.

---

## **3️⃣ SQL Managed Instance — Reserved Instance Example**

**Scenario:** You run a **SQL MI (Business Critical)** with consistent usage.

**Purchase Example:**

* Resource: **Managed Instance BC — 16 vCore**
* Term: **3 years**
* Region: **West Europe**
* Billing: **Upfront**

---

## **4️⃣ Cosmos DB — Reserved Throughput Example**

**Scenario:** Your app consistently uses around **10,000 RU/s**.

**Purchase Example:**

* Resource: **Cosmos DB RU/s – 10,000 RU provision**
* Term: **1 year**
* Region: **Central US**

---

## **5️⃣ Azure App Service (Isolated Plan) — RI Example**

**Scenario:** You host internal apps on a **I2V2 App Service Plan**.

**Purchase Example:**

* Resource: **App Service Isolated – I2V2**
* Term: **3 years**
* Region: **Southeast Asia**

---

## **6️⃣ PostgreSQL / MySQL / MariaDB Database — RI Example**

**Scenario:** You use Azure DB for PostgreSQL Flexible Server, 4 vCore, always-on.

**Purchase Example:**

* Resource: **PostgreSQL Flexible Server – General Purpose – 4 vCore**
* Term: **3 years**
* Region: **Central India**

---

## **7️⃣ Azure Dedicated Host — Reserved Instance Example**

**Scenario:** You run 8 VMs on a single physical host.

**Purchase Example:**

* Resource: **Dedicated Host Type 1**
* Term: **3 years**
* Billing: **Upfront**

---

## **8️⃣ Azure Storage — Reserved Capacity Example**

**Scenario:** Your project stores ~100 TB of Blob storage.

**Purchase Example:**

* Resource: **Hot Blob Storage – 100 TB**
* Term: **1 year**
* Region: **Central India**

---

## **9️⃣ Azure Synapse (SQL Data Warehouse) — RI Example**

**Scenario:** You use DW1000c always-on.

**Purchase Example:**

* Resource: **Synapse DW1000c reserved compute**
* Term: **3 years**

---

## **🔟 Azure Cache for Redis — RI Example**

**Scenario:** You run a Premium P2 Redis Cache.

**Purchase Example:**

* Resource: **Redis Cache – Premium P2**
* Term: **1 year**

---

# ✅ **Examples for Each Savings Plan Eligible Resource (SP)**

Savings Plans apply to ALL compute. Here are examples:

---

## **1️⃣ Virtual Machines – Savings Plan Example**

**Scenario:** You run a mix of D-series and E-series VMs across regions.

**Purchase Example:**

* Savings Plan: **₹400/hr commitment**
* Term: **3 years**
* Scope: **Shared**

Covers all VM usage automatically — no need to choose size.

---

## **2️⃣ AKS Node Pools — Savings Plan Example**

**Scenario:** AKS cluster auto-scales from 3–20 nodes.

**Purchase Example:**

* Savings Plan: **₹250/hr**
* Term: **1 year**
* Scope: **Shared**

All AKS VM nodes get discounted.

---

## **3️⃣ App Service (Premium Plan) — SP Example**

**Scenario:** You run multiple web apps on Premium V3 plan.

**Purchase Example:**

* Savings Plan: **₹100/hr**
* Term: **3 years**

Covers compute behind app service automatically.

---

## **4️⃣ Azure Functions Premium — SP Example**

**Scenario:** Your functions run continuously ~24/7.

**Purchase Example:**

* Savings Plan: **₹60/hr**
* Term: **1 year**

---

## **5️⃣ VM Scale Sets — SP Example**

**Scenario:** Autoscaling from 5 to 100 VMs during peak.

**Purchase Example:**

* Savings Plan: **₹500/hr**
* Term: **3 years**

Works regardless of VM size changes.

---

## **6️⃣ Dedicated Host — SP Example**

**Scenario:** You manage physical host compute.

**Purchase Example:**

* Savings Plan: **₹300/hr**
* Term: **3 years**

---
Savings Plans are **not tied to specific individual resources** like Reservations—instead, Azure automatically applies the hourly discount to **eligible compute usage** within the plan's **scope** (shared, subscription, etc.), prioritizing the highest-value usage first.[1][10]

## How application works (automatic, no manual assignment)

1. **Eligibility check**: Every hour, Azure scans all **running eligible compute** in the Savings Plan's scope:  
   - VMs (D/E/F-series, scale sets, Spot VMs)  
   - AKS node pools  
   - App Service Premium V3+  
   - Azure Functions Premium  
   - Azure Dedicated Host, etc.[11][1]

2. **Prioritization algorithm**: Within the scope, Azure applies the discount to usage in this order:  
   - **Highest discount rate first** (most expensive PAYG meters get covered first)  
   - **Longer-term plans first** (3-year before 1-year)  
   - **Narrower scopes first** (RG → subscription → MG → shared)[10][1]

3. **Consumption until exhausted**: The discount covers usage up to your hourly commitment (e.g., ₹400/hr). Any excess usage that hour is PAYG.[10]

## Concrete example with your scenarios

**Hourly usage snapshot**:  
```
VMs (D-series): ₹250    ← Eligible
AKS nodes:     ₹180     ← Eligible  
App Service:   ₹90      ← Eligible
Functions:     ₹70      ← Eligible
Scale Sets:    ₹420     ← Eligible
TOTAL:         ₹1010
```

**Your 5 Savings Plans (all shared scope)**:  
- Plan1 (VMs): ₹400/hr, 3yr  
- Plan2 (AKS): ₹250/hr, 1yr  
- Plan3 (AppSvc): ₹100/hr, 3yr  
- Plan4 (Func): ₹60/hr, 1yr  
- Plan5 (Scale): ₹500/hr, 3yr  

**How Azure applies (one hour)**:  
```
Step 1: 3yr plans first (Plan1,3,5) → highest discount rates
        Plan1 (₹400): covers ₹250 VMs + ₹150 Scale Sets  
        Plan3 (₹100): covers ₹90 App Service  
        Plan5 (₹500): covers remaining ₹270 Scale Sets  
        
Step 2: 1yr plans (Plan2,4)  
        Plan2 (₹250): covers ₹180 AKS  
        Plan4 (₹60):  covers ₹60 Functions (₹10 unused expires)
        
Total covered: ₹1010 → ₹0 PAYG!
```

## Key behaviors you need to know

| Scenario | What happens |
|----------|-------------|
| **Usage < commitment** | Unused discount expires that hour (e.g., ₹400 plan but only ₹200 VMs running → ₹200 wasted)[10] |
| **Usage > commitment** | Excess billed PAYG (e.g., ₹400 plan but ₹600 VMs → ₹200 PAYG)[10] |
| **Scale up/down** | Automatic—no reconfiguration needed[4] |
| **Multiple plans** | Sum of commitments; applied by priority rules above[1] |
| **Reservations exist** | Reservations applied FIRST, then Savings Plans to remainder[10] |

**Interview answer**: "Savings Plans work like a 'discount budget per hour' across eligible compute in scope. Azure automatically maximizes value by covering highest-PAYG usage first until the budget is exhausted each hour—no manual resource assignment needed."[1][10]

The **shared scope** means it floats across **all subscriptions in your EA/MCA billing context**, making it perfect for enterprise landing zones with dynamic/multi-sub workloads.
