# Module 10 — Capstone Projects & Assessment

## Capstone overview
- Build a complete data-backed application with design, implementation, testing, monitoring and runbooks. Deliverables include schema, sample data scripts, queries, indexing strategy, backup plan, and a short architecture document.

## Example capstone projects
1. E-commerce analytics pipeline
  - Schema design for orders, products, customers.
  - OLAP summary tables or materialized views for daily sales.
  - Stored procedures for nightly ETL and a set of analytics queries.

2. Multi-tenant SaaS baseline
  - Multi-tenant model (shared schema with tenant_id) with row-level security and tenant-aware indexing.
  - Automated provisioning script for new tenants.

3. Real-time order processing with auditing and DR
  - Implement transactional processing, audit logs, backup/restore tests and ASR-style DR runbook (simulate failover).

## Grading rubric
- Schema & normalization (20%)
- Query correctness & performance (30%)
- Security & data protection (15%)
- Backup/DR & operations (15%)
- Documentation & automation (20%)

## Submission checklist
- SQL scripts to create schema and sample data.
- README with architecture diagram and justification for design choices.
- Example queries and performance notes (EXPLAIN plans before/after tuning).
- Cleanup script.

## Next steps
- I can generate starter SQL scripts and a small dataset for any chosen engine (PostgreSQL, MySQL, SQL Server). Tell me which engine you want and I will scaffold the project.