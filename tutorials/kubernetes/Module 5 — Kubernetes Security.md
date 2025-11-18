# 🔐 **Module 5 — Kubernetes Security**

*Everything from basic Pod restrictions → enterprise-grade cluster hardening → real-world security operations.*

This is one of the most important modules because security mistakes in Kubernetes can lead to **cluster compromise**, **data exfiltration**, and **RCE across nodes**.

---

# 🧭 **Section 1 — Kubernetes Security Philosophy**

Kubernetes security must be handled across **4 layers**:

1. **Cluster Security**
   (Nodes, API Server, PKI, Certificates, IAM)

2. **Workload Security**
   (Pods, containers, permissions, resource boundaries)

3. **Network Security**
   (NetworkPolicies, service exposure, traffic encryption)

4. **Supply Chain Security**
   (Images, scanning, signing, provenance)

Kubernetes itself does **not** secure your workloads — YOU must design the security posture.

---

# 🧩 **Section 2 — Authentication & Authorization (Master API Security)**

## ⭐ WHAT is Authentication in Kubernetes?

Determines **who** you are:

* Certificate-based (kubelets, admins)
* Tokens (service accounts)
* OIDC (Azure AD, AWS IAM, Google IAM, Okta)

## ⭐ WHAT is Authorization?

Determines **what** you are allowed to do.

Kubernetes uses **RBAC** (Role-Based Access Control).

---

## **RBAC Core Objects**

| Object                 | Purpose                           |
| ---------------------- | --------------------------------- |
| **Role**               | Permissions scoped to a namespace |
| **ClusterRole**        | Cluster-wide permissions          |
| **RoleBinding**        | Attach Role to a subject          |
| **ClusterRoleBinding** | Attach ClusterRole to a subject   |

Example RBAC:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: dev
  name: pod-reader
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list"]
```

Binding:

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: read-pods
  namespace: dev
subjects:
  - kind: User
    name: alice
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

---

# 🔐 **Section 3 — Service Accounts & Workload Identity**

Pods use **Service Accounts** to authenticate to the API server.

⚠️ Best Practice:
**Never use the default service account.**

Instead:

* Create a specific SA
* Bind minimal permissions
* Mount only needed secrets

Example:

```yaml
spec:
  serviceAccountName: app-service
```

---

# 🚪 **Section 4 — Pod Security Standards (PSS)**

Successor to PodSecurityPolicy (PSP).

Three profiles:

### **1️⃣ Privileged**

* Full host access
* Used only by system DaemonSets

### **2️⃣ Baseline**

* No privileged containers
* No hostPath
* Minimal permissions

### **3️⃣ Restricted** (best for production)

* No privilege escalation
* Read-only root filesystem
* Mandatory seccomp
* Dropped capabilities

---

# 🧰 **Section 5 — Pod Security Context (Hardening Workloads)**

Control security at Pod/container level.

Key fields:

### 🔒 Drop root:

```yaml
securityContext:
  runAsNonRoot: true
```

### 🔒 Disable privilege escalation:

```yaml
allowPrivilegeEscalation: false
```

### 🔒 Drop Linux capabilities:

```yaml
capabilities:
  drop: ["ALL"]
```

### 🔒 Use read-only filesystem:

```yaml
readOnlyRootFilesystem: true
```

### 🔒 Set UID/GID:

```yaml
runAsUser: 1000
runAsGroup: 3000
```

### 🔒 seccomp:

```yaml
seccompProfile:
  type: RuntimeDefault
```

These dramatically reduce the blast radius of a compromised container.

---

# 🔥 **Section 6 — Image Security (Supply Chain Protection)**

Images are a major attack vector.

### ✔ Vulnerability scanning

Use:

* Trivy
* Aqua
* Twistlock
* Clair

### ✔ Image signing (to prevent tampering)

Use:

* cosign
* Notary
* Sigstore

### ✔ Avoid "latest" tag

Use immutable tags + digests:

```
nginx@sha256:abcd123...
```

### ✔ Base image minimization

Prefer distroless, alpine, scratch.

### ✔ Enforce allowed registries only

Admission controller or OPA Gatekeeper.

---

# 🌐 **Section 7 — Network Security**

### ⭐ NetworkPolicies

Restrict traffic between Pods.

Default behavior:

* EVERYTHING is allowed

Best practice:

* Default deny
* Allow only required ingress/egress

Example: **deny all**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
```

Example: **allow only from app pods**

```yaml
podSelector:
  matchLabels:
    app: backend
ingress:
  - from:
      - podSelector:
          matchLabels:
            app: frontend
```

---

# 🔒 **Section 8 — Secrets Management**

Kubernetes Secrets are **base64 encoded** (NOT encrypted).

### Best Practices:

* Enable **encryption at rest** (etcd)
* Use external secret stores:

  * HashiCorp Vault
  * AWS Secrets Manager
  * Azure Key Vault
  * Google Secret Manager

Example enabling encryption-at-rest:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources: ["secrets"]
    providers:
      - kms:
          name: my-kms
      - identity: {}
```

---

# 🔑 **Section 9 — TLS Everywhere**

Kubernetes requires TLS for:

* API server
* kubelet
* etcd
* Controller-manager
* Scheduler
* Ingress controllers

Service mesh (Istio/Linkerd) provides **automatic mTLS** between Pods.

---

# 🛂 **Section 10 — Admission Controllers (Policy Enforcement)**

Admission controllers validate or mutate API requests.

Key controllers:

* `NamespaceLifecycle`
* `LimitRanger`
* `ResourceQuota`
* `ServiceAccount`
* `NodeRestriction`
* `PodSecurity`

Enterprise-grade:

* **OPA Gatekeeper** (policy-as-code)
* **Kyverno** (declarative policy engine)

Example Kyverno policy:

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-root
spec:
  rules:
    - name: validate-runAsNonRoot
      match:
        resources:
          kinds:
            - Pod
      validate:
        pattern:
          spec:
            containers:
              - securityContext:
                  runAsNonRoot: true
```

---

# 🛡 **Section 11 — Resource Security (Preventing DoS)**

Use **Resource Limits**:

```yaml
resources:
  limits:
    cpu: 1
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi
```

Why:

* Prevent noisy neighbor problems
* Prevent bad code from crashing entire node

---

# 🎣 **Section 12 — Audit Logs & Monitoring**

Enable:

### 🔎 API Server Audit Logs

Tracks:

* who accessed what
* what was changed
* failed authentication

### 🔎 Falco

Runtime security tool to detect:

* exec into container
* privilege escalation
* file changes
* network anomalies

### 🔎 Prometheus + Grafana

Monitor node, cluster, and workload metrics.

---

# 🗄 **Section 13 — Node Security (Hardening Worker Nodes)**

### ✔ Disable SSH access

### ✔ Use OS-level hardening (Seccomp, SELinux, AppArmor)

### ✔ Disable Docker socket exposure

### ✔ Rotate kubelet certificates

### ✔ Patch nodes regularly

### ✔ Use Managed Node Pools (AKS, EKS, GKE)

Node compromise = cluster compromise.

---

# 🧨 **Section 14 — Common Kubernetes Attack Paths**

1. Pod breakout → host
2. Privileged Pod → root access
3. Exposed kubelet API
4. Unrestricted RBAC → cluster-admin
5. Exposed dashboard
6. Public LoadBalancer exposing admin panel
7. exposed Etcd → full cluster takeover

Understanding these vectors helps you secure production.

---

# 🎯 **Outcome After Module 5**

You will understand **everything required to secure Kubernetes clusters**:

### ✔ RBAC mastery

### ✔ Workload identity

### ✔ Pod security standards

### ✔ Seccomp, AppArmor, capabilities

### ✔ NetworkPolicies & zero-trust networking

### ✔ Secret management & encryption

### ✔ Image scanning & signing

### ✔ TLS & certificate rotation

### ✔ Auditing & runtime security

### ✔ Node & API server hardening

### ✔ Real-world threat vectors

You’ll be able to secure clusters like a **DevSecOps Engineer**, **Platform Engineer**, or **Kubernetes Security Specialist**.

---
