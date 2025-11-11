# Module 5 — Networking Deep-Dive (Intermediate → Advanced)

Scope: Advanced vNet design, ExpressRoute, VPN Gateway, Azure Firewall, Application Gateway/WAF, Front Door, Traffic Manager, DNS, and hybrid connectivity patterns.

## Learning objectives

- Design hub-and-spoke topologies with effective routing and security.
- Configure ExpressRoute with private peering and Microsoft peering; understand SLA and circuit resiliency.
- Implement Application Gateway with WAF for web apps and Front Door for global HTTP load balancing and CDN.
- Troubleshoot network issues using Network Watcher, IP flow verify, connection troubleshoot, and packet capture.

---

## Advanced topics (detailed)

### BGP, route propagation and ExpressRoute
- ExpressRoute uses BGP for route exchange; plan ASN, route filters and communities for traffic engineering.
- Understand route priority in Azure: system routes < user-defined routes < BGP learned routes (varies by scenario). Test with `az network watcher show-next-hop`.

### Forced tunneling & UDR
- Forced tunneling sends internet-bound traffic to on-prem or NVA in the hub; implement UDRs and disable default internet access at subnet level.

### Network performance & MTU
- Consider MTU and packet fragmentation across VPN/ExpressRoute; tune MTU and TCP window for high-throughput workloads.

### Private Link vs Service Endpoints
- Service Endpoints: still use public endpoint but subnet-restricted.
- Private Link (Private Endpoint): presents private IP in vNet for PaaS -> recommended for least public exposure and granular access.

---

## Hands-on labs (practical)

- Lab 5.1 — Hub-and-spoke with Firewall:
	1. Deploy hub VNet with Azure Firewall and two spoke VNets.
	2. Configure peering and UDRs in spokes to route outbound traffic to firewall.
	3. Validate DNAT and SNAT behavior and verify logs in Log Analytics.

- Lab 5.2 — Application Gateway & WAF:
	1. Deploy Application Gateway with WAF v2 SKU.
	2. Configure listener, backend pool, health probe, and rewrite rules for header-based routing.
	3. Test OWASP rule set and tune false positives.

- Lab 5.3 — VPN/BGP failover simulation:
	1. Create VPN Gateway and configure a site-to-site connection to a simulated on-prem router.
	2. Enable BGP, advertise prefixes and test failover by disabling the primary link.

### Useful commands & snippets
```powershell
# Show effective routes on NIC
az network nic show-effective-route-table --name nic1 --resource-group rg-demo

# Start packet capture (Network Watcher)
az network watcher packet-capture create -g rg-demo -n cap1 --vm demoVM --time-limit 30

# Check next hop for a VM
az network watcher show-next-hop --resource-group rg-demo --vm demoVM --source-ip 10.0.0.4 --dest-ip 8.8.8.8
```

---

## Troubleshooting playbook

- Use `connection-monitor` and `IP flow verify` to isolate where traffic is blocked.
- For BGP issues: collect `bgpPeerStatus` from the gateway and inspect advertised routes on both sides.
- For performance issues: collect metrics (bytes/sec, RTT), and run packet captures for correlation.

---

## Design & interview tips

- When designing for regulated workloads, prefer Private Link, ExpressRoute private peering, and centralized egress via hub firewall.
- Be ready to sketch the hub-and-spoke and explain how DNS, routing, and peering flow across subscriptions.

---

## References
- Azure networking documentation: https://learn.microsoft.com/azure/networking/

