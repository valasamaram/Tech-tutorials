# 🚀 **Module 1 — Kubernetes Fundamentals (Deep Dive)**

This module builds your foundation for everything in Kubernetes.
By the end, you will fully understand *what Kubernetes is, how it works internally, and how to work with core components* like Pods, Deployments, and Services.

---

# 🧩 **Section 1 — What is Kubernetes?**

---

## ⭐ WHAT is Kubernetes?

Kubernetes (K8s) is an **open-source container orchestration platform** that automatically manages:

* Deployment of containers
* Scaling
* Load balancing
* Self-healing
* Resource management
* Configuration & secrets

It turns a cluster of servers into one **unified, automated platform**.

---

## 🧠 WHY Kubernetes?

Before Kubernetes:

* You manually deployed containers
* Restarted crashed apps
* Load-balanced requests yourself
* Updated apps manually (risk of downtime)
* Tracked resource usage per container manually

Kubernetes solves all of these.

### Kubernetes gives you:

| Feature                    | Explanation                                     |
| -------------------------- | ----------------------------------------------- |
| **Self-healing**           | Restart, reschedule, replace failed pods        |
| **Auto-scaling**           | Scale apps up/down automatically                |
| **Rolling updates**        | Deploy new versions without downtime            |
| **Desired state**          | Ensures system is always in your declared state |
| **Portable**               | Works in any cloud or on-prem                   |
| **Efficient resource use** | Optimizes CPU & memory                          |

---

## ⚙️ HOW Kubernetes Works (High-Level Architecture)

Kubernetes has two major layers:

### 1. **Control Plane** (brain)

* API Server
* Scheduler
* Controller Manager
* etcd

### 2. **Worker Nodes** (muscles)

* Kubelet
* Kube-proxy
* Container runtime (containerd, CRI-O)

The control plane decides *what should happen*,
the nodes execute *what must happen*.

---

# 🧩 **Section 2 — Kubernetes Cluster Architecture**

---

## ⭐ WHAT is a Kubernetes Cluster?

A **cluster** = control plane + worker nodes.

### 🧠 WHY do we need clusters?

* Reliability
* Horizontal scaling
* Distribution of workloads
* Separation of orchestration vs execution

---

## 🏗️ Control Plane Components (Detailed)

### 1. **API Server**

📌 *The front door of Kubernetes.*

* All kubectl commands go here
* UI, CLI, and internal controllers communicate through it
* Validates all requests

### 2. **etcd**

📌 *Kubernetes database (key-value store).*

* Stores the entire cluster state
* Highly available
* Very fast (millisecond reads/writes)

### 3. **Scheduler**

📌 *Decides where each pod should run.*
Considers:

* Available CPU & memory
* Affinity/anti-affinity
* Node taints & tolerations
* Storage
* Network topology

### 4. **Controller Manager**

📌 *Maintains desired state.*
Examples:

* Deployment Controller → ensures correct number of pods
* Node Controller → detects node failures
* Replication Controller → ensures replicas
* Job Controller → manages batch jobs

---

## 🏗️ Worker Node Components (Detailed)

### 1. **Kubelet**

📌 The agent running on each node.

* Talks to the API server
* Starts/stops containers
* Reports health

### 2. **Kube-proxy**

📌 Networking component.

* Routes traffic
* Maintains service load balancing

### 3. **Container Runtime**

📌 Runs containers.

* containerd (default)
* CRI-O
* Docker (legacy)

---

# 🧩 **Section 3 — Pods (Smallest Deployable Unit)**

---

## ⭐ WHAT is a Pod?

A **Pod = 1 or more containers that share:**

* Network namespace (same IP, same ports)
* Storage (volumes)
* Lifecycle

Pods are **ephemeral** — they come and go.

---

## 🧠 WHY Pods?

Containers alone:

* Cannot share storage easily
* Cannot share network easily
* Cannot be managed directly by Kubernetes

Pods:

* Provide abstraction
* Allow multiple tightly-coupled containers (sidecar pattern)
* Enable orchestration

---

## 🌐 HOW Pods Work

* Each pod gets a unique IP
* Containers inside a pod talk via localhost
* Pods are scheduled on nodes
* Pods are recreated automatically by controllers

### Pod Lifecycle

* Pending
* Running
* Succeeded
* Failed
* CrashLoopBackOff
* Terminating

---

## 🛠 Example Pod YAML

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
    - name: app
      image: nginx
```

---

# 🧩 **Section 4 — ReplicaSets**

---

## ⭐ WHAT is a ReplicaSet?

Ensures a certain number of **pod replicas** are always running.

---

## 🧠 WHY ReplicaSets?

Pods can die.
You need:

* Scaling
* High availability
* Fault tolerance

ReplicaSets ensure:

> “Run exactly N pods at all times.”

---

## ⚙️ HOW ReplicaSets Work

* Monitor pods
* Create new ones if old ones die
* Remove extra ones

---

# 🧩 **Section 5 — Deployments (Most Important Controller)**

---

## ⭐ WHAT is a Deployment?

Deployment = ReplicaSet + rollout strategy.

It is the **most common way** to run apps in Kubernetes.

---

## 🧠 WHY Deployments?

They provide:

* Rolling updates
* Rollbacks
* Version history
* Safe, zero-downtime deployments
* Auto-scaling compatibility

---

## ⚙️ HOW Deployments Work

1. You create a Deployment
2. It creates a ReplicaSet
3. ReplicaSet creates Pods
4. For updates:

   * New ReplicaSet created
   * Old one scaled down gradually

---

## 🛠 Example Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
        - name: nginx
          image: nginx:latest
```

---

# 🧩 **Section 6 — Services (Networking Layer)**

---

## ⭐ WHAT is a Service?

A Kubernetes **Service** is a stable virtual IP that exposes Pods.

---

## 🧠 WHY Services?

Pods:

* Have dynamic IPs
* Restart frequently
* Are ephemeral

Services provide:

* Stable DNS name
* Load balancing
* Connectivity between components

---

## 🔗 Types of Services

### 1. **ClusterIP**

Default, internal-only access.

### 2. **NodePort**

Exposes service on `NodeIP:Port`.

### 3. **LoadBalancer**

Cloud provider creates external LB.

### 4. **ExternalName**

DNS mapping to an external address.

---

## 🛠 Example Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: ClusterIP
  selector:
    app: webapp
  ports:
    - port: 80
      targetPort: 80
```

---

# 🧩 **Section 7 — Namespaces**

---

## ⭐ WHAT is a Namespace?

A logical partition inside the cluster.

---

## 🧠 WHY Namespaces?

Used for:

* Multi-tenancy
* Resource quotas
* RBAC boundaries
* Environment separation (dev, test, prod)

---

## ⚙️ HOW Namespaces Work

`default`, `kube-system`, `kube-public` built-in.

You can create custom namespaces.

---

# 🧩 **Section 8 — Basic kubectl Commands (Hands-On)**

### Pods

```bash
kubectl get pods
kubectl describe pod <name>
kubectl logs <pod>
kubectl exec -it <pod> -- sh
```

### Deployments

```bash
kubectl get deploy
kubectl rollout status deploy/myapp
kubectl rollout undo deploy/myapp
```

### Services

```bash
kubectl get svc
kubectl describe svc <name>
```

---

# 🧩 **Section 9 — Kubernetes YAML Deep Dive**

Learn:

* apiVersion
* kind
* metadata
* spec
* selectors
* labels & annotations

Labeling strategy is critical for:

* Service discovery
* Scaling
* Monitoring
* Rollouts

---

# 🎯 **Outcome After Module 1**

You will have strong foundations in:

* Cluster architecture
* Control plane & node components
* Pods, ReplicaSets, Deployments
* Services & networking basics
* Namespaces
* kubectl commands
* YAML structuring

This prepares you for:

📘 Module 2 — Kubernetes Networking
📘 Module 3 — Workloads & Controllers
📘 Module 4 — Storage
📘 Module 5 — Security
📘 Module 6 — Helm & CI/CD
📘 Module 7 — Observability
📘 Module 8 — Real-world production operations

---
