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
Here is a **clear and simple explanation of Pod Networking**, specifically useful for **Azure AKS / Kubernetes / DevOps interviews** 👇

---

# 🌐 **Pod Networking in Kubernetes — Clean Explanation**

Pod networking defines **how Pods inside a Kubernetes cluster communicate** with:

* Other pods
* Nodes
* Services
* External networks

Kubernetes follows the **Container Network Interface (CNI)** model.

---

# 🔑 **Core Principles of Kubernetes Pod Networking**

Kubernetes networking is built on three rules:

### **1️⃣ Every Pod gets its own IP**

Each Pod gets a **unique, routable IP address** inside the cluster.
No port conflicts → containers inside a Pod use *localhost*.

Example:

```
Pod A IP: 10.244.1.23
Pod B IP: 10.244.2.10
```

---

### **2️⃣ Pods can communicate with each other directly**

No NAT between Pods → full east–west communication inside cluster.

---

### **3️⃣ Containers inside the same Pod share a network namespace**

This means:

* same IP
* same network stack
* same ports

Useful for sidecars (Envoy, Istio, Fluentbit, etc.)

---

# 🛠 **How Pod Networking Works (CNI plugins)**

Kubernetes itself doesn’t provide networking.
Instead, it uses plugins called **CNI (Container Network Interface)**.

Popular CNIs:

* Azure CNI (AKS native)
* Kubenet (AKS basic)
* Calico
* Cilium
* Weave
* Flannel

The CNI is responsible for:

* Assigning IP to pods
* Creating routes
* Managing network policies
* Enabling connectivity between nodes and pods

---

# 🔵 **AKS-Specific Pod Networking**

AKS supports **two major networking models**:

---

## **1️⃣ Azure CNI (Recommended for production)**

### **How it works**

* Pod IPs come from **Azure VNet subnet**
* Each Pod gets a real VNet IP (not overlay)
* Fully integrates with Azure firewall, NSG, routes, private link

### **Pros**

✔ More secure
✔ Faster networking
✔ Better for enterprise
✔ Easy VNet integration

### **Cons**

❌ High IP consumption (each Pod uses VNet IP)

---

## **2️⃣ Kubenet (Basic / cost effective)**

### **How it works**

* Nodes get IP from VNet
* Pods receive IPs from an Overlay network
* NAT is used for outgoing connections

### **Pros**

✔ Saves IPs
✔ Simple

### **Cons**

❌ Slower performance
❌ Harder to integrate with Azure firewall
❌ NAT overhead

---

# 🔄 **Pod-to-Pod Communication Flow**

### **Same Node**

Pod A → virtual ethernet → CNI bridge → Pod B
(Simple Linux networking)

### **Different Nodes**

Pod A → Node A routing table → CNI → Node B → Pod B
(CNI manages routes between nodes)

---

# 🧱 **Network Policies**

Network Policies control:

* Which pods can talk to which
* Limit inbound/outbound rules
* Enforce zero trust

Example:

```
allow only pods with label app=frontend to talk to backend
```

Supported by:

* Azure CNI + Calico
* Cilium
* Calico CNI

---

# 🌍 **Pod-to-External Communication**

Pods communicate to the internet via:

* Node IP + SNAT (Kubenet)
* Pod IP directly (Azure CNI)
* Azure Firewall / NSG rules

---

# 📌 **In Interview, Be Ready to Explain:**

Here is a short version:

### **“What is Pod Networking?”**

> Pod networking ensures each pod receives its own unique IP and can communicate with other pods and services without NAT. Kubernetes uses CNI plugins like Azure CNI or Kubenet to create routes, assign pod IPs, and control traffic.”

### **“Difference between Azure CNI and Kubenet?”**

**Azure CNI:** Pod IPs from VNet, no NAT, faster, secure
**Kubenet:** Pod IPs from overlay, uses NAT, slow, fewer IPs consumed

---
Absolutely — here is a **deep internal breakdown of CNI** (Container Network Interface) in a way that is **interview-ready + technically accurate**.

---

# 🚀 **CNI Deep Internals — How Pod Networking Really Works**

CNI is **not a daemon** — it is a **spec + set of executable plugins**
that run **only during network lifecycle events** like:

* Pod creation
* Pod deletion

Kubelet triggers the CNI binary to:
✔ Allocate IP
✔ Create Pod network interfaces
✔ Configure routes
✔ Apply network policies

---

## 🧱 Core CNI Architecture

```
Kubelet
  └── executes CNI plugin binaries (in /opt/cni/bin)
        ├── Main CNI plugin (Azure CNI, Calico, Cilium, Flannel, Weave)
        └── IPAM Plugin (Host-local, Azure IPAM)
```

The configuration files are stored in:

```
/etc/cni/net.d/*.conf
```

Example call from kubelet:

```
ADD <container-id> <network-config>
```

The plugin returns a **CNI Result JSON** containing:

* Pod IP
* Gateway
* Interface name
* DNS settings

If the plugin fails → **Pod stays in ContainerCreating state**

---

# 🔄 Pod Creation Network Flow — Internal Sequence

### When kubelet creates a pod, network setup goes like:

```
1️⃣ Create Pod Sandbox Namespace
2️⃣ Run CNI ADD command
3️⃣ CNI plugin:
      - Creates veth pair
      - One end in Pod's namespace (eth0)
      - Other end on Node bridge/host namespace
4️⃣ Assign Pod IP (via IPAM)
5️⃣ Configure Routes
6️⃣ Return IP details to kubelet
```

Then kubelet attaches container to Pod sandbox → Pod is Ready.

---

## 🧩 Veth + Namespace Detailed View

```
Pod NET namespace
------------------------
eth0 (10.244.1.23)
Default route → veth0-peered
------------------------

Node Host Namespace
------------------------
bridge0 or host veth
Routing table entry:
10.244.1.0/24 → via node network
------------------------
```

---

# 🎯 Azure CNI vs Kubenet — Internal Routing Differences

| Feature                    | **Azure CNI**          | **Kubenet**            |
| -------------------------- | ---------------------- | ---------------------- |
| Pod IP source              | From Azure VNet Subnet | Overlay (10.244.x.x)   |
| Routing                    | UDRs or VNet routing   | Node-level NAT         |
| Pod IP routable externally | Yes                    | No                     |
| Performance                | High (no NAT)          | Medium (SNAT overhead) |
| IPAM                       | Azure IPAM             | host-local             |

---

## 🛰 Azure CNI Routing Internals

Azure injects routes into the subnet representing node pod CIDRs:

```
10.244.2.0/24 → via Node B IP (10.0.0.5)
```

Communication:
Pod A → Node A → Azure VNet routing → Node B → Pod B

➡ No encapsulation
➡ No NAT inside cluster

---

## 🧊 Kubenet Networking Internals

Uses Linux bridge + IPTables + SNAT

Pod → cbr0 (Linux bridge) → Node IP → SNAT → external

Node overlay CIDRs exchanged via:

* kube-proxy rules
* route distribution from kube-controller-manager

Overlay → slower → debugging harder

---

# 🧠 IPAM Internals

CNI calls **IP Address Management plugin**:

Two main types:

* **host-local** → maintains local IP pool file
* **Azure IPAM** → communicates with Azure VNet

Example host-local pool state stored at:

```
/var/lib/cni/networks/<name>
```

IPAM ensures:
✔ no duplicate IPs
✔ reclaim on Pod delete (CNI DEL)

---

# 🔐 CNI + Network Policies Enforcement

Network Policies enforced by:

| CNI        | Policy Engine            |
| ---------- | ------------------------ |
| Azure CNI  | Calico or Azure NP agent |
| Calico CNI | Calico                   |
| Cilium CNI | eBPF                     |
| Weave      | Weave firewall           |

### Enforcement level:

| Feature       | iptables | eBPF     |
| ------------- | -------- | -------- |
| Performance   | Medium   | High     |
| Observability | Hard     | Great    |
| CPU cost      | Higher   | Very low |

➡ Cilium gaining adoption for eBPF observability + security

---

# 🧩 CNI Plugin Types

### Main plugins

* Azure CNI, Calico, Cilium, Flannel, Weave Net

### Chained plugins (advanced)

```
Main CNI → Bandwidth → Firewall → Logging → Others
```

---

# ❌ Pod Delete Sequence (CNI DEL)

```
1️⃣ kubelet calls CNI DEL
2️⃣ Remove veth pair
3️⃣ Release IP back to IPAM pool
4️⃣ Cleanup iptables / eBPF flows
```

If DEL fails → orphan IPs → IP exhaustion in Azure CNI (VERY COMMON issue)

---

# 🔥 Interview-Ready Summary (Short Version)

> “CNI is a spec that kubelet calls to configure Pod networking. During Pod create, the CNI plugin creates a veth pair, assigns a Pod IP via IPAM, configures routing, and returns results. Azure CNI uses VNet IPs with native routing and no NAT. Kubenet uses an overlay with NAT and Linux bridging. eBPF-based CNIs like Cilium improve performance by replacing iptables.”

---

Below is a **clear, deep-dive, interview-ready explanation** of **Kubernetes Services** — especially useful for **AKS, DevOps, SRE, Platform Engineering** roles.

I’ll explain internals + packet flow + when to use which + AKS-specific behavior.

---

# 🚀 **Kubernetes Services (Deep Explanation)**

A **Service** in Kubernetes provides a **stable, permanent network endpoint** for a set of Pods.

Pods are **ephemeral**, but Services give them:

* Stable **DNS name**
* Stable **ClusterIP**
* Built-in load balancing
* Service discovery

Services match Pods using **labels**.

---

# 🟦 1. **ClusterIP (Default Service)**

### ✔ What it is

* Internal service accessible **only inside the cluster**
* Creates a **virtual IP** (VIP) inside cluster
* Other pods use this VIP to reach your service

Example:

```
ClusterIP: 10.96.0.12
DNS: myapp.default.svc.cluster.local
```

---

## 🔥 **How it works internally**

### **kube-proxy** programs iptables/eBPF rules:

```
10.96.0.12:80 → send to Pod A or Pod B
```

* Service IP is **virtual** (not bound to any interface)
* kube-proxy forwards traffic to Pod IPs using round-robin / random LB

### **Packet Flow**

```
Pod → ClusterIP (VIP) → kube-proxy → selects Pod → forwards
```

---

## ✔ Use Cases

* Internal microservices
* Database access
* Internal APIs
* Communication between pods

---

# 🟧 2. **NodePort (Service exposed at NodeIP:Port)**

### ✔ What it is

NodePort exposes a Service **on every node** at a static port (30000–32767).

Example:

```
NodeIP: 10.0.0.4:31001
NodeIP: 10.0.0.5:31001
```

Access using:

```
http://<any-node-ip>:31001
```

---

## 🔥 **How it works internally**

When a NodePort service is created:

1. **ClusterIP is created first**
2. kube-proxy opens a **port on every node**
3. Traffic to that port is forwarded:

```
NodeIP:31001 → ClusterIP → Pod
```

### **Packet Flow**

```
Client → NodeIP:NodePort → kube-proxy → Pod selected by endpoints
```

---

## ✔ Use Cases

* Expose for local development/test
* When you want a **Load Balancer above it** (example: MetalLB, ingress)
* Bare-metal Kubernetes clusters

---

## ❌ Not recommended for production on cloud

Because:

* No health checks
* No autoscaling integration
* Hard to secure
* Port collisions

AKS users typically don’t use NodePort directly.

---

# 🟩 3. **LoadBalancer (Cloud Load Balancer)**

### ✔ What it is

Creates an **external cloud load balancer** (Azure Load Balancer for AKS).

This provides:

* Public IP
* Health probes
* Cloud LB distribution
* Node failover

### Example:

```
Public IP: 20.41.90.15
DNS: myapp.eastus.cloudapp.azure.com
```

---

# 🔥 **How it works internally**

1. Kubernetes creates a **ClusterIP**
2. A **NodePort** is created automatically
3. Cloud provider creates:

* Azure Load Balancer (Layer 4)
* Azure Public IP
* Health probes
* Backend pool (AKS Nodes)

### **Packet Flow**

```
Client → Azure LB → NodeIP:NodePort → ClusterIP → Pod
```

Cloud LB → NodePort → Service → Pod

---

## ✔ Use Cases

* External-facing microservices
* Public APIs
* Apps exposed on internet
* Any AKS workload that needs public reachability

---

# 📌 Summary Table (Interview Fast Answer)

| Service Type     | Accessibility         | Use Case                  | Internals                  |
| ---------------- | --------------------- | ------------------------- | -------------------------- |
| **ClusterIP**    | Inside cluster only   | Internal services         | kube-proxy routes to pods  |
| **NodePort**     | Exposed on every node | Dev/Test, ingress backend | NodeIP:Port → Service      |
| **LoadBalancer** | External Internet     | Public apps               | Cloud LB → NodePort → Pods |

---

# 🧠 Deep Internal Differences

### ClusterIP

* VIP created via virtual IP (iptables/eBPF handled)
* No actual network interface is created
* Runs entirely inside cluster

### NodePort

* Real port opened on each node
* kube-proxy catches traffic at host level
* Used as backend for cloud load balancers

### LoadBalancer

* Managed by **cloud-controller-manager (CCM)**
* External resources created (Azure LB + Public IP)
* NodePort used under the hood

---

# 🌐 AKS-Specific Behavior

### **AKS creates:**

* Azure Load Balancer (Standard SKU)
* Inbound rules
* Backend pool (all nodes)
* Health probe port
* Managed Public IP

### Supported features:

* Internal LoadBalancers
* Multiple LoadBalancers per cluster
* Static Public IPs
* Allowed/Denied traffic via NSG

---

# 🏆 Interview Winning 30-Second Answer

> “ClusterIP exposes a service inside the cluster using a virtual IP managed by kube-proxy. NodePort exposes the service on each node’s IP at a fixed port and mainly acts as a backend for load balancers. LoadBalancer provisions a cloud load balancer (in AKS an Azure Load Balancer) that forwards external traffic to NodePort, then kube-proxy load balances to the pods.”

---

Here is a **clear, deep, interview-ready explanation** of **Headless Services** and **StatefulSet networking**, including **DNS behavior**, **pod identity**, and **how clients discover pods**.

---

# ✅ **Headless Services & StatefulSet Networking — Detailed Explanation**

## 1. **What is a Headless Service?**

A **Headless Service** is a Kubernetes Service *without* a ClusterIP.

You create it by setting:

```yaml
clusterIP: None
```

### 👉 Why is it called “headless”?

Because it **does not allocate a virtual IP** (ClusterIP) and **does not do load balancing**.

### Instead:

* Kubernetes returns **pod IPs directly** via DNS.
* The service acts as a **stable DNS registry**, not a load balancer.

---

# 2. **What does a Headless Service do?**

### ✔ **No VIP (ClusterIP = None)**

There is **no proxying** through kube-proxy.

### ✔ **DNS returns A-records for *each* Pod**

If your headless service is `mysql`, DNS resolves like:

```
mysql.default.svc.cluster.local
→ [10.10.1.21, 10.10.2.15, 10.10.3.22]
```

All pod IPs returned → application decides which one to connect.

### ✔ Used heavily with **StatefulSet**

Because StatefulSet needs:

* Stable pod identity
* Stable DNS hostname
* Direct connections (not load balanced)

---

# 3. **Why StatefulSets Need Headless Services**

StatefulSet gives **stable pod identities**:

```
pod-0
pod-1
pod-2
```

Headless service provides **stable DNS names** for these pods:

```
pod-0.mysql.default.svc.cluster.local
pod-1.mysql.default.svc.cluster.local
pod-2.mysql.default.svc.cluster.local
```

This is important for databases like:

* MongoDB Replica Set
* MySQL Group Replication
* Kafka brokers
* Cassandra
* ElasticSearch

These systems require each node to have:

* A **fixed hostname**
* An identity inside the cluster

---

# 4. **StatefulSet Networking — How it Works**

## ✔ Stable Hostnames

Each pod gets a predictable hostname:

```
<statefulset-name>-<ordinal>
```

Example:

```
kafka-0
kafka-1
kafka-2
```

---

## ✔ Stable DNS Records

Each pod automatically gets a DNS entry:

```
<pod-name>.<service-name>.<namespace>.svc.cluster.local
```

Example:

```
kafka-0.kafka-headless.default.svc.cluster.local
```

Even if the **pod is rescheduled**, the **DNS name remains**.

---

# 5. **Deep Internal Behavior — DNS Flow**

### 1️⃣ Pod starts

StatefulSet controller assigns identity:
`mysql-0`

### 2️⃣ Kubelet reports pod IP

Pod: `10.42.1.18`

### 3️⃣ DNS entry created

```
mysql-0.mysql.default.svc.cluster.local → 10.42.1.18
```

### 4️⃣ Any client doing DNS lookup receives:

* Only that pod’s IP
* No load balancing
* No virtual IP

---

# 6. **Headless Service vs ClusterIP**

| Feature             | ClusterIP        | Headless Service         |
| ------------------- | ---------------- | ------------------------ |
| ClusterIP assigned  | ✔ yes            | ❌ no                     |
| Load balancing      | ✔ via kube-proxy | ❌ client-side            |
| DNS returns         | 1 service IP     | All pod IPs              |
| Stable Pod Identity | ❌ no             | ✔ yes (with StatefulSet) |
| Best used for       | Web apps         | Databases, brokers       |

---

# 7. **Example: Headless Service + StatefulSet**

### **Headless Service**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  clusterIP: None
  selector:
    app: mysql
```

### **StatefulSet**

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql
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
```

---

# 8. **Why Headless Service Required for StatefulSet?**

### 👉 To preserve identity

`mysql-0` must always mean the same node.

### 👉 To support stable DNS

DB clusters expect fixed peer names (e.g., `mysql-0`, `mysql-1`).

### 👉 To allow direct pod-to-pod communication

Critical for:

* Replica set sync
* Leader election
* Gossip protocols

---

# 9. **Interview-Ready Summary**

### **Headless Service**

* No ClusterIP
* No load balancing
* DNS returns pod IPs
* Clients do their own load balancing
* Essential for StatefulSets

### **StatefulSet Networking**

* Stable pod identity: `<name>-<index>`
* Unique DNS per pod created automatically
* Perfect for databases and messaging clusters
* Requires a headless service for stable DNS

---
Below is a **clean, deep, interview-ready explanation** of **DNS & Service Discovery in Kubernetes**, simplified enough to remember but detailed enough to impress in AKS/DevOps interviews.

---

# ⭐ **DNS & Service Discovery in Kubernetes (Deep Explanation)**

Service discovery in Kubernetes allows one workload (Pod) to **find and communicate** with another workload **without knowing IP addresses**.

Kubernetes achieves this using **CoreDNS + Services**.

---

# 1️⃣ Why Service Discovery is Needed

Pods:

* are **ephemeral**
* frequently die and restart
* get **new IP addresses** each time

Applications **cannot rely on Pod IPs**.

Kubernetes solves this through:

* **Stable Service names**
* **Stable DNS names**
* **Automatic routing to healthy Pods**

---

# 2️⃣ Components Involved

| Component                      | Purpose                              |
| ------------------------------ | ------------------------------------ |
| **CoreDNS**                    | DNS server inside the cluster        |
| **Kube-proxy**                 | Creates load-balancing rules         |
| **Services**                   | Stable virtual endpoints             |
| **Endpoints / EndpointSlices** | Track which Pods belong to a service |

---

# 3️⃣ CoreDNS — The Brain of Service Discovery

In AKS and Kubernetes:

* CoreDNS is deployed as a **Deployment** in the `kube-system` namespace.
* Every Pod's `/etc/resolv.conf` points to CoreDNS as its DNS server.

Example (`cat /etc/resolv.conf` inside a Pod):

```
nameserver 10.0.0.10  # Cluster DNS (CoreDNS)
search default.svc.cluster.local svc.cluster.local cluster.local
```

This means:

* Pod DNS requests first go to CoreDNS.
* CoreDNS resolves **services**, **pod DNS**, and forwards others to public DNS.

---

# 4️⃣ How DNS Works for Services

Every Service gets a DNS name:

```
<service>.<namespace>.svc.cluster.local
```

Example:

```
backend-service.default.svc.cluster.local
```

### 👉 DNS returns the Service **ClusterIP**

Example:

```
backend-service → 10.0.1.144 (ClusterIP)
```

This is a **virtual IP**, not a real pod IP.

---

# 5️⃣ How Requests Reach Pods (Deep Flow)

### 🔍 When a Pod wants to call the backend service:

**Step-1:** App sends request to DNS name

```
curl http://backend-service
```

**Step-2:** DNS resolves

```
backend-service → 10.0.1.144 (ClusterIP)
```

**Step-3:** kube-proxy rewrites packet to one of the backend Pod IPs
(e.g., 10.244.3.21 or 10.244.4.17)

**Step-4:** Load balancing happens (Round Robin / IPVS)

---

# 6️⃣ EndpointSlices — How Kubernetes Tracks Pod Endpoints

Service stores which Pods are ready via:

* **Endpoints** (old style)
* **EndpointSlices** (modern** and scalable**)

Example EndpointSlice:

```
Addresses:
  - 10.244.3.21
  - 10.244.4.17
```

CoreDNS uses this to answer DNS queries accurately.

---

# 7️⃣ DNS for Headless Services (ClusterIP: None)

If you create:

```yaml
clusterIP: None
```

Then DNS responds with **all pod IPs**, not a single service IP:

```
mydb.default.svc.cluster.local
→ 10.244.1.10
→ 10.244.1.11
→ 10.244.1.12
```

Why?

Because:

* No load balancer
* No ClusterIP
* Used for **StatefulSets**, **databases**, **Kafka**, **Elasticsearch**

Clients handle load balancing.

---

# 8️⃣ DNS for StatefulSet Pods

For StatefulSets, Kubernetes creates **stable A-records**:

```
mysql-0.mysql.default.svc.cluster.local
mysql-1.mysql.default.svc.cluster.local
mysql-2.mysql.default.svc.cluster.local
```

These are **fixed hostnames** → perfect for distributed storage, leader election, replication.

---

# 9️⃣ How DNS Caching Works

CoreDNS caches results for a small TTL (default ~30s).

Pods may cache DNS depending on:

* OS
* libc
* application

For performance:

* CoreDNS uses a **cache plugin**
* NodeLocal DNS Cache (optional) speeds up Kubernetes DNS

---

# 🔟 Service Discovery Without DNS (Environment Variables)

When a Pod starts, Kubernetes injects environment variables:

```
BACKEND_SERVICE_HOST=10.0.1.144
BACKEND_SERVICE_PORT=8080
```

❗These variables do **not** update if service changes after pod startup.

DNS-based discovery is preferred.

---

# 1️⃣1️⃣ How External Services Are Discovered

Using `ExternalName`:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: mydb
spec:
  type: ExternalName
  externalName: db.company.com
```

DNS returns:

```
mydb.svc.cluster.local → CNAME → db.company.com
```

No proxying. Pure DNS.

---

# ⭐ Interview-Ready Summary

### **DNS in Kubernetes**

* CoreDNS resolves service/pod names.
* Every Pod uses CoreDNS as DNS server.
* DNS names are hierarchical:
  `service.namespace.svc.cluster.local`

### **Service Discovery**

* Clients call services using DNS.
* Services map to Pod IPs via EndpointSlices.
* kube-proxy routes traffic to correct Pods.

### **Headless Service**

* No ClusterIP.
* DNS returns Pod IPs.
* Used with StatefulSets, databases, brokers.

### **StatefulSet DNS**

* Gives stable identities:
  `pod-0.service.namespace.svc.cluster.local`

### **Load Balancing**

* ClusterIP -> kube-proxy load-balances
* Headless -> client load-balances

---
Here is a **deep, clear, interview-ready explanation** of **kube-proxy internals** — including iptables, IPVS, conntrack, service VIP logic, and how traffic flows inside nodes.

This will help you answer **AKS / Kubernetes networking interviews** confidently.

---

# ⭐ **Kube-Proxy Internals (Deep Explanation)**

Kube-proxy is a network component that runs on **every node**.
Its job:
✔ Maintain **load balancing rules**
✔ Route traffic for **ClusterIP, NodePort, LoadBalancer** services
✔ Forward packets to the correct **Pod endpoints**

BUT kube-proxy does **not** forward packets directly.
Instead, it programs the **node’s networking stack** using:

* **iptables mode** (older, widely used)
* **IPVS mode** (faster, scalable)
* **Userspace mode** (deprecated)

AKS uses **iptables or IPVS** depending on configuration.

---

# 1️⃣ kube-proxy doesn’t proxy packets like Nginx

Despite the name, kube-proxy is **not a reverse proxy**.

It does **not**:

* sit in the data path
* terminate connections
* forward packets itself

Instead, kube-proxy is a **controller** that configures OS-level networking rules.

---

# 2️⃣ Core Inputs kube-proxy Watches

kube-proxy listens to:

1. **Services**
2. **EndpointSlices** (or older Endpoints)
3. **Node events**

When anything changes:

* service created
* pod added/removed
* node becomes NotReady

kube-proxy updates routing rules accordingly.

---

# 3️⃣ Iptables Mode — How it Works Internally

### 🧠 Concept:

kube-proxy writes a set of NAT rules in **iptables**.
These rules translate **service ClusterIP** into **Pod IPs**.

### Example:

Service ClusterIP:

```
10.0.1.144:80
```

Backend Pods:

```
10.244.3.11:80
10.244.3.17:80
```

### kube-proxy creates:

* A service chain
* A load balancing chain
* DNAT rules

---

## 🔍 Deep Flow: How a Packet Reaches a Pod (iptables)

### 1. Client pod sends request to:

```
http://backend.default.svc.cluster.local
→ DNS resolves to ClusterIP: 10.0.1.144
```

### 2. Packet reaches node → hits iptables PREROUTING

### 3. iptables rule:

```
-d 10.0.1.144 --dport 80
-J KUBE-SVC-XYZ
```

### 4. KUBE-SVC-XYZ contains load-balancing jumps:

```
-J KUBE-SEP-ab12cd
-J KUBE-SEP-31ff99
```

### 5. One of the KUBE-SEP-* chains DNATs to pod:

```
--to-destination 10.244.3.11:80
```

### 6. The packet is forwarded to the Pod network (CNI)

**Result → Pod receives traffic as if it was sent directly.**

---

# 4️⃣ IPVS Mode (More Advanced)

IPVS = **Linux Kernel Layer 4 load balancer**

It’s faster because:

* Uses **connection tracking tables**
* Performs **direct kernel-level load balancing**
* Supports algorithms like RR, LC, WRR

### kube-proxy in IPVS mode does:

* Create a virtual service (`ClusterIP`) in IPVS
* Add backend endpoints as real servers

### Example:

```
ipvsadm -Ln

TCP  10.0.1.144:80 rr
 → 10.244.3.11:80
 → 10.244.3.17:80
```

### Why IPVS is better:

* Scales for **10,000+ services**
* Fast connection handling
* Efficient failover
* Lower latency vs iptables

---

# 5️⃣ NodePort Internals (Deep)

NodePort exposes service on a static port on **every** node:

```
<nodeIP>:30080
```

kube-proxy creates rules:

```
-d <nodeIP> --dport 30080
-J KUBE-NODEPORT-XYZ
```

NodePort traffic can come from:

* inside cluster
* outside cluster
* even nodes where no pod is running

Final DNAT → Pod IP.

---

# 6️⃣ LoadBalancer Internals

LoadBalancer service relies on **cloud provider** (AKS → Azure Load Balancer).

Flow:

1. LB sends traffic to nodeIP on NodePort
2. NodePort → iptables/IPVS
3. DNAT → Pod

kube-proxy still handles backend routing.

---

# 7️⃣ Hairpin NAT – Pod → Service → Same Node Pod

If a pod accesses service IP of itself:

```
pod1 → serviceIP → pod1
```

kube-proxy must support **hairpin mode**, so return traffic can re-enter correctly.

Without hairpin NAT:

* connection breaks
* services fail in same-node scenarios

---

# 8️⃣ Conntrack — Very Important

Linux conntrack tracks active connections.

Why important?

* If pod changes but conntrack still holds old IP → traffic goes to deleted pod.
* kube-proxy cleans up old conntrack entries when endpoints change.

Many outages happen due to **stale conntrack entries**.

---

# 9️⃣ kube-proxy in AKS

AKS supports two modes:

* **iptables** (default)
* **IPVS** (optional via config)

AKS also integrates:

* Azure CNI or Kubenet routing
* NSGs
* Azure Load Balancer
* UDRs for overlay routing

kube-proxy works on top of all these.

---

# 🔟 kube-proxy Failure Scenarios (Interview Gold)

### ✔ Pods added/removed but traffic still going to old IP →

Cause: **stale conntrack entries**

### ✔ NodePort not routing →

Cause: **iptables chain missing** or **kube-proxy crashed**

### ✔ Service not reachable →

Cause:

* CoreDNS failure
* kube-proxy not updating rules
* Node’s routing table broken
* EndpointSlices empty

---

# ⭐ Interview-Ready Summary (Use This Verbally!)

**kube-proxy is not a proxy. It programs the node’s networking rules using iptables or IPVS.
It watches Services and EndpointSlices, and when backends change, it updates NAT rules or IPVS virtual servers.
Traffic to a Service ClusterIP is DNAT’ed to Pod IPs using kernel-level routing.
In IPVS mode, kube-proxy uses kernel load balancing for faster and scalable service routing.
NodePort and LoadBalancer services also depend on kube-proxy rules.
Conntrack ensures flow consistency but can cause stale connection issues.
Overall, kube-proxy handles service discovery at packet-routing level.**

---

Below is a **deep, clear, interview-ready explanation** of **Ingress & L7 Routing**, covering architecture, controllers, traffic flow, TLS termination, routing rules, path/host routing, AKS specifics, and real-world use cases.
This is the level expected in **Azure, Kubernetes, and DevOps interviews**.

---

# ⭐ 1. What Is Ingress in Kubernetes?

Ingress is **not a load balancer** — it is a **Kubernetes API object** that defines **L7 (HTTP/HTTPS) routing rules** to expose your services externally.

Think of Ingress as:

**“A smart L7 traffic manager that routes HTTP/HTTPS requests to different services based on rules.”**

Example:

* `/api → backend service`
* `/app → frontend service`
* `shop.example.com → ecommerce service`

---

# ⭐ 2. Ingress Alone Does Nothing → Needs an Ingress Controller

Ingress is just configuration. The real work is done by:

### **Ingress Controller**

Examples:

* **NGINX Ingress Controller** (most common)
* **Azure Application Gateway Ingress Controller (AGIC)**
* **Traefik**
* **HAProxy**
* **Istio (Gateway)**

In AKS, common setups:

* **NGINX Ingress Controller** (traditional)
* **Azure Application Gateway (AGIC)** (cloud native, WAF)
* **NGINX Plus** (Enterprise)

---

# ⭐ 3. Why Ingress is L7 (Application Layer)

L4 (LoadBalancer/NodePort) works with:

* IP address
* Port numbers

Ingress works at **Layer 7**, meaning:

* HTTP path (`/api`, `/login`)
* Hostnames (`shop.example.com`)
* Cookies
* Headers
* JWT claims
* TLS termination/SNI

Ingress is smarter than L4 because it inspects **HTTP traffic**, not just packets.

---

# ⭐ 4. Ingress Traffic Flow (Deep Internals)

### 🔽 Step-by-step AKS Ingress Traffic Flow:

**1. User hits your domain:**

```
https://api.mysite.com
```

**2. DNS resolves to → public IP of Ingress Controller**

**3. Request arrives at Ingress Controller Pod**
(Common: NGINX or Application Gateway)

**4. Ingress Controller reads routing rules from Ingress object**

**5. Applies L7 logic**

* Check Host header
* Check Path
* Check TLS
* Check rules
* Select service

**6. Forwards traffic to the correct Kubernetes Service**

**7. Service forwards → kube-proxy → correct Pod**

---

# ⭐ 5. Ingress Routing Types (Very Important in Interviews)

### ✔ **1. Host-based Routing**

Routes based on hostname.

Example:

```
shop.example.com → shop-service
api.example.com → api-service
```

### ✔ **2. Path-based Routing**

Routes based on URL path.

Example:

```
/app → frontend-service
/api → backend-service
```

### ✔ **3. Regex Routing**

(Only in NGINX advanced mode)

```
/v[0-9]/users → user-service
```

### ✔ **4. Header-based Routing**

Used in Traefik, Istio, and NGINX Plus.

Example:

```
Header: X-Version=beta → beta-service
```

### ✔ **5. Weighted Routing (Blue/Green or Canary)**

```
70% traffic → stable
30% traffic → canary
```

Supported by:

* NGINX
* Istio
* Argo Rollouts

---

# ⭐ 6. Ingress Architecture Internals

### **A. Ingress Object → Defines Rules**

```yaml
/api → service1
/app → service2
```

### **B. Ingress Controller → Applies Rules**

NGINX generates a runtime config file:

```
server {
  location /api {
    proxy_pass http://service1
  }
  location /app {
    proxy_pass http://service2
  }
}
```

### **C. Backend Services & Endpoints**

Service → Pod IPs

Ingress → Service → Pod

---

# ⭐ 7. TLS in Ingress (Very Important)

Ingress supports:

* **TLS termination**
* **SSL offloading**
* **SNI routing** (multiple domains)

### Example TLS block:

```yaml
tls:
  - hosts:
      - example.com
    secretName: tls-secret
```

Ingress Controller:

* terminates TLS
* routes decrypted HTTP traffic internally

**AGIC** can also offload TLS at the Application Gateway level.

---

# ⭐ 8. AGIC (Azure Application Gateway Ingress Controller)

AGIC is unique because:

* It does **not** run as a proxy pod.
* It programs **Azure Application Gateway (Layer 7 load balancer + WAF)**.
* Good for production-grade L7 routing.

Flow:

```
User → App Gateway (TLS termination + WAF) → AKS NodePort → Pod
```

AGIC benefits:

* WAF (OWASP rules)
* Autoscaling gateway
* Private IP / public IP
* Multi-site routing
* Zero-trust app-level controls

---

# ⭐ 9. Ingress vs Service Mesh (Difference)

| Feature             | Ingress (L7 routing) | Service Mesh (Istio/Linkerd)     |
| ------------------- | -------------------- | -------------------------------- |
| External traffic    | ✔ Yes                | ✔ Yes (gateway)                  |
| Internal pod-to-pod | ❌ No                 | ✔ Yes                            |
| mTLS                | ❌ No                 | ✔ Yes                            |
| Traffic shifting    | Limited              | Advanced (ratelimiting, retries) |
| Observability       | Basic                | Deep (metrics, tracing)          |

---

# ⭐ 10. Difference Between Ingress, LoadBalancer, NodePort

| Type         | Layer | Purpose                             |
| ------------ | ----- | ----------------------------------- |
| NodePort     | L4    | Opens fixed port on nodes           |
| LoadBalancer | L4    | Exposes app externally via cloud LB |
| Ingress      | L7    | Smart routing + TLS + rules         |

Ingress provides **one public IP** for **many services**.

---

# ⭐ 11. Why Enterprises Use Ingress

### 🚀 Advantages:

* Single public IP
* Easy routing rules
* Centralized TLS termination
* Cheaper than multiple LoadBalancers
* Advanced HTTP features
* Can host multi-domain, multi-app setup

---

# ⭐ 12. Ingress in Real Production Scenarios

### ✔ Microservices Routing

```
/api
/auth
/catalog
/recommendation
```

### ✔ Multi-domain hosting

```
admin.company.com
portal.company.com
www.company.com
```

### ✔ Canary or Blue/Green deployment

NGINX or AGIC supports weighted routing.

### ✔ WAF protection (AGIC + App Gateway WAF)

Protects apps from:

* SQL injection
* XSS
* OWASP Top 10 attacks

---

# ⭐ Interview-Ready Summary

Use this exact text in interviews:

> **Ingress is a Kubernetes L7 routing mechanism that exposes multiple services through a single external endpoint. It uses an Ingress Controller like NGINX or AGIC to implement HTTP/HTTPS routing rules such as host-based routing, path routing, TLS termination, and load balancing. Unlike L4 load balancers, Ingress works at the application layer, meaning it understands HTTP, headers, cookies, and domains, which enables advanced traffic management such as blue/green, canary, sticky sessions, and WAF filtering.**

---

Here is a **clear, deep, structured explanation** of **Kubernetes Network Policies** and how they enforce **Zero-Trust Networking** inside a cluster.

---

# ✅ **Network Policies (Zero-Trust Networking) — Full Detailed Explanation**

Kubernetes **Network Policies** control **which Pods can talk to which Pods** (and/or external networks) at **Layer 3/4** (IP + Port).
They act like **firewalls for Pods**.

Think of Network Policies as **distributed ACLs** enforced by the CNI plugin.

---

# 🔥 **Why Network Policies? — Zero-Trust Model**

Traditional cluster behavior =
➡️ **ALL pods can talk to ALL pods by default** (flat network, open communication).

Zero-Trust model =
❌ “Trust nothing”
❌ “Default allow everything”
✅ “Deny everything first”
✅ “Explicitly allow only required communication paths”

A Zero-Trust approach requires:

| Zero-Trust Principle     | Network Policy Implementation                           |
| ------------------------ | ------------------------------------------------------- |
| Default deny all traffic | Use `defaultDeny` ingress/egress rule                   |
| Least privilege          | Allow only required traffic (ports, namespaces, labels) |
| Micro-segmentation       | Per-app network rules                                   |
| Identity-based access    | Pod labels = identity of workload                       |

So Network Policies create **micro firewalls around each pod**.

---

# 🧰 **Prerequisites**

**Network Policies do NOT work with all CNIs.**
They require a CNI that supports network policy enforcement:

✔ Calico
✔ Cilium
✔ Azure CNI
✔ AWS VPC CNI + plugins
✔ Antrea

❌ Flannel (does NOT support policies)

---

# 🧬 **How Network Policies Work Internally**

1. You create a `NetworkPolicy` object.

2. K8s API server stores & distributes the policy.

3. CNI plugin (Calico/Cilium/etc.) programs firewall rules:

   * iptables
   * eBPF maps
   * OVS flow rules (for Antrea/OpenShift)

4. Rules are ENFORCED per-pod:

   * Pod IP
   * Source pod label
   * Namespace label
   * Port/Protocol

5. Only **matching traffic** is allowed; all else is denied.

---

# 🟦 **1. Default-Deny Network Policy (Zero-Trust Begin)**

Before you allow anything, you MUST deny everything.

### **Ingress Default Deny**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

### **Egress Default Deny**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
spec:
  podSelector: {}
  policyTypes:
  - Egress
```

This means:

* NO pod in namespace can receive traffic
* NO pod can send traffic
  Unless explicitly allowed later.

---

# 🟩 **2. Allow Ingress from a Specific App (Micro-Segmentation)**

Example: Allow **frontend** to talk to **backend** on port 8080.

### Backend Policy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - port: 8080
      protocol: TCP
```

Meaning:

* Backend **ONLY accepts traffic** from pods labelled `app=frontend`.

If another pod tries → **DENIED**.

---

# 🟥 **3. Namespace-Based Access**

Example: Only pods from namespace `payments` can call `app=processor`.

```yaml
ingress:
- from:
  - namespaceSelector:
      matchLabels:
        name: payments
```

This allows **isolation between teams**.

---

# 🟪 **4. Egress Policy (Outbound Firewall)**

Example: Allow pod to call only database and block internet.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: restrict-egress
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - port: 5432
      protocol: TCP
```

This means:

* Pod can talk ONLY to DB subnet on port 5432.
* Internet Traffic = BLOCKED.

---

# 🟧 **5. IP Block Rule (Ban Internet / Allow Only Specific CIDRs)**

Block entire internet except one CIDR:

```yaml
egress:
- to:
  - ipBlock:
      cidr: 0.0.0.0/0
      except:
      - 1.2.3.0/24  # Block this
```

Used for:

* PCI/DSS
* Banking
* Zero-trust production clusters

---

# 🟨 **6. Allow DNS Traffic (required for cluster apps!)**

If you apply **default deny egress**, your pods cannot resolve DNS.

You MUST allow DNS manually:

```yaml
egress:
- to:
  - namespaceSelector:
      matchLabels:
        name: kube-system
    podSelector:
      matchLabels:
        k8s-app: kube-dns
  ports:
  - port: 53
    protocol: UDP
```

---

# 🟦 **Zero-Trust Architecture Using Network Policies**

### 1️⃣ Block all traffic (default deny)

### 2️⃣ Allow required ingress for each service

### 3️⃣ Allow required egress (DB, API, logging)

### 4️⃣ Restrict namespace-to-namespace traffic

### 5️⃣ Enforce identity-based pod access

### 6️⃣ Log traffic using Cilium/Calico

### 7️⃣ Use eBPF for high performance rules

This results in:
✔ Zero lateral movement
✔ Micro-segmentation
✔ Pod-level firewall
✔ Encrypted traffic (if used with service mesh)

---

# 🔥 **Advanced Concepts (Interview-Level)**

### **1. How CNI Implements Policies**

**Calico**
→ iptables rules per pod
→ eBPF dataplane (faster)

**Cilium**
→ eBPF programs at L3, L4, L7
→ Can enforce HTTP-level policies (very advanced)

**Antrea**
→ Open vSwitch flows
→ Supports conntrack, L7 rules

---

### **2. Network Policies are Stateful**

They use **conntrack** so allowed connections can flow bidirectionally once established.

Example: If ingress allows
`frontend → backend:8080`
Response from backend to frontend is **allowed automatically**.

---

### **3. Logging via Cilium/Calico**

You can enable:

* Flow logs
* Denied packet logs
* eBPF packet traces

Used heavily in incident analysis.

---

# 🎯 **Simple Explanation (60 seconds)**

Network Policies define **who can talk to whom** inside Kubernetes.
They enforce zero-trust by **blocking all traffic by default** and only allowing specific, intentional communication paths between pods, namespaces, or IP ranges.

They turn Kubernetes into a **secured, segmented, micro-firewalled environment**.

---

Here is a **clear, deep, structured, interview-ready explanation** of **Service Mesh Fundamentals**—exactly what you need for Kubernetes architecture understanding.

---

# 🌐 **Service Mesh Fundamentals — Full Detailed Explanation**

A **Service Mesh** is an infrastructure layer that manages **service-to-service communication** inside a microservices environment—usually Kubernetes.
It provides **L7 networking features** without changing your application code.

**Think of it as:**

> “A dedicated control plane + a network of sidecars that transparently handle service communication.”

---

# 🧱 **Core Purpose of a Service Mesh**

Traditional microservices face problems:

* Service discovery
* Secure mTLS communication
* Traffic management (retry, timeout, load balancing)
* Observability (traces, metrics, logs)
* Policy enforcement
* Zero-trust communication
* Circuit breaking

A Service Mesh solves these **without modifying application code**.

---

# 🌀 **Service Mesh Architecture (High-Level)**

A service mesh has two major components:

---

## 🟦 **1. Data Plane (Sidecar Proxies)**

This is the **runtime** part.

Typically uses **Envoy proxy** running as a **sidecar container** next to every application pod.

Functions:

* Intercepts all inbound/outbound traffic
* Applies routing rules
* Performs mTLS handshake
* Collects telemetry
* Enforces security policies
* Rate limiting / retries / circuit breakers

The app talks → localhost proxy → network → remote proxy → remote app.

**No app code changes needed.**

---

## 🟧 **2. Control Plane**

The **brain** of the mesh.

Examples:

* Istio Control Plane (istiod)
* Linkerd Control Plane
* Consul Control Plane

Responsibilities:

* Distribute policies
* Manage certificates
* Push config to sidecars
* Manage service discovery
* Compute routing rules
* Provide mesh-wide intelligence

The control plane **does NOT sit in data path**, so it does NOT affect request latency.

---

# ⭐ **Key Features of a Service Mesh**

Below are the **main functionalities**, grouped for clarity.

---

# 🔐 1. **Security (Zero-Trust Networking)**

### ✔ **mTLS (Mutual TLS)**

Every service-to-service call is encrypted AND authenticated.

Mesh automatically handles:

* Key generation
* Certificate rotation
* Identity-based communication (SPIFFE/SVID)
* Denying unauthenticated calls

This enforces **zero trust**:
“No service trusts any other service automatically.”

---

# 🔀 2. **Traffic Management (L7 Routing)**

Dynamic routing without code changes:

### ✔ Intelligent load balancing

* Weighted
* Least request
* Round-robin
* Random

### ✔ Traffic shifting (Canary / Blue-Green)

Example: Route
95% → v1
5% → v2

### ✔ Fault injection

* Add delays
* Add errors
  Used for testing resiliency.

### ✔ Timeouts, retries, circuit breaking

All configured at mesh level (Envoy sidecar does it).

---

# 📡 3. **Observability**

Automatically gives:

### ✔ Distributed tracing

Jaeger / Zipkin

### ✔ Metrics

* Request count
* Latency
* Errors
* Success/Failure rate

### ✔ Access logs for all services

Per-service telemetry without code instrumentation.

This is **HUGE** in complex microservices.

---

# 🛡 4. **Policy & Access Control**

Example policies:

### ✔ Allow only frontend → backend

based on service identity, not IP.

### ✔ Rate limiting

Restrict a service to X RPS.

### ✔ Quotas

Limit API calls or resources.

### ✔ Authorization policies

Who can call whom → RBAC at service-to-service level.

---

# 🧩 5. **Service Discovery**

Even if pod IPs change, sidecars handle discovery using:

* Service registry
* Endpoints API
* Mesh control plane

Sidecars maintain an updated view of which pods exist.

---

# 🧱 **Sidecar Pattern — Critical Concept**

Every pod gets a **sidecar container** (Envoy proxy).

Example pod:

```
Pod
 ├── app container (your code)
 └── envoy sidecar container (mesh proxy)
```

All traffic is forced through sidecar using **iptables** or **eBPF**.

Sidecar responsibilities:

* Encrypt traffic
* Apply routing
* Collect telemetry
* Enforce security
* Retries + circuit breaking

Applications don’t know the mesh exists — ZERO app changes.

---

# 🧰 **Popular Service Mesh Technologies**

| Mesh                 | Concept        | Data Plane | Notes                              |
| -------------------- | -------------- | ---------- | ---------------------------------- |
| **Istio**            | Most powerful  | Envoy      | Enterprise features, sidecar heavy |
| **Linkerd**          | Lightweight    | Rust proxy | Faster, simpler                    |
| **Consul Connect**   | Multi-env      | Envoy      | Integrates with HashiCorp tools    |
| **Kuma / Kong Mesh** | Universal mesh | Envoy      | Easy multi-cluster                 |

---

# 🧲 **Service Mesh vs Ingress Controller**

| Feature       | Ingress Controller  | Service Mesh                              |
| ------------- | ------------------- | ----------------------------------------- |
| Works at      | Cluster edge        | Inside cluster                            |
| Purpose       | North-south traffic | East-west traffic                         |
| Security      | Basic TLS           | mTLS, identity                            |
| Routing       | HTTP L7             | Deep routing + retries + circuit-breakers |
| Observability | Limited             | Full metrics/tracing                      |

Both are complementary, not replacements.

---

# 📚 **Why Service Mesh Became Important?**

Microservices have challenges:

* Too many services
* Hard to secure (no mTLS by default)
* Hard to monitor
* Hard to control failures
* Hard to do progressive delivery

Service mesh solves these **centrally**, not inside the application code.

---

# 📦 **Service Mesh in AKS (Azure Kubernetes)**

AKS supports:

✔ Istio (official add-on)
✔ Open Service Mesh (OSM)
✔ Linkerd

Istio is the most commonly used.

---

# 🧠 **Advanced Concepts (Interview Level)**

### **1. mTLS Identity = SPIFFE/SVID**

Each service gets an identity like:

```
spiffe://cluster.local/ns/default/sa/myservice
```

This proves **who the service is**, cryptographically.

---

### **2. Envoy Filter Chains**

Envoy uses multiple filter layers:

* L3/L4 filters: TCP proxying
* L7 filters: HTTP routing
* Listener Filters
* Detect protocol
* Apply routing rules

---

### **3. Sidecarless Mesh (Istio ambient mesh)**

Next-generation model:

* No sidecars
* Uses eBPF + mTLS tunnels
* Lower overhead
* Simpler operations

This is **future of mesh in 2025+**.

---

# 🎯 **Simple Summary (60 Seconds)**

A service mesh is a **network layer for microservices** that provides:

* mTLS security
* Advanced traffic routing
* Observability
* Policies
* Resilience (retries, circuit breaking)

It works using:

* **Sidecar proxies (data plane)**
* **A central control plane**

It gives powerful features **without modifying application code**.

---
# Real-world Networking Troubleshooting — deep, practical, step-by-step

This is a compact, battle-tested playbook for troubleshooting networking issues in Kubernetes/AKS and Linux cloud environments. It’s organized as a repeatable checklist, common scenarios with exact commands, diagnostics to run, and escalation points. Use it as your lab notebook when things go wrong.

---

## Quick strategy (how to think)

1. **Reproduce the problem** and scope it (single pod / namespace / node / cluster / external).
2. **Work from client → server** (where request originates to where it should terminate).
3. **Check layers**: App → Pod network → Node → Cluster (Service, kube-proxy) → CNI → Cloud network (VNet, NSG, LB) → Internet.
4. **Gather evidence** (logs, tcpdump, traces) — do NOT start changing things wildly.
5. **Fix minimal surface**: small changes, validate, then expand.
6. **Document** what you did and revert unsafe changes.

---

## Core checklist (run quickly, then deep dive)

1. Is the Pod running and Ready?

```bash
kubectl get pods -n <ns> -o wide
kubectl describe pod <pod> -n <ns>
```

2. Does the Pod have an IP and is it reachable from another Pod on same node?

```bash
kubectl exec -n <ns> -it <pod-a> -- ip addr show
kubectl exec -n <ns> -it <pod-a> -- ping -c3 <pod-b-ip>
```

3. Are Service / Endpoint objects correct?

```bash
kubectl get svc -n <ns>
kubectl describe svc <svc> -n <ns>
kubectl get endpointslices -n <ns> -o wide
kubectl get endpoints -n <ns>
```

4. DNS resolving?

```bash
kubectl exec -n <ns> -it <pod> -- nslookup <svc>.<ns>.svc.cluster.local
kubectl exec -n <ns> -it <pod> -- dig +short <svc>.<ns>.svc.cluster.local
```

5. Kube-proxy status & rules:

```bash
kubectl get ds -n kube-system kube-proxy -o wide
kubectl logs -n kube-system ds/kube-proxy
# on node:
sudo iptables -t nat -L KUBE-SERVICES -n --line-numbers   # iptables mode
sudo ipvsadm -Ln                                       # IPVS mode
```

6. CNI / node routes:

```bash
# see CNI interfaces and routes on node
ip a
ip route
# check neighbor/ARP
ip neigh
# if Azure CNI: check Azure network interface on node, IP forwarding etc.
```

7. Cloud layer (AKS/Azure):

* NSGs: inbound/outbound rules for node subnet and LB IPs
* Route Tables (UDR) for node subnets
* Azure LB backend health probes & rules
* Azure Firewall / Application Gateway (WAF) logs
  Use Azure Portal / `az network watcher` tools for connection monitor & packet capture.

---

## Tools you’ll use (local & in-cluster)

* `kubectl` (describe, logs, exec, port-forward)
* `nslookup` / `dig` / `host` inside pods
* `curl -v`, `wget`, `telnet`, `nc` for connectivity & ports
* `tcpdump`, `wireshark` (pcap) — on nodes or using `kubectl debug`/privileged pods
* `ss` / `netstat` on nodes and pods
* `iptables` / `ipvsadm` / `conntrack -L` on nodes
* Cloud tools: Azure Network Watcher (connection troubleshoot, packet capture, NSG flow logs), AWS VPC Reachability Analyzer etc.
* Observability: Prometheus metrics, application logs, Azure Monitor/Log Analytics

---

## How to capture packets safely

* On a node (privileged):

```bash
sudo tcpdump -i any -s 0 -w /tmp/trace.pcap host <ip> and port <port>
# copy file and open in Wireshark
```

* In Kubernetes: run a privileged debug pod with hostNetwork / hostPID if necessary, or use `kubectl debug node/<node> -it --image=nicolaka/netshoot`.
* Use cloud packet capture (Azure Network Watcher) when node-level capture isn't allowed.

---

## Diagnosis recipes — real scenarios

### Scenario A — Pod **A** can’t reach Pod **B** (same namespace)

1. Confirm Pod IPs:

```bash
kubectl get pod <a> -o wide -n ns
kubectl get pod <b> -o wide -n ns
```

2. From A: ping/tcp connect to B:

```bash
kubectl exec -n ns -it <a> -- ping -c3 <b-ip>
kubectl exec -n ns -it <a> -- curl -v http://<b-ip>:<port>    # or nc -zv
```

3. If ping fails: check CNI interface & routes on node A:

```bash
kubectl debug node/<node-a> -it --image=nicolaka/netshoot -- bash
ip a; ip route; ip neigh
```

4. If ping works but TCP fails: check service on Pod B:

```bash
kubectl exec -n ns -it <b> -- ss -lntup
kubectl logs -n ns <b>
```

5. If packets leave node but no reply: capture packets on node, check iptables/ipvs rules.

---

### Scenario B — Service (ClusterIP) unreachable from other pods

1. `kubectl get svc -n ns` and `kubectl describe svc <svc>` — confirm ClusterIP and ports.
2. Check Endpoints/EndpointSlices:

```bash
kubectl get endpoints -n ns <svc> -o yaml
kubectl get endpointslices -n ns -o wide | grep <svc>
```

3. From a pod, curl the ClusterIP:

```bash
kubectl exec -n ns -it <tester> -- curl -v http://<cluster-ip>:<port>
```

4. If ClusterIP not reachable: examine kube-proxy rules on node (iptables / ipvs). On node:

```bash
sudo iptables -t nat -L KUBE-SERVICES -n --line-numbers
sudo iptables -t nat -L KUBE-SEP -n --line-numbers
# or for IPVS
sudo ipvsadm -Ln
```

5. Also check `kube-proxy` logs for errors and EndpointSlice controller errors.

---

### Scenario C — Ingress returns 502/504 or 404

1. Check Ingress resource and corresponding Ingress Controller logs (NGINX / AGIC).

```bash
kubectl describe ingress <ingress> -n ingress-nginx
kubectl logs -n ingress-nginx deploy/<nginx-controller> -f
```

2. Validate backend services exist and endpoints are healthy.
3. Check NGINX config inside controller pod (for nginx-ingress):

```bash
kubectl exec -n ingress-nginx -it <nginx-pod> -- cat /etc/nginx/nginx.conf
```

4. If 502 — backend refused / not responding. Debug service/Pod.
5. If 504 — backend timed out, check timeouts, health probes, and application latency.
6. For AGIC: check Azure Application Gateway health probes & backend pool; use Azure Portal to see probe status.

---

### Scenario D — DNS resolution failing in pods

1. Check pod `/etc/resolv.conf`:

```bash
kubectl exec -n ns -it <pod> -- cat /etc/resolv.conf
```

2. Query CoreDNS directly:

```bash
kubectl get pods -n kube-system -l k8s-app=kube-dns -o name
kubectl exec -n kube-system -it <coredns-pod> -- /bin/sh -c "cat /etc/resolv.conf; nslookup kubernetes.default"
```

3. Check CoreDNS logs and configmap:

```bash
kubectl logs -n kube-system deploy/coredns
kubectl get configmap -n kube-system coredns -o yaml
```

4. If DNS broken after default-deny network policy, ensure DNS allowed in policies.

---

### Scenario E — NodePort / LoadBalancer traffic not arriving at pods

1. For cloud LB: check cloud provider (Azure) resources:

   * Azure Load Balancer health probes (are they GREEN?)
   * Backend pools contain node IPs
   * NSG allows probe and NodePort ports
2. Verify NodePort exists:

```bash
kubectl get svc -n ns <svc> -o yaml
```

3. On node, inspect iptables/ipvs NodePort chains. Check that NodePort is open (ss/netstat):

```bash
ss -ltnp | grep <nodeport>
```

4. If cloud LB shows unhealthy: troubleshoot node firewall and kube-proxy and check that kube-proxy updated rules for the NodePort.

---

## Deep command bank (copy-paste ready)

### Kubernetes introspection

```bash
kubectl get pods,svc,ep -A
kubectl describe pod <pod> -n <ns>
kubectl describe svc <svc> -n <ns>
kubectl get endpointslices -n <ns> -o yaml
kubectl get events -n <ns> --sort-by='.lastTimestamp'
kubectl port-forward -n <ns> <pod> 8080:80    # quick local test
```

### In-pod tests

```bash
kubectl exec -n <ns> -it <pod> -- /bin/sh -c "apk add --no-cache bind-tools; nslookup svc.ns.svc.cluster.local"
kubectl exec -n <ns> -it <pod> -- curl -vS --connect-timeout 5 http://<ip>:<port>
kubectl exec -n <ns> -it <pod> -- nc -zv <ip> <port>
kubectl exec -n <ns> -it <pod> -- ss -tulpen
```

### Node-level diagnostics (ssh as appropriate)

```bash
# networking
ip a; ip route; ip neigh
ss -tulpen
sudo iptables -t nat -L -n --line-numbers
sudo ipvsadm -Ln   # if IPVS
sudo conntrack -L | grep <ip>
# captures
sudo tcpdump -i any host <pod-ip> and port <port> -w /tmp/out.pcap
# check CNI logs
sudo journalctl -u kubelet -n 200
sudo docker ps   # if Docker runtime
```

### Azure-specific

```bash
# check NSG rules
az network nsg rule list --nsg-name <nsg> --resource-group <rg> -o table
# check effective routes for NIC
az network nic show-effective-route-table --name <nic> --resource-group <rg>
# Network Watcher connection troubleshoot
az network watcher test-connectivity --resource-group <rg> --source-resource <vm-id> --dest-address <ip> --dest-port 80
# start packet capture via Network Watcher
az network watcher packet-capture create --resource-group <rg> --name pc1 --vm <vm-name> --time-limit 300 --capture-filter "tcp and port 80"
```

---

## Common root causes & how to spot them

| Symptom                          | Common cause                                     | How to detect                                            |
| -------------------------------- | ------------------------------------------------ | -------------------------------------------------------- |
| Pod unreachable from other pods  | CNI misconfig / node route missing               | `ip route`, `ip a`, `ping` between pods                  |
| ClusterIP reachable not          | kube-proxy rules missing / broken                | `iptables`/`ipvsadm`, kube-proxy logs                    |
| Service resolves but no backends | Endpoints not populated                          | `kubectl get endpoints`, EndpointSlices, controller logs |
| DNS fails only in some pods      | NetworkPolicy blocking DNS / CoreDNS issue       | check netpol, CoreDNS logs, nslookup from pod            |
| LB unhealthy in cloud            | Health probe failure / NSG blocking              | Cloud LB health status, NSG flow logs                    |
| Intermittent 5xx from Ingress    | Backend timeouts / resource pressure / conntrack | NGINX logs, Pod metrics, tcpdump                         |
| Latency spikes                   | MTU/fragmentation / overlay encapsulation        | MSS/MTU checks, tcpdump show fragmentation               |

---

## Advanced topics & gotchas

* **Conntrack**: stale connections continue to flow to deleted pods. Clean with `conntrack -D` for specific tuple (use carefully).
* **Hairpin NAT**: pods calling services that direct to same-node pods may need hairpin enabled.
* **MTU / Fragmentation**: overlay (VXLAN) adds overhead; large packets may be dropped — check `ip link` MTU and `tcpdump` for fragmentation.
* **IP exhaustion (Azure CNI)**: Pods get VNet IPs; running out of IPs causes scheduling/network failures. Monitor pod IP pool consumption.
* **NetworkPolicy expectations**: If *any* NetworkPolicy selects a pod for ingress (or egress), Kubernetes switches to the “deny-by-omission” model — you must allow DNS and kube-system traffic explicitly.
* **kube-proxy mode changes**: mixing iptables and IPVS behavior differences — ensure all nodes are consistent.
* **HostNetwork pods** bypass CNI rules — helpful for debugging or when node-level connectivity is required.

---

## Example full troubleshooting playthrough (complete steps)

**Problem:** Production web app returns 502 behind NGINX Ingress.

1. Reproduce & scope: get 502 time + correlation: all pods or only some.
2. `kubectl describe ingress` → check backend service name/port mapping.
3. `kubectl get svc backend -o yaml` → confirm port names/targetPort.
4. `kubectl get endpoints backend` → are pod IPs listed? If none, controller failed or labels mismatch.
5. `kubectl logs -n ingress-nginx <nginx-pod>` → check 502 reasons (upstream connection refused, timeout).
6. `kubectl exec -n <ns> <tester> -- curl -v http://<backend-pod-ip>:<port>` → direct pod reachability. If fail, inspect pod logs & process.
7. If pod responds but service/ingress still 502: ssh into node, check iptables KUBE-SERVICES chains and if NodePort exists. Check `ss -ltnp` on node to ensure kube-proxy bound ports.
8. If iptables look ok, run tcpdump on node while sending request to see where packets drop.
9. Check Azure LB health probe — if probe failing, LB will not forward to node. Fix probe port/path or backend app.
10. After fix, verify via `kubectl get endpoints` and ingress logs. Rollback any changes if needed.

---

## When to escalate to platform/cloud team

* Node-level networking misconfiguration outside Kubernetes (NSG, UDR, Azure Firewall, VNet peering) — involve cloud or infra team.
* Suspected CNI bug across nodes (all pods losing connectivity) — collect node logs, CNI plugin logs, and open ticket with vendor (Calico/Cilium/Azure).
* Hardware/network provider incidents (packet drops at infra level) — engage cloud provider support with packet captures and timestamps.

---

## Good practices to reduce future incidents

* Enable **NetworkPolicy** (start with audit mode), but remember to allow DNS & kube-system.
* Use **EndpointSlices** monitoring and alerts.
* Monitor kube-proxy & CNI metrics (missing endpoints, sync errors).
* Enable **NSG Flow Logs / Network Watcher** to diagnose cloud-level flows.
* Use **NodeLocal DNS Cache** and probe CoreDNS health.
* Test failover with chaos experiments (pod delete, node drain) and monitor network behavior.
* Keep MTU consistent across overlay and non-overlay networks.

---

