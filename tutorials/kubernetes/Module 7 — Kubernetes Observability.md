# 🛰️ **Module 7 — Kubernetes Observability (Deep Dive)**

**Goal:** Build complete visibility into your cluster using metrics, logs, events, tracing, and dashboards.
Understand HOW Kubernetes works *internally*, diagnose issues, troubleshoot failures, and maintain performance.

---

# 🧭 **Why Observability Matters**

Modern apps are:

* Distributed
* Containerized
* Ephemeral (Pods restart / die frequently)
* Auto-scaling
* Multi-node

This means traditional monitoring **fails**. Kubernetes requires:

* **Metrics** → performance insights
* **Logs** → debugging
* **Tracing** → request flow visualization
* **Events** → cluster-level alerts
* **Dashboards** → SRE visibility
* **Alerts** → proactive detection

Observability answers questions like:

* *Why did Pods restart?*
* *Why is the app slow?*
* *Why is HPA scaling/not scaling?*
* *Why did a node become NotReady?*
* *Why is traffic not reaching the Pod?*

---

# 🔶 **Section 1 — Observability Architecture (The Big Picture)**

Observability in Kubernetes involves **four pillars**:

## 🧩 **1. Metrics**

Numerical data: CPU, memory, latency, throughput.
Used for autoscaling, alerting, and dashboards.

## 🧾 **2. Logs**

Raw application and system output.
Used for debugging and incident resolution.

## 📣 **3. Events**

Kubernetes internal messages: scheduling failures, evictions, OOMKilled, node issues.

## 🔍 **4. Traces (Distributed Tracing)**

Shows the path of a request across microservices.

---

# 📊 **Section 2 — Metrics Pipeline (In-Depth)**

**Prometheus** is the de-facto standard.

## 🔍 How metrics flow:

1. **Kubelets** expose node and Pod metrics
2. **cAdvisor** exposes container metrics
3. **kube-state-metrics** exposes cluster state (deployments, jobs, replicas)
4. **Prometheus server** scrapes all endpoints
5. **Grafana** visualizes metrics
6. Optional: **Alertmanager** sends alerts (Slack, PagerDuty, Email)

### 🔹 Key Metric Types:

| Type      | Example                      |
| --------- | ---------------------------- |
| Counter   | total requests served        |
| Gauge     | CPU usage at a moment        |
| Histogram | request latency distribution |
| Summary   | percentiles (p90, p95, p99)  |

### 🔹 Critical Kubernetes Metrics to Track:

#### **Pods**

* Restarts
* CPU throttling
* Memory usage vs limits
* Pending Pods

#### **Nodes**

* CPU pressure / memory pressure
* Disk IO bottlenecks
* Network saturation
* Node Ready/NotReady status

#### **Cluster**

* HPA behavior
* Evictions
* Auto-scaler activity
* API server latency

Example: CPU usage metric

```
container_cpu_usage_seconds_total
```

---

# 📄 **Section 3 — Logging Architecture (Deep Dive)**

Logs in Kubernetes are scattered across:

* Containers
* Nodes
* Kubelet
* Network plugin
* API Server

### 🔧 Logging Pipeline Components:

1. **Fluentd / Fluent Bit / Vector / Logstash**
   Collect logs from nodes & containers.

2. **Elasticsearch / OpenSearch / Loki**
   Stores logs.

3. **Grafana / Kibana**
   Visualizes log data.

### 🔹 Types of Logs:

| Type             | Description                    |
| ---------------- | ------------------------------ |
| Application logs | app stderr/stdout              |
| Pod logs         | via `kubectl logs`             |
| Node logs        | OS & Kubelet logs              |
| Cluster logs     | API server, controller-manager |
| Audit logs       | security-focused logging       |

### 🔹 Common Log Issues:

* “CrashLoopBackOff”
* “OOMKilled”
* ImagePullBackOff
* Node disk pressure
* CNI failures

---

# 🎆 **Section 4 — Kubernetes Events (Instant Troubleshooting)**

Events reveal:

* **Pod scheduling failures**
* **Node problems**
* **Evictions**
* **Image pull issues**
* **Volume attach/detach failures**

Commands:

```
kubectl get events --sort-by='.metadata.creationTimestamp'
kubectl describe pod <pod>
```

Example events:

* `FailedScheduling`
* `BackOff`
* `Unhealthy`
* `FailedMount`
* `NodeNotReady`

Events are ephemeral → use:

* Eventrouter
* Loki
* Kubernetes dashboard

---

# 🧵 **Section 5 — Distributed Tracing (Advanced Production Setup)**

Tracing shows **how a request flows across services**.

Tools:

* **Jaeger**
* **OpenTelemetry**
* **Zipkin**

### 🔍 Why Tracing Is Critical:

* Debug microservice performance
* Identify bottlenecks
* Measure latency breakdown
* Detect slow downstream dependencies

### Trace Example:

```
Frontend → Auth Service → Product Service → Database
```

Tracing reveals:

* Slow queries
* Network hops
* Serialization overhead

---

# 🖥 **Section 6 — Dashboards (What SREs Use Daily)**

Grafana dashboards provide full visibility.

### Must-Have Dashboards:

#### 1️⃣ **Node Health Dashboard**

* CPU, memory, disk IOPS
* Node pressure conditions

#### 2️⃣ **Pod/Deployment Dashboard**

* Pod restarts
* Replica count
* Resource usage

#### 3️⃣ **HPA Dashboard**

* Target vs actual CPU
* Scaling events

#### 4️⃣ **Network Dashboard**

* Latency
* Dropped packets
* DNS failures

#### 5️⃣ **Storage Dashboard**

* PVC usage
* Latency (I/O)
* Volume attach delays

---

# 🔔 **Section 7 — Alerting (Proactive Monitoring)**

Using **Alertmanager** or cloud-native equivalents.

### 🔥 Critical Alerts for Production:

#### Nodes:

* NodeNotReady
* DiskPressure
* MemoryPressure

#### Pods:

* CrashLoopBackOff
* Image pull failure
* High restart count

#### Apps:

* Error rate > threshold
* Latency (p95/p99) high
* DB connection failure

Triggers:

* Slack
* PagerDuty
* OpsGenie
* Email

---

# 🛠 **Section 8 — Tooling Ecosystem**

### Core:

* **Prometheus**
* **Grafana**
* **Alertmanager**

### Logs:

* Fluentd / Fluent Bit
* Loki
* Elasticsearch

### Tracing:

* Jaeger
* OpenTelemetry
* Zipkin

### Hosted alternatives:

* Datadog
* New Relic
* Dynatrace
* Elastic Cloud
* AWS CloudWatch
* Azure Monitor
* GCP Ops Suite

---

# 🧠 **Section 9 — Advanced Debugging & Triage Techniques**

### 🧩 Pod level:

```
kubectl describe pod
kubectl logs <pod>
kubectl exec -it <pod> -- bash
```

### 🧩 Node level:

```
kubectl describe node
journalctl -u kubelet
dmesg
```

### 🧩 Network level:

* Check CNI plugin
* Validate Services/Endpoints
* Test DNS with:

```
kubectl exec -it <pod> -- nslookup service-name
```

### 🧩 Storage level:

* Check PVC events
* Look for `FailedMount` errors

---

# 🔒 **Section 10 — Observability for Security**

Capture:

* Audit logs
* Unauthorized access attempts
* API server logs
* Pod exec logs
* Network flow logs

Requirements for Zero Trust:

* Tracing
* Correlated logs
* Full request metadata

---

# 🔁 **Section 11 — Observability for Autoscaling**

Autoscalers depend on observability:

### HPA needs:

* CPU metrics
* Memory metrics
* Custom metrics

### VPA needs:

* historical resource usage

### Cluster Autoscaler needs:

* Pending Pod metrics
* Node utilization

---

# 🏁 **After Module 7 You Will Be Able To:**

✔ Build a complete observability stack
✔ Configure metrics, logs, tracing, events
✔ Build dashboards for SRE teams
✔ Troubleshoot Pod/Node/Network/Storage issues
✔ Create alerts for incidents
✔ Integrate observability with autoscaling
✔ Monitor microservices end-to-end
✔ Use Prometheus, Grafana, FluentBit, Loki, Jaeger
✔ Achieve production-grade monitoring

---

