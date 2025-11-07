# Availability Sets — Deep Dive

## Table of Contents
1. [What is an Availability Set?](#what-is-an-availability-set)
2. [Key Concepts](#key-concepts)
   - Fault Domains (FD)
   - Update Domains (UD)
3. [How Availability Sets Work](#how-availability-sets-work)
4. [When to Use Availability Sets vs Availability Zones](#when-to-use-availability-sets-vs-availability-zones)
5. [Choosing Fault Domains and Update Domains](#choosing-fds-and-uds)
6. [Examples and Deployment](#examples-and-deployment)
   - Azure CLI
   - PowerShell
   - ARM template (minimal)
   - Bicep (minimal)
7. [Best Practices](#best-practices)
8. [Limitations and Notes](#limitations-and-notes)
9. [Troubleshooting Checklist](#troubleshooting-checklist)
10. [Additional Resources](#additional-resources)

---

## What is an Availability Set?
An Availability Set is an Azure compute construct that ensures your Virtual Machines (VMs) are distributed across multiple physical and logical boundaries to reduce the impact of hardware failures and planned maintenance. Put simply: group VMs that provide the same service into an Availability Set so they don't all go down at once.

Key benefits:
- Protects against single-rack/hardware failures (via Fault Domains).
- Minimizes downtime during platform/OS update cycles (via Update Domains).
- Required for certain Azure VM SLA guarantees when you have two or more instances.

---

## Key Concepts

### Fault Domains (FD)
- FD = physical separation (racks, power circuits, network switches).
- VMs in different FDs won't share the same single point of hardware failure.
- Typical counts: 2 or 3 FDs per region (region-specific limits apply).

### Update Domains (UD)
- UD = logical grouping for planned maintenance.
- During platform or host patching, Azure updates one UD at a time so not all VMs reboot simultaneously.
- Default UD values and max UD count can vary; common defaults are 5 (can be up to 20 when supported).

---

## How Availability Sets Work
1. When you create an Availability Set you specify the number of fault domains and update domains (subject to regional limits).
2. Azure assigns each VM placed into the Availability Set to a specific FD and UD.
3. During an unplanned hardware failure, only VMs in the affected FD are impacted.
4. During planned maintenance, Azure cycles through UDs, restarting only VMs in one UD at a time.

Example distribution (4 VMs, 2 FDs, 2 UDs):

| VM  | Fault Domain | Update Domain |
|-----|--------------|---------------|
| VM1 | FD0          | UD0           |
| VM2 | FD1          | UD1           |
| VM3 | FD0          | UD1           |
| VM4 | FD1          | UD0           |

Outcome:
- If FD0 fails → VM1 & VM3 impacted; VM2 & VM4 remain running.
- During maintenance of UD0 → VM1 & VM4 reboot while UD1 remains online.

---

## When to Use Availability Sets vs Availability Zones
- Availability Set: Use when you need high availability within a single Azure region and do not need cross-AZ redundancy. Good for classic single-region deployments where zone support isn't necessary or available.
- Availability Zone: Use when you need higher resilience against entire datacenter failures — zones are physically separated datacenters within a region.

Quick guidance:
- Use Availability Zones for critical services that must survive a datacenter outage and where the region supports zones.
- Use Availability Sets for compatibility, simpler deployments, or when zones aren't available in the chosen region.
- Note: Availability Sets and Availability Zones are not mutually substitutable — zones provide stronger failure domain separation.

---

## Choosing FDs and UDs
Consider these factors:
- Number of VMs in the set
- Tolerance for partial failures (how many VMs can go down)
- Tolerance for maintenance (how many VMs can restart at once)
- Region limits (check the region's supported FD and UD counts)

Rule-of-thumb table:

| Workload size | Fault Domains (FD) | Update Domains (UD) |
|---------------|---------------------|---------------------|
| Small (1-5 VMs)  | 2                   | 5 (default)         |
| Medium (6-20 VMs) | 3                   | 5–10                |
| Large (>20 VMs)   | 3+ (if supported)   | Increase toward 20  |

A simple approach:
1. Count VMs.
2. Decide max acceptable simultaneous failures (map to FDs).
3. Decide how many VMs restarting at once you can tolerate (map to UDs).
4. Verify regional limits and set the Availability Set accordingly.

---

## Examples and Deployment
Below are practical examples to create an Availability Set and VMs that join it.

### Azure CLI
Create availability set and two VMs (Linux example):

```powershell
# Create a resource group
az group create --name rg-demo --location eastus

# Create the availability set (2 FDs, 5 UDs)
az vm availability-set create --resource-group rg-demo --name myAS --platform-fault-domain-count 2 --platform-update-domain-count 5

# Create two VMs in the availability set
az vm create --resource-group rg-demo --name vm1 --image UbuntuLTS --admin-username azureuser --generate-ssh-keys --availability-set myAS
az vm create --resource-group rg-demo --name vm2 --image UbuntuLTS --admin-username azureuser --generate-ssh-keys --availability-set myAS
```

Notes: Azure CLI on Windows PowerShell is fine; the CLI commands are the same.

### PowerShell (Az module)

```powershell
# Create a resource group
New-AzResourceGroup -Name rg-demo -Location eastus

# Create an availability set
$as = New-AzAvailabilitySet -ResourceGroupName rg-demo -Location eastus -Name myAS -PlatformFaultDomainCount 2 -PlatformUpdateDomainCount 5 -Sku Aligned

# Create a virtual network and subnet for VMs (minimal)
$vnet = New-AzVirtualNetwork -ResourceGroupName rg-demo -Location eastus -Name vnet1 -AddressPrefix 10.0.0.0/16
$subnetConfig = Add-AzVirtualNetworkSubnetConfig -Name default -AddressPrefix 10.0.0.0/24 -VirtualNetwork $vnet
$vnet | Set-AzVirtualNetwork

# Create two VMs assigned to that availability set (omitting nic & ip steps for brevity)
# Use New-AzVM with -AvailabilitySetId $as.Id when creating each VM
```

### ARM template (minimal availability set resource)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Compute/availabilitySets",
      "apiVersion": "2021-07-01",
      "name": "myAS",
      "location": "eastus",
      "properties": {
        "platformFaultDomainCount": 2,
        "platformUpdateDomainCount": 5
      }
    }
  ]
}
```

When creating a VM resource, reference the availability set by ID in the VM properties.

### Bicep (minimal)

```bicep
resource myAS 'Microsoft.Compute/availabilitySets@2021-07-01' = {
  name: 'myAS'
  location: 'eastus'
  properties: {
    platformFaultDomainCount: 2
    platformUpdateDomainCount: 5
  }
}

// Sample VM would reference myAS.id in availabilityProfile/availabilitySet
```

---

## Best Practices
- Place at least two instances of a critical VM in an Availability Set to qualify for a higher SLA.
- Use consistent naming for availability sets and related VMs (ex: svcname-env-as).
- Combine Availability Sets with Load Balancers/Traffic Manager for service-level availability.
- Use managed identities for VMs and avoid storing credentials in code.
- Tag resources for cost and lifecycle management.
- For large scale-out workloads, consider Virtual Machine Scale Sets (VMSS) which handle distribution automatically.

---

## Limitations and Notes
- Availability Sets are scoped to a single Azure region and a single fault/scale boundary — they do not provide cross-region redundancy.
- They do not protect against full datacenter or zonal failures (use Availability Zones for that level of resilience).
- Some older VM SKUs may have different FD/UD behavior; always check the SKU documentation.
- The exact number of FDs available can vary by region and by underlying hardware; check Azure's regional documentation.
- An Availability Set is free — you pay only for the VMs and resources themselves.

---

## Troubleshooting Checklist
- Symptom: VMs in the same Availability Set restarted together during maintenance.
  - Confirm the VMs were actually in the same UD (use Azure Portal or CLI to inspect assignment).
  - Check platform maintenance notifications in Azure Service Health.

- Symptom: One VM failed while others in same Availability Set are fine.
  - Inspect Azure Resource Health and the VM's boot diagnostics.
  - Check activity logs for host-level failures.

- Tools to help diagnose:
  - Azure Resource Health (resource-level health details).
  - Activity Log (who/what/when for resource changes).
  - Azure Monitor and Log Analytics (for performance and logs).
  - Support Requests (for hardware failures that require Microsoft support).

---

## Additional Resources
- Azure documentation: https://learn.microsoft.com/azure
- Availability Sets overview: https://learn.microsoft.com/azure/virtual-machines/availability-set
- ARM template reference: https://learn.microsoft.com/azure/templates/
- Bicep documentation: https://learn.microsoft.com/azure/azure-resource-manager/bicep/

---

## Quick Summary
- Use Availability Sets to reduce the blast radius of hardware failures and planned maintenance inside a region.
- Choose FD and UD counts based on workload size and availability needs.
- For stronger isolation and resilience, use Availability Zones when available in the region.

If you'd like, I can:
- Add a ready-to-run ARM template that deploys an Availability Set with 3 VMs and a load balancer.
- Create an SVG diagram showing FDs and UDs placement that you can embed in the doc.
- Add a short automated test script to validate that VMs are created in different FDs/UDs.
