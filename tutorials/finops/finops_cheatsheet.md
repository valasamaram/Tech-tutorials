# 🚀 **Azure FinOps Engineer Cheat Sheet & Quick Reference**

*Your go-to guide for Azure cost optimization, FinOps operations, and technical interviews*

---

## 📋 **Table of Contents**

1. [Azure Pricing Quick Reference](#azure-pricing-quick-reference)
2. [Essential Azure CLI Commands](#essential-azure-cli-commands)
3. [PowerShell Cost Management Commands](#powershell-cost-management-commands)
4. [KQL Queries for Cost Analysis](#kql-queries-for-cost-analysis)
5. [Key FinOps Metrics & KPIs](#key-finops-metrics--kpis)
6. [Cost Optimization Decision Trees](#cost-optimization-decision-trees)
7. [Azure Policy Examples](#azure-policy-examples)
8. [Interview Questions & Answers](#interview-questions--answers)
9. [Common Troubleshooting Scenarios](#common-troubleshooting-scenarios)
10. [FinOps Formulas & Calculations](#finops-formulas--calculations)

---

# 🌐 **Azure Pricing Quick Reference**

## Compute (India Central - Approximate Monthly Cost)

| Service Type | Size | vCPU | RAM | Monthly Cost (₹) |
|--------------|------|------|-----|------------------|
| **B-Series (Burstable)** |
| B1s | 1 | 1 GB | 450-600 |
| B2s | 2 | 4 GB | 1,800-2,200 |
| **D-Series (General Purpose)** |
| D2s_v3 | 2 | 8 GB | 4,500-5,500 |
| D4s_v3 | 4 | 16 GB | 9,000-11,000 |
| D8s_v3 | 8 | 32 GB | 18,000-22,000 |
| **E-Series (Memory Optimized)** |
| E8s_v3 | 8 | 64 GB | 25,000-32,000 |
| **F-Series (Compute Optimized)** |
| F4s_v2 | 4 | 8 GB | 8,500-10,000 |

**Discount Options:**
- Reserved Instances (1-year): ~30-40% savings
- Reserved Instances (3-year): ~60-70% savings
- Spot VMs: ~70-90% savings (interruptible)
- Azure Hybrid Benefit: ~40-85% savings (with licenses)

## Storage (Per GB Per Month)

| Storage Type | Access Tier | Cost (₹/GB) |
|--------------|-------------|-------------|
| **Blob Storage** |
| Hot | 1.5-2.0 |
| Cool | 0.8-1.0 |
| Archive | 0.2 |
| **Managed Disks** |
| Standard HDD | 0.3-0.5 (per disk) |
| Standard SSD | 0.8-1.2 (per disk) |
| Premium SSD | 2.5-4.0 (per disk) |
| Ultra Disk | Very high (varies by IOPS) |

## Databases (Approximate Monthly)

| Service | Tier | Monthly Cost (₹) |
|---------|------|------------------|
| **Azure SQL Database** |
| Basic | 350-450 |
| S2 (Standard) | 6,000-8,000 |
| P1 (Premium) | 40,000-50,000 |
| **Managed Instance** |
| General Purpose | 40,000-80,000 |
| Business Critical | 100,000-200,000 |

## Networking

| Service | Cost |
|---------|------|
| **Data Egress** |
| First 5 GB | Free |
| Next 10 TB | ₹6-9 per GB |
| **VPN Gateway** | ₹9,000-30,000/month |
| **ExpressRoute** | ₹40,000-200,000/month |
| **Public IP** |
| Basic | Free |
| Standard | ₹300-600/month |

---

# 💻 **Essential Azure CLI Commands**

## Cost Management

```bash
# Get subscription cost for current month
az consumption usage list --subscription <subscription-id>

# Get cost by resource group
az consumption usage list --resource-group <rg-name>

# Query specific time range
az consumption usage list --start-date 2024-01-01 --end-date 2024-01-31

# Get budget information
az consumption budget list --subscription <subscription-id>

# Export cost data
az costmanagement export list --scope "subscriptions/<subscription-id>"
```

## Resource Optimization

```bash
# List all VMs with their sizes
az vm list --query "[].{Name:name, Size:hardwareProfile.vmSize, RG:resourceGroup}" -o table

# List unattached disks (orphaned)
az disk list --query "[?managedBy==null].{Name:name, ResourceGroup:resourceGroup, DiskSizeGB:diskSizeGb}" -o table

# List unused public IPs
az network public-ip list --query "[?ipConfiguration==null].{Name:name, ResourceGroup:resourceGroup}" -o table

# List stopped VMs (still incurring disk costs)
az vm list -d --query "[?powerState=='VM deallocated' || powerState=='VM stopped'].{Name:name, RG:resourceGroup, State:powerState}" -o table

# Check VM utilization (requires Azure Monitor)
az monitor metrics list --resource <vm-resource-id> --metric "Percentage CPU" --aggregation Average
```

## Tagging

```bash
# List resources without specific tag
az resource list --query "[?tags.Environment==null].{Name:name, Type:type, RG:resourceGroup}" -o table

# Apply tag to resource
az tag create --resource-id <resource-id> --tags Environment=Dev CostCenter=IT

# Apply tag to resource group
az group update --name <rg-name> --set tags.CostCenter=Finance tags.Owner=JohnDoe

# List all tags in use
az tag list -o table
```

## Azure Policy

```bash
# List policy assignments
az policy assignment list -o table

# Check policy compliance
az policy state list --resource-group <rg-name> --query "[?complianceState=='NonCompliant']" -o table

# Create policy assignment for required tags
az policy assignment create --name 'require-cost-center-tag' \
  --policy '<policy-definition-id>' \
  --scope '/subscriptions/<subscription-id>'
```

## Cost Analysis Queries

```bash
# Get top 10 most expensive resources
az graph query -q "
  ResourceContainers
  | where type =~ 'microsoft.resources/subscriptions'
  | project subscriptionId, name
" --first 10

# Find resources by cost center tag
az resource list --tag CostCenter=Finance -o table

# Get resource count by type
az resource list --query "[].type" | grep -o '"[^"]*"' | sort | uniq -c
```

---

# 🔷 **PowerShell Cost Management Commands**

## Cost Queries

```powershell
# Connect to Azure
Connect-AzAccount

# Get current subscription cost
Get-AzConsumptionUsageDetail -StartDate (Get-Date).AddDays(-30) -EndDate (Get-Date) | 
  Measure-Object -Property PretaxCost -Sum

# Get cost by resource group
Get-AzConsumptionUsageDetail -ResourceGroup "MyRG" | 
  Group-Object -Property InstanceName | 
  Select-Object Name, @{N='Cost';E={($_.Group | Measure-Object -Property PretaxCost -Sum).Sum}}

# Export cost data to CSV
Get-AzConsumptionUsageDetail -StartDate "2024-01-01" -EndDate "2024-01-31" | 
  Export-Csv -Path "C:\cost-report.csv" -NoTypeInformation

# Get budget information
Get-AzConsumptionBudget

# Get reservation recommendations
Get-AzConsumptionReservationRecommendation -Scope "subscriptions/<subscription-id>"
```

## VM Optimization

```powershell
# List all VMs with CPU metrics
Get-AzVM | ForEach-Object {
    $vm = $_
    $metric = Get-AzMetric -ResourceId $vm.Id -MetricName "Percentage CPU" -TimeGrain 01:00:00
    [PSCustomObject]@{
        VMName = $vm.Name
        Size = $vm.HardwareProfile.VmSize
        AvgCPU = ($metric.Data | Measure-Object -Property Average -Average).Average
    }
}

# List idle VMs (CPU < 5% for 30 days)
$threshold = 5
Get-AzVM | Where-Object {
    $metric = Get-AzMetric -ResourceId $_.Id -MetricName "Percentage CPU"
    ($metric.Data | Measure-Object -Property Average -Average).Average -lt $threshold
}

# Stop all VMs in a resource group
Get-AzVM -ResourceGroupName "DevRG" | Stop-AzVM -Force

# Right-size recommendation script
function Get-VMRightsizingRecommendation {
    param([string]$VMName)
    
    $vm = Get-AzVM -Name $VMName
    $cpuMetric = Get-AzMetric -ResourceId $vm.Id -MetricName "Percentage CPU"
    $avgCPU = ($cpuMetric.Data | Measure-Object -Property Average -Average).Average
    
    if ($avgCPU -lt 10) { "Consider B-series or downsize" }
    elseif ($avgCPU -lt 30) { "Consider downsizing by 1-2 sizes" }
    elseif ($avgCPU -gt 80) { "Consider upsizing" }
    else { "Current size appropriate" }
}
```

## Storage Optimization

```powershell
# Find orphaned disks
Get-AzDisk | Where-Object {$_.ManagedBy -eq $null} | 
  Select-Object Name, ResourceGroupName, DiskSizeGB, @{N='MonthlyCost';E={$_.DiskSizeGB * 0.04}}

# Find old snapshots (older than 30 days)
Get-AzSnapshot | Where-Object {$_.TimeCreated -lt (Get-Date).AddDays(-30)} | 
  Select-Object Name, ResourceGroupName, TimeCreated

# Calculate storage cost
Get-AzStorageAccount | ForEach-Object {
    $context = $_.Context
    $usage = Get-AzStorageUsage -Location $_.Location
    [PSCustomObject]@{
        StorageAccount = $_.StorageAccountName
        UsageGB = $usage.CurrentValue / 1GB
        EstimatedMonthlyCost = ($usage.CurrentValue / 1GB) * 1.5
    }
}
```

## Tagging Automation

```powershell
# Apply tags to all resources in RG
$tags = @{
    Environment = "Production"
    CostCenter = "IT"
    Owner = "FinOps-Team"
}

Get-AzResource -ResourceGroupName "MyRG" | ForEach-Object {
    Set-AzResource -ResourceId $_.ResourceId -Tag $tags -Force
}

# Report untagged resources
Get-AzResource | Where-Object {
    -not $_.Tags.ContainsKey("CostCenter")
} | Select-Object Name, ResourceGroupName, Type

# Copy tags from RG to resources
$rg = Get-AzResourceGroup -Name "MyRG"
Get-AzResource -ResourceGroupName "MyRG" | ForEach-Object {
    $resourceTags = $_.Tags ?? @{}
    $rg.Tags.GetEnumerator() | ForEach-Object { $resourceTags[$_.Key] = $_.Value }
    Set-AzResource -ResourceId $_.ResourceId -Tag $resourceTags -Force
}
```

---

# 📊 **KQL Queries for Cost Analysis**

## Azure Monitor / Log Analytics

```kusto
// Top 10 resources by cost
Resources
| extend cost = todouble(tags.monthlyCost)
| top 10 by cost desc
| project name, resourceGroup, type, cost

// Untagged resources
Resources
| where tags !has "CostCenter"
| project name, resourceGroup, type, location

// Resources by environment
Resources
| where tags has "Environment"
| summarize count() by tostring(tags.Environment)

// CPU utilization analysis
Perf
| where ObjectName == "Processor" and CounterName == "% Processor Time"
| where Computer startswith "MyVM"
| summarize AvgCPU = avg(CounterValue) by bin(TimeGenerated, 1h), Computer
| where AvgCPU < 10
| project TimeGenerated, Computer, AvgCPU

// Cost anomaly detection
let baseline = toscalar(
    UsageDetails
    | where TimeGenerated between (ago(30d) .. ago(7d))
    | summarize avg(Cost)
);
UsageDetails
| where TimeGenerated > ago(7d)
| summarize DailyCost = sum(Cost) by bin(TimeGenerated, 1d)
| extend Anomaly = iff(DailyCost > (baseline * 1.5), "High", "Normal")
| where Anomaly == "High"

// Resource growth tracking
Resources
| where TimeGenerated > ago(30d)
| summarize ResourceCount = count() by bin(TimeGenerated, 1d), type
| render timechart
```

## Azure Resource Graph

```kusto
// All VMs with their properties
Resources
| where type == "microsoft.compute/virtualmachines"
| project name, location, resourceGroup, properties.hardwareProfile.vmSize, properties.storageProfile.osDisk.diskSizeGB

// Storage accounts with redundancy
Resources
| where type == "microsoft.storage/storageaccounts"
| project name, location, sku.name, kind

// Public IPs cost analysis
Resources
| where type == "microsoft.network/publicipaddresses"
| extend ipAllocationMethod = properties.publicIPAllocationMethod
| extend sku = sku.name
| summarize count() by tostring(sku), tostring(ipAllocationMethod)

// SQL Databases by tier
Resources
| where type == "microsoft.sql/servers/databases"
| extend tier = properties.currentServiceObjectiveName
| summarize count() by tostring(tier)

// Disks not attached to VMs
Resources
| where type == "microsoft.compute/disks"
| where managedBy == ""
| project name, resourceGroup, location, properties.diskSizeGB, sku.name

// Resources without required tags
Resources
| where tags !has "CostCenter" or tags !has "Owner" or tags !has "Environment"
| project name, type, resourceGroup, tags
```

---

# 📈 **Key FinOps Metrics & KPIs**

## Core Financial Metrics

| Metric | Formula | Target | Meaning |
|--------|---------|--------|---------|
| **Total Cloud Spend** | Sum of all Azure charges | N/A | Monthly/annual Azure bill |
| **Cost per Environment** | Cost by Env tag / Total Cost | Dev+Test ≤ 30% | Ensure non-prod doesn't dominate |
| **Variance %** | ((Actual - Budget) / Budget) × 100 | ±5% | Budget accuracy |
| **Cost Trend** | (Current Month - Last Month) / Last Month × 100 | Controlled growth | Month-over-month change |

## Optimization Metrics

| Metric | Formula | Target | Meaning |
|--------|---------|--------|---------|
| **Waste %** | Wasted spend / Total spend × 100 | <10% | Idle, unused, orphaned resources |
| **RI Coverage %** | RI-covered hours / Total eligible hours × 100 | 60-80% | % of workloads using RIs |
| **RI Utilization %** | RI hours used / RI hours purchased × 100 | >90% | Efficiency of RI purchases |
| **Savings Realized** | On-demand cost - Actual cost | Maximize | Dollars saved through optimization |

## Operational Metrics

| Metric | Formula | Target | Meaning |
|--------|---------|--------|---------|
| **Tag Compliance %** | Tagged resources / Total resources × 100 | >95% | Cost allocation capability |
| **Time to Optimize** | Days from alert to remediation | <7 days | Operational efficiency |
| **Forecast Accuracy** | 100 - abs((Forecast - Actual) / Actual × 100) | >90% | Prediction quality |

## Business Metrics (Unit Economics)

| Metric | Formula | Use Case |
|--------|---------|----------|
| **Cost per User** | Total cost / Active users | SaaS applications |
| **Cost per Transaction** | Total cost / Number of transactions | E-commerce, banking |
| **Cost per API Call** | API Gateway cost / API calls | Microservices |
| **Cost per Environment** | Environment cost / Total cost | Multi-tenant systems |
| **Cost per GB Stored** | Storage cost / Total GB | Data platforms |
| **Cost per vCPU** | Compute cost / Total vCPUs | IaaS efficiency |

---

# 🌳 **Cost Optimization Decision Trees**

## VM Optimization Decision Tree

```
Is VM CPU < 10% for 30 days?
├─ YES → Is it a critical production system?
│   ├─ YES → Review with application team
│   └─ NO → Shutdown or delete
└─ NO → Continue

Is VM CPU < 40% for 30 days?
├─ YES → Can workload tolerate variable performance?
│   ├─ YES → Consider B-series (burstable)
│   └─ NO → Downsize to smaller size in same family
└─ NO → Continue

Is VM using Premium SSD?
├─ YES → Is IOPS > 50% of disk limit?
│   ├─ YES → Keep Premium
│   └─ NO → Move to Standard SSD
└─ NO → Already optimized

Is workload running 24/7?
├─ NO → Implement auto-shutdown schedule
└─ YES → Is workload predictable?
    ├─ YES → Consider Reserved Instance or Savings Plan
    └─ NO → Evaluate Spot VMs for non-critical

Can workload be migrated to PaaS?
├─ YES → Evaluate App Service, AKS, or Functions
└─ NO → Optimize current IaaS configuration
```

## Storage Optimization Decision Tree

```
Is blob data accessed < once per 30 days?
├─ YES → Is it accessed < once per 180 days?
│   ├─ YES → Move to Archive tier
│   └─ NO → Move to Cool tier
└─ NO → Keep in Hot tier

Are there orphaned disks?
├─ YES → Are they snapshots or backups?
│   ├─ YES → Review retention policy, delete if expired
│   └─ NO → Delete immediately
└─ NO → Continue

Is Premium SSD being used?
├─ YES → Is IOPS utilization > 50%?
│   ├─ NO → Downgrade to Standard SSD
│   └─ YES → Keep Premium
└─ NO → Continue

Is storage using GRS redundancy?
├─ YES → Is geo-redundancy required?
│   ├─ NO → Switch to LRS (save 30-50%)
│   └─ YES → Consider ZRS as alternative
└─ NO → Already optimized

Are lifecycle policies configured?
├─ NO → Implement tiering rules (Hot→Cool→Archive→Delete)
└─ YES → Review and optimize rules
```

## Database Optimization Decision Tree

```
Is DTU/vCore utilization < 30% for 30 days?
├─ YES → Is the database idle > 50% of time?
│   ├─ YES → Switch to Serverless with auto-pause
│   └─ NO → Downsize tier
└─ NO → Continue

Are there multiple small databases?
├─ YES → Can they share resources?
│   ├─ YES → Consider Elastic Pool
│   └─ NO → Keep separate
└─ NO → Continue

Is Business Critical tier in use?
├─ YES → Is in-memory OLTP or high availability required?
│   ├─ NO → Switch to General Purpose (50-70% savings)
│   └─ YES → Keep Business Critical
└─ NO → Already cost-optimized

Is backup retention > 7 days for non-production?
├─ YES → Reduce to 7 days for dev/test
└─ NO → Already optimized

Are read replicas in use?
├─ YES → Are they being actively used?
│   ├─ NO → Remove unused replicas
│   └─ YES → Optimize replica size
└─ NO → Continue
```

---

# 🔐 **Azure Policy Examples**

## Enforce Required Tags

```json
{
  "mode": "Indexed",
  "policyRule": {
    "if": {
      "anyOf": [
        {
          "field": "tags['CostCenter']",
          "exists": "false"
        },
        {
          "field": "tags['Environment']",
          "exists": "false"
        },
        {
          "field": "tags['Owner']",
          "exists": "false"
        }
      ]
    },
    "then": {
      "effect": "deny"
    }
  }
}
```

## Deny Expensive VM Sizes in Dev/Test

```json
{
  "mode": "Indexed",
  "policyRule": {
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": "Microsoft.Compute/virtualMachines"
        },
        {
          "field": "tags['Environment']",
          "in": ["Dev", "Test", "QA"]
        },
        {
          "field": "Microsoft.Compute/virtualMachines/sku.name",
          "in": ["Standard_D16s_v3", "Standard_D32s_v3", "Standard_E16s_v3"]
        }
      ]
    },
    "then": {
      "effect": "deny"
    }
  }
}
```

## Require Managed Disks

```json
{
  "mode": "Indexed",
  "policyRule": {
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": "Microsoft.Compute/virtualMachines"
        },
        {
          "field": "Microsoft.Compute/virtualMachines/storageProfile.osDisk.managedDisk",
          "exists": "false"
        }
      ]
    },
    "then": {
      "effect": "deny"
    }
  }
}
```

## Deny Premium Storage for Non-Prod

```json
{
  "mode": "Indexed",
  "policyRule": {
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": "Microsoft.Compute/disks"
        },
        {
          "field": "Microsoft.Compute/disks/sku.name",
          "contains": "Premium"
        },
        {
          "field": "tags['Environment']",
          "notIn": ["Production", "Prod"]
        }
      ]
    },
    "then": {
      "effect": "deny"
    }
  }
}
```

---

# 🎤 **Interview Questions & Answers**

## Technical Questions

### Q1: What is the difference between amortized and unblended cost?

**Answer:**
- **Unblended cost** is the raw, pay-as-you-go cost before any commitment discounts (RIs/SPs) are applied. It shows what you would have paid at retail prices.
- **Amortized cost** spreads the upfront or commitment costs (Reserved Instances, Savings Plans) evenly across the usage period. It gives a true picture of ongoing costs after commitments.
- **When to use:** Use amortized cost for chargeback/showback and trend analysis. Use unblended cost for invoice reconciliation and comparing against retail pricing.

### Q2: How do you handle cost allocation for untagged resources?

**Answer:**
1. **Prevention:** Implement Azure Policy to deny deployment of resources without required tags
2. **Detection:** Run regular queries to identify untagged resources
3. **Remediation:** 
   - Apply default tags based on subscription or resource group
   - Use business mapping rules in Cloudability (e.g., "if subscription contains 'SAP' → allocate to SAP team")
   - Create "unallocated" bucket and incentivize teams to claim their resources
4. **Long-term:** Gradually reduce untagged resources to <5% through policy and culture

### Q3: Explain your approach to VM rightsizing.

**Answer:**
1. **Data Collection:** Gather 14-30 days of metrics (CPU, memory, disk, network) using Azure Monitor
2. **Analysis:** Identify VMs with consistent low utilization:
   - CPU < 40%
   - Memory < 40%
   - Low disk IOPS
3. **Recommendation:** 
   - Downsize by 1-2 sizes (D8→D4 or D4→D2)
   - Consider B-series for burstable workloads
   - Evaluate PaaS migration for web apps
4. **Validation:** Test in non-prod first, monitor performance
5. **Implementation:** Coordinate with app teams, implement during maintenance window
6. **Verification:** Monitor for 7 days post-change to ensure no degradation

### Q4: When would you choose Reserved Instances vs Savings Plans?

**Answer:**

**Reserved Instances:**
- Predictable, steady workloads (24/7)
- Same VM family and size for extended period
- Maximum discount (up to 72%)
- Less flexibility but higher savings
- **Example:** Production SQL Server VMs

**Savings Plans:**
- Variable workloads that scale
- Multiple VM families or regions
- More flexibility
- Lower discount than RI but broader coverage
- **Example:** AKS clusters with autoscaling

**Best Practice:** Use combination - RIs for baseline, Savings Plans for variable, and on-demand for burst.

### Q5: How do you allocate shared service costs?

**Answer:**

**Common shared services:**
- ExpressRoute, Hub VNet, Firewall, Bastion, Monitoring

**Allocation methods:**
1. **Proportional by usage:** 
   - Allocate VPN cost by data transferred per team
   - Distribute based on number of VMs per BU
2. **Equal split:** Simple but may not be fair
3. **Tiered model:** Heavy users pay more
4. **Cost per unit:** 
   - Charge $X per VM for firewall protection
   - Charge $Y per GB for storage

**Implementation:** Configure in Cloudability business mapping or create manual allocation in reports.

### Q6: What would you do if cloud costs suddenly increased by 200%?

**Answer:**

**Immediate actions (within 1 hour):**
1. Check Cost Management for daily cost breakdown
2. Identify which service caused the spike (Compute? Storage? SQL?)
3. Look at new resources deployed recently
4. Check for autoscaling misconfigurations

**Investigation (1-4 hours):**
5. Review deployment logs and changes
6. Check for security breaches (crypto mining)
7. Identify responsible team/subscription
8. Assess if it's expected (new project launch) or anomaly

**Remediation:**
9. If unintended: Stop/delete problematic resources immediately
10. If expected: Validate budget approval and forecast impact
11. Implement controls to prevent recurrence

**Communication:**
12. Notify finance and leadership
13. Document root cause analysis
14. Share lessons learned

## Behavioral Questions

### Q7: How do you handle pushback from engineering teams when you recommend shutting down resources?

**Answer:**
1. **Lead with data:** Show metrics proving low utilization and cost impact
2. **Understand their concerns:** Ask why the resource is needed
3. **Offer alternatives:** 
   - "Instead of deleting, can we implement auto-shutdown?"
   - "Can we move to a smaller size or Spot VM?"
4. **Show business impact:** Explain how savings fund other priorities
5. **Collaborative approach:** Position as optimization, not policing
6. **Escalation path:** If no agreement, involve management with data

### Q8: Describe a time you successfully reduced cloud costs significantly.

**Answer structure (STAR method):**
- **Situation:** "Company cloud spend increased 40% in 6 months..."
- **Task:** "I was tasked with finding 25% cost savings..."
- **Action:** 
  - "I analyzed 90 days of cost data"
  - "Identified 50 idle VMs and 200 orphaned disks"
  - "Implemented tagging policy and rightsized 30 VMs"
  - "Purchased Reserved Instances for baseline workloads"
- **Result:** "Achieved 32% cost reduction ($120K/month savings), improved cost visibility, and implemented ongoing governance"

### Q9: How do you communicate technical cost concepts to non-technical executives?

**Answer:**
1. **Use business language:** Talk ROI, budget impact, not technical jargon
2. **Visual storytelling:** Charts, graphs, trends - not tables of numbers
3. **Focus on outcomes:** "We can save $50K/month" not "We can rightsize D8 to D4"
4. **Provide context:** Compare to business metrics (cost per customer, cost per transaction)
5. **Executive summary:** Start with 3 key takeaways, then details
6. **Action-oriented:** Clear recommendations with next steps

## Scenario-Based Questions

### Q10: Your company is migrating 500 VMs to Azure. How do you ensure cost optimization from day one?

**Answer:**

**Pre-migration:**
1. Right-size during assessment (Azure Migrate recommendations)
2. Define tagging strategy and enforce via policy
3. Design subscription/RG structure for cost allocation
4. Calculate TCO and set budgets

**During migration:**
5. Deploy with cost-optimized templates (Terraform/Bicep)
6. Implement auto-shutdown for dev/test
7. Use Azure Hybrid Benefit for licenses
8. Enable Cost Management exports

**Post-migration:**
9. Validate actual vs. estimated costs
10. Identify quick wins (idle VMs, orphaned disks)
11. Purchase RIs for baseline workloads after 30 days
12. Establish monthly FinOps review cadence

**Governance:**
13. Azure Policy for cost controls
14. Budget alerts at multiple levels
15. Cloudability for business mapping and reporting

---

# 🔧 **Common Troubleshooting Scenarios**

## Scenario 1: Cost spike in storage

**Symptoms:** Storage costs increased 300% overnight

**Diagnosis steps:**
1. Check storage account metrics for sudden capacity increase
2. Look for large blob uploads or log growth
3. Check diagnostic log settings (are all logs enabled?)
4. Review snapshot and backup retention
5. Check for application logging or data export jobs

**Resolution:**
- Implement lifecycle policies (delete old logs)
- Disable unnecessary diagnostic logs
- Move cold data to Cool/Archive tier
- Clean up old snapshots

## Scenario 2: RI utilization is only 60%

**Symptoms:** Reserved Instances not fully utilized

**Diagnosis:**
1. Check if VMs matching RI size are running
2. Verify regional scope vs. subscription scope
3. Look for VMs being stopped/deallocated
4. Check if VMs were resized to different family

**Resolution:**
- Adjust RI scope to subscription or management group
- Consider exchanging for different size
- Ensure critical VMs run 24/7
- Use Savings Plans for more flexibility

## Scenario 3: Tags not showing in Cost Management

**Symptoms:** Resources have tags but Cost Management shows "untagged"

**Diagnosis:**
1. Tags applied after cost was already incurred (tags are prospective)
2. Cost export delay (can take 24-48 hours)
3. Tag name contains special characters
4. Resource provider doesn't support tagging

**Resolution:**
- Wait 24-48 hours for tags to appear in cost data
- Verify tag names follow Azure conventions
- Use resource groups for cost allocation as workaround
- Check resource type tagging support

## Scenario 4: Cloudability not showing Azure data

**Symptoms:** Cloudability dashboard empty or stale

**Diagnosis:**
1. Check Azure cost export is running (Cost Management → Exports)
2. Verify storage account connection is valid
3. Check service principal permissions
4. Look at Cloudability ingestion logs
5. Verify billing scope is correct (EA vs MCA)

**Resolution:**
- Reconfigure cost export with correct parameters
- Regenerate service principal credentials
- Grant Reader role on billing scope
- Contact Cloudability support for ingestion errors

## Scenario 5: Budget alerts not triggering

**Symptoms:** Spent over budget but no alerts received

**Diagnosis:**
1. Check budget threshold configuration
2. Verify action group is properly configured
3. Check email addresses are correct
4. Look for suppression rules
5. Verify budget scope matches spending location

**Resolution:**
- Reconfigure budget with lower thresholds for testing
- Update action group recipients
- Check spam/junk folders
- Test action group manually
- Ensure budget is at correct scope

---

# 🧮 **FinOps Formulas & Calculations**

## Cost Savings Calculations

```
Savings from Rightsizing:
= (Old VM monthly cost - New VM monthly cost) × number of VMs

Reserved Instance Savings:
= (On-demand hourly rate - RI hourly rate) × 730 hours × number of instances

Spot VM Savings:
= On-demand cost × (1 - spot discount %) × hours running

Azure Hybrid Benefit Savings:
= License cost included in VM price × number of VMs

Storage Tiering Savings:
= Data size in GB × (Hot tier cost - Cool tier cost)
```

## ROI Calculations

```
FinOps Program ROI:
= (Total savings - Program cost) / Program cost × 100%

Time to Value:
= Program cost / Monthly savings (in months)

Cost Avoidance:
= What would have been spent - Actual spend
```

## Efficiency Metrics

```
Cloud Efficiency Ratio:
= Value delivered / Total cloud spend

Waste Percentage:
= (Idle resources cost + Orphaned resources cost) / Total cost × 100%

Optimization Rate:
= Number of optimizations completed / Number of recommendations × 100%
```

## Unit Economics

```
Cost per Active User:
= Total monthly cloud spend / Number of active users

Cost per Transaction:
= Total monthly cloud spend / Number of transactions

Cost per API Call:
= API Management cost / Number of API calls

Cost per Environment:
= Environment total cost / Number of applications in environment
```

## Forecasting Formulas

```
Simple Linear Forecast:
Next Month = Current Month + ((Current - Previous) × growth factor)

Moving Average Forecast:
Next Month = Average(Last 3 months)

Seasonal Forecast:
Predicted = (Average daily cost × Days in month) × Seasonal factor
```

---

# 🎯 **Quick Tips**

## Daily FinOps Habits
- ✅ Check yesterday's costs vs. forecast (5 min)
- ✅ Review cost anomaly alerts (5 min)
- ✅ Scan for new untagged resources (5 min)

## Weekly FinOps Habits
- ✅ Review top 10 cost drivers (15 min)
- ✅ Check RI/SP utilization (10 min)
- ✅ Review and action optimization recommendations (30 min)
- ✅ Update stakeholder dashboard (15 min)

## Monthly FinOps Habits
- ✅ Month-close cost analysis (2 hours)
- ✅ Budget vs actual reconciliation (1 hour)
- ✅ Chargeback/showback report generation (2 hours)
- ✅ Stakeholder review meeting (1 hour)
- ✅ Update forecasts for next quarter (1 hour)
- ✅ Tag compliance review and remediation (1 hour)

## Interview Preparation
- ✅ Practice explaining cost optimization in simple terms
- ✅ Have 3 detailed project examples ready (STAR format)
- ✅ Know current Azure pricing for common services
- ✅ Be ready to write basic PowerShell/CLI on whiteboard
- ✅ Prepare questions about company's FinOps maturity

---

# 🔗 **Quick Links**

- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
- [Azure Cost Management Documentation](https://learn.microsoft.com/azure/cost-management-billing/)
- [FinOps Foundation](https://www.finops.org/)
- [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost)
- [Azure Resource Graph Explorer](https://portal.azure.com/#view/HubsExtension/ArgQueryBlade)

---

*Last Updated: November 2025*
*Keep this cheat sheet handy for daily FinOps operations and interview preparation!*
