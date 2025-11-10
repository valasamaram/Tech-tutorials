# Module 1 — Core Compute, Storage, and Networking (Basics → Advanced)

This module covers compute options (VMs, VM Scale Sets, PaaS), storage choices and performance characteristics, and networking building blocks (vNets, NSGs, routing, peering, hybrid connectivity). The content moves from concepts to deep operational details, performance considerations, and architecture decisions you will need as an engineer or architect.

## Table of contents
- Compute: options, VM details, VMSS, placement and proximity
- Storage: account types, disk types, blob/file/NFS, performance & redundancy
- Networking: vNet fundamentals, NSG/ASG, UDRs, peering, load balancers, Application Gateway, Azure Firewall, hybrid connectivity
- Advanced operational topics: monitoring, backup, encryption, cost trade-offs
- Hands-on labs and validation

---

## Compute

High-level decision guide
- IaaS (VMs): full OS control, legacy app lift-and-shift, stateful workloads where you manage OS and patching.
- PaaS (App Service, Azure SQL, AKS for containers): reduce operational overhead, faster deployment cadence, built-in scaling options.
- Serverless (Functions): event-driven, pay-per-use, best for small units of work.

When to choose what
- If you need OS-level customization, run specialized drivers, or lift-and-shift legacy apps → VM.
- If you can run in containers and want autoscaling and faster CI/CD → AKS.
- If the app is stateless and HTTP-based → App Service or Container Apps.

### VM deep-dive
- VM sizing: choose series based on CPU, memory, IO, GPU needs. Consider burstable (B-series) for dev/test and Standard series for prod workloads.
- OS disk vs data disk: separate OS and data for easier snapshot/restore and different performance profiles.
- Disk caching: ReadOnly, ReadWrite, None — affects performance for OS and data disks.
- Ephemeral OS disks: store OS on local SSD for fast performance but not persistent across deallocations; good for stateless scale-out scenarios.

### Managed disks and types
- Standard HDD/Standard SSD: cost-optimized; Standard SSD better for consistent latency.
- Premium SSD (P10/P20...): higher IOPS and throughput for production workloads.
- Premium SSD v2 / Ultra disks: very high IOPS/throughput for databases and heavy IO workloads. Ultra allows dynamic performance tuning.

### IOPS/throughput sizing
- Each disk SKU has documented IOPS and throughput limits. For high-performance DBs, stripe multiple disks or use Premium/Ultra.
- Monitor using Azure Monitor and OS-level tools (DiskSpd on Windows, fio on Linux). Ensure the VM size supports required throughput (some limits are per VM).

### VM Scale Sets (VMSS)
- Purpose: manage a set of identical VMs for scale-out workloads. Use with autoscale and load balancers.
- Orchestration modes: Uniform (identical VMs) vs Flexible (supports different VM sizes and stateful workloads).
- Upgrade policies:
	- Automatic: platform automatically upgrades instances.
	- Rolling: control batch upgrades (recommended for production).
	- Manual: you control instance updates.
- Health probes and instance protection: configure health probes and use scale-in protection to avoid evicting critical instances.

### Load balancing patterns
- Azure Load Balancer (L4): TCP/UDP, regional, supports high throughput and low latency. Use Standard SKU for production (secure by default, requires backend health probes and NSG configuration).
- Application Gateway (L7): HTTP/HTTPS termination, WAF, path-based routing, session affinity, SSL offload.
- Front Door: global HTTP load balancing, dynamic site acceleration, WAF at edge.

### Placement and proximity
- Placement groups / proximity placement groups: reduce latency between VMs by placing them close in the fabric — useful for low-latency clusters and HPC.
- Availability Sets vs Zones: Availability Set spreads VMs across fault and update domains within a region; Availability Zones spread across datacenters.

### Operational checklist — compute
- Always separate OS and data disks.
- Use managed identities for VMs when accessing Key Vault / Resource Manager.
- Configure diagnostics and boot diagnostics; collect metrics for CPU, memory, disk latency, and network throughput.
- Define backup strategy: Azure Backup for VMs (application consistent snapshots) and VM snapshot policies for frequent state capture.

---

## Storage

### Storage accounts: kinds and use-cases
- StorageV2 (general purpose v2): recommended; supports blobs, files, queues, tables, and tiering.
- Blob Storage (specialized): use for very large-scale object stores and when specific blob-only features are required.

### Blob types and tiers
- Block blobs: most common for files and objects. Support append, snapshots, and lifecycle policies.
- Page blobs: used for Azure managed disks (random read/write), optimized for IOPS.
- Append blobs: for append-only logs.
- Access tiers: Hot (frequent), Cool (infrequent), Archive (rare, long retrieval times). Lifecycle management can move blobs between tiers.

### Redundancy and durability
- LRS (Locally Redundant Storage): copies within single datacenter cluster — lowest cost, single-datacenter failure risk.
- ZRS (Zone-Redundant Storage): copies across availability zones in the region — protects against datacenter failure.
- GRS / RA-GRS (Geo-Redundant / Read-Access Geo-Redundant): replicates to a paired region asynchronously — protects against region outage.

### Managed disks and consistency
- OS and data disks are page blobs under the hood. Use managed disks and select disk type based on IOPS/throughput needs.
- Snapshot vs backup: snapshot is a point-in-time copy of a disk; Azure Backup gives application-consistent backups with retention policies.

### Files & NFS
- Azure Files: SMB and NFS file shares. Use standard or premium file shares depending on throughput/IOPS.
- Azure NetApp Files: high-performance file service for enterprise workloads (requires provisioning and special quotas).

### Performance testing and optimization
- Use fio (Linux) or DiskSpd (Windows) for benchmarking.
- Tune block size, concurrency, and file system mount options.
- For large throughput, consider striping multiple managed disks and using caching appropriately.

### Security & encryption
- Storage encryption at rest is enabled by default (Microsoft-managed keys). For higher control, use customer-managed keys in Key Vault.
- Secure data in transit using HTTPS; for private access use Private Endpoint (Private Link) instead of public endpoints.

### Operational checklist — storage
- Choose redundancy based on RTO/RPO and compliance.
- Implement lifecycle policies for blob tiering to control costs.
- Use soft-delete and versioning for blobs where appropriate.

---

## Networking

### vNet fundamentals
- A vNet is a private network in Azure. Subnets partition the address space; plan IP ranges to avoid overlap across peered VNets and on-prem.
- Network Security Groups (NSGs) filter traffic at the NIC or subnet level. Application Security Groups (ASGs) group VMs logically for policy reuse.

### Routing and UDRs
- By default, Azure routes traffic within a vNet and between peered vNets. Use User-Defined Routes (UDRs) to force traffic to appliances (e.g., Azure Firewall) or on-prem gateways.

### Peering and transit
- vNet peering provides low-latency connectivity between vNets in the same or different regions (Global VNet Peering). Peering is non-transitive.
- Use hub-and-spoke or Virtual WAN architectures for centralized egress and security.

### Private connectivity patterns
- Service Endpoints: extend vNet identity to platform services, still use public endpoints but restrict to vNet.
- Private Endpoint (Private Link): private IP in your vNet maps to platform service, removes public exposure.

### Load balancers and Application Gateway
- Azure Load Balancer: L4, use Standard SKU for prod. Backend pools consist of NICs, VMSS, or IPs. Health probes determine backend health.
- Application Gateway: L7, WAF, cookie-based affinity, URL-based routing. Good for web apps requiring layer-7 functionality.

### Azure Firewall and NVAs
- Azure Firewall: stateful managed firewall with FQDN filtering, threat intelligence, and logging to Log Analytics.
- NVAs: third-party appliances from marketplace (e.g., Palo Alto, Fortinet) — use when vendor-specific features needed.

### Hybrid connectivity
- VPN Gateway (IKEv2 / IPsec): site-to-site VPN for smaller bandwidth / lower cost links.
- ExpressRoute: private circuit, higher bandwidth and lower latency. Understand peering options (private, Microsoft, public) and routing via BGP.

### DNS considerations
- Azure DNS: public DNS hosting. For private name resolution, use Azure Private DNS Zones and link to vNets.
- AD-integrated DNS for hybrid AD scenarios or forwarders to on-prem.

### Operational checklist — networking
- IP addressing: allocate non-overlapping CIDRs; leave room for growth and future peers.
- Secure egress: centralize via hub firewall and log traffic.
- Monitor: enable NSG flow logs, Azure Firewall logs, and Network Watcher packet captures for deep debugging.

---

## Advanced operational topics

### Monitoring & troubleshooting
- Use Azure Monitor metrics and Log Analytics for telemetry. Collect NSG flow logs, Application Gateway access logs, and Load Balancer metrics.
- Use Network Watcher for connection troubleshoot, IP flow verify, and packet capture.

### Backup & recovery
- VM backups: use Recovery Services vault; configure application-consistent snapshots for SQL and other transactional apps.
- Storage: enable soft-delete for blobs and point-in-time restore where supported.

### Encryption & key management
- Use Key Vault for customer-managed keys (CMK) to encrypt storage and disks. Combine with RBAC and firewall rules on Key Vault.

### Cost optimization
- Right-size VMs and use reserved instances or savings plans for long-running workloads.
- Use lifecycle and tiering policies for storage to move cold data to cheaper tiers.

### Security hardening checklist
- restrict management plane access via Just-in-Time (JIT) VM access and PIM.
- apply NSGs + Azure Firewall + Private Endpoints to remove public surface.

---

## Hands-on labs and validation
- Lab 1.1: Deploy a VMSS with custom image, configure a Standard Load Balancer with health probes, create autoscale rules based on CPU and queue length. Validate scale-in protection by marking one instance protected and triggering scale in.
- Lab 1.2: Create two storage accounts: one with ZRS and one with RA-GRS, upload a 10GB dataset and measure throughput and consistency characteristics. Test failover scenarios for RA-GRS.
- Lab 1.3: Build a hub-and-spoke network with Azure Firewall in the hub, configure UDRs in spokes to route outbound to firewall, and validate blocked traffic and DNAT rules.

### Validation commands (examples)
```
# VMSS: show instance view and health
az vmss get-instance-view --name webvmss --resource-group rg-demo

# Autoscale profile list
az monitor autoscale list --resource-group rg-demo --query "[?contains(name,'webvmss')].{name:name,profiles:profiles}"

# Storage account show
az storage account show -n <saName> -g rg-demo --query "{sku:sku.name,kind:kind,primaryEndpoints:primaryEndpoints}"

# Show effective routes
az network nic show-effective-route-table --resource-group rg-demo --nic-name nic1
```

---

## Interview & design tips
- When asked about HA, always mention RTO/RPO and cost trade-offs; suggest AZs + VMSS for stateless front-ends and zone-redundant storage for stateful components.
- For networking questions, draw hub-and-spoke and explain how routing, firewalling, and DNS resolution work end-to-end.

---

## Further reading and references
- VM sizes & series: https://learn.microsoft.com/azure/virtual-machines/sizes
- Storage performance checklist: https://learn.microsoft.com/azure/storage/common/storage-performance-checklist
- Azure networking documentation: https://learn.microsoft.com/azure/networking


