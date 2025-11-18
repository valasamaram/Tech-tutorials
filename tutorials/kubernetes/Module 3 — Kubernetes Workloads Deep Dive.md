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

