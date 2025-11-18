# 🚀 **Module 6 — Autoscaling & Reliability**

*How Kubernetes keeps your apps fast, stable, and cost-efficient — automatically.*

This module teaches everything about **HPA, VPA, Cluster Autoscaler, Pod disruption rules, probes, affinities, PDBs, and high availability**.

---

# 🧭 **Section 1 — The Philosophy of Reliability in Kubernetes**

Kubernetes reliability is based on 3 principles:

### 1️⃣ **Self-Healing**

If a container or Pod crashes → Kubernetes restarts it.
If a node dies → Pods rescheduled automatically.

### 2️⃣ **Elasticity**

Scale apps up/down based on demand using autoscalers.

### 3️⃣ **Fault Tolerance**

Distribute workloads so loss of a node or zone doesn’t impact availability.

---

# ⚙️ **Section 2 — Liveness & Readiness Probes (Foundations of Reliable Pods)**

Probes determine whether a container is healthy.

### 🔥 Liveness Probe

Checks **if app is alive**.
If it fails → container is restarted.

Example:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
```

### 🚪 Readiness Probe

Checks **if app is ready to serve traffic**.
If it fails → Pod removed from service endpoints.

Example:

```yaml
readinessProbe:
  exec:
    command: ["cat", "/tmp/ready"]
```

### 🧊 Startup Probe

Used for slow-start apps (Java Spring Boot, ML models, etc.).

```yaml
startupProbe:
  httpGet:
    path: /startup
    port: 8080
  failureThreshold: 30
  periodSeconds: 10
```

---

# 📈 **Section 3 — Horizontal Pod Autoscaler (HPA)**

Scales the **number of Pods**.

### 🔍 How HPA Works:

* Reads metrics (CPU, memory, custom metrics)
* Compares metrics vs target
* Scales up/down replicas accordingly

Example:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: webapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          averageUtilization: 70
          type: Utilization
```

### Supported Metrics

| Type             | Example                           |
| ---------------- | --------------------------------- |
| CPU              | 70% utilization                   |
| Memory           | 80% utilization                   |
| Custom Metrics   | requests per second, queue length |
| External Metrics | SQS queue size, Kafka lag         |

---

# 📦 **Section 4 — Vertical Pod Autoscaler (VPA)**

Adjusts **CPU/memory limits** automatically.

Useful for:

* ML workloads
* Batch jobs
* Pods with unpredictable compute needs

Three modes:

1. **Off** → only recommendations
2. **Auto** → apply changes live
3. **Initial** → apply on Pod creation only

Example:

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: api-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  updatePolicy:
    updateMode: "Auto"
```

⚠️ **Note:**
HPA + VPA can conflict unless carefully configured.

---

# 🏗 **Section 5 — Cluster Autoscaler (Node Autoscaling)**

Adds/removes **worker nodes** automatically.

### When nodes scale **UP**

* Pods are pending (insufficient CPU/memory)

### When nodes scale **DOWN**

* Node has < 50% utilization
* All Pods can be rescheduled elsewhere

### Supported Platforms

* AWS EKS
* Azure AKS
* Google GKE
* Karpenter (AWS) — modern alternative

---

# 🧩 **Section 6 — PodDisruptionBudgets (PDB) for High Availability**

PDB ensures a minimum number of Pods stay running during:

* Node upgrades
* Drains
* Autoscaler scale-down
* Evictions

Example: Keep 2 replicas always available

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api
```

---

# 🧭 **Section 7 — Affinity, NodeSelectors & Taints/Tolerations**

These control **where Pods run**, improving reliability and performance.

---

## 🧲 **Node Affinity**

Schedule Pod to specific nodes (e.g., GPU nodes).

```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: gpu
              operator: In
              values:
                - "true"
```

---

## 📍 **Pod Affinity & Anti-Affinity**

Goal: Spread Pods across nodes/zones.

### 🧩 Anti-Affinity Example

Prevent all Pods of same app from being on same node (HA):

```yaml
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: backend
        topologyKey: "kubernetes.io/hostname"
```

This ensures:

* Each Pod on a **different node**
* Improved fault tolerance

---

## 🚫 Taints & Tolerations

Nodes can “repel” Pods unless they tolerate the taint.

Example:
Node reserved for DB workloads:

```bash
kubectl taint nodes db-node workload=db:NoSchedule
```

Pod must tolerate it:

```yaml
tolerations:
  - key: workload
    operator: Equal
    value: db
    effect: NoSchedule
```

---

# 💥 **Section 8 — Multi-Zone & Multi-Region HA**

Used by production companies (Netflix, Uber, Salesforce).

### Best Practices:

* Spread nodes across zones
* Use topology-aware routing
* Use anti-affinity for Pods
* Use regional load balancers
* Store data in multi-AZ persistent storage (EBS, Managed Disks, PD)

---

# 🔄 **Section 9 — Rolling Updates & Rollbacks**

Deployment ensures:

* Zero downtime releases
* Gradual rollouts
* Automatic rollback on failure

Example configuration:

```yaml
strategy:
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

### Canary or Blue-Green deployment

Use tools:

* Argo Rollouts
* Flagger
* Istio traffic shifting

---

# 🩺 **Section 10 — Self-Healing Mechanisms**

Kubernetes automatically:

* Restarts crashed containers
* Reschedules Pods when node fails
* Recreates Pods if deleted
* Repairs replicas to maintain desired state

---

# 🎯 **Section 11 — Reliability Patterns**

### ✔ Circuit breakers

Via service mesh (Istio/Linkerd)

### ✔ Timeouts & retries

Configured via mesh or app settings

### ✔ Bulkheads

Isolate workloads across nodes/zones

### ✔ Rate limiting

Protect backend services

### ✔ Auto restart policies

`OnFailure`, `Always`, `Never`

---

# 🏁 **After Module 6 You Will Be Able To:**

✔ Enable auto-scaling for both Pods and nodes
✔ Properly configure cluster self-healing
✔ Ensure zero-downtime deployments
✔ Build Fault-Tolerant applications
✔ Protect your app from overloads
✔ Configure high availability across nodes & zones
✔ Use PDBs, probes, affinities, taints effectively
✔ Build reliable, enterprise-grade platforms

---

