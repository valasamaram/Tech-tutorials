# Module 04 — Indexing & Concurrency Basics

## Learning objectives
- Understand index types and when to use them.
- Learn concurrency primitives and how indexes affect locking behavior.

## Index types
- B-Tree (clustered/non-clustered): general-purpose index for range and equality queries.
- Hash indexes: optimized for equality lookups (supported in some engines).
- Bitmap indexes: good for low-cardinality columns (not typical in OLTP).
- Covering indexes: include columns used by a query to avoid lookups.

## Index design best practices
- Index selective columns (high cardinality) used in WHERE, JOIN, ORDER BY.
- Avoid too many indexes: write penalty on INSERT/UPDATE/DELETE.
- Use composite indexes for multi-column filters; order matters.

## Concurrency & isolation
- ACID principles (see Module 06 for deep dive). Isolation levels: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.
- Locks: shared vs exclusive; lock escalation and deadlocks.
- MVCC (Multi-Version Concurrency Control) used by Postgres and others to reduce read locks.

## How indexes affect concurrency
- Proper indexes reduce table scans and lock contention.
- Missing indexes can cause long-running scans holding locks and blocking others.

## Lab
- Create single-column and composite indexes; measure query performance with and without indexes using `EXPLAIN`.
- Simulate two transactions that cause a deadlock and resolve by changing index or access order.

## Troubleshooting
- High write latency after adding many indexes — consider consolidating or removing rarely used indexes.
- Deadlocks: examine engine-specific deadlock graphs/logs and redesign transactions to access resources in consistent order.

## Interview questions
- When would you create a covering index? Give an example.
- Explain how MVCC works at a high level.