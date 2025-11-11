# SQL Cheat Sheet — Quick Reference

## SELECT basics
SELECT col1, col2 FROM table WHERE condition ORDER BY col LIMIT n;

## Joins
- INNER JOIN: returns matching rows
- LEFT JOIN: all left rows + matches
- RIGHT JOIN: all right rows + matches
- FULL JOIN: rows in either side

## Aggregates
COUNT(), SUM(), AVG(), MIN(), MAX()
GROUP BY col HAVING COUNT(*) > 1

## Window functions
ROW_NUMBER() OVER (PARTITION BY col ORDER BY col2)
SUM(x) OVER (ORDER BY ts ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)

## Subqueries
- IN (subquery)
- EXISTS (correlated subquery)

## Common patterns
- Upsert (Postgres): INSERT ... ON CONFLICT (key) DO UPDATE ...
- Pagination (Keyset): WHERE id > :last_id ORDER BY id LIMIT 50

## Useful functions
- COALESCE(a,b): return first non-null
- NULLIF(a,b): return NULL if equal
- CAST(value AS TYPE) for explicit casts

## Performance tips
- Avoid SELECT *; index columns used in WHERE/JOIN/ORDER BY; use EXPLAIN to inspect plans.

## Transaction control
BEGIN/START TRANSACTION; COMMIT; ROLLBACK;

---
Keep this cheat sheet as a quick reference while you work through the modules. If you want a printable PDF version, I can produce one.