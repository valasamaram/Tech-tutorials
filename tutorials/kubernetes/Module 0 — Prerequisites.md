# 🚀 **Module 0 — Prerequisites for Kubernetes Deep Dive (Complete Explanation)**

Kubernetes is a powerful system, but to master it you MUST understand **containers**, **Docker**, **Linux basics**, and **networking fundamentals**.
This module ensures you have the "mental building blocks" required before touching Kubernetes.

---

# 📘 **Section 1 — Containers & Why They Exist**

---

## ⭐ What is a Container?

A **container** is:

* A lightweight, isolated runtime environment
* Runs on top of the host OS kernel
* Packages application + dependencies
* Fast to start (milliseconds)
* Consistent across environments (“works on my machine” problem solved)

Think of it like a **small, isolated mini-computer** inside your OS, dedicated to one application.

---

## 🧠 Why Containers?

Before containers, we had:

* Apps breaking on different environments
* Dependency conflicts (Python 3.7 vs 3.9, Java versions, libraries etc.)
* Slow VMs (heavy & expensive)

Containers fix all of this:

| Feature     | VM      | Container     |
| ----------- | ------- | ------------- |
| Boot time   | minutes | seconds       |
| Size        | GBs     | MBs           |
| Isolation   | full OS | process-level |
| Performance | slower  | near-native   |
| Portability | low     | very high     |

---

## ⚙️ How Containers Work (Deep Internal View)

Containers use **Linux features**:

* **Namespaces** → isolation (PID, network, mount, IPC)
* **Cgroups** → CPU & memory limits
* **UnionFS** → layered filesystems

Kubernetes orchestrates containers, NOT VMs.
So you must be comfortable with how containers behave.

---

# 📘 **Section 2 — Docker Fundamentals**

Docker is the most popular container engine (runtime was Docker → now containerd under the hood).

---

## ⭐ WHAT is Docker?

A platform to:

* Build container images
* Run containers
* Push images to registries
* Manage container lifecycle

---

## 🧠 WHY Docker?

Kubernetes deploys **images**, not code.
You MUST know how to package applications into Docker images.

---

## 🛠 HOW Docker Works?

### 2.1 Dockerfile

File used to build images.

Example:

```dockerfile
FROM python:3.11-slim
COPY app.py .
CMD ["python", "app.py"]
```

### 2.2 Docker Commands

| Command          | Purpose                    |
| ---------------- | -------------------------- |
| docker build     | build image                |
| docker run       | start container            |
| docker ps        | list running containers    |
| docker exec      | execute inside a container |
| docker push/pull | upload/download images     |

### 2.3 Image Registries

Used to store & distribute images:

* Docker Hub
* Azure Container Registry (ACR)
* Amazon ECR
* GitHub Container Registry

---

## 🔬 Hands-on Tasks

* Build a Docker image
* Tag and push to Docker Hub
* Run the container locally

This is essential because **Kubernetes pulls these images**.

---

# 📘 **Section 3 — Linux Fundamentals**

Kubernetes nodes and containers run on **Linux**.

You MUST know the basics.

---

## 🟦 WHAT Linux Skills You Need?

* Navigating directories (cd, ls, pwd)
* File operations (cp, mv, rm, mkdir)
* Viewing logs (cat, tail, grep)
* Process management (ps, top)
* Permissions (chmod, chown)
* Networking commands (curl, nslookup, ping, netstat/ss)

---

## 🧠 WHY You Need This?

Inside Kubernetes:

* Pods run Linux containers
* Troubleshooting requires Linux commands
* Node-level debugging requires familiarity with OS
* kubectl exec gets you into containers → Linux shell

---

## 🛠 HOW to Practice?

Use Ubuntu:

```bash
apt update
apt install -y curl vim nginx
```

Practice finding logs:

```bash
tail -f /var/log/syslog
```

Practice networking:

```bash
curl google.com
ping 8.8.8.8
```

---

# 📘 **Section 4 — Networking Basics**

Kubernetes is **95% networking**:

* Pods need IPs
* Services route traffic
* Network policies block traffic
* Ingress exposes applications externally

Before learning Kubernetes networking, understand these basics:

---

## 🟦 WHAT Networking Concepts You Need?

### **IP Addressing**

* IPv4
* CIDR blocks (10.0.0.0/16 etc.)

### **Ports**

* 80 → HTTP
* 443 → HTTPS
* 53 → DNS

### **DNS**

* How names resolve to IPs
* DNS queries inside clusters

### **TCP/UDP**

* Client-server communication basics

### **Routing**

* Default gateway
* Route tables

---

## 🧠 WHY This Matters?

Kubernetes networking includes:

* Pod-to-pod communication
* Pod-to-service communication
* NodePort & LoadBalancers
* Ingress routing
* CNI plugins (Calico, Cilium)

Without basic networking, Kubernetes networking will feel impossible.

---

## 🛠 HOW to Practice?

* Create local networks using Docker
* Use `curl`, `nslookup`, `telnet` to test connectivity
* Visualize routing using `ip route`

---

# 📘 **Section 5 — Git Basics**

Kubernetes uses:

* YAML
* GitOps workflows
* Infrastructure as code

You must understand Git version control.

---

## 🟦 WHAT You Need?

* git init
* git add, commit, push
* git checkout, branch
* git merge, rebase
* Pull Requests

---

## 🧠 WHY Git Matters?

Kubernetes configs (Deployment, Pods, Services) are YAML files.
In the real world, they are stored in Git.

Argo CD & Flux use Git as the source of truth.

---

## 🛠 HOW to Practice?

* Create GitHub repo
* Store YAML files
* Commit versions
* Review diffs

---

# 📘 **Section 6 — Basic YAML Skills**

Kubernetes uses YAML for everything.

---

## 🟦 WHAT YAML Concepts You Need?

* Key-value
* Lists
* Indentation rules
* Scalars
* Anchors & references (advanced)

Example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: demo
spec:
  containers:
    - name: app
      image: nginx
```

---

## 🧠 WHY Important?

Without YAML skills, Kubernetes manifests will constantly break.

---

## 🛠 HOW to Practice?

Use YAML validation tools:

* `yamllint`
* IDE with YAML plugin

---

# 📘 **Section 7 — Optional but Important: Basics of Cloud Platforms**

Kubernetes often runs on:

* AKS (Azure Kubernetes Service)
* EKS (AWS)
* GKE (Google)

Understanding cloud basics helps with:

* Load balancers
* Storage volumes
* Identity management
* Node pools

---

# 🎯 Summary: What You Should Know Before Starting Kubernetes

| Prerequisite | Why It Matters                      |
| ------------ | ----------------------------------- |
| Containers   | Pods = containers                   |
| Docker       | Kubernetes runs Docker-like images  |
| Linux        | Containers & nodes are Linux-based  |
| Networking   | Services, Ingress, Policies         |
| Git          | GitOps & YAML versioning            |
| YAML         | Kubernetes uses YAML for everything |
| Cloud Basics | Most K8s clusters run in the cloud  |

---
