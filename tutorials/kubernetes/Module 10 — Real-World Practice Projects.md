Below is a **complete end-to-end list of AKS + Kubernetes commands**, organized in a clean, easy-to-use reference format.
This is **not just a cheat sheet** — it’s a **full operational command guide** covering:
✔ AKS provisioning
✔ Cluster operations
✔ Workloads
✔ Networking
✔ Storage
✔ Autoscaling
✔ Security
✔ Monitoring
✔ Upgrades & troubleshooting

---

# 🚀 **AKS + Kubernetes End-to-End Command Guide (Full Reference)**

All commands are categorized & include context for **what/why/how**.

---

# 🧱 **1. Azure AKS Provisioning & Management**

---

## 🔐 **1.1 Login & Set Context**

```bash
az login
az account show
az account list
az account set --subscription "<SUB-ID>"
```

---

## 🏗️ **1.2 Create Resource Group**

```bash
az group create -n aks-rg -l eastus
```

---

## 🚀 **1.3 Create AKS Cluster**

### Basic AKS

```bash
az aks create \
  --resource-group aks-rg \
  --name aks-demo \
  --node-count 3 \
  --generate-ssh-keys
```

### AKS with System + User Node Pools

```bash
az aks create \
  --resource-group aks-rg \
  --name aks-prod \
  --node-count 1 \
  --nodepool-name system \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 5
```

### Add User Node Pool

```bash
az aks nodepool add \
  --resource-group aks-rg \
  --cluster-name aks-prod \
  --name userpool \
  --node-count 3 \
  --node-vm-size Standard_D4s_v3
```

---

## 🎯 **1.4 Get AKS Credentials**

```bash
az aks get-credentials \
  --resource-group aks-rg \
  --name aks-demo
```

Merge or overwrite:

```bash
az aks get-credentials -g aks-rg -n aks-demo --overwrite-existing
```

---

## 🔄 **1.5 Upgrade AKS Cluster**

List versions:

```bash
az aks get-upgrades -g aks-rg -n aks-demo
```

Upgrade:

```bash
az aks upgrade \
  -g aks-rg \
  -n aks-demo \
  --kubernetes-version 1.29.1 \
  --control-plane-only
```

Upgrade Agent Pool:

```bash
az aks nodepool upgrade \
  -g aks-rg \
  --cluster-name aks-demo \
  --name nodepool1 \
  --kubernetes-version 1.29.1
```

---

## 🧹 **1.6 Delete Cluster**

```bash
az aks delete -g aks-rg -n aks-demo --yes
```

---

# 🎮 **2. Kubernetes Cluster Management Commands**

---

## 🧪 **2.1 Cluster Status**

```bash
kubectl cluster-info
kubectl version
kubectl get componentstatuses
```

---

## 👇 **2.2 Nodes**

```bash
kubectl get nodes
kubectl describe node <node-name>
kubectl cordon <node>
kubectl drain <node> --ignore-daemonsets --force
kubectl uncordon <node>
```

---

## 📦 **2.3 Namespaces**

```bash
kubectl get ns
kubectl create ns dev
kubectl delete ns dev
```

---

# 📦 **3. Kubernetes Workloads (Pods, Deployments, ReplicaSets, DaemonSets)**

---

## 🎯 **3.1 Pods**

```bash
kubectl get pods
kubectl get pods -o wide
kubectl describe pod <pod>
kubectl logs <pod>
kubectl logs <pod> -f     # stream logs
kubectl exec -it <pod> -- bash
```

---

## 🚀 **3.2 Deployment**

Create:

```bash
kubectl create deployment nginx --image=nginx
```

Scale:

```bash
kubectl scale deployment nginx --replicas=5
```

Update image:

```bash
kubectl set image deployment/nginx nginx=nginx:1.25
```

Rollback:

```bash
kubectl rollout undo deployment/nginx
kubectl rollout status deployment/nginx
```

---

## 🌀 **3.3 ReplicaSets**

```bash
kubectl get rs
```

---

## 🛠️ **3.4 DaemonSets**

```bash
kubectl get ds -A
kubectl describe ds <ds-name>
```

---

# 🔗 **4. Networking (Services, Ingress, DNS)**

---

## 🌐 **4.1 Services**

List:

```bash
kubectl get svc
```

ClusterIP:

```bash
kubectl expose deployment nginx --port=80 --type=ClusterIP
```

LoadBalancer:

```bash
kubectl expose deployment nginx --port=80 --type=LoadBalancer
```

---

## 🌍 **4.2 Ingress (Nginx Ingress Controller)**

View ingress:

```bash
kubectl get ingress
kubectl describe ingress <ingress-name>
```

---

## 📡 **4.3 DNS**

```bash
kubectl exec -it <pod> -- nslookup kubernetes.default
```

---

# 🗄️ **5. Kubernetes Storage Commands**

---

## 📁 **5.1 Persistent Volumes (PV)**

```bash
kubectl get pv
kubectl describe pv <pv>
```

---

## 📦 **5.2 Persistent Volume Claims (PVC)**

```bash
kubectl get pvc
kubectl describe pvc <pvc>
```

---

## 🔧 **5.3 StorageClasses**

```bash
kubectl get sc
kubectl describe sc <sc>
```

---

# 🔒 **6. Security: RBAC, Secrets, Network Policies**

---

## 🔑 **6.1 Secrets**

Create:

```bash
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=Passw0rd!
```

View:

```bash
kubectl get secrets
kubectl describe secret db-secret
```

---

## 🧑‍🤝‍🧑 **6.2 RBAC**

```bash
kubectl create role dev-reader --verb=get --verb=list --resource=pods
kubectl create rolebinding dev-read \
  --role=dev-reader \
  --user=bob
```

---

## 🚫 **6.3 Network Policies**

```bash
kubectl get networkpolicy
kubectl describe networkpolicy <name>
```

---

# 📈 **7. Autoscaling (HPA, VPA, Cluster Autoscaler)**

---

## 📉 **7.1 Horizontal Pod Autoscaler**

```bash
kubectl autoscale deployment nginx --min=2 --max=10 --cpu-percent=70
kubectl get hpa
```

---

## 📏 **7.2 Vertical Pod Autoscaler (VPA)**

```bash
kubectl get vpa
```

---

## 🏗️ **7.3 Cluster Autoscaler (AKS)**

```bash
az aks show -g aks-rg -n aks-demo --query "agentPoolProfiles"
```

---

# 🔍 **8. Observability (Logs, Metrics, Debugging)**

---

## 📜 **8.1 Logs**

```bash
kubectl logs <pod>
kubectl logs <pod> -c <container> -f
```

---

## 🧪 **8.2 Debugging**

```bash
kubectl describe pod <pod>
kubectl exec -it <pod> -- sh
kubectl get events --sort-by=.metadata.creationTimestamp
```

Run ephemeral debug container:

```bash
kubectl debug <pod> -it --image=busybox
```

---

## 📈 **8.3 Metrics (kubectl top)**

```bash
kubectl top nodes
kubectl top pods
```

---

# 🔄 **9. Upgrades & Maintenance**

---

## 🧹 **9.1 Restart Deployment**

```bash
kubectl rollout restart deployment <name>
```

---

## 🔄 **9.2 Drain Node for Maintenance**

```bash
kubectl cordon <node>
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data
```

---

## 🏁 **9.3 Replace Node**

```bash
az aks nodepool delete -g aks-rg --cluster-name aks-demo --name oldpool
```

---

# 💀 **10. Troubleshooting (Most Important Commands)**

---

## 🚨 Pod issues:

```bash
kubectl describe pod <pod>
kubectl logs <pod> --previous
kubectl get events --sort-by=.metadata.creationTimestamp
```

---

## ❗ Service not reachable

```bash
kubectl get endpoints
kubectl describe svc <service>
```

---

## 🧭 Network issues (DNS)

```bash
kubectl exec -it <pod> -- nslookup google.com
```

---

## 🏥 Node pressure

```bash
kubectl describe node <node>
```

---

## ⚠️ CrashLoopBackOff

```bash
kubectl logs <pod>
kubectl logs <pod> -c <container>
kubectl describe pod <pod>
```

---

# 🎁 **Bonus — YAML Apply Workflow**

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
kubectl delete -f deployment.yaml
```

---
You’re right — let me give you a concise, complete, copy-paste ready section that you can drop into your AKS/Kubernetes command guide. It includes **taints**, **tolerations**, **cordon/drain/uncordon**, **evict**, listing, examples, and best practices.

---

# ✅ Node Scheduling & Maintenance — Taints / Tolerations / Cordon / Drain / Uncordon (All commands + examples)

---

## 1) Taints (node) — repel pods unless tolerated

**Add a taint**

```bash
# format: kubectl taint nodes <node> <key>=<value>:<effect>
kubectl taint nodes aks-nodepool1-123456 gpu=true:NoSchedule
kubectl taint nodes aks-nodepool1-123456 reserved:NoSchedule    # no value example
```

**Remove a taint**

```bash
# include trailing '-' to remove the taint
kubectl taint nodes aks-nodepool1-123456 gpu=true:NoSchedule-
kubectl taint nodes aks-nodepool1-123456 reserved:NoSchedule-
```

**List taints on a node**

```bash
kubectl describe node <node-name> | sed -n '/Taints:/, /Conditions:/p'
# or
kubectl get node <node-name> -o jsonpath='{.spec.taints}'
```

---

## 2) Tolerations (pod) — allow pods to be scheduled on tainted nodes

**Pod YAML toleration example (matches `gpu=true:NoSchedule`)**

```yaml
spec:
  tolerations:
    - key: "gpu"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
```

**Generic toleration (tolerate any NoSchedule taint)**

```yaml
spec:
  tolerations:
    - operator: "Exists"
      effect: "NoSchedule"
```

**Toleration with eviction window (NoExecute)**

```yaml
spec:
  tolerations:
    - key: "maintenance"
      operator: "Equal"
      value: "true"
      effect: "NoExecute"
      tolerationSeconds: 3600   # pod tolerated for 1 hour then evicted
```

---

## 3) Cordon / Uncordon — mark node unschedulable / schedulable

**Cordon (prevent new pods being scheduled)**

```bash
kubectl cordon <node-name>
# Example:
kubectl cordon aks-nodepool1-123456
```

**Uncordon (allow scheduling again)**

```bash
kubectl uncordon <node-name>
# Example:
kubectl uncordon aks-nodepool1-123456
```

**Check node schedulability**

```bash
kubectl get nodes
# Look for "SchedulingDisabled" in STATUS
kubectl get nodes -o wide
```

---

## 4) Drain — safely evict pods (prepare node for maintenance)

**Basic safe drain**

```bash
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data
```

**Common useful options**

* `--ignore-daemonsets` — don't try to evict daemonset pods (they are expected on nodes)
* `--delete-emptydir-data` — allow deleting pods that use EmptyDir (data loss risk)
* `--force` — force deletion (dangerous)
* `--grace-period=<seconds>` — termination grace override
* `--timeout=<duration>` — overall time to wait for drain

**Example full flow**

```bash
kubectl cordon worker-02
kubectl drain worker-02 --ignore-daemonsets --delete-emptydir-data --timeout=10m
# perform maintenance...
kubectl uncordon worker-02
```

**If drain blocks due to PodDisruptionBudget (PDB):**

* Either scale the workload up temporarily, or coordinate with owners, or adjust PDB, rather than forcing.

---

## 5) Evict — evict a specific pod (respects PDB)

**Evict a single pod (preferred vs direct delete)**

```bash
kubectl evict pod/<pod-name> -n <namespace>
# Example
kubectl evict pod/my-app-5f8b9c7d-abcde -n prod
```

**If `kubectl evict` not available (older clusters)**

```bash
kubectl delete pod <pod-name> -n <namespace>
```

Note: `delete` does not respect eviction API semantics the same way; prefer `evict` when possible.

---

## 6) Useful queries — pods on a node, static & daemonset detection

**List pods on a node**

```bash
kubectl get pods --all-namespaces --field-selector spec.nodeName=<node-name> -o wide
# or
kubectl get pods -A -o wide | grep <node-name>
```

**Show daemonsets (kubectl drain ignores these)**

```bash
kubectl get daemonset -A
```

**Find pods that would block eviction because of PDB**

```bash
kubectl get pdb -A
# Inspect PDBs and their current disruptions:
kubectl describe pdb <pdb-name> -n <namespace>
```

---

## 7) Examples: reserve nodes for special workloads (GPU, critical)

**Taint GPU node and create pod toleration**

Taint the node:

```bash
kubectl taint nodes gpu-node-01 gpu=true:NoSchedule
```

Pod spec:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-job
spec:
  tolerations:
    - key: "gpu"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
  containers:
    - name: worker
      image: my-gpu-image:latest
      resources:
        limits:
          nvidia.com/gpu: 1
```

---

## 8) Best Practices & Safety Notes

* Use **cordon → drain → maintenance → uncordon** for safe node work.
* Avoid `--force` and `--delete-emptydir-data` unless you fully accept consequences.
* Use **PodDisruptionBudgets (PDBs)** to guarantee availability; but coordinate when draining nodes.
* Taint nodes for reserved hardware (GPU, high-memory, noisy) and assign **tolerations only to intended pods**.
* For scheduled maintenance, prefer draining nodes during low-traffic windows and/or temporarily scale out replicas.
* Use labels + taints for neat separation: `kubectl label node <node> role=gpu` and taint by key `role=gpu`.
* Monitor `kubectl get nodes`, `kubectl get pods -A`, and events during maintenance:

  ```bash
  kubectl get events --sort-by='.metadata.creationTimestamp' -A
  ```

---

## 9) Quick Reference — common commands

```bash
# taint / remove taint
kubectl taint nodes <node> key=value:NoSchedule
kubectl taint nodes <node> key=value:NoSchedule-

# show taints
kubectl describe node <node> | sed -n '/Taints:/, /Conditions:/p'
kubectl get node <node> -o jsonpath='{.spec.taints}'

# cordon / drain / uncordon
kubectl cordon <node>
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data
kubectl uncordon <node>

# list pods on node
kubectl get pods -A --field-selector spec.nodeName=<node> -o wide

# evict a pod (respects PDBs)
kubectl evict pod/<pod-name> -n <namespace>

# emergency force drain (use with care)
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data --force
```

---
