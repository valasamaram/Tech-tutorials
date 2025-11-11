# Module 6 — Observability & Operations (Basics → Advanced)

Scope: Azure Monitor, Log Analytics, Application Insights, Alerts & Action Groups, Network Watcher, Resource Health, runbooks, automation, SRE practices, and incident response.

## Learning objectives

- Instrument infrastructure and applications with logs and metrics.
- Build meaningful dashboards, alerts, and automated remediation runbooks.
- Use distributed tracing to correlate requests across microservices.
- Implement on-call practices and runbook-driven incident response.

---

## Advanced topics (detailed)

### Metrics, logs and traces
- Metrics: numeric time-series data for short-term monitoring and alerting.
- Logs: richer event data stored in Log Analytics (Kusto) for queries and forensic analysis.
- Traces: distributed tracing (Application Insights, OpenTelemetry) for correlating requests across services.

### Alerting & action groups
- Metric alerts vs Log alerts: metric alerts are low-latency; log alerts allow complex KQL conditions.
- Action groups: define notification and automation targets (email, webhook, Logic App, runbook).

### Kusto Query Language (KQL)
- KQL basics and examples for common investigations. Use summarize, join, extend, and time binning for aggregations.

### Automation & runbooks
- Use Azure Automation, Logic Apps, or Functions for remediation. Use managed identities for secure automation credentials.

---

## Hands-on labs (practical)

- Lab 6.1 — Log Analytics and diagnostics:
	1. Create Log Analytics workspace and enable diagnostic settings on Storage, Key Vault and App Service.
	2. Write KQL to find failed deployments and spikes in 5xx errors.

- Lab 6.2 — Application Insights tracing:
	1. Instrument a sample web app with Application Insights SDK.
	2. Capture dependencies and exceptions, and view end-to-end transaction details.

- Lab 6.3 — Automated remediation:
	1. Create an alert that triggers an Automation runbook to restart a VM on sustained high CPU.
	2. Use a Logic App to notify Slack/Teams and create a ticket in ServiceNow.

### Useful Kusto snippets
```kusto
# Find failed VM operations
AzureActivity
| where ResourceProvider == "Microsoft.Compute"
| where ActivityStatusValue == "Failed"
| summarize count() by OperationName, bin(TimeGenerated, 1h)

# Top N slowest dependencies in App Insights
requests
| where timestamp > ago(1h)
| summarize avg(duration) by operation_Name
| top 10 by avg_duration desc
```

---

## Operational checklist & best practices

- Tag resources for cost allocation and filtering in monitoring dashboards.
- Tune retention: keep high-fidelity logs for short windows and aggregated metrics long-term to control costs.
- Configure diagnostic settings for every production service and route to Log Analytics, Event Hub or storage as required.

---

## Troubleshooting playbook

- When an alert fires: run a quick triage — check telemetry, recent deployments, configuration changes and resource health.
- Use Application Insights end-to-end traces to identify slow dependencies and correlate with infrastructure metrics.

---

## Interview & design tips

- When designing observability for microservices, discuss sampling strategies (adaptive vs fixed), trace context propagation, and how to balance fidelity vs cost.

---

## References
- Azure Monitor docs: https://learn.microsoft.com/azure/azure-monitor/

