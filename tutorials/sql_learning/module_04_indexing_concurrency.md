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


---

# 📚 Indexes in SQL — Types & When to Use Them

Indexes make data retrieval **faster**, just like an index in a book helps you quickly find a topic without scanning every page.

Without indexes → the database performs a **full table scan** (slow).
With indexes → the database performs a **fast lookup** (efficient).

---

# 🔍 Why Indexes Matter

* Speed up `SELECT`, `JOIN`, and `WHERE` queries
* Improve sorting (`ORDER BY`) performance
* Improve grouping (`GROUP BY`) performance

But…
⚠ **Indexes slow down INSERT/UPDATE/DELETE** because they must also be updated.

---

# 🏷 Types of Indexes (Most Common)

---

## 1️⃣ **B-Tree Index** (Default / Most Common)

### ✔ Best For:

* Equality filters (`=`)
* Range queries (`>`, `<`, `BETWEEN`)
* Sorting and grouping

### Example:

```sql
CREATE INDEX idx_employee_lastname
ON employees(last_name);
```

### 📌 Notes:

* Works for most workloads
* Default index type in most databases

---

## 2️⃣ **Unique Index**

Guarantees uniqueness of data.

### Example:

```sql
CREATE UNIQUE INDEX idx_users_email
ON users(email);
```

### ✔ Best For:

* Columns that must not have duplicates
* Enforcing constraints (email, username, mobile)

### 📌 Notes:

* Prevents duplicate values
* Usually automatically created for **PRIMARY KEY** and **UNIQUE** constraints

---

## 3️⃣ **Clustered Index**

Determines the **physical order** of rows in the table.

### ✔ Best For:

* Primary key columns
* Columns frequently used for range queries
* Large tables requiring fast retrieval

### 📌 Notes:

* Only **one** clustered index per table
* Other indexes become **non-clustered**

---

## 4️⃣ **Non-Clustered Index**

Stores the index separately from the table, pointing to the data.

### ✔ Best For:

* Frequently searched columns
* JOIN columns
* Filtering conditions

### Example:

```sql
CREATE INDEX idx_orders_customer
ON orders(customer_id);
```

---

## 5️⃣ **Composite Index** (Multi-column index)

Index on **multiple columns**.

### Example:

```sql
CREATE INDEX idx_orders_customer_date
ON orders(customer_id, order_date);
```

### ✔ Best For:

Queries that use leading columns:

```sql
WHERE customer_id = 10 AND order_date > '2025-01-01'
```

### Important Rule:

👉 **Index works left to right**
If index = (A, B, C),
queries on A or A+B work,
but queries on only B do not.

---

## 6️⃣ **Full-Text Index**

Used for searching **text**, sentences, and documents.

### ✔ Best For:

* Searching words in text columns
* "Google-like" search queries

Example:

```sql
SELECT * FROM articles
WHERE MATCH(content) AGAINST('cloud security');
```

---

## 7️⃣ **Hash Index** (Some DBs: MySQL Memory Engine, Postgres Hash)

Works using a hash table.

### ✔ Best For:

* Equality checks only (`=`)

### ⚠ Not Good For:

* Range queries
* Sorting

---

## 8️⃣ **Bitmap Index** (Used in data warehouses)

Efficient for columns with **low-cardinality** (few unique values).

### ✔ Best For:

* Gender (M/F)
* Status (active/inactive)
* Boolean flags
* Category columns

### ⚠ Not ideal for OLTP databases

Common in: Oracle, Snowflake, Redshift

---

# 🧠 When to Use What (Quick Guide)

| Index Type        | Best For                                     |
| ----------------- | -------------------------------------------- |
| **B-Tree**        | Normal queries (`WHERE`, `JOIN`, sorting)    |
| **Unique**        | Enforcing uniqueness (email, id)             |
| **Clustered**     | Primary key, range queries                   |
| **Non-Clustered** | Filtering / JOIN columns                     |
| **Composite**     | Queries filtering on multiple columns        |
| **Full-Text**     | Searching text or documents                  |
| **Hash**          | Exact match lookups                          |
| **Bitmap**        | Low-cardinality columns in analytics systems |

---

# ⚠ When NOT to Use an Index

* Columns with **very high write activity** (frequent updates)
* **Small tables** (index overhead > performance gains)
* Columns with **very low selectivity** (e.g., Boolean fields) unless using bitmap indexes
* Columns that are updated extremely frequently (indexes slow writes)

---

# 🎯 Summary

Indexes are powerful tools that drastically improve read performance.
Choosing the right index type depends on:

* Query pattern
* Table size
* Cardinality (number of distinct values)
* Read vs write workload

---



---

# 🔐 Concurrency in SQL: Primitives & How Indexes Affect Locking

Modern databases allow **multiple users to read and write data at the same time**. To ensure correctness, they use **concurrency control** mechanisms.

Understanding these helps you write high-performance, low-contention SQL queries.

---

# 🧩 1. Concurrency Primitives (Core Concepts)

These are the building blocks databases use to coordinate concurrent operations.

---

## 1️⃣ **Locks**

Locks prevent conflicting operations from touching the same data at the same time.

### Types of locks:

### 🔸 **Shared Lock (S-lock)**

* Held during a `SELECT` (in certain isolation levels).
* Multiple sessions can read simultaneously.

### 🔸 **Exclusive Lock (X-lock)**

* Held during `INSERT`, `UPDATE`, `DELETE`.
* **Blocks other readers and writers**.

### 🔸 **Intent Locks (IS, IX)**

* Metadata-level locks on tables/pages.
* Used so the DB knows “something is locked inside.”

### 🔸 **Update Lock (U-lock)**

* Used to avoid deadlocks during updates.
* "Maybe going to update" → used before upgrading to X-lock.

---

## 2️⃣ **Latches**

Lightweight in-memory locks for internal operations (buffer changes, page splits).
These do **not** block at the SQL level.

---

## 3️⃣ **Row Versioning**

In modern databases (e.g., SQL Server RCSI, Postgres MVCC):

* Readers don’t block writers
* Writers don’t block readers
* DB stores previous row versions in temp storage

This improves concurrency drastically.

---

## 4️⃣ **Transactions**

A logical unit of work that must follow **ACID**:

* **A**tomicity
* **C**onsistency
* **I**solation
* **D**urability

---

## 5️⃣ **Isolation Levels**

Isolation level controls how much concurrency you get vs consistency:

| Level            | Behavior                                       |
| ---------------- | ---------------------------------------------- |
| Read Uncommitted | No locks → dirty reads allowed                 |
| Read Committed   | Basic consistency → avoids dirty reads         |
| Repeatable Read  | Ensures row stability while reading            |
| Serializable     | Highest isolation → like locking entire ranges |
| Snapshot/MVCC    | Uses versions instead of locks                 |

Higher isolation → more locking → lower concurrency.

---

# ⚙️ 2. How Indexes Affect Locking Behavior

Indexes greatly influence **which rows get locked**, **how many rows**, and even **whether locking happens at the row, page, or table level**.

---

## 🧲 1. Indexes Reduce Lock Footprint

### Without an index (table scan):

```sql
SELECT * FROM orders WHERE customer_id = 100;
```

DB must scan **every row** → often locks **lots of pages or the whole table**.

### With an index:

```sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
```

DB locks only the target **index rows → fewer locks → better concurrency**.

---

## 🎯 2. Indexes Help Avoid Escalation to Table Locks

**Lock Escalation** = DB replaces many small row locks with a big table lock.

Indexes prevent escalation because:

* The scan touches fewer rows/pages
* Lock count stays small

Meaning:
**Better concurrency + fewer blocking issues.**

---

## 🔄 3. Indexes Affect Range Locks for SERIALIZABLE

In SERIALIZABLE isolation:

```sql
SELECT * FROM orders WHERE amount > 500;
```

If there is **no index**, DB cannot identify the range efficiently → locks large portions of the table.

With an index on `amount`, only those index ranges get locked → much less contention.

---

## 🧩 4. Unique Indexes Reduce Deadlocks

Unique indexes help the DB locate rows faster and lock fewer rows.

Example:

Without a unique index on `email`, `INSERT` may:

1️⃣ Scan for existence
2️⃣ Lock multiple rows/pages
3️⃣ Increase chances of deadlock

With a unique index → only one index path is locked.

---

## 🌀 5. Non-Clustered Index + Clustered Key Locking

When updating a row using a non-clustered index, SQL Server may lock:

1. The non-clustered index entry
2. The clustered index entry

This can create unexpected lock chains if not understood.

---

## 🔥 6. Missing Indexes Cause Writer–Reader Blocking

A **write** (UPDATE/DELETE) without an index typically locks more data → blocking all readers behind it.

Proper indexes isolate the lock to a small range or even a single row.

---

# 📌 Practical Examples

### Example 1: Query With Index → Row Lock

```sql
SELECT * FROM employees WHERE emp_id = 1001;
```

Only one index entry is touched → **row lock**.

---

### Example 2: Query Without Index → Table or Page Locks

```sql
SELECT * FROM employees WHERE name = 'John';
```

If there’s no index on `name`, a full scan happens → **locks many pages** → concurrency drops.

---

### Example 3: Writing Without Index → Lock Storm

```sql
DELETE FROM orders WHERE status = 'Cancelled';
```

If `status` is not indexed:

* DB scans entire table
* Locks rows one by one → may escalate
* Blocks many other operations

Add an index → problem disappears.

---

# 🧠 Summary Cheat Sheet

| Concept                                        | Effect                          |
| ---------------------------------------------- | ------------------------------- |
| **Indexes reduce locking**                     | Fewer rows/pages accessed       |
| **Indexes prevent lock escalation**            | Avoid table-level locks         |
| **Indexes enable fast row lookup**             | Less contention                 |
| **Missing indexes cause blocking & deadlocks** | Large scans = many locks        |
| **Isolation levels change locking rules**      | Serializable causes range locks |
| **MVCC reduces locking**                       | Readers don’t block writers     |

---

