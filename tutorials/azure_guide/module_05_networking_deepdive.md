# Module 5 — Networking Deep-Dive (Intermediate → Advanced)

Scope: Advanced vNet design, ExpressRoute, VPN Gateway, Azure Firewall, Application Gateway/WAF, Front Door, Traffic Manager, DNS, and hybrid connectivity patterns.

Learning objectives
- Design hub-and-spoke topologies with effective routing and security.
- Configure ExpressRoute with private peering and Microsoft peering; understand SLA and circuit resiliency.
- Implement Application Gateway with WAF for web apps and Front Door for global HTTP load balancing and CDN.
- Troubleshoot network issues using Network Watcher, IP flow verify, connection troubleshoot, and packet capture.

Advanced topics
- BGP route propagation, community tags, and learning for ExpressRoute and Virtual WAN.
- Forced tunneling and user-defined routes for secure internet egress via hub.
- Network performance tuning: TCP window scaling, MTU considerations across VPN/ExpressRoute.
- Service endpoints vs Private Link / Private Endpoint: trade-offs and security patterns.

Hands-on labs
- Lab 5.1: Implement hub-and-spoke with Azure Firewall and route tables; validate SNAT/DNAT rules.
- Lab 5.2: Deploy Application Gateway with WAF and configure listener, backend pool, probe, and rewrite rule.
- Lab 5.3: Simulate a site-to-site VPN and verify BGP routes and failover.

Commands & snippets
- Show effective routes on VM NIC:
```
az network nic show-effective-route-table --name nic1 --resource-group rg-demo
```

- Start packet capture (Network Watcher):
```
az network watcher packet-capture create -g rg-demo -n cap1 --vm demoVM --time-limit 30
```

Design checklist
- Ensure IP addressing plan across subscriptions and regions avoids overlap for peering and on-prem connectivity.
- Decide between Private Link (recommended) or service endpoints depending on your security and connectivity needs.
- Use Azure Firewall for centralized outbound control and DDoS protection for public apps.

Study checkpoint
- Deliverable: network architecture for a regulated customer requiring private connectivity, WAF and centralized logging to Log Analytics.

Further reading
- Azure networking documentation: https://learn.microsoft.com/azure/networking/

---
