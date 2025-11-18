# 🚀 **Kubernetes Deep Dive — Full Learning Plan**

---

# 📘 **Module 0 — Prerequisites (1–3 days)**

Before starting Kubernetes, ensure you know:

### **🟦 Container Basics**

* What is a container?
* Docker architecture: client, daemon, registry
* Dockerfile basics
* Building & tagging images
* Pushing images to Docker Hub / ACR / ECR / GCR

**Hands-on:**

* Create Dockerfile for a sample app
* Push to a public registry

---

# 📘 **Module 1 — Kubernetes Fundamentals (1–2 weeks)**

Build strong foundation first.

---

## 🧩 **1.1 What is Kubernetes?**

* Why do we need container orchestration?
* Kubernetes vs Docker Swarm vs Nomad
* Kubernetes benefits

  * Auto-healing
  * Auto-scaling
  * Service discovery
  * Rolling updates

---

## 🧩 **1.2 Kubernetes Architecture (Deep Dive)**

### **Control Plane Components**

* **API Server**
* **etcd** (distributed key-value store)
* **Scheduler**
* **Controller Manager**
* **Cloud Controller Manager**

### **Worker Node Components**

* **kubelet**
* **kube-proxy**
* **Container runtime** (containerd, CRI-O)

### **How control-plane communicates with worker nodes**

* REST API
* Certificates
* Heartbeats

---

## 🧩 **1.3 Kubernetes Objects**

Understand each object with fields, lifecycle, best practices.

* **Pod**
* **ReplicaSet**
* **Deployment**
* **Service**
* **Namespace**
* **ConfigMap**
* **Secret**
* **Ingress**
* **PersistentVolume (PV)**
* **PersistentVolumeClaim (PVC)**
* **StorageClass**

---

## 🧩 **1.4 YAML Deep Dive (Very Important)**

* apiVersion
* kind
* metadata
* spec
* Using labels & selectors
* Templating basics

---

## 🧩 **1.5 Services & Networking**

* ClusterIP
* NodePort
* LoadBalancer
* Headless service
* Service discovery (DNS)

### Ingress & Ingress Controller

* NGINX Ingress
* TLS termination

---

### **Hands-on Labs**

* Deploy NGINX using Deployment
* Scale replicas
* Expose Service
* Use Ingress to expose an app externally

---

# 📘 **Module 2 — Kubernetes Storage (3–5 days)**

---

## 🧩 **2.1 Kubernetes Storage Model**

* PV vs PVC
* StorageClass provisions
* CSI drivers
* AzureDisk / EBS / GCE PersistentDisk

---

## 🧩 **2.2 Volume Types**

* emptyDir
* hostPath
* configMap & secret volumes
* projected volumes

---

## 🧩 **2.3 Stateful Applications**

* StatefulSets
* Headless service
* Sticky identity
* Ordered deployment
* Persistent storage

---

### **Labs**

* Deploy MySQL using StatefulSet
* Attach Azure Disk / EBS
* Test failover

---

# 📘 **Module 3 — Kubernetes Workloads Deep Dive (5–7 days)**

---

## 🧩 **3.1 Deployments vs StatefulSets vs DaemonSets**

* When to use which
* Rolling updates strategies

  * Rolling updates
  * Blue-Green
  * Canary

---

## 🧩 **3.2 Probes**

* Liveness probe
* Readiness probe
* Startup probe

How kubelet restarts containers.

---

## 🧩 **3.3 Resource Management**

* Requests vs Limits
* CPU throttling
* OOMKilled
* QoS Classes

  * Guaranteed
  * Burstable
  * BestEffort

---

### **3.4 Jobs & CronJobs**

* Batch workloads
* Retry policies
* Backoff limits
* Concurrency policies

---

### **Hands-on**

* Implement readiness/liveness probes
* Deploy a cronjob
* Run a daemonset (e.g., filebeat)

---

# 📘 **Module 4 — Networking Mastery (5–7 days)**

---

## 🧩 **4.1 Kubernetes CNI Deep Dive**

* Pod networking
* CNI plugins
* Calico / Cilium / Flannel

### **How IP addresses assigned?**

* IPAM
* CNI lifecycle

---

## 🧩 **4.2 Network Policies**

* Default deny
* Allow ingress
* Allow egress
* Namespace-isolation

---

## 🧩 **4.3 Service Mesh (Intro)**

* Why service mesh?
* Istio / Linkerd basics
* Sidecar architecture

---

### **Hands-on**

* Configure Calico network policy
* Block/allow traffic
* Test using busybox pod

---

# 📘 **Module 5 — Kubernetes Security (1–2 weeks)**

---

## 🧩 **5.1 RBAC Deep Dive**

* Roles
* RoleBinding
* ClusterRole
* ClusterRoleBinding
* Service accounts

---

## 🧩 **5.2 Secrets Management**

* Secret types
* Encryption at rest
* External secret managers (Vault, Azure Key Vault)

---

## 🧩 **5.3 Pod Security**

* SecurityContext
* runAsUser
* non-root enforcement
* readOnlyRootFileSystem
* Disallow privilege escalation

---

## 🧩 **5.4 Infrastructure Security**

* Network Policies
* Ingress TLS
* Image scanning
* Admission controllers
* OPA Gatekeeper

---

### **Hands-on**

* Implement PodSecurityStandard
* Create custom OPA policy
* ServiceAccount with minimal permissions

---

# 📘 **Module 6 — Autoscaling & Reliability (4–7 days)**

---

## 🧩 **6.1 Horizontal Pod Autoscaler (HPA)**

* CPU-based scaling
* Memory-based scaling
* Custom metrics

---

## 🧩 **6.2 Vertical Pod Autoscaler (VPA)**

* When to use
* Recommender, updater, admission plugin

---

## 🧩 **6.3 Cluster Autoscaler**

* Scaling nodes
* Scale-up/down rules
* Eviction policies

---

## 🧩 **6.4 Pod Disruption Budgets**

* Voluntary disruptions
* Availability guarantees

---

### **Hands-on**

* Configure HPA
* Simulate load test
* Enable cluster autoscaler

---

# 📘 **Module 7 — Kubernetes Observability (5–7 days)**

---

## 🧩 **7.1 Logging**

* EFK stack (Elasticsearch + Fluentd + Kibana)
* Loki + Promtail + Grafana

---

## 🧩 **7.2 Monitoring**

* Prometheus
* Alertmanager
* Node exporter
* Kube-state-metrics

---

## 🧩 **7.3 Tracing**

* Jaeger
* OpenTelemetry

---

### **Hands-on**

* Install Prometheus + Grafana
* Build dashboards
* Setup alerting

---

# 📘 **Module 8 — GitOps & CI/CD (1–2 weeks)**

---

## 🧩 **8.1 GitOps Fundamentals**

* Why GitOps
* Declarative infra
* Continuous reconciliation

---

## 🧩 **8.2 Tools**

* Argo CD (leader)
* Flux

---

## 🧩 **8.3 CI/CD Pipeline**

* GitHub Actions / Azure DevOps
* Build → Test → Scan → Deploy

---

### **Hands-on**

* Create GitOps repo
* Deploy app via Argo CD
* Implement PR-based change approval

---

# 📘 **Module 9 — Multi-Cluster & Advanced Topics (1–2 weeks)**

---

## 🧩 **9.1 Multi-Cluster Patterns**

* Federation
* Global load balancing
* Cluster Mesh

---

## 🧩 **9.2 Zero-Downtime Upgrades**

* Node draining
* MaxUnavailable
* Surge parameters

---

## 🧩 **9.3 Backup & DR**

* Velero backups
* Disaster recovery strategies

---

# 📘 **Module 10 — Real-World Practice Projects (2–4 weeks)**

---

## 🧪 **Project 1: Deploy 3-tier microservice app**

* API + Web + DB
* HPA
* Ingress
* Monitoring

---

## 🧪 **Project 2: Build Production-Ready Cluster**

* RBAC
* Network Policies
* GitOps
* Logging/monitoring

---

## 🧪 **Project 3: Cost Optimization**

* Rightsizing
* Spot node pools
* Autoscaling

---

## 🧪 **Project 4: Implement Service Mesh**

* Istio ingress
* mTLS
* Traffic routing

---

# 📘 **Certifications (Optional but Recommended)**

### 🥇 CKA — Certified Kubernetes Administrator

### 🥈 CKAD — Certified Kubernetes Application Developer

### 🥉 CKS — Certified Kubernetes Security Specialist

---