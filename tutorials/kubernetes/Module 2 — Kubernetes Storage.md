# 🚀 **Module 2 — Kubernetes Storage (Deep Dive)**  
*From fundamentals → real-world → advanced concepts*

---

# 🧩 **Section 1 — Why Storage is Hard in Kubernetes**

Before learning “how”, understand the “why”.

### ❗ By default, containers:
- Are **ephemeral**  
- Lose all data when the Pod dies  
- Are recreated anywhere in the cluster  
- Can be rescheduled on ANY node  

So Kubernetes needed a mechanism to provide **persistent data** despite this dynamic environment.

**Therefore: Persistent Volumes (PVs) and Persistent Volume Claims (PVCs) were invented.**

Kubernetes storage is designed to:
- Abstract physical disks  
- Support dynamic provisioning  
- Enable portability across clouds/on-prem  
- Allow Pods to move between nodes  
- Support distributed workloads  

---

# 🧩 **Section 2 — Volumes (Basic Building Block)**

---

## ⭐ WHAT is a Kubernetes Volume?

A **Volume** in Kubernetes provides a directory accessible by containers in a Pod.

The simplest form is an **ephemeral volume**.

---

## 🔸 Types of Basic Volumes (Non-Persistent)

### 1️⃣ **emptyDir**
- Lives as long as the Pod lives  
- Data destroyed on pod deletion  
- Useful for caching, temp storage, log buffers

### 2️⃣ **hostPath**
- Mounts a folder *from the node filesystem*  
- Tightly couples Pod to a specific node  
- NOT recommended for production

### 3️⃣ **configMap / secret**
- Configuration data injected as files

### 4️⃣ **downwardAPI**
- Exposes Pod’s metadata into a file  

These are **not persistable** across Pod recreation.

---

# 🧩 **Section 3 — Persistent Volumes (PV)**

---

## ⭐ WHAT is a Persistent Volume?

A **Persistent Volume (PV)** is a **cluster-wide storage resource**.  
Think of it like a *disk that lives independently of pods*.

It is a real piece of storage:
- Azure Disk  
- AWS EBS  
- Google Persistent Disk  
- NFS mount  
- iSCSI  
- Ceph RBD  
- FibreChannel  
- CSI backends  

---

## 🧠 WHY PVs Exist?

PVs ensure that:
- Data survives Pod restarts  
- Storage is reusable  
- Applications can be rescheduled on different nodes  
- You do NOT hardcode storage details in Pod YAML

Kubernetes storage is **decoupled** from workload definitions.

---

## 🧱 HOW Persistent Volumes Work

The admin (or cloud platform) creates a PV.

Example PV:
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: fast
  hostPath:
    path: "/data/pv1/"
```

---

# 🧩 **Section 4 — Persistent Volume Claims (PVC)**

---

## ⭐ WHAT is a PVC?

A **Persistent Volume Claim** is a request for storage by a Pod.

Pods do **not** attach PVs directly.  
Instead, PVCs act as an interface.

PVC example:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  storageClassName: fast
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

Kubernetes automatically:
- Finds a matching PV  
- Binds them  
- Mounts storage into the Pod  

---

## 🧠 WHY PVCs?

PVC allows:
- Developers to request storage without knowing storage backend  
- Cluster admin to control storage types  
- Applications to be portable  

---

# 🧩 **Section 5 — Storage Classes (Dynamic Provisioning)**

---

## ⭐ WHAT is a StorageClass?

A **StorageClass** defines the *type* of storage.  
It also supports **Dynamic Volume Provisioning** → automatically creates PVs.

Example for Azure Disk StorageClass:
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: managed-premium
provisioner: kubernetes.io/azure-disk
parameters:
  storageaccounttype: Premium_LRS
  kind: Managed
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
```

---

## 🧠 WHY StorageClasses?

Without a StorageClass:
- PVs must be manually created  
- You cannot autoscale stateful workloads  
- Dev teams need admin involvement  

**Dynamic provisioning is crucial for production usage.**

---

## ⚙️ HOW StorageClasses Work

Flow:
1. PVC references a StorageClass  
2. StorageClass provisions a PV dynamically  
3. PVC binds to the PV  
4. Pod mounts PVC  

---

# 🧩 **Section 6 — Access Modes (Very Important)**

Defines how Pods can access a volume.

### **📌 ReadWriteOnce (RWO)**
- Only one node can mount  
- Most common (Azure Disk, AWS EBS)

### **📌 ReadWriteMany (RWX)**
- Multiple nodes can read & write  
- Needed for multi-replica apps  
- Provided by NFS, Azure Files, EFS, CephFS  

### **📌 ReadOnlyMany (ROX)**
- Multiple nodes, read-only  

---

# 🧩 **Section 7 — Volume Binding Modes**

### 1️⃣ **Immediate**
PV provisioned immediately when PVC is created  
(Default for many storage backends)

### 2️⃣ **WaitForFirstConsumer**
PV created **only** when Pod is scheduled  
Better for:
- Zonal-aware storage  
- Optimized performance  
- Preventing cross-zone mounts  

---

# 🧩 **Section 8 — StatefulSets (Built for Stateful Apps)**

---

## ⭐ WHAT is a StatefulSet?

A Kubernetes controller designed for **stateful applications**.

Provides:
- Stable network identity  
- Stable storage  
- Ordered deployment  
- Ordered termination  
- Automated per-pod PVC creation  

---

## 🧠 WHY StatefulSet?

Some apps require:
- Stable names  
- Individual storage for each replica  
- Sequential initialization  

Examples:
- Databases: MySQL, PostgreSQL  
- Distributed systems: Kafka, Cassandra, Elasticsearch  

---

## 🧱 HOW StatefulSets Handle Storage

Creates one PVC per Pod:
- pod-0  
- pod-1  
- pod-2  

If a Pod is rescheduled:
- PVC attaches to the new node  
- Data stays consistent  

Example:
```yaml
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

# 🧩 **Section 9 — CSI (Container Storage Interface)**

This is the **modern storage architecture** in Kubernetes.

---

## ⭐ WHAT is CSI?

A pluggable API that allows external storage vendors to integrate with Kubernetes.

Examples of CSI drivers:
- Azure Disk CSI Driver  
- Azure File CSI Driver  
- AWS EBS CSI Driver  
- Ceph CSI  
- NetApp Trident  
- Pure Storage Portworx  

---

## 🧠 WHY CSI?

Before CSI:
- Every cloud provider had built-in code inside Kubernetes  
- Upgrades were painful  
- Storage support was inconsistent  

CSI standardized:
- Volume provisioning  
- Attaching/detaching  
- Snapshotting  
- Cloning  
- Resizing  

---

# 🧩 **Section 10 — Snapshots & Volume Cloning**

---

## ⭐ WHAT is a VolumeSnapshot?

A point-in-time copy of a volume.

Useful for:
- Backups  
- Restores  
- Pre-deployment safety points  
- Cloning test environments  

---

## ⭐ WHAT is a VolumeClone?

A duplicate of an existing PVC.

Useful for:
- Dev/test  
- Data science experiments  

---

# 🧩 **Section 11 — Expanding PVCs (Volume Resize)**

PVCs support increasing size (not decreasing):

Just edit:
```bash
kubectl edit pvc myclaim
```

Change:
```yaml
resources:
  requests:
    storage: 20Gi
```

StorageClass must allow expansion (`allowVolumeExpansion: true`).

---

# 🧩 **Section 12 — Real-World Storage Architectures**

---

## 🔹 For Databases  
Use:
- StatefulSets  
- RWO volumes  
- Zonal storage  
- Crash-consistent snapshots  

Avoid:
- RWX shared volumes  

---

## 🔹 For Web Apps  
Use:
- RWX volumes (Azure Files, NFS)  
- Stateless containers where possible  

---

## 🔹 For High-Performance Apps  
Use:
- NVMe-backed CSI volumes  
- Low-latency zones  
- Proper node affinity  

---

# 🧩 **Section 13 — Troubleshooting Storage**

### Common issues:
- PVC stuck in “Pending”  
- PV available but not bound  
- Permission denied inside Pod  
- Pod stuck in “ContainerCreating”  
- Wrong access mode  
- Mismatch StorageClass  

Debug commands:
```bash
kubectl get pvc
kubectl describe pvc <name>
kubectl get pv
kubectl describe pv <name>
kubectl logs <pod>
```

---
