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
