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



---

# 🔒 ACID Properties & Transaction Boundaries

A **transaction** in SQL is a sequence of operations that must be treated as a **single logical unit of work**. Transactions ensure that the database remains consistent even in cases of errors, failures, or concurrent access.

To guarantee reliability, databases follow the **ACID** properties.

---

## 🧱 1. **Atomicity**

**"All or nothing."**

A transaction must either complete **entirely** or **not run at all**.
If any step fails, the database rolls everything back.

✔ Prevents partial updates
✔ Ensures data correctness

**Example:**

```sql
BEGIN;

UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;

COMMIT;  -- Or ROLLBACK on failure
```

If the second update fails → both operations roll back.

---

## 🔑 2. **Consistency**

**"Data must always be valid according to rules."**

A transaction must take the database from one **valid state** to another.

Consistency ensures:

* Constraints are respected (PK/FK, CHECK constraints, data types)
* Business rules are not violated
* Integrity is preserved

**Example:**
You cannot insert an order that references a non-existent customer.

---

## 🔁 3. **Isolation**

**"Transactions shouldn’t interfere with each other."**

Multiple transactions running at the same time must behave **as if they executed one at a time** (depending on isolation level).

Isolation prevents issues like:

* Dirty reads
* Non-repeatable reads
* Phantom reads

Higher isolation = safer, but more locking.

---

## 🧮 4. **Durability**

**"Once committed, it’s permanent."**

After a transaction is committed:

* The changes survive crashes
* The data is guaranteed to be stored (via log writing, flushing to disk, WAL, etc.)

Even power loss cannot undo a committed transaction.

---

# 🧩 Transaction Boundaries

A transaction starts and ends with specific keywords:

* **BEGIN / START TRANSACTION** → Marks start
* **COMMIT** → Saves all changes permanently
* **ROLLBACK** → Undoes all changes since the start

### Example Transaction

```sql
BEGIN;

UPDATE inventory SET qty = qty - 5 WHERE product_id = 10;
INSERT INTO sales(product_id, qty) VALUES (10, 5);

COMMIT;
```

If anything fails before COMMIT → `ROLLBACK` restores the original state.

---

# 🛑 Autocommit Mode

Most databases are in **autocommit** mode by default:

* Every statement is automatically committed
* You must manually disable autocommit to use explicit transactions

Example:

```sql
SET autocommit = OFF;
```

---

# 🧠 Why ACID Matters

ACID guarantees:

* Reliable financial transactions
* Safe concurrent updates
* Predictable behavior
* Data that can be trusted

Without ACID, databases would lose integrity during crashes or multi-user operations.

---


---

# 🔰 Isolation Levels & Concurrency Control (MVCC vs Locking)

Modern databases run **many transactions at the same time**. Concurrency control ensures that transactions don’t corrupt each other’s data. Two major parts of concurrency are:

1. **Isolation Levels** — how much one transaction is protected from others
2. **Concurrency Control Mechanisms** — *how* the database implements these protections

   * **MVCC** (Multi-Version Concurrency Control)
   * **Locking**

Let’s break these down.

---

# 🧱 1. Isolation Levels

The SQL Standard defines **four isolation levels**.
Each level protects against certain anomalies (read/write problems).

### 🔹 Common Read Anomalies

| Anomaly                 | Meaning                                                    |
| ----------------------- | ---------------------------------------------------------- |
| **Dirty Read**          | Read uncommitted (temporary) data from another transaction |
| **Non-Repeatable Read** | Same query returns different results inside a transaction  |
| **Phantom Read**        | New rows appear when running the same query again          |

---

## 🔒 Isolation Levels Table

| Isolation Level      | Dirty Reads | Non-Repeatable Reads | Phantom Reads      |
| -------------------- | ----------- | -------------------- | ------------------ |
| **Read Uncommitted** | ❌ allowed   | ❌ allowed            | ❌ allowed          |
| **Read Committed**   | ✅ prevented | ❌ allowed            | ❌ allowed          |
| **Repeatable Read**  | ✅ prevented | ✅ prevented          | ❌ allowed (varies) |
| **Serializable**     | ✅ prevented | ✅ prevented          | ✅ prevented        |

---

## 🟡 1. Read Uncommitted

* Lowest isolation
* Can see uncommitted changes from other transactions
* Rarely used in modern systems

Great for: analytics where absolute accuracy is not critical

---

## 🟢 2. Read Committed (Most Common Default)

* Prevents dirty reads
* Each statement sees only committed data
* But subsequent reads may change (non-repeatable)

Used by: **PostgreSQL, Oracle, SQL Server (default)**

---

## 🔵 3. Repeatable Read

* Prevents dirty + non-repeatable reads
* Same row returns identical results throughout the transaction
* Phantom reads still possible (in some DBs)

Used by: MySQL (default)

---

## 🔴 4. Serializable (Strictest)

* Highest isolation → safest
* Acts like transactions run one at a time
* Prevents all anomalies
* But performance may drop (blocking, rollbacks)

Use when correctness is critical (banking, inventory)

---

# 🔧 2. Concurrency Control Mechanisms

Databases use different mechanisms to implement these isolation levels.

---

# 🌀 MVCC (Multi-Version Concurrency Control)

Most modern databases (PostgreSQL, MySQL InnoDB, Oracle) use **MVCC**.

### 🎯 Core Idea

**Readers don’t block writers.**
**Writers don’t block readers.**

The database keeps **multiple versions of a row**:

* A transaction reads a snapshot of the data as it existed when it started
* Updates create a *new version*, not overwriting the old one

### ✔ Benefits

* Very high read performance
* Minimal blocking
* Better for OLTP + analytical workloads
* Supports features like time-travel queries (Postgres)

### ❗ Downsides

* More disk usage (row versions)
* Background cleanup required (VACUUM in Postgres)

---

# 🔒 Lock-Based Concurrency Control (Two-Phase Locking)

Used traditionally by databases like **SQL Server**, MySQL (partially), DB2.

### 🎯 Core Idea

Transactions use **locks** on rows/tables:

* **Shared locks** → reading
* **Exclusive locks** → writing

### ✔ Benefits

* Strong consistency
* Predictable behavior
* Works well for strict isolation (serializable)

### ❗ Downsides

* Readers can block writers
* Writers can block readers
* Can cause:

  * Deadlocks
  * Lock waits
  * Contention under heavy load

---

# 🔍 MVCC vs Locking (Quick Comparison)

| Feature          | MVCC                        | Locking                     |
| ---------------- | --------------------------- | --------------------------- |
| Reading behavior | Snapshot reads              | Shared locks                |
| Blocking         | Readers don’t block writers | Readers may block writers   |
| Versions         | Multiple versions per row   | One row version             |
| Performance      | Great for mixed workloads   | Good for strict consistency |
| Issues           | Bloat, vacuum overhead      | Deadlocks, lock waits       |

---

# 🧠 Choosing the Right Mechanism (Implicit by DB)

* **PostgreSQL → MVCC only**
* **Oracle → MVCC**
* **MySQL InnoDB → MVCC + locking**
* **SQL Server → locking by default, optional MVCC (RCSI)**

---

