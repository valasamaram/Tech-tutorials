# Module 1 — Compute, Storage & Networking: Hands-on Lab

This lab provides two practical, minimal Bicep templates and step-by-step guidance to practice core Module 1 concepts:

- vmss.bicep — deploy a small Virtual Machine Scale Set behind an Azure Standard Load Balancer (basic scaling, health probe).
- hub_spoke.bicep — deploy a hub-and-spoke skeleton with a hub vNet and two spoke vNets, route table and a simple network security group rule.

Prerequisites
- Azure subscription with Contributor or Owner privileges.
- Azure CLI installed and logged in (az login) or Azure PowerShell with Az module.
- Bicep CLI (optional; `az deployment sub create` will compile Bicep automatically).

Quick start (Azure CLI)
1. Change to this directory in PowerShell:

   cd "c:\Users\believeme\Documents\Tech-tutorials\tutorials\azure_guide\module_01_lab"

2. Deploy the VMSS example (creates resource group and VMSS):

   az deployment sub create --location eastus --template-file vmss.bicep --parameters adminUsername="azureuser" adminPasswordOrKey="<YourP@ssw0rd!>" prefix="m1lab"

3. Deploy the hub-and-spoke example:

   az deployment sub create --location eastus --template-file hub_spoke.bicep --parameters location="eastus" prefix="m1hub"

Files
- vmss.bicep — VM Scale Set example
- hub_spoke.bicep — Hub-and-spoke networking skeleton

Notes and safety
- These templates are intentionally minimal and for learning only. Do not use the admin password value in production; prefer SSH key for Linux or Key Vault integration.
- Template deployments at subscription-level are used here for simplicity; you can deploy at resource-group scope by changing the deployment command to `az deployment group create` and adding `resourceGroupName`.

Next steps
- Add a Key Vault and store secrets; integrate managed identities for VMSS.
- Extend the hub with a firewall or NAT gateway.
- Add Private Endpoints for PaaS resources in spokes.

Support
If you want, I can run a quick validation of the Bicep files for syntax and produce parameter files. Tell me to "validate" or "expand" any template.
