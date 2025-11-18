# 🚀 **Module 4 — Kubernetes Networking Mastery**

*From fundamentals → advanced service mesh → real-world troubleshooting.*

This module will take you from ZERO to EXPERT in Kubernetes networking.

---

# 🧭 **Section 1 — Networking Basics in Kubernetes**

Kubernetes networking is unique because it follows **four fundamental rules**:

### **Networking Rule #1 — Every Pod gets its own IP**

No NAT, no port mapping inside the cluster.

### **Networking Rule #2 — All Pods can communicate with each other**

No firewalls by default.

### **Networking Rule #3 — Containers in the same Pod share the same network namespace**

Same IP, same ports → communicate via `localhost`.

### **Networking Rule #4 — Services provide stable virtual IPs**

Even though Pods are ephemeral, Service IP never changes.

👉 These rules form the backbone of all Kubernetes networking decisions.

---

# 🧱 **Section 2 — Container Network Interface (CNI)**

## ⭐ WHAT is CNI?

CNI is the **plugin system** used by Kubernetes to handle:

* Pod networking
* IP assignment
* Routing
* Network policies

Kubernetes does **not include networking** by default — CNI provides it.

---

## 🔧 Popular CNI Plugins

| Plugin             | Purpose                                  |
| ------------------ | ---------------------------------------- |
| **Calico**         | L3 routing, Network Policies, eBPF mode  |
| **Cilium**         | eBPF networking, security, observability |
| **Flannel**        | Simplest overlay networking              |
| **Azure CNI**      | Native Azure VNet integration            |
| **Amazon VPC CNI** | Native AWS ENI integration               |
| **Weave**          | Simple overlay + encryption              |

---

## 🔍 HOW CNI Works (High-Level)

1. Pod scheduled to node
2. Kubelet calls CNI plugin
3. Plugin:

   * creates veth pairs
   * assigns IP
   * updates routing tables
4. Pod can now communicate with other Pods

👉 Every Pod’s IP is managed by the CNI plugin.

---

# 🧩 **Section 3 — Pod-to-Pod Networking**

Pods can communicate directly:

* Same node: via virtual ethernet (veth)
* Different nodes: via CNI routing or overlay network

### 🧠 WHY this matters:

* Microservices communicate across Pods
* Service discovery becomes easy
* No NAT inside cluster → simpler traffic flow

---

# 🛰️ **Section 4 — Services (Stable Networking Abstraction)**

A **Service** provides:

* A stable IP
* A stable DNS name
* Load balancing across Pods
* Discovery: which Pods are behind it

Common service types:

---

## **1️⃣ ClusterIP (Default)**

Internal virtual IP.
Used for **internal services**.

Example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 8080
```

---

## **2️⃣ NodePort**

Exposes service on each node’s IP on a static high port (30000–32767).

👉 Not recommended for production.

---

## **3️⃣ LoadBalancer**

Creates:

* NodePort
* ClusterIP
* External Load Balancer (cloud provider)

Used for:

* Publicly available services
* Exposing APIs

Azure/AWS/GCP automatically provision cloud LB.

---

## **4️⃣ Headless Service**

No ClusterIP → `None`.

Used for:

* StatefulSets
* DNS discovery
* Direct Pod access

Example:

```yaml
clusterIP: None
```

---

# 🌐 **Section 5 — DNS & Service Discovery**

Kubernetes includes **CoreDNS**.

DNS names follow patterns:

```
<service>.<namespace>.svc.cluster.local
```

Examples:

```
backend.default.svc.cluster.local
mysql.data.svc.cluster.local
```

---

# 🚖 **Section 6 — Ingress (L7 Routing)**

Ingress exposes HTTP/HTTPS routes.

Provides:

* Host-based routing
* Path-based routing
* TLS termination
* WAF capability (if supported)

Requires **Ingress Controller** such as:

* NGINX Ingress
* Traefik
* Istio Ingress
* Azure Application Gateway Ingress Controller

---

## Example Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
    - host: myapp.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
```

---

# 🧱 **Section 7 — Network Policies**

Network Policies control **who can talk to whom**.

Without policies → all traffic allowed.

Policies allow:

* Zero-trust networking
* Namespace isolation
* Application isolation
* Egress restrictions

Example:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
    - Ingress
```

---

# 🚦 **Section 8 — Advanced Service Concepts**

### ⭐ Endpoint Slices

Replaces Endpoints API for better scalability.

### ⭐ Session Affinity

Stick users to the same Pod.

### ⭐ ExternalName

Maps internal service to external DNS record.

---

# 🛣 **Section 9 — Traffic Flow Deep Dive**

For a request coming from user → Pod:

```
User → Ingress → Service → Endpoints → Pod
```

Inside the cluster:

```
Pod A → ClusterIP → kube-proxy → Pod B
```

Inside node:

* kube-proxy manages iptables or IPVS rules
* CNI controls routing

---

# 🧠 **Section 10 — kube-proxy Modes**

kube-proxy can run in:

### **1️⃣ iptables mode**

Fast, stable, default.

### **2️⃣ IPVS mode**

High performance load balancing.

---

# 🧬 **Section 11 — Multi-Cluster Networking**

Advanced distributed systems use:

* Submariner
* Istio multi-mesh
* Linkerd multi-cluster

Use cases:

* Disaster recovery
* Global traffic routing
* Federated clusters

---

# 🧳 **Section 12 — Service Mesh (Advanced Networking Layer)**

A service mesh provides:

### ✔ mTLS (encryption)

### ✔ Traffic shifting (canary, blue/green)

### ✔ Retry policies

### ✔ Circuit breaking

### ✔ Observability (metrics, traces)

Popular meshes:

* **Istio** (most powerful)
* **Linkerd** (lightweight)
* **Consul Connect**
* **Kuma**

---

# 🧰 **Section 13 — Kubernetes Networking Troubleshooting**

Key commands:

```
kubectl get pods -o wide
kubectl exec -it <pod> -- sh
kubectl get svc
kubectl get endpoints
kubectl get ing
kubectl describe svc <name>
kubectl describe ing <name>
```

Check Pod DNS:

```
nslookup backend
dig backend
```

Check connectivity:

```
curl http://backend
```

Check CNI issues:

```
kubectl get pods -n kube-system
journalctl -u kubelet
```

---

# 🎯 **What You Will Master After Module 4**

You will fully understand:

### ✔ Pod networking

### ✔ CNI deep internals

### ✔ Services (ClusterIP, NodePort, LoadBalancer)

### ✔ Headless Services & StatefulSet networking

### ✔ DNS & service discovery

### ✔ kube-proxy internals

### ✔ Ingress & L7 routing

### ✔ Network Policies (zero-trust)

### ✔ Service mesh fundamentals

### ✔ Real-world troubleshooting

This is everything required for **platform engineering**, **DevOps**, **SRE**, and **production-grade Kubernetes networking**.

---
