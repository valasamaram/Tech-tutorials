# Module 0 — Prep & Fundamentals (Cloud + Azure basics → Advanced)

This lesson takes you from zero to confident in the core cloud and Azure fundamentals. It includes conceptual material, hands-on labs (Portal, Azure CLI, PowerShell, Bicep validation), a troubleshooting checklist, small quizzes, and assignments.

Estimated time: 1–2 weeks (standard track). Adjust pace if you're on the fast or deep track.

---

## Learning objectives
By the end of this module you will be able to:
- Explain cloud computing models (IaaS, PaaS, SaaS) and deployment models (public, private, hybrid).
- Describe Azure components: subscriptions, management groups, resource groups, resources, regions, availability zones, and pricing model basics.
- Use the Azure Portal, Azure CLI, and Azure PowerShell to create and manage a resource group and simple resources (VM, storage account).
- Understand identity basics (Azure AD → user vs service principal vs managed identity) and basic RBAC concepts.
- Apply tags and cost-control basics (budgets, cost analysis) and implement basic policies.
- Validate, troubleshoot, and clean up resources.

---

## Concepts — from basics to deeper understanding

### 1. Cloud computing models (short)
- IaaS (Infrastructure as a Service): raw VMs, network, and storage you manage (OS updates, patching). Example: Azure Virtual Machines.
- PaaS (Platform as a Service): platform-managed runtime and scaling, you manage application code. Example: Azure App Service.
- SaaS (Software as a Service): fully managed applications. Example: Office 365.

Why it matters: choose the right level of control vs operational overhead.

### 2. Deployment models (public/hybrid/private)
- Public cloud: infrastructure run by Azure; shared multi-tenant model.
- Private cloud: single-tenant; dedicated hardware (on-prem or hosted).
- Hybrid cloud: combination, often using VPN/ExpressRoute and identity integration.

### 3. Azure organizational constructs
- Tenant (Azure AD): identity boundary for an organization.
- Subscription: billing boundary and resource quota container.
- Management groups: group subscriptions for governance and policy assignment.
- Resource groups: logical container to group related resources for lifecycle and RBAC.
- Resources: any service deployed in Azure (VM, storage, SQL, function).

Deeper: understand tenant vs subscription vs management groups for governance and policy inheritance.

### 4. Regions, availability zones & pairs
- Region: geographic area where Azure services are hosted.
- Availability Zone: physically separate datacenters within a region.
- Region pair: pre-defined pair for disaster recovery guarantees and coordinated updates.

Deeper: region selection affects latency, data residency, and available services. Availability zones vs availability sets trade-offs.

### 5. Azure pricing basics & cost controls
- Pricing model: pay-as-you-go, reserved instances (1/3-year), spot instances.
- Cost controls: tags, budgets, Cost Management, reservations, Azure Hybrid Benefit.

Deeper: understand pricing calculators, TCO considerations, and cost-saving patterns (auto-shutdown non-prod, reserved instances, right-sizing).

### 6. Identity basics
- Azure AD vs AD DS: Azure AD is an identity and access management service for cloud resources (OAuth, OpenID Connect, SAML). AD DS is traditional on-premises directory.
- Users vs service principals vs managed identities:
  - User: human identity.
  - Service principal: application identity in Azure AD (used for automation/CI).
  - Managed identity: platform-managed identity tied to a resource (VM, Function) with automatic credential rotation.

Deeper: tokens, OAuth flows, and when to use managed identity vs SP.

### 7. RBAC & least privilege
- Roles: Owner, Contributor, Reader, and many built-in roles.
- Assign to groups, not individual users.
- Use custom roles only when necessary.

Deeper: resource-scoped RBAC vs management-group scoped assignments; role assignment evaluation and deny policies.

### 8. Tools & IaC basics
- Azure Portal: GUI for exploration and quick tasks.
- Azure CLI: cross-platform command-line tool.
- Azure PowerShell (Az module): PowerShell-oriented commands.
- IaC: ARM templates, Bicep (recommended) — author declarative resource definitions.

Deeper: authoring Bicep modules and parameter files; local validation with "bicep build" and `az deployment group create --template-file`.

---

## Hands-on labs (practical)
Each lab includes step-by-step commands and validation. Perform them in a sandbox subscription or a free trial.

### Lab 0.1 — Setup & tools (15–30m)
Goals: install Azure CLI, login, and set default subscription.

Install Azure CLI (Windows PowerShell):
```powershell
# Install (if not installed already)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'

# Login
az login

# List subscriptions
az account list -o table

# Set default subscription
az account set --subscription "<subscription-id-or-name>"
```

Install Az PowerShell module (optional):
```powershell
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
Connect-AzAccount
```

Validation:
```powershell
az account show -o table
```

### Lab 0.2 — Create resource group & simple VM (Portal + CLI)
Goals: create RG, create a Linux VM using CLI, open SSH port, and verify connectivity.

CLI steps:
```powershell
# Variables
$rg = 'rg-fundamentals'
$location = 'eastus'

# Create RG
az group create --name $rg --location $location

# Create SSH key (if not exists)
if (-not (Test-Path "$env:USERPROFILE\.ssh\id_rsa.pub")) { ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\id_rsa" -N "" }

# Create VM
az vm create --resource-group $rg --name demoVM --image UbuntuLTS --admin-username azureuser --ssh-key-value "$env:USERPROFILE\.ssh\id_rsa.pub"

# Open SSH port (NSG rule)
az vm open-port --resource-group $rg --name demoVM --port 22

# Get public IP
az vm list-ip-addresses --name demoVM -g $rg -o table
```

Portal steps: show how to create RG, VM, and check NSG inbound rules.

Validation:
- SSH into public IP.
- Verify VM is running in Portal and shows resource group.

Cleanup:
```powershell
az group delete --name $rg --yes --no-wait
```

### Lab 0.3 — Create Storage account and blob container (CLI)
Goals: create storage account, container, upload a small file, and view properties in Portal.

Commands:
```powershell
$rg = 'rg-fundamentals'
$location = 'eastus'
$sa = 'fundamentalsa'$([System.Guid]::NewGuid().ToString('N').Substring(0,8))

az group create --name $rg --location $location
az storage account create --name $sa --resource-group $rg --location $location --sku Standard_LRS --kind StorageV2

# Get keys
$key = az storage account keys list --resource-group $rg --account-name $sa --query "[0].value" -o tsv

# Create container and upload
az storage container create --account-name $sa --name demo --account-key $key
az storage blob upload --account-name $sa --container-name demo --name hello.txt --file README.md --account-key $key

# List blobs
az storage blob list --account-name $sa --container-name demo --account-key $key -o table
```

Cleanup:
```powershell
az group delete --name $rg --yes --no-wait
```

### Lab 0.4 — Bicep: Validate a simple template (resource group + storage)
Goals: author a small Bicep file to create a storage account and deploy it.

`storage.bicep`:
```bicep
param location string = resourceGroup().location
param storageName string

resource sa 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: storageName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

output storageId string = sa.id
```

Deploy:
```powershell
az deployment group create --resource-group $rg --template-file storage.bicep --parameters storageName='fundamentalsa123'
```

Validation:
- Check deployment status in Portal and outputs.

Cleanup:
```powershell
az group delete --name $rg --yes --no-wait
```

---

## Troubleshooting checklist (common starter issues)
- Login errors: ensure `az login` succeeded and subscription selected.
- Quota errors: check subscription quotas and region availability.
- NSG blocking: verify effective security rules for VM NIC; use `az network nic show-effective-nsg`.
- DNS resolution: check Azure DNS/private DNS zones if using custom names.
- Bicep validation: run `bicep build` to detect compile-time errors and `az deployment group validate` for template validation.

---

## Quizzes & Assessments
Short quiz (conceptual):
1. Explain difference between subscription and tenant.
2. When to use Availability Zones vs Availability Sets?
3. Describe the use-cases for managed identity vs service principal.

Practical assessment:
- Deploy a VM and a storage account using CLI and Bicep; submit a screenshot of both resources in the Portal and paste the deployment output.

---

## Grading rubric (lab deliverables)
- Lab correctness (50%): resources created as instructed, outputs present, connections validated.
- Security & hygiene (20%): tags applied, least-privilege secrets handling, cleanup script provided.
- Explanation & reasoning (20%): short write-up explaining choices (region, SKU, sizing).
- Bonus (10%): add a small automation (GitHub Action or script) to re-run the lab.

---

## Further reading & references
- Azure fundamentals learning path: https://learn.microsoft.com/learn/paths/azure-fundamentals/
- Bicep docs: https://learn.microsoft.com/azure/azure-resource-manager/bicep
- Azure CLI docs: https://learn.microsoft.com/cli/azure

---

## Next actions (if you confirm)
- I will add a grading rubric for Module 0 labs and create the week-1 schedule and session notes.
- I can also generate a parameterized Bicep file and a GitHub Actions workflow to deploy the lab automatically.

Choose: add grading rubric only, or add rubric + automated lab deploy pipeline (GitHub Actions).
# Module 0 — Prep & Fundamentals (Cloud + Azure basics → Advanced)

This lesson takes you from zero to confident in the core cloud and Azure fundamentals. It includes conceptual material, hands-on labs (Portal, Azure CLI, PowerShell, Bicep validation), a troubleshooting checklist, small quizzes, and assignments.

Estimated time: 1–2 weeks (standard track). Adjust pace if you're on the fast or deep track.

---

## Learning objectives
By the end of this module you will be able to:
- Explain cloud computing models (IaaS, PaaS, SaaS) and deployment models (public, private, hybrid).
- Describe Azure components: subscriptions, management groups, resource groups, resources, regions, availability zones, and pricing model basics.
- Use the Azure Portal, Azure CLI, and Azure PowerShell to create and manage a resource group and simple resources (VM, storage account).
- Understand identity basics (Azure AD → user vs service principal vs managed identity) and basic RBAC concepts.
- Apply tags and cost-control basics (budgets, cost analysis) and implement basic policies.
- Validate, troubleshoot, and clean up resources.

---

## Concepts — from basics to deeper understanding

### 1. Cloud computing models (short)
- IaaS (Infrastructure as a Service): raw VMs, network, and storage you manage (OS updates, patching). Example: Azure Virtual Machines.
- PaaS (Platform as a Service): platform-managed runtime and scaling, you manage application code. Example: Azure App Service.
- SaaS (Software as a Service): fully managed applications. Example: Office 365.

Why it matters: choose the right level of control vs operational overhead.

### 2. Deployment models (public/hybrid/private)
- Public cloud: infrastructure run by Azure; shared multi-tenant model.
- Private cloud: single-tenant; dedicated hardware (on-prem or hosted).
- Hybrid cloud: combination, often using VPN/ExpressRoute and identity integration.

### 3. Azure organizational constructs
- Tenant (Azure AD): identity boundary for an organization.
- Subscription: billing boundary and resource quota container.
- Management groups: group subscriptions for governance and policy assignment.
- Resource groups: logical container to group related resources for lifecycle and RBAC.
- Resources: any service deployed in Azure (VM, storage, SQL, function).

Deeper: understand tenant vs subscription vs management groups for governance and policy inheritance.

### 4. Regions, availability zones & pairs
- Region: geographic area where Azure services are hosted.
- Availability Zone: physically separate datacenters within a region.
- Region pair: pre-defined pair for disaster recovery guarantees and coordinated updates.

Deeper: region selection affects latency, data residency, and available services. Availability zones vs availability sets trade-offs.

### 5. Azure pricing basics & cost controls
- Pricing model: pay-as-you-go, reserved instances (1/3-year), spot instances.
- Cost controls: tags, budgets, Cost Management, reservations, Azure Hybrid Benefit.

Deeper: understand pricing calculators, TCO considerations, and cost-saving patterns (auto-shutdown non-prod, reserved instances, right-sizing).

### 6. Identity basics
- Azure AD vs AD DS: Azure AD is an identity and access management service for cloud resources (OAuth, OpenID Connect, SAML). AD DS is traditional on-premises directory.
- Users vs service principals vs managed identities:
  - User: human identity.
  - Service principal: application identity in Azure AD (used for automation/CI).
  - Managed identity: platform-managed identity tied to a resource (VM, Function) with automatic credential rotation.

Deeper: tokens, OAuth flows, and when to use managed identity vs SP.

### 7. RBAC & least privilege
- Roles: Owner, Contributor, Reader, and many built-in roles.
- Assign to groups, not individual users.
- Use custom roles only when necessary.

Deeper: resource-scoped RBAC vs management-group scoped assignments; role assignment evaluation and deny policies.

### 8. Tools & IaC basics
- Azure Portal: GUI for exploration and quick tasks.
- Azure CLI: cross-platform command-line tool.
- Azure PowerShell (Az module): PowerShell-oriented commands.
- IaC: ARM templates, Bicep (recommended) — author declarative resource definitions.

Deeper: authoring Bicep modules and parameter files; local validation with "bicep build" and "az deployment group create --template-file".

---

## Hands-on labs (practical)
Each lab includes step-by-step commands and validation. Perform them in a sandbox subscription or a free trial.

### Lab 0.1 — Setup & tools (15–30m)
Goals: install Azure CLI, login, and set default subscription.

Install Azure CLI (Windows PowerShell):
```powershell
# Install (if not installed already)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'

# Login
az login

# List subscriptions
az account list -o table

# Set default subscription
az account set --subscription "<subscription-id-or-name>"
```

Install Az PowerShell module (optional):
```powershell
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
Connect-AzAccount
```

Validation:
```powershell
az account show -o table
```

### Lab 0.2 — Create resource group & simple VM (Portal + CLI)
Goals: create RG, create a Linux VM using CLI, open SSH port, and verify connectivity.

CLI steps:
```powershell
# Variables
$rg = 'rg-fundamentals'
$location = 'eastus'

# Create RG
az group create --name $rg --location $location

# Create SSH key (if not exists)
if (-not (Test-Path "$env:USERPROFILE\.ssh\id_rsa.pub")) { ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\id_rsa" -N "" }

# Create VM
az vm create --resource-group $rg --name demoVM --image UbuntuLTS --admin-username azureuser --ssh-key-value "$env:USERPROFILE\.ssh\id_rsa.pub"

# Open SSH port (NSG rule)
az vm open-port --resource-group $rg --name demoVM --port 22

# Get public IP
az vm list-ip-addresses --name demoVM -g $rg -o table
```

Portal steps: show how to create RG, VM, and check NSG inbound rules.

Validation:
- SSH into public IP.
- Verify VM is running in Portal and shows resource group.

Cleanup:
```powershell
az group delete --name $rg --yes --no-wait
```

### Lab 0.3 — Create Storage account and blob container (CLI)
Goals: create storage account, container, upload a small file, and view properties in Portal.

Commands:
```powershell
$rg = 'rg-fundamentals'
$location = 'eastus'
$sa = 'fundamentalsa'$([System.Guid]::NewGuid().ToString('N').Substring(0,8))

az group create --name $rg --location $location
az storage account create --name $sa --resource-group $rg --location $location --sku Standard_LRS --kind StorageV2

# Get keys
$key = az storage account keys list --resource-group $rg --account-name $sa --query "[0].value" -o tsv

# Create container and upload
az storage container create --account-name $sa --name demo --account-key $key
az storage blob upload --account-name $sa --container-name demo --name hello.txt --file README.md --account-key $key

# List blobs
az storage blob list --account-name $sa --container-name demo --account-key $key -o table
```

Cleanup:
```powershell
az group delete --name $rg --yes --no-wait
```

### Lab 0.4 — Bicep: Validate a simple template (resource group + storage)
Goals: author a small Bicep file to create a storage account and deploy it.

`storage.bicep`:
```bicep
param location string = resourceGroup().location
param storageName string

resource sa 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: storageName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

output storageId string = sa.id
```

Deploy:
```powershell
az deployment group create --resource-group $rg --template-file storage.bicep --parameters storageName='fundamentalsa123'
```

Validation:
- Check deployment status in Portal and outputs.

Cleanup:
```powershell
az group delete --name $rg --yes --no-wait
```

---

## Troubleshooting checklist (common starter issues)
- Login errors: ensure `az login` succeeded and subscription selected.
- Quota errors: check subscription quotas and region availability.
- NSG blocking: verify effective security rules for VM NIC; use `az network nic show-effective-nsg`.
- DNS resolution: check Azure DNS/private DNS zones if using custom names.
- Bicep validation: run `bicep build` to detect compile-time errors and `az deployment group validate` for template validation.

---

## Quizzes & Assessments
Short quiz (conceptual):
1. Explain difference between subscription and tenant.
2. When to use Availability Zones vs Availability Sets?
3. Describe the use-cases for managed identity vs service principal.

Practical assessment:
- Deploy a VM and a storage account using CLI and Bicep; submit a screenshot of both resources in the Portal and paste the deployment output.

---

## Further reading & references
- Azure fundamentals learning path: https://learn.microsoft.com/learn/paths/azure-fundamentals/
- Bicep docs: https://learn.microsoft.com/azure/azure-resource-manager/bicep
- Azure CLI docs: https://learn.microsoft.com/cli/azure

---

## Next actions (if you confirm)
- I will add a grading rubric for Module 0 labs and create the week-1 schedule and session notes.
- I can also generate a parameterized Bicep file and a GitHub Actions workflow to deploy the lab automatically.

Choose: add grading rubric only, or add rubric + automated lab deploy pipeline (GitHub Actions).