# Module 06 — Transactions, Locking & Concurrency (Advanced)

## Learning objectives
- Understand ACID properties and transaction boundaries.
- Learn isolation levels and concurrency control mechanisms (MVCC vs locking).

## ACID recap
- Atomicity, Consistency, Isolation, Durability.

## Isolation levels
- READ UNCOMMITTED: dirty reads allowed.
- READ COMMITTED: no dirty reads; non-repeatable reads possible.
- REPEATABLE READ: repeatable reads but phantom rows possible in some engines.
- SERIALIZABLE: highest isolation; prevents phantoms.

## MVCC vs pessimistic locking
- MVCC: readers don't block writers; each transaction sees a snapshot. Implemented in Postgres, Oracle, etc.
- Pessimistic locking: writers lock rows preventing concurrent reads/writes depending on isolation and lock mode.

## Deadlocks and prevention
- Deadlocks occur when two transactions wait on each other; DB detects and aborts victim.
- Prevention: consistent order of resource access, shorter transactions, proper indexing to avoid long scans.

## Lab
- Demonstrate transaction behavior at different isolation levels using two concurrent sessions.
- Observe deadlock detection and inspect logs.

## Troubleshooting
- High contention on hot rows: redesign to reduce contention (sharding, queue table patterns, optimistic concurrency).

## Interview questions
- Compare MVCC and locking; when is MVCC preferable?
- How do you design a system to minimize deadlocks?