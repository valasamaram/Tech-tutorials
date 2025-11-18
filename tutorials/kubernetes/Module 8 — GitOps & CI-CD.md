# 🚀 **Module 8 — GitOps & CI/CD for Kubernetes (Deep Dive)**

This module teaches you **how production engineering teams deliver software**, automate deployments, enforce governance, and manage Kubernetes reliably using **GitOps + CI/CD**.

---

# 🧭 **Why GitOps & CI/CD Matter**

Modern Kubernetes environments are:

* Highly dynamic
* Multi-environment (dev/test/stage/prod)
* Multi-team
* Require strict governance
* Require fast & safe deployments

GitOps ensures:
✔ Versioned infrastructure
✔ Automated deployments
✔ Rollbacks
✔ Multi-env consistency
✔ Security and auditability

CI/CD ensures:
✔ Code tested automatically
✔ Built into container images
✔ Pushed to registries
✔ Validated automatically
✔ Delivered with confidence

GitOps + CI/CD = **Production-grade DevOps**

---

# 🧩 **PART A — CI/CD Foundations for Kubernetes**

# 🔷 **Section 1 — CI/CD Concepts (Basics to Advanced)**

### 🔍 What is CI (Continuous Integration)?

Automation triggered when developers push code:

* Compile/build
* Run tests
* Static analysis
* Security scanning

### 🔍 What is CD (Continuous Delivery / Deployment)?

Automation triggered after CI builds:

* Build container image
* Scan for vulnerabilities
* Push to registry
* Deploy to Kubernetes
* Validate rollout
* Rollback on failure

### Benefits:

* Faster development cycles
* Repeatable releases
* Reduced manual effort
* Stable pipelines

---

# 🐳 **Section 2 — Container Build Pipeline (Deep Dive)**

CI builds typically include:

### 1️⃣ **Code Checkout**

Pull repo from GitHub/GitLab/Azure DevOps.

### 2️⃣ **Dependency Install**

Install libraries, modules, packages.

### 3️⃣ **Unit & Integration Tests**

Quality gate before deployment.

### 4️⃣ **Container Build**

Tools:

* Docker
* BuildKit
* Kaniko (no Docker daemon)
* Buildpacks

### 5️⃣ **Image Scanning**

Security scans using:

* Trivy
* Aqua
* Checkov
* Clair

### 6️⃣ **Push to Registry**

* GitHub Container Registry (GHCR)
* Docker Hub
* Azure ACR
* AWS ECR
* GCP Artifact Registry

### Example GitHub Actions workflow:

```yaml
- name: Build and push
  uses: docker/build-push-action@v3
  with:
    push: true
    tags: ghcr.io/company/app:latest
```

---

# 🧩 **PART B — GitOps Deep Dive (ArgoCD & FluxCD)**

# 🚀 **Section 3 — What is GitOps?**

GitOps =
**Git is the single source of truth for:**

* application manifests
* config maps
* policies
* infrastructure (Helm, Kustomize, Terraform)

Operators (ArgoCD/FluxCD) automatically:

* watch Git
* detect change
* apply change
* verify cluster state
* rollback if needed

### GitOps Benefits:

✔ No kubectl required
✔ Full history & audit trail
✔ Auto-rollbacks
✔ Multi-env consistency
✔ Security & compliance
✔ Faster disaster recovery

---

# 🎯 **Section 4 — GitOps Workflow Explained**

### 1️⃣ Developer pushes change

Example: modifies Deployment YAML

### 2️⃣ GitOps controller detects change

ArgoCD polls Git every few seconds.

### 3️⃣ ArgoCD applies Kubernetes manifests

kubectl apply → automated

### 4️⃣ ArgoCD performs health checks

Checks replica sets, Pods, services

### 5️⃣ ArgoCD syncs cluster state to Git

If cluster drifts → auto-heal

### 6️⃣ Rollback with 1 click

Restore previous commit instantly

---

# 🚦 **Section 5 — ArgoCD Internal Architecture**

ArgoCD Components:

| Component              | Purpose                |
| ---------------------- | ---------------------- |
| API Server             | UI/API for interaction |
| Repo Server            | Reads Git repo         |
| Application Controller | Sync engine            |
| Dex                    | Authentication         |
| Redis                  | Caching states         |
| CLI/UI                 | Developer access       |

### ArgoCD Sync Strategies:

* **Automatic sync**
* **Manual sync**
* **Selective sync**
* **Self-heal**

### Health Checks:

* Deployments
* ReplicaSets
* StatefulSets
* Jobs
* CRDs

---

# 🧱 **Section 6 — GitOps Repository Structure (Best Practices)**

### 1️⃣ **App Repo**

Contains:

* Source code
* Dockerfile
* Helm charts (optional)

### 2️⃣ **Ops Repo**

Contains:

* Kubernetes manifests
* Environments (`dev/`, `test/`, `prod/`)
* Policies
* Kustomize overlays
* Helm values

### Example folder structure:

```
gitops/
  dev/
    app-values.yaml
    kustomization.yaml
  stage/
    app-values.yaml
  prod/
    app-values.yaml
```

---

# 🧰 **Section 7 — Deployment Strategies (Zero Downtime)**

### 1️⃣ Rolling Update

Default Kubernetes strategy.

### 2️⃣ Blue-Green

Two versions run; switch traffic instantly.

### 3️⃣ Canary Deployments

Small % of traffic → new version
Argo Rollouts handles:

* traffic shifting
* auto-analysis
* rollback

### 4️⃣ A/B Testing

Send traffic based on header/user segment.

---

# 🛡 **Section 8 — Security in CI/CD & GitOps**

### CI Security:

* Secret scanning
* SBOM generation
* Image signing (Sigstore Cosign)
* Dependency scanning
* SAST/DAST

### GitOps Security:

* RBAC for ArgoCD
* Signed commits
* Encrypted secrets (SealedSecrets, SOPS)
* Admission control (OPA Gatekeeper)
* Vulnerability scanning of manifests

---

# 🧪 **Section 9 — Policy Enforcement (OPA, Kyverno, Gatekeeper)**

Policies ensure safe deployments.

Examples:

* No privileged Pods
* Mandatory probes
* Resource limits required
* Block deployment if container runs as root

### Tools:

* OPA Gatekeeper
* Kyverno
* Kubewarden

Policies stored in Git → enforced via GitOps.

---

# 🧩 **Section 10 — Multi-Environment GitOps**

Typical environments:

* dev
* qa
* stage
* prod

Methods:

* **Kustomize overlays**
* **Helm charts with values files**
* **Branch-based GitOps**

Best practice:

```
main → prod  
dev → development  
release/x → staging
```

---

# 🧵 **Section 11 — CI/CD Workflow (End-to-End)**

### Step-by-step:

## 1️⃣ Developer writes code

↓

## 2️⃣ Commit triggers CI pipeline

* Build
* Test
* Scan
* Package container image

↓

## 3️⃣ Push image to registry

↓

## 4️⃣ Update Kubernetes manifest

* Update Deployment image tag
* Commit to GitOps repo

↓

## 5️⃣ ArgoCD detects change

↓

## 6️⃣ ArgoCD deploys automatically

↓

## 7️⃣ ArgoCD verifies health

↓

## 8️⃣ Alerting & metrics

Prometheus/Grafana verify performance

↓

## 9️⃣ Rollback if necessary

---

# 🧭 **Section 12 — GitOps for Infrastructure (Infra-as-Code)**

GitOps can manage:

* Ingress
* Network policies
* Storage classes
* Custom resources
* Operators
* Entire cluster definitions

Tools:

* Terraform
* Crossplane
* Pulumi

ArgoCD can deploy:

* Helm charts
* Kustomize
* YAML
* Terraform via plugins

---

# 🧱 **Section 13 — Advanced Topics (Expert Level)**

### ✔ Progressive Delivery (Argo Rollouts)

* Automated canary analysis
* Traffic shifting
* ML-based metric evaluation

### ✔ Secret Encryption with SOPS

Encrypted secrets stored inside Git.

### ✔ Image Automation

FluxCD can automatically:

* detect new image tag
* update manifest
* commit to repo

### ✔ GitOps in Multi-Cluster Environment

* ArgoCD ApplicationSet
* Central control plane
* Fleet deployments

### ✔ Disaster Recovery with GitOps

Restore clusters by just:

```
kubectl apply -f gitops/
```

---

# 🎯 **After Module 8, You Will Be Able To…**

✔ Build CI pipelines to test, build & scan apps
✔ Build CD pipelines for Kubernetes deployments
✔ Implement GitOps using ArgoCD & FluxCD
✔ Manage multi-environment deployments
✔ Build progressive delivery workflows
✔ Enforce Kubernetes policies
✔ Protect pipelines with security best practices
✔ Roll back releases instantly
✔ Automate end-to-end Kubernetes delivery

---
