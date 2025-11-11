# Module 09 — Advanced SQL Features

## Learning objectives
- Use stored procedures, user-defined functions, triggers, views and materialized views.
- Work with JSON, XML, recursive queries (CTEs), temporal tables, and table partitioning.

## Programmability
- Stored procedures: encapsulate business logic in the DB server.
- Functions: scalar or table-valued; use for reusable logic (note: side-effects restrictions).
- Triggers: fire on DML; use sparingly to avoid hidden side-effects.

## CTEs and recursive queries
- CTE: common table expression for readability and to provide scope for recursive queries (e.g., hierarchical data).

Example recursive CTE (organizational chart):
```sql
WITH RECURSIVE manager_tree AS (
  SELECT employee_id, manager_id, 0 AS depth FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.manager_id, mt.depth + 1
  FROM employees e JOIN manager_tree mt ON e.manager_id = mt.employee_id
)
SELECT * FROM manager_tree;
```

## JSON & semi-structured data
- Many engines support JSON columns and functions to query and index JSON (->> in Postgres, JSON_VALUE in SQL Server).

## Partitioning and materialized views
- Partition large tables by date or hash to improve maintenance and query pruning.
- Materialized views: precomputed results for expensive queries (maintain / refresh strategies).

## Temporal tables
- System-versioned temporal tables store history automatically; useful for auditing and point-in-time queries.

## Lab
- Create a stored procedure for monthly billing and a materialized view for summary stats.
- Use a recursive CTE to flatten a hierarchical category tree.

## Troubleshooting
- Triggers causing performance regressions: profile and consider moving logic to app layer or use asynchronous processing.
- Materialized view stale data: determine refresh policy and consistency requirements.

## Interview questions
- When to use a materialized view vs a normal view?
- Explain a use-case for recursive CTEs.