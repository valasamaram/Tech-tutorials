# Module 8 — Containers & Serverless (Fundamentals → Advanced)

Scope: container basics, Azure Kubernetes Service (AKS), container registries, CI/CD for containers, serverless (Azure Functions, Durable Functions), event-driven patterns and security for containerized workloads.

## Learning objectives
- Understand container images, registries (ACR), and secure image supply chains.
- Deploy and operate AKS clusters (node pools, autoscaling, networking models).
- Implement CI/CD for containers: build, scan, push, and deploy via GitHub Actions or Azure Pipelines.
- Design serverless functions for event-driven workloads and integrate with managed identities and Key Vault.

---

## Container fundamentals

### Images and registries
- Container images are immutable layers; use multi-stage builds to reduce final image size.
- Azure Container Registry (ACR) stores images; enable Content Trust and image scanning (e.g., Microsoft Defender for Containers or third-party scanners).

### Image signing and scanning
- Use ACR Tasks or pipeline steps to scan images. Use Azure Container Registry vulnerability assessment integrations.

---

## AKS deep dive

### Cluster basics
- Managed Kubernetes: AKS separates control plane (managed by Azure) from node pools (your responsibility).
- Node pools: system vs user node pools; spot instances for low-cost non-critical workloads.

### Networking models
- Kubenet vs Azure CNI: Kubenet uses NAT for pod IPs; Azure CNI gives pods real IPs from vNet (recommended for advanced networking and Azure native integrations).

### Security
- Use Pod Identity (workload identity) to avoid secrets; integrate Key Vault with CSI driver for secret injection.
- Use network policies (Calico) to restrict pod-to-pod traffic; enforce admission policies with OPA/Gatekeeper.

### Scaling and upgrades
- Cluster autoscaler for node pool scaling; Horizontal Pod Autoscaler (HPA) for pod scaling.
- Use upgrade channels and node pool rolling upgrades; test upgrades on non-production clusters first.

---

## Serverless — Azure Functions

### Hosting plans
- Consumption (pay-per-execution), Premium (pre-warmed instances, VNet integration), Dedicated (App Service plan).

### Durable Functions & patterns
- Durable Functions for orchestrations, fan-out/fan-in, and long-running workflows.

### Triggers and bindings
- Event Grid, Event Hubs, Service Bus, HTTP triggers — choose based on throughput and ordering requirements.

---

## CI/CD for containers and serverless

### Build pipeline
- Build image, run unit tests, scan image, push to ACR, tag with semantic versioning.

### Deploy pipeline
- Use GitHub Actions or Azure Pipelines to deploy Helm charts to AKS or to deploy function packages.
- Use preview environments (ephemeral namespaces) for PR validation.

Example GitHub Actions step (push image to ACR):
```yaml
- name: Build and push
  uses: docker/build-push-action@v3
  with:
    context: .
    push: true
    tags: ${{ env.ACR_NAME }}.azurecr.io/myapp:${{ github.sha }}
```

---

## Observability & operations

- Collect cluster metrics (Metrics Server / Prometheus), use Azure Monitor for containers for integrated logging and insights.
- Configure liveness/readiness probes, pod disruption budgets, and resource requests/limits to ensure stability.

---

## Labs (practical)

- Lab 8.1 — AKS quickstart:
  1. Create ACR and AKS cluster with Azure CNI and a user node pool.
  2. Deploy a sample app with Helm and configure an ingress controller (AGIC or NGINX) and TLS.

- Lab 8.2 — Secure image pipeline:
  1. Build image in GitHub Actions, scan with a vulnerability scanner, push to ACR and deploy to AKS.

- Lab 8.3 — Serverless orchestration:
  1. Create an Azure Function (Durable) that processes a batch job and writes status to Cosmos DB.

Validation commands (examples):
```powershell
# AKS: get node pools
az aks nodepool list --resource-group rg-demo --cluster-name aks-demo -o table

# ACR: list images
az acr repository list --name myacr --output table

# Functions: check function app logs
az webapp log tail --name func-demo --resource-group rg-demo
```

---

## Troubleshooting tips

- Image not pulling: check ACR credentials and role assignment for the cluster identity (ACRPull role).
- Pod crashloops: check `kubectl describe pod`, `kubectl logs`, and liveness/readiness probe configuration.
- Function auth errors: verify managed identity permissions and Key Vault access policies.

---

## Interview & design tips

- Be ready to explain AKS networking trade-offs (Azure CNI vs Kubenet), how you secure container supply chain, and when to choose serverless vs containers.

---

## References
- AKS best practices: https://learn.microsoft.com/azure/aks/
- Azure Functions patterns: https://learn.microsoft.com/azure/azure-functions/
# Module 8 — Containers, Serverless & App Platforms (Basics → Advanced)

Scope: AKS, container registries, serverless Functions, Logic Apps, App Service, ingress controllers, service mesh, CI/CD for containers, observability and security for container platforms.

Learning objectives
- Deploy and operate an AKS cluster with node pools, autoscaling, and ingress (NGINX/Application Gateway).
- Use ACR for container image management and implement image signing and scanning.
- Implement Functions with managed identities and durable functions for orchestrations.
- Understand service mesh basics (Istio/Linkerd/Consul) and when to use them.

Advanced topics
- AKS node pool types: spot, GPU, and system/user node pools for workload separation.
- Cluster autoscaler vs KEDA for event-driven scaling.
- Network policies in AKS (Calico) and securing pod-to-pod communications.
- CI/CD for containers: image build, notarization, and deployment strategies (blue/green, canary with Flagger).

Hands-on labs
- Lab 8.1: Provision AKS with two node pools and install NGINX ingress; deploy a sample microservice and expose via ingress.
- Lab 8.2: Configure GitHub Actions to build and push images to ACR and deploy to AKS using Helm.
- Lab 8.3: Create an Azure Function with system-managed identity that pulls configuration from Key Vault and triggers a durable function orchestrator.

Commands & snippets
- AKS create with managed identity and node pools (CLI):
```
az aks create -g rg-demo -n aks-demo --node-count 2 --enable-managed-identity --network-plugin kubenet
az aks nodepool add --resource-group rg-demo --cluster-name aks-demo --name userpool --node-count 3 --node-vm-size Standard_D4s_v3
```

- Build & push to ACR (GitHub Actions step):
```yaml
- name: Build and push image
  uses: docker/build-push-action@v4
  with:
    context: .
    push: true
    tags: ${{ env.ACR_NAME }}.azurecr.io/myapp:${{ github.sha }}
```

Design checklist
- Secure container registries with firewall rules and ACR tokens or managed identities.
- Use Pod Security Admission and image policies to prevent untrusted images.
- Separate infra and workload concerns: use namespaces, network policies, and resource quotas.

Study checkpoint
- Deliverable: production-ready AKS architecture with CI/CD pipeline and security controls documented.

Further reading
- AKS best practices: https://learn.microsoft.com/azure/aks/best-practices

---
