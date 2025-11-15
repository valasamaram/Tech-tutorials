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




---

# 📊 Reading & Interpreting Execution Plans (EXPLAIN / EXPLAIN ANALYZE)

Execution plans show **how the database engine decides to run your query**.
They help you understand:

* Which indexes are being used
* Which operations are slow
* Where full table scans occur
* How joins, filters, and sorts are executed
* Why your query is slow

Execution plans are essential for performance tuning.

---

# 🛠 1. What Is an Execution Plan?

When you run a SQL query, the query optimizer chooses the most efficient strategy to retrieve the data.

An **execution plan** is the step-by-step breakdown of that strategy.

You view it using:

* `EXPLAIN <query>`
  (Shows the planned steps, *estimates*)

* `EXPLAIN ANALYZE <query>`
  (Runs the query and shows *actual* steps with real timings)

---

# 🔍 2. Why Execution Plans Matter

| Problem                 | Execution Plan Reveals              |
| ----------------------- | ----------------------------------- |
| Slow query              | Which operation is slow             |
| Missing index           | Table scan, hash join, or full sort |
| Inefficient join order  | Wrong table joined first            |
| Too many rows processed | Cardinality estimates off           |
| Wasted sorting/grouping | Heavy sort or hash aggregate        |

It is the fastest way to identify bottlenecks.

---

# 🧩 3. Key Components of an Execution Plan

Execution plans contain **operators**—logical steps executed by the database.

Here are the most common and important ones:

---

## 📦 **Seq Scan / Table Scan**

Reads the entire table.

🔴 **Bad** when filtering on non-indexed columns
🟢 **Fine** for small tables

---

## 🔍 **Index Scan**

Uses B-tree index to find matching rows.

🟢 Efficient
🟡 Might read more rows than needed if low selectivity

---

## ⚡ **Index Seek**

Best case — directly jumps to the matching index entries.

🟢 Very fast
🟢 Ideal for equality and range filters

---

## 🔒 **Bitmap Index Scan**

Used in analytic DBs for low-cardinality indexes.

🟢 Efficient for combining multiple conditions

---

## 🔗 Join Types in Execution Plans

Depending on index availability and table size:

| Join Type            | When Used                        |
| -------------------- | -------------------------------- |
| **Nested Loop Join** | Best for small results + indexes |
| **Hash Join**        | Large joins; no index needed     |
| **Merge Join**       | Both sides sorted on join key    |

---

## 🔄 **Sort**

The database must sort data (ORDER BY, GROUP BY).

🔴 Heavy cost for large datasets
🟢 Index on sort columns reduces cost

---

## 🧮 **Aggregate**

Used for `GROUP BY`, `SUM()`, `AVG()`, etc.

---

## 🧱 **Filter**

Represents the `WHERE` condition being applied.

---

## 📦 **CTE Inline / Materialize**

Shows whether a CTE is optimized or materialized.

---

# 🎯 4. How to Read an Execution Plan (Step-by-Step)

Execution plans read from **bottom to top**
and **right to left** (Postgres style).

### Example:

```
-> Nested Loop
     -> Index Seek on customers (customer_id = 100)
     -> Index Scan on orders (customer_id = 100)
```

Interpretation:

1. Find customer 100 efficiently (index seek).
2. For each result, lookup matching orders (index scan).
3. Join them via nested loop.

---

# 🧪 5. EXPLAIN vs EXPLAIN ANALYZE

| Command             | What it Shows                       |
| ------------------- | ----------------------------------- |
| **EXPLAIN**         | Estimated plan (no execution)       |
| **EXPLAIN ANALYZE** | Actual work executed + real timings |

`EXPLAIN ANALYZE` includes:

✔ Actual vs estimated rows
✔ Time taken per node
✔ Cache hits
✔ Exact cost of each operation

---

# 🧠 6. Red Flags to Look For

🚨 **Sequential Scans on Large Tables**
→ You need an index.

🚨 **Hash Join + Large Hash Table**
→ Missing join index, memory bloat.

🚨 **Sort on millions of rows**
→ Add index on ORDER BY columns.

🚨 **Node where actual rows >> estimated rows**
→ Bad statistics → inaccurate optimizer decisions.

🚨 **Nested loop join on big tables**
→ Can become extremely slow without proper indexes.

---

# 💡 7. Simple Example

```sql
EXPLAIN ANALYZE
SELECT first_name, last_name
FROM employees
WHERE last_name = 'Smith';
```

Typical output:

```
Index Seek on employees_lastname_idx  
  Index Cond: last_name = 'Smith'
```

This means:

✔ Index exists
✔ Query is optimized
✔ Only required rows were touched

---

# 🌐 Another Example: Join Plan

```sql
EXPLAIN
SELECT *
FROM orders o
JOIN customers c ON o.customer_id = c.id;
```

Possible result:

```
Hash Join
  -> Seq Scan on orders
  -> Hash (Seq Scan on customers)
```

Interpretation:

❗ No index on join keys → DB uses hash join
❗ Full table scans on both tables

Solution? Add an index on:

```sql
CREATE INDEX idx_orders_customer ON orders(customer_id);
```

---

# 📘 Summary Table

| Operator    | Meaning                       | Good/Bad                |
| ----------- | ----------------------------- | ----------------------- |
| Seq Scan    | Full table scan               | ⚠️ Bad for large tables |
| Index Scan  | Uses index but scans range    | 🟡 Acceptable           |
| Index Seek  | Direct lookup                 | 🟢 Best                 |
| Sort        | Sorting needed                | ⚠️ Can be expensive     |
| Hash Join   | Heavy but necessary w/o index | 🟡 OK sometimes         |
| Nested Loop | Fast w/ small input + index   | 🟢 Good                 |

---

# 🎉 Final Thought

Learning to read execution plans is **the most valuable skill for SQL performance tuning**.
It tells you exactly what the database is doing—and how to fix it.

---



---

# 🚀 Query Rewrites & Indexing Strategies for Performance Tuning

Database performance tuning is mainly about **reducing the amount of work the database must do**.
You can improve SQL performance dramatically by:

* Rewriting inefficient queries
* Adding or adjusting the right indexes
* Eliminating unnecessary scans, joins, and sorts

Below is a practical guide used by real-world performance engineers.

---

# 🛠 1. Query Rewrite Techniques (Make Queries Cheaper)

---

## 1️⃣ **Avoid SELECT ***

Bad:

```sql
SELECT * FROM employees;
```

Good:

```sql
SELECT id, name, department FROM employees;
```

✔ Reduces I/O
✔ Reduces network data
✔ Allows better index-only scans

---

## 2️⃣ **Filter Early (Push Predicates Down)**

Avoid filtering after joins or aggregates.

Bad:

```sql
SELECT *
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.country = 'India';
```

Better:

```sql
SELECT *
FROM orders o
JOIN customers c ON o.customer_id = c.id AND c.country = 'India';
```

✔ DB processes fewer rows
✔ Helps optimizer pick index seeks instead of scans

---

## 3️⃣ **Rewrite OR with UNION for Better Index Usage**

Bad:

```sql
SELECT * FROM employees
WHERE department = 'IT' OR department = 'HR';
```

Better (allows index seeks):

```sql
SELECT * FROM employees WHERE department = 'IT'
UNION
SELECT * FROM employees WHERE department = 'HR';
```

---

## 4️⃣ **Replace Subqueries With Joins (When Appropriate)**

Bad:

```sql
SELECT *
FROM orders
WHERE customer_id IN (SELECT id FROM customers WHERE vip = true);
```

Better:

```sql
SELECT o.*
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.vip = true;
```

---

## 5️⃣ **Replace DISTINCT with EXISTS / GROUP BY** (more efficient)

Bad:

```sql
SELECT DISTINCT customer_id FROM orders;
```

Better:

```sql
SELECT customer_id FROM orders GROUP BY customer_id;
```

OR to test existence:

```sql
SELECT customer_id
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
```

---

## 6️⃣ **Use LIMIT / TOP When Only a Few Rows Needed**

Bad:

```sql
SELECT * FROM logs ORDER BY created_at DESC;
```

Better:

```sql
SELECT * FROM logs ORDER BY created_at DESC LIMIT 10;
```

---

## 7️⃣ **Avoid Functions on Indexed Columns**

Bad (breaks index):

```sql
WHERE LOWER(email) = 'abc@gmail.com';
```

Better:

```sql
WHERE email = 'abc@gmail.com';
```

---

# 📚 2. Indexing Strategies (Make Reads Faster)

Indexes must match **query patterns**, not table design.

---

## 1️⃣ **Create Indexes on Filtering Columns (WHERE)**

```sql
CREATE INDEX idx_orders_status
ON orders(status);
```

---

## 2️⃣ **Create Indexes on Join Columns**

```sql
CREATE INDEX idx_orders_customer
ON orders(customer_id);
```

✔ Improves join efficiency
✔ Enables nested loop & merge joins

---

## 3️⃣ **Use Composite Indexes for Multi-Column Filters**

Example query:

```sql
WHERE customer_id = 10 AND order_date > '2025-01-01'
```

Index:

```sql
CREATE INDEX idx_orders_customer_date
ON orders(customer_id, order_date);
```

**Rule:** Index works left → right.
Leading column is crucial.

---

## 4️⃣ **Create Covering Indexes (Index-Only Scans)**

Query:

```sql
SELECT name, salary FROM employees WHERE department = 'Finance';
```

Index:

```sql
CREATE INDEX idx_emp_finance_cover
ON employees(department, name, salary);
```

✔ DB doesn't have to read table
✔ All needed columns exist in index → **fastest possible read**

---

## 5️⃣ **Use Partial / Filtered Indexes** (If DB supports them)

Only index rows that matter.

Example (Postgres / SQL Server):

```sql
CREATE INDEX idx_orders_active
ON orders(status)
WHERE status = 'Active';
```

✔ Smaller index
✔ Faster lookups

---

## 6️⃣ **Use Full-Text Indexes for Search Queries**

```sql
WHERE content LIKE '%cloud computing%'
```

is slow.

Better:

```sql
CREATE FULLTEXT INDEX idx_articles_content
ON articles(content);
```

---

## 7️⃣ **Avoid Over-Indexing**

Every index:

* Slows INSERT
* Slows UPDATE
* Slows DELETE
* Consumes disk + memory

Rule:
📌 *Index only where beneficial to query patterns.*

---

# 🧠 3. Combine Query Rewriting + Indexing

### Slow Query:

```sql
SELECT *
FROM orders
WHERE YEAR(order_date) = 2025;
```

Problem:
`YEAR(order_date)` breaks the index.

### Rewrite:

```sql
WHERE order_date >= '2025-01-01'
  AND order_date < '2026-01-01';
```

### Add Index:

```sql
CREATE INDEX idx_orders_orderdate
ON orders(order_date);
```

✔ Index Seek instead of Table Scan
✔ Query becomes 10x–100x faster

---

# 🚀 4. Performance Tuning Workflow (Real-World Process)

1. Capture slow query (from logs / profiler)
2. Run **EXPLAIN ANALYZE**
3. Identify:

   * Full table scans
   * Heavy sorts
   * Hash joins
   * Misused columns
4. Rewrite query
5. Add or adjust indexes
6. Test again
7. Remove unused indexes

This is how professional DBAs work.

---

# 🏁 Summary

| Technique                          | Benefit                            |
| ---------------------------------- | ---------------------------------- |
| Rewrite queries                    | Reduce computation, I/O            |
| Add indexes                        | Speed up filtering, joins, sorting |
| Create composite indexes           | Optimize multi-column filtering    |
| Avoid functions on indexed columns | Preserve index usage               |
| Use covering indexes               | Enable index-only scans            |
| Tune join patterns                 | Reduce row scans                   |

---

