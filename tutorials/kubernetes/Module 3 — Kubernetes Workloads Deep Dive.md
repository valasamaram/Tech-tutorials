# 🚀 **Module 3 — Kubernetes Workloads Deep Dive**

*Pods → ReplicaSets → Deployments → StatefulSets → DaemonSets → Jobs/CronJobs → Controllers → Advanced scheduling*

---

# 🧩 **Section 1 — What Are Kubernetes Workloads?**

Kubernetes workloads are **objects that run applications** on the cluster.

They define:

* How many replicas to run
* How they are updated
* How they scale
* How they store data
* How they behave during failures

Workloads are what actually execute your containers inside K8s.

Main workload types:

| Workload Type             | Purpose                        |
| ------------------------- | ------------------------------ |
| **Pod**                   | Smallest unit of deployment    |
| **ReplicaSet**            | Ensures desired number of Pods |
| **Deployment**            | Rolling updates, rollback      |
| **StatefulSet**           | Persistent identity + storage  |
| **DaemonSet**             | One Pod per node               |
| **Job**                   | Run-to-completion tasks        |
| **CronJob**               | Scheduled Jobs                 |
| **ReplicationController** | Legacy, avoid                  |

---

# 🧩 **Section 2 — PODS (Foundation of all workloads)**

---

## ⭐ WHAT is a Pod?

A Pod is:

* The smallest deployable unit in Kubernetes
* One or more containers sharing:

  * network namespace (same IP)
  * storage volumes
  * process namespace

### Example Pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: app
      image: nginx
```

---

## 🧠 WHY Pods?

Containers in the same Pod:

* Communicate via localhost
* Share storage
* Usually tightly coupled processes (e.g., app + log agent)

---

## ⚙️ HOW Pods Work Internally

* Scheduled to a node
* Pulls container image
* Creates network interface
* Adds volumes
* Starts containers in defined order

Pods are **ephemeral**:

* If destroyed → not automatically brought back unless managed by higher workloads like Deployments.

---

# 🧩 **Section 3 — ReplicaSets (Maintain Pod Count)**

---

## ⭐ WHAT is a ReplicaSet?

Maintains **desired number of Pod replicas** at all times.

Example:

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx
```

---

## 🧠 WHY ReplicaSets?

Provides:

* Self-healing
* Auto-rescheduling if nodes fail
* Guarantees high availability

---

## ⚠️ Important Note

We **never use ReplicaSets directly** in real-world.
They’re controlled by **Deployments**.

---

# 🧩 **Section 4 — Deployments (Most Common Workload)**

---

## ⭐ WHAT is a Deployment?

A Deployment:

* Manages ReplicaSets
* Supports rolling updates
* Supports rollbacks
* Enables zero-downtime releases
* Scales horizontally

This is the **default abstraction** for stateless workloads.

---

## 🧠 WHY Deployments?

You need:

* High availability
* Declarative updates
* Automatic rollback
* Versioning
* Auto-scaling (HPA)

---

## ⚙️ HOW Deployments Work

When you deploy a new version:

* Deployment creates a new ReplicaSet
* Slowly decreases old RS
* Slowly increases new RS
* Ensures no downtime

---

## Example Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.25
```

---

# 🧩 **Section 5 — Deployment Update Strategies**

### 1️⃣ **RollingUpdate** (default)

Gradually replace Pods. No downtime.

### 2️⃣ **Recreate**

Deletes all Pods first, then creates new ones.
Use when:

* App cannot handle parallel versions
* Database schema incompatibilities

---

# 🧩 **Section 6 — StatefulSets (Stateful Workloads)**

---

## ⭐ WHAT is a StatefulSet?

Designed for **stateful applications** like:

* Databases (MySQL, PostgreSQL)
* Streams (Kafka, RabbitMQ)
* Search engines (Elasticsearch)
* Distributed key-value stores (etcd, Consul)

---

## 🧠 WHY StatefulSets?

Provides:

* Stable pod names (pod-0, pod-1, pod-2)
* Stable storage (PVCs)
* Ordered deployment
* Ordered termination
* Unique network identities

---

## ⚙️ HOW StatefulSets Behave

Pod names never change:

```
mysql-0
mysql-1
mysql-2
```

State (PVC) is bound per Pod:

```
data-mysql-0
data-mysql-1
data-mysql-2
```

If a Pod reschedules → PVC follows it.

---

## Example StatefulSet:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: "mysql"
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 20Gi
```

---

# 🧩 **Section 7 — DaemonSets (One Pod Per Node)**

---

## ⭐ WHAT is a DaemonSet?

Runs **exactly one Pod on every node**.

Used for node-level tasks like:

* Logging agents (Fluentd, Logstash)
* Monitoring agents (Prometheus Node Exporter, Datadog agent)
* Network plugins (CNI)
* Storage plugins (CSI drivers)

---

## Example:

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      containers:
        - name: exporter
          image: prom/node-exporter
```

---

# 🧩 **Section 8 — Jobs (Run-to-Completion Tasks)**

---

## ⭐ WHAT is a Job?

Runs **a finite task** until completion.

Examples:

* Data cleanup
* Batch processing
* DB migration
* File processing
* Machine learning training

---

## ✔ Job Guarantees

* Pod restarts on failure
* Ensures completion
* Retry logic

---

## Example:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: backup-job
spec:
  template:
    spec:
      containers:
        - name: backup
          image: alpine
          command: ["sh", "-c", "echo backing up..."]
      restartPolicy: OnFailure
```

---

# 🧩 **Section 9 — CronJobs (Scheduled Jobs)**

---

## ⭐ WHAT is a CronJob?

Runs a Job on a schedule.
Same as Linux cron.

Examples:

* Nightly backups
* Daily data sync
* Monthly reporting
* Log rotation

---

## Example:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: cleanup
spec:
  schedule: "0 1 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: cleaner
              image: alpine
              command: ["sh", "-c", "rm -rf /tmp/*"]
          restartPolicy: OnFailure
```

---

# 🧩 **Section 10 — Probes (Advanced Workload Behavior)**

---

## ⭐ Types:

### 🔹 Readiness Probe

Determines if Pod is ready to receive traffic.

### 🔹 Liveness Probe

Restart container if unhealthy.

### 🔹 Startup Probe

Ensures container starts before liveness/readiness run.

---

## Example:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 10
```

---

# 🧩 **Section 11 — Advanced Scheduling (Placement Rules)**

Workloads can use scheduling rules to control where Pods run.

### Methods:

* **nodeSelector**
* **nodeAffinity**
* **podAffinity / podAntiAffinity**
* **taints & tolerations**
* **topologySpreadConstraints**

Used to:

* Isolate workloads
* Ensure high availability
* Improve performance
* Avoid noisy neighbors

---

# 🧩 **Section 12 — Autoscaling Workloads**

### 1️⃣ HPA — Horizontal Pod Autoscaler

Scales Pods up/down based on CPU, memory, custom metrics.

### 2️⃣ VPA — Vertical Pod Autoscaler

Adjusts Pod resources.

### 3️⃣ Cluster Autoscaler

Adds/removes nodes.

---

# 🧩 **Section 13 — Workload Patterns (Best Practices)**

### ✔ Stateless apps → **Deployments**

### ✔ Stateful apps → **StatefulSets**

### ✔ Node agents → **DaemonSets**

### ✔ One-time tasks → **Jobs**

### ✔ Scheduled tasks → **CronJobs**

### ✔ High availability → **ReplicaSets**

### ✔ Multi-zone apps → **topology spread constraints**


---

# 🟦 **1. nodeSelector (Basic Scheduling)**

> **Simplest way** to force a Pod to run on specific nodes.

### ✔ How it works

* You label a node.
* You tell the pod: **run only on nodes with this label**.

### 📌 Example

**Step 1: Label the node**

```
kubectl label node aks-node-1 disk=ssd
```

**Step 2: Pod manifest**

```yaml
spec:
  nodeSelector:
    disk: ssd
```

### 💡 Use Cases

* Run workloads on:

  * GPU nodes
  * SSD nodes
  * High-memory nodes
  * Specific environment nodes (prod/dev)

### 🚫 Limitation

* Exact match only
* No advanced rules

---

# 🟩 **2. Node Affinity (Advanced Scheduling)**

> **Smarter version of nodeSelector** with rules like required, preferred, multiple conditions.

### ✔ Types

1. **requiredDuringSchedulingIgnoredDuringExecution**
   → Pod MUST run on matching nodes (hard requirement)

2. **preferredDuringSchedulingIgnoredDuringExecution**
   → Pod SHOULD run on matching nodes (soft preference)

---

### 📌 Example

```yaml
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: disk
            operator: In
            values:
            - ssd
            - nvme
```

### 💡 Use Cases

* Run on nodes with:

  * Certain OS versions
  * Certain regions/availability zones
  * Node type (gpu=true)
* Spread workloads logically

---

# 🟦 **3. Pod Affinity & Pod Anti-affinity**

Controls how pods are placed **relative to other pods**.

---

## 🟩 **Pod Affinity (Pods want to stay together)**

> “Place this pod **near** other pods.”

### 📌 Example

Run backend pod close to frontend pod (same node/zone).

```yaml
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: frontend
        topologyKey: "kubernetes.io/hostname"
```

### 💡 Use Cases

* Low-latency communication
* Services that must run **together**

---

## 🟥 **Pod Anti-Affinity (Pods must stay apart)**

> “Do NOT place pods together.”

### 📌 Example

Spread replicas across nodes (high availability)

```yaml
spec:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: api
        topologyKey: "kubernetes.io/hostname"
```

### 💡 Use Cases

* High availability
* Avoid placing all replicas in one node
* Avoid resource contention

---

# 🟦 **4. Taints & Tolerations**

Used by nodes to **repel** pods unless they tolerate specific taints.

### ✔ Meaning

* **Taint = Node says: Do NOT schedule pods here (keep away).**
* **Toleration = Pod says: I can run on that tainted node.**

---

## 🟩 Node Taint Example

Add taint:

```
kubectl taint nodes aks-gpu-node gpu=true:NoSchedule
```

Meaning:

> Only pods with this toleration can run on GPU node.

---

## 🟩 Pod Toleration Example

```yaml
spec:
  tolerations:
  - key: "gpu"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
```

### 💡 Use Cases

* GPU workloads
* Dedicated nodes (database, logging, ingress)
* Spot node pools
* Protect system nodes

---

# 🟦 **5. topologySpreadConstraints (Even distribution)**

> Ensures pods are **evenly spread** across zones, nodes, or racks.

### 📌 Example: Spread pods across availability zones

```yaml
spec:
  topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: checkout
```

### ✔ Key Terms

* **maxSkew** → Max difference between zones (e.g., difference of 1 pod)
* **topologyKey** → hostname, zone, rack
* **DoNotSchedule** → strictly enforce the rule

### 💡 Use Cases

* High availability and fault tolerance
* Ensure replicas are well distributed
* Avoid placing all pods in one AZ

---

# 🟧 **Short Summary Table**

| Feature                       | Purpose                           | Level         | Example Use        |
| ----------------------------- | --------------------------------- | ------------- | ------------------ |
| **nodeSelector**              | Run pod on simple labeled node    | Basic         | SSD-only nodes     |
| **nodeAffinity**              | Advanced rules for node selection | Advanced      | Zones, CPU, OS     |
| **podAffinity**               | Pods placed together              | Logical       | Frontend + backend |
| **podAntiAffinity**           | Pods placed apart                 | HA            | Spread replicas    |
| **Taints & Tolerations**      | Block nodes except allowed pods   | Node-level    | GPU, system nodes  |
| **topologySpreadConstraints** | Spread pods evenly                | Cluster-level | Multi-AZ spreading |

---

### 🟦 **Which Architecture Diagram Should I Generate?**

#### **1️⃣ Pod Scheduling Decision Flow (full flowchart)**

How Kubernetes decides:

* nodeSelector
* nodeAffinity
* podAffinity
* taints/tolerations
* topologySpreadConstraints

#### **2️⃣ nodeSelector vs nodeAffinity (comparison diagram)**

Visual layering:
Labels → nodeSelector → requiredAffinity → preferredAffinity.

#### **3️⃣ PodAffinity & PodAntiAffinity Diagram**

Shows pods placed together vs spread across nodes.

#### **4️⃣ Taints & Tolerations Diagram**

Node repels pods → Pod tolerates taint → Allowed scheduling.

#### **5️⃣ topologySpreadConstraints Diagram**

Replica distribution across zones/nodes.

#### **6️⃣ Full AKS Node Pool Scheduling Diagram**

End-to-end:
Pods → Scheduler → Constraints → Node Pools → Placement.

---
Below is the **Pod Scheduling Decision Flow Diagram** (clear, textual architecture diagram).
This shows how Kubernetes decides **where a pod will run** based on all rules:

---

# 🟦 **1️⃣ Pod Scheduling Flow Diagram (Full End-to-End Logic)**

*(Best-quality flow diagram in text format — clean and interview-friendly)*

```
                 +----------------------------------+
                 |     Pod is created (Pending)     |
                 +----------------------+-----------+
                                      |
                                      v
                   +------------------+------------------+
                   |   Scheduler collects all nodes      |
                   +------------------+------------------+
                                      |
                                      v
            +-------------------------+-------------------------------+
            | 1. Filter nodes based on TAINTS (hard block)           |
            |    - If node has taint X                              |
            |    - Pod must have matching toleration                |
            |    - Otherwise node is removed from candidate list    |
            +-------------------------+-------------------------------+
                                      |
                                      v
          +---------------------------+------------------------------+
          | 2. Apply nodeSelector (simple label matching)            |
          |    - Keep only nodes with labels exactly matching       |
          |      nodeSelector → key:value                           |
          +---------------------------+------------------------------+
                                      |
                                      v
    +---------------------------------+----------------------------------+
    | 3. Apply Node Affinity (Advanced Matching)                         |
    |    - requiredDuringScheduling (hard rule)                           |
    |        → if not matched → node is removed                           |
    |    - preferredDuringScheduling (soft rule)                           |
    |        → scoring: matched nodes get higher ranking                 |
    +---------------------------------+----------------------------------+
                                      |
                                      v
  +-----------------------------------+---------------------------------+
  | 4. Apply Pod Affinity / Pod Anti-Affinity                          |
  |                                                                     |
  |    Pod Affinity (run near others):                                  |
  |      - If required: invalid nodes removed                           |
  |      - If preferred: nodes receive score boost                      |
  |                                                                     |
  |    Pod Anti-Affinity (spread away from others):                     |
  |      - If required: nodes hosting same label pods removed           |
  |      - If preferred: nodes hosting fewer get higher score           |
  +-----------------------------------+---------------------------------+
                                      |
                                      v
        +-----------------------------+-----------------------------+
        | 5. Apply topologySpreadConstraints                        |
        |    - Ensure even spread across zones/hosts                |
        |    - MaxSkew must not be violated                         |
        |    - If DoNotSchedule: nodes violating rules removed      |
        |    - If ScheduleAnyway: reduce node score                |
        +-----------------------------+-----------------------------+
                                      |
                                      v
  +-----------------------------------+-----------------------------------+
  | 6. Scoring Phase                                                      |
  |    Remaining nodes are scored based on:                               |
  |      - preferredAffinity                                               |
  |      - preferred Pod Affinity / AntiAffinity                          |
  |      - resource availability (CPU/mem)                                |
  |      - number of running pods                                          |
  |      - topology spread                                                 |
  +-----------------------------------+-----------------------------------+
                                      |
                                      v
           +--------------------------+---------------------------+
           | 7. Scheduler selects the highest scoring node        |
           +--------------------------+---------------------------+
                                      |
                                      v
                 +---------------------------------------------+
                 | 8. Pod is assigned and kubelet starts it     |
                 +---------------------------------------------+
```

---

# 🟦 **🔥 What This Flow Diagram Covers**

✔ Taints & Tolerations (first filter—hard rule)
✔ nodeSelector (simple filtering)
✔ nodeAffinity (required + preferred rules)
✔ podAffinity / podAntiAffinity (relative placement)
✔ topologySpreadConstraints (cross-zone/node distribution)
✔ Final scoring and selection logic

This is **exactly how Kubernetes makes its decision in real AKS clusters**.

---
Here is the **clean, visual, interview-ready diagram** for

# 🟦 **nodeSelector vs nodeAffinity (Side-by-Side Architecture Diagram)**

---

# 🟩 **NODE SELECTOR vs NODE AFFINITY – VISUAL FLOW**

```
                   ┌───────────────────────────────────────┐
                   │        Node Scheduling Layer          │
                   └───────────────┬───────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
┌───────────────────┐     ┌────────────────────┐     ┌────────────────────────────┐
│   nodeSelector     │     │  Node Affinity     │     │  Preferred Node Affinity   │
│   (Basic Match)    │     │  (Hard Rules)      │     │  (Soft Rules)              │
└─────────┬──────────┘     └───────────┬────────┘     └───────────────┬──────────┘
          │                            │                                │
          ▼                            ▼                                ▼
┌───────────────────┐     ┌─────────────────────────┐       ┌───────────────────────────────┐
│ Exact Label Match │     │ MatchExpressions (In,     │       │ Best Effort Node Selection     │
│ key=value         │     │ NotIn, Exists, DoesNotExist)│    │ (If available)                 │
└─────────┬──────────┘     └───────────┬──────────────┘       └─────────┬───────────────────┘
          │                            │                                │
          ▼                            ▼                                ▼
 ┌─────────────────────────────────────────────────────────────────────────────────────────┐
 │                 HARD FILTER (must pass)                           SOFT FILTER            │
 │  If node doesn't match → POD WILL NOT SCHEDULE         If node doesn’t match → OK       │
 └─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# 🟦 **1️⃣ nodeSelector (Basic)**

Simplest scheduling rule.

### ✔ What it does

* Requires **exact label match** with `key=value`
* No logic, no conditions

### ✔ Example

```yaml
spec:
  nodeSelector:
    disk: ssd
```

### ✔ Limitations

* Only **exact equality**
* Cannot use Operators (In, NotIn, Exists, etc.)

---

# 🟩 **2️⃣ Node Affinity – Required (Hard Rules)**

Advanced, flexible, powerful.

### ✔ What it does

* Uses **matchExpressions**
* Supports operators:

  * In
  * NotIn
  * Exists
  * DoesNotExist
  * Gt / Lt

### ✔ Example

```yaml
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: disk
            operator: In
            values: ["ssd", "nvme"]
```

### ✔ Behavior

❗ If this rule is not satisfied → **Pod stays Pending**

---

# 🟨 **3️⃣ Preferred Node Affinity (Soft Rules)**

Best-effort scheduling.

### ✔ What it does

* Scheduler **prefers** (not requires) matching nodes
* Pod can still run even if no node matches

### ✔ Example

```yaml
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 50
        preference:
          matchExpressions:
          - key: zone
            operator: In
            values: ["eastus-1"]
```

### ✔ Behavior

* Pod will **try** to run on preferred node
* If not possible → runs anywhere

---

# 🟧 **Comparison Table (Very Clear)**

| Feature        | nodeSelector     | Node Affinity (Required) | Node Affinity (Preferred) |
| -------------- | ---------------- | ------------------------ | ------------------------- |
| Match Type     | Exact match      | Advanced expressions     | Preferred expressions     |
| Operators      | None             | In, NotIn, Exists, etc.  | Same as Required          |
| Flexible       | ❌ No             | ✔ Yes                    | ✔ Yes                     |
| If not matched | Pod unscheduled  | Pod Pending              | Pod still schedules       |
| Use Case       | Simple filtering | Strict placement rules   | Best-effort placement     |
| Difficulty     | Easy             | Medium                   | Medium                    |

---

# 🟦 **Simple Real-World Example**

### ✔ nodeSelector

> "Run this Pod only on SSD nodes."

### ✔ Node Affinity (Required)

> "Run only on SSD or NVMe nodes in East US."

### ✔ Preferred Node Affinity

> "Prefer East-US nodes, but run anywhere if needed."

---
Here is the **clean, visual, interview-ready diagram** for

# 🟦 **PodAffinity vs PodAntiAffinity**

This explains **how pods are placed relative to each other** inside a Kubernetes cluster.

---

# 🟩 **3️⃣ Pod Affinity & Pod Anti-Affinity – Visual Diagram**

```
                ┌───────────────────────────────────────────────┐
                │          Kubernetes Scheduler                  │
                └──────────────┬────────────────────────────────┘
                               │
     ┌─────────────────────────┼────────────────────────────┐
     ▼                         ▼                            ▼
┌──────────────────┐   ┌──────────────────────────┐   ┌──────────────────────────┐
│   Pod Affinity    │   │  Pod Anti-Affinity       │   │   No Affinity Rules      │
│  (Pods together)  │   │  (Pods apart)             │   │   (Place anywhere)       │
└───────┬───────────┘   └───────────┬──────────────┘   └─────────────┬──────────┘
        │                           │                                │
        ▼                           ▼                                ▼
┌──────────────────────┐  ┌──────────────────────────┐   ┌──────────────────────────┐
│ Find nodes WITH pods  │  │ Reject nodes WITH pods   │   │ Scheduler picks best      │
│ matching label        │  │ matching label           │   │ node (least load, etc.)  │
└───────────┬───────────┘  └──────────┬───────────────┘   └──────────────────────────┘
            │                          │
            ▼                          ▼
   ┌───────────────────┐     ┌──────────────────────┐
   │ Place pod NEAR     │     │ Place pod AWAY from   │
   │ target pod(s)      │     │ target pod(s)         │
   └───────────────────┘     └──────────────────────┘
```

---

# 🟦 **1️⃣ Pod Affinity (Pods Together)**

> *“Place this pod close to another pod.”*

Used when pods **must run near each other** for:

* Low latency
* High-speed communication
* Same zone placement
* Caching layers
* Stateful workloads

### 📌 Example (Backend wants to run near Frontend)

```yaml
affinity:
  podAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
    - labelSelector:
        matchLabels:
          app: frontend
      topologyKey: "kubernetes.io/hostname"
```

### ✔ What happens

* Scheduler finds nodes where **frontend pods exist**
* Places backend pods **close to them (same node/zone)**

---

# 🟥 **2️⃣ Pod Anti-Affinity (Pods Spread Apart)**

> *“Do NOT place pods together.”*

Used for:

* High Availability (HA)
* Avoiding single-node failure
* Distributing replicas across zones
* Preventing resource contention

### 📌 Example (API replicas must run on different nodes)

```yaml
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
    - labelSelector:
        matchLabels:
          app: api
      topologyKey: "kubernetes.io/hostname"
```

### ✔ What happens

* Scheduler avoids nodes where the same “api” pod already exists
* Ensures **each replica runs on a different node**

---

# 🟧 **3️⃣ Clear Real-World Example**

### Pod Affinity – Use Case

> “Kafka brokers must stay together for fast syncing.”

### Pod Anti-Affinity – Use Case

> “3 replicas of API must be placed on 3 different nodes.”

---

# 🟩 **Comparison Table**

| Feature          | Pod Affinity                              | Pod Anti-Affinity                          |
| ---------------- | ----------------------------------------- | ------------------------------------------ |
| Meaning          | Pods want to stay **together**            | Pods must stay **apart**                   |
| Used For         | Low latency, shared cache, tight coupling | High availability, redundancy              |
| Failure Behavior | Pod stays Pending until match found       | Pod stays Pending if only 1 node available |
| Topology Key     | hostname, zone, region                    | hostname, zone, region                     |

---

# 🟦 **Short Mnemonic (Easy to Remember)**

* **Affinity = “Friends Together”**
* **Anti-Affinity = “Spread Out”**

---
Perfect — here is the **cleanest visual explanation** of

# 🟦 **Taints & Tolerations in Kubernetes**

---

## 🟩 Core Idea (1-line)

> **Taints = Node pushes Pods away**
> **Tolerations = Pods that are allowed to run there**

---

## 🧠 Visual Flow Diagram

```
                    ┌────────────────────────────────┐
                    │  Kubernetes Scheduler          │
                    └───────────┬────────────────────┘
                                │
                                ▼
                     ┌───────────────────────┐
                     │ Does Node have Taint? │
                     └─────────┬────────────┘
                               │ Yes
                               ▼
                    ┌──────────────────────────┐
                    │ Pod has matching         │
                    │ Toleration?              │
                    └─────────┬────────────────┘
                             │ Yes
                             ▼
                ┌────────────────────────┐
                │ Pod CAN be scheduled   │
                │ on this node           │
                └────────────────────────┘
                             │
                             ▼
                       🟢 SUCCESS
```

If **No Toleration**, then:

```
Node rejects Pod ❌
Pod stays Pending ⏳
```

---

# 🟧 Example Scenario

### Node with GPU:

We **only want GPU workloads** to run on it.

#### Step 1️⃣ Add Taint to Node

```
kubectl taint nodes gpu-node gpu=true:NoSchedule
```

Meaning:

> No pods allowed unless they **tolerate** gpu=true

#### Step 2️⃣ Pod Manifest with Toleration

```yaml
spec:
  tolerations:
  - key: "gpu"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
```

✔ This pod **can** run on GPU node
❌ All other pods get **pushed away**

---

# 🟦 🔍 Effects of Taints

| Effect               | Meaning               | Behavior                     |
| -------------------- | --------------------- | ---------------------------- |
| **NoSchedule**       | Prevent new pods      | Pod will not schedule here   |
| **PreferNoSchedule** | Soft version of above | Scheduler will try to avoid  |
| **NoExecute**        | Evicts existing pods  | Pod removed unless tolerated |

Example:

```
gpu=true:NoExecute
```

---

# 🟩 Best Real-World Use Cases

| Use Case                | Why Use Taints                                     |
| ----------------------- | -------------------------------------------------- |
| Dedicated GPU Node Pool | Prevent normal apps from occupying expensive nodes |
| System Node Pool        | Only kube-system pods should run                   |
| Spot Node Pool          | Only workloads that can be interrupted             |
| Database Node Pool      | Keep Noisy apps away                               |
| Security Isolation      | Workload segregation (Prod vs Dev)                 |

---

# 🟦 Interview Summary (Easy to Say)

> Nodes apply **taints** to protect themselves from unwanted pods.
> Pods use **tolerations** to express they are allowed to run on those nodes.
> Taints = Hard rule from the Node side
> Tolerations = Permission from the Pod side

---

# 🟨 Quick Memory Trick

> **Tainted nodes are “Toxic” → Only tolerant pods survive**

---

Here is **#5 – TopologySpreadConstraints** explained in a clean, simple way with examples.

---

# **5. TopologySpreadConstraints (Even distribution of Pods)**

Used to **spread pods evenly** across zones, nodes, racks, or any topology domain.
Prevents all pods landing on a single node/zone → improves **high availability & fault tolerance**.

---

## **Why use it?**

* Avoids **single-point failure**
* Ensures **balanced load**
* Works across **zones, nodes, hostnames**, etc.

Example topology keys:

* `topology.kubernetes.io/zone`
* `kubernetes.io/hostname`
* `rack` (custom labels)
* `failure-domain.beta.kubernetes.io/zone` (old)

---

## **How it works**

You define:

1. **Which pods to spread** (`labelSelector`)
2. **Across what domain** (`topologyKey`)
3. Max difference allowed (`maxSkew`)

---

# **Example 1 — Spread evenly across Availability Zones**

### **Goal:**

Run 3 pods → spread across 3 zones → **1 pod each zone**.

```yaml
spec:
  topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: myapp
```

### What happens?

* Pod 1 → Zone A
* Pod 2 → Zone B
* Pod 3 → Zone C

No two pods end up in the same zone.

---

# **Example 2 — Spread across Nodes**

### **Goal:**

Run 4 pods across 2 nodes → 2 pods per node.

```yaml
spec:
  topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: kubernetes.io/hostname
    whenUnsatisfiable: ScheduleAnyway
    labelSelector:
      matchLabels:
        app: api
```

### What happens?

If nodes are:

* **node1**
* **node2**

Pods spread like:

* node1 → 2 pods
* node2 → 2 pods

If balanced scheduling is not possible → still schedules (`ScheduleAnyway`).

---

# **Key Fields Explained**

| Field               | Meaning                                                    |
| ------------------- | ---------------------------------------------------------- |
| `topologyKey`       | Label key defining domain (zone, node)                     |
| `labelSelector`     | Which pods to balance                                      |
| `maxSkew`           | Max allowable difference in number of pods between domains |
| `whenUnsatisfiable` | `DoNotSchedule` or `ScheduleAnyway`                        |
| `matchLabels`       | Used to select pods in same app                            |

---

# **Difference from Affinity / AntiAffinity**

| Feature                       | Behavior                              |
| ----------------------------- | ------------------------------------- |
| **Affinity**                  | Attract pods to specific nodes        |
| **AntiAffinity**              | Spread by **avoiding** same node/zone |
| **TopologySpreadConstraints** | Spread **evenly**, not just avoid     |

Affinity = "place near"
AntiAffinity = "avoid placing together"
SpreadConstraints = "place evenly"

---

# **Super Simple Summary**

* Want even distribution → **use TopologySpreadConstraints**
* Want pods together → **nodeAffinity**
* Want pods away from each other → **podAntiAffinity**
* Want to block pods from nodes → **taints & tolerations**

---
Below is a **complete, end-to-end, clear and practical AKS Scheduling Architecture** explanation.
This covers everything: **scheduler flow → node selection → constraints → affinity → taints → spreading → autoscaling → upgrades**.

---

# ✅ **AKS Scheduling Architecture (Full Overview)**

**“How Kubernetes (AKS) decides *where* a Pod runs.”**

AKS scheduling = **Kubernetes Scheduler logic + AKS-specific behaviors**
It happens in 7 stages:

---

# **📌 Stage 1 — Pod Arrives in the Cluster**

When you create a Deployment / Pod:

1. API server stores the Pod as **Pending**
2. Scheduler watches Pending pods
3. Scheduler starts placement logic

---

# **📌 Stage 2 — Hard Filters (Node Eligibility Check)**

Scheduler filters out nodes that **cannot host** the pod.

### Hard Filters:

| Filter                                | What It Does                          |
| ------------------------------------- | ------------------------------------- |
| **Node Readiness**                    | Filters NotReady nodes                |
| **Resource fit**                      | Checks CPU, memory, ephemeral storage |
| **Taints/Tolerations**                | Pod must tolerate node taints         |
| **NodeSelector**                      | Pod must match node labels            |
| **NodeAffinity (required)**           | Hard placement rules                  |
| **PodTopologySpread (DoNotSchedule)** | Enforces skew limits                  |

If the pod fails here → stays **Pending**.

---

# **📌 Stage 3 — Soft Filters (Node Preferences)**

If multiple nodes are eligible → apply preferences:

### Soft constraints:

| Rule                                          | Role                              |
| --------------------------------------------- | --------------------------------- |
| **Preferred Node Affinity**                   | Prefer certain nodes              |
| **PodAffinity / PodAntiAffinity (preferred)** | Prefer to place together or avoid |
| **TopologySpread (ScheduleAnyway)**           | Try even distribution             |
| **PodPriority**                               | High-priority pods score higher   |

These contribute to a **node scoring system**.

---

# **📌 Stage 4 — Scoring & Choosing the Best Node**

Scheduler assigns scores to each eligible node:

### Scoring plugins (important ones):

| Scoring Logic                  | Meaning                                   |
| ------------------------------ | ----------------------------------------- |
| **LeastAllocated**             | Spreads pods; prefers balanced nodes      |
| **MostAllocated**              | Packs pods; helps consolidate             |
| **NodeAffinityScore**          | Scores based on nodeAffinity preferences  |
| **InterPodAffinityScore**      | Places pods near each other               |
| **BalancedResourceAllocation** | CPU-Memory balanced nodes                 |
| **ImageLocality**              | Prefers nodes that already have the image |

Finally:
**Highest score = target node**

---

# **📌 Stage 5 — Binding (Pod → Node Assignment)**

Scheduler instructs API server:

```
Bind pod X to node Y
```

Kubelet on that node:

* Pulls image (if not cached)
* Starts container
* Reports back as **Running**

---

# **📌 Stage 6 — AKS Enhancements (Azure-specific)**

AKS adds features beyond upstream Kubernetes:

### **1. AKS Auto-Scaler Integration**

Kubernetes scheduler + Cluster Autoscaler work together:

* If scheduler finds *no node* can run a pod
  → **Cluster Autoscaler scales out node pool**
* When nodes are under-utilized
  → drains nodes → scales in

Works with:

* VMAS or VMSS
* Spot nodes
* Multiple node pools
* Priority-based eviction

---

### **2. AKS Zone-Aware Scheduling**

If cluster uses Availability Zones:

* Scheduler prefers **even spread across zones**
* Combined with:

  * topologySpreadConstraints
  * node affinities
  * pod anti-affinity

---

### **3. AKS Node Pool Architecture**

Each node pool is a separate VMSS.

| Pool Type       | Usage                                     |
| --------------- | ----------------------------------------- |
| **System pool** | Critical components (kube-proxy, coredns) |
| **User pools**  | Application workloads                     |
| **GPU pools**   | AI/ML workloads                           |
| **Spot pools**  | Low-cost workloads                        |

Scheduler respects pool labels:

```
agentpool: system
agentpool: userpool1
```

---

# **📌 Stage 7 — Scheduling During Upgrades & Scaling**

### **Node upgrades**

* AKS cordons the node
* Drains pods
* Scheduler reschedules pods automatically
* Upgraded node rejoins

### **Scaling Events**

**Scale-out**

* New nodes join Ready state → scheduler places pending pods

**Scale-in**

* CA drains nodes → scheduler migrates pods → node deleted

---

# 🔷 **Complete AKS Scheduling Diagram (Text Diagram)**

```
                 ┌──────────────────────────┐
                 │      Deployments/Pods     │
                 └───────────────┬──────────┘
                                 ▼
                       ┌─────────────────┐
                       │    API Server   │
                       └─────────┬───────┘
                                 ▼
                     ┌──────────────────────┐
                     │   Kubernetes Scheduler│
                     └──────────────────────┘
                                 │
         ┌───────────────────────┼────────────────────────┐
         ▼                       ▼                        ▼
┌─────────────────┐   ┌─────────────────────┐   ┌──────────────────────┐
│  Hard Filters    │   │  Soft Preferences   │   │  Scoring & Ranking   │
└─────────────────┘   └─────────────────────┘   └──────────────────────┘
         │                       │                        │
         └───────────────────────┴───────────┬────────────┘
                                             ▼
                                 ┌──────────────────────┐
                                 │     Best Node        │
                                 └──────────┬───────────┘
                                            ▼
                          ┌────────────────────────────────┐
                          │        Pod is Bound            │
                          └────────────────────────────────┘
                                            ▼
                          ┌────────────────────────────────┐
                          │         Kubelet Starts Pod     │
                          └────────────────────────────────┘
                                            ▼
                         ┌──────────────────────────────────┐
                         │  AKS Autoscaler / Zones / NP Mgmt│
                         └──────────────────────────────────┘
```

---

# 🔥 **All Scheduling Components in AKS**

### **Pod-level controls**

* nodeSelector
* nodeAffinity (required / preferred)
* podAffinity
* podAntiAffinity
* tolerations
* topologySpreadConstraints
* pod priority & preemption

### **Node-level controls**

* labels
* taints
* zones
* capacity
* node pools

### **Cluster-level**

* Cluster Autoscaler
* Multiple node pools
* Spot nodes
* AKS upgrades
* VMSS behavior

---

# 🎯 **Super Simple Summary**

### **AKS scheduling = Kubernetes scheduler + Azure intelligence**

Pod Placement Order:

1. **Filter** nodes
2. **Score** nodes
3. **Select** best node
4. **Bind** pod
5. AKS **autoscaler** adds/removes nodes
6. AKS **upgrades** move pods safely

---
Here is a **clear, simple and complete explanation** of **HPA, VPA, and Cluster Autoscaler** — with examples, when to use, and how they work inside AKS/Kubernetes.

---

# ⭐ **1️⃣ HPA — Horizontal Pod Autoscaler**

**HPA scales the *number of pods* up or down** based on workload demand.

### ✔ What HPA does

* If load increases → **adds more pod replicas**
* If load decreases → **reduces pod replicas**
* It ensures your app stays responsive.

### ✔ Metrics HPA can use

* **CPU Utilization** (most common)
* **Memory Utilization**
* **Custom metrics** (prometheus, requests/sec)
* **External metrics** (queue length, Azure Monitor)

---

### ✔ How HPA works (very simple)

1. Metrics Server checks CPU/Mem usage
2. HPA compares usage with target
3. If usage > target → **scale out (more pods)**
4. If usage < target → **scale in (fewer pods)**

---

### ✔ Example

Target CPU = 50%
Current CPU = 90%
→ HPA creates more pods

Current CPU = 20%
→ HPA removes pods

---

### ✔ When to use HPA

Use when load changes based on:

* traffic
* user requests
* batch workload
* queues

**Best for web apps, APIs, microservices.**

---

# ⭐ **2️⃣ VPA — Vertical Pod Autoscaler**

**VPA adjusts the *resources (CPU/RAM)* of a pod automatically.**

### ✔ What VPA does

* If pod is starving (OOMKilled) → increases RAM
* If pod CPU is throttling → increases CPU
* If pod is over-allocated → reduces CPU/memory

### ✔ How VPA works

1. Monitor pod’s real usage
2. Recommend or update resource requests/limits
3. Restart pod with new resources

---

### ✔ Modes of VPA

| Mode        | Meaning                             |
| ----------- | ----------------------------------- |
| **Off**     | Only gives recommendations          |
| **Auto**    | Applies new CPU/Mem automatically   |
| **Initial** | Sets resources only at pod creation |

---

### ✔ Example

Your pod often uses 2 CPU but request=0.5 CPU
→ VPA increases request to match 2 CPU

---

### ✔ When to use VPA

Use for:

* **batch jobs**
* **ML jobs**
* **databases (non-HPA workloads)**
* **stateful applications**

**Do NOT use VPA + HPA on CPU at the same time**
(only safe if VPA manages memory & HPA manages CPU)

---

# ⭐ **3️⃣ Cluster Autoscaler (CA)**

**Cluster Autoscaler adds or removes *nodes* in the cluster** (VMs in the node pool).

### ✔ What CA does

* If pods **cannot be scheduled** → Adds nodes
* If nodes are **under-utilized** → Removes nodes
* Works at **VM/node level**, not pod level.

---

### ✔ How CA works

1. Scheduler looks for a place to run pods
2. If NO node has space → node pool SCALE OUT
3. When a node is empty for a long time → scale in
4. Before removing a node

   * drain
   * reschedule pods
   * delete VM

---

### ✔ Example

Your node pool has:

* **2 nodes (each 4 CPUs)**
* Running pods consume **all CPUs**

You deploy new pods → no space → **CA adds node 3**

Later at night:

* Low traffic
* Pods only need 1 node
  → CA removes nodes 2 and 3

---

### ✔ When to use CA

* Workloads with unpredictable traffic
* Microservices architecture
* Batch/cron jobs
* Any cluster where cost optimization matters
* Multi-pool workloads (GPU, system, app pool)

---

# 🎯 **Super Easy Summary**

| Feature                | Scales What?  | Based On                 | Affects          | When to Use             |
| ---------------------- | ------------- | ------------------------ | ---------------- | ----------------------- |
| **HPA**                | Pods          | CPU/Mem/Custom Metrics   | Replica count    | Web apps, APIs          |
| **VPA**                | Pod Resources | Actual usage             | CPU/RAM requests | Batch, ML, DB pods      |
| **Cluster Autoscaler** | Nodes (VMs)   | Pending pods, idle nodes | Node pool size   | Cluster-wide elasticity |

---

# 🌟 **Real-World Example: How All 3 Work Together**

Example scenario:

* High traffic → CPU spikes
* Pods cannot handle load → HPA adds pods
* No nodes left → CA adds more nodes
* Some pods need more RAM → VPA increases RAM request

Visualization:

```
Traffic ↑ → HPA adds pods
     ↓
Nodes full → Cluster Autoscaler adds nodes
     ↓
Pods starving → VPA increases CPU/RAM
```

---
