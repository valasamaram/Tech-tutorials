# Module 6 — Observability & Operations (Basics → Advanced)

Scope: Azure Monitor, Log Analytics, Application Insights, Alerts & Action Groups, Network Watcher, Resource Health, runbooks, automation, SRE practices, and incident response.

Learning objectives
- Instrument infrastructure and applications with logs and metrics.
- Build meaningful dashboards, alerts, and automated remediation runbooks.
- Use distributed tracing to correlate requests across microservices.
- Implement on-call practices and runbook-driven incident response.

Advanced topics
- Custom metrics ingestion, retention, and cost optimization strategies (sampling, metric aggregation).
- Advanced alerting patterns: dynamic thresholds, machine-learning based anomaly detection.
- Implementing service-level objectives (SLOs) and error budgets; tying alerts to SLO breaches.
- Automated incident playbooks with Logic Apps or Azure Functions triggered by alerts.

Hands-on labs
- Lab 6.1: Create Log Analytics workspace, configure diagnostic settings for resources, write Kusto queries to find failed deployments and high error rates.
- Lab 6.2: Instrument a sample web app with Application Insights, track dependencies, and visualize traces.
- Lab 6.3: Build an automation runbook that remediates a common issue (e.g., restart a VM on high CPU) and connects to an action group.

Useful Kusto snippets
- Find failed VM operations:
```
AzureActivity
| where ResourceProvider == "Microsoft.Compute"
| where ActivityStatusValue == "Failed"
| summarize count() by OperationName, bin(TimeGenerated, 1h)
```

- Top N slowest dependencies in App Insights:
```
requests
| where timestamp > ago(1h)
| summarize avg(duration) by operation_Name
| top 10 by avg_duration desc
```

Design checklist
- Tag resources for cost allocation and filtering in monitoring dashboards.
- Tune retention: keep high-fidelity logs for short windows and aggregated metrics long-term.
- Protect monitoring endpoint access and use RBAC for workspace access.

Study checkpoint
- Deliverable: alerting plan for a 3-tier app with actionable alerts and runbook attachments.

Further reading
- Azure Monitor docs: https://learn.microsoft.com/azure/azure-monitor/

---
