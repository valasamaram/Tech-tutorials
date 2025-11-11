# Module 05 — Query Optimization & Execution Plans

## Learning objectives
- Read and interpret execution plans (EXPLAIN / EXPLAIN ANALYZE).
- Apply query rewrites and indexing strategies to improve performance.

## Execution plans
- Logical vs physical operators: scans, seeks, nested loops, hash join, merge join.
- Cost estimates vs actuals: mismatches point to stale statistics or parameter sniffing.

## Common performance techniques
- Use covering indexes to eliminate lookups.
- Replace correlated subqueries with joins or apply optimizations.
- Avoid SELECT *; return only required columns.
- Use appropriate pagination (keyset) and avoid OFFSET on large offsets.

## Statistics & maintenance
- Statistics describe data distribution; update regularly (AUTO UPDATE in many engines).
- Rebuild/reorganize indexes as needed to remove fragmentation (engine-specific).

## Temp objects and spills
- Large sorts/hashes may spill to disk if memory insufficient; tune work_mem (Postgres) or memory grants in SQL Server.

## Lab
- Use a sample dataset to run EXPLAIN ANALYZE and identify hot spots.
- Implement index changes and compare execution plans and timing.

## Troubleshooting
- Slow query after schema change: check missing indexes, outdated stats, parameter sniffing.
- High tempdb/temporary space usage: check sorts, aggregations, and concurrent load.

## Interview questions
- Explain nested loops vs hash join and when the optimizer chooses each.
- What is parameter sniffing and how can it hurt performance?