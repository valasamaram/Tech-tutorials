# Module 02 — Joins & Subqueries

## Learning objectives
- Understand the different join types and their use-cases.
- Use subqueries and correlated subqueries appropriately.

## Join types
- INNER JOIN: rows with matching keys in both tables.
- LEFT (LEFT OUTER) JOIN: all rows from left table; matching rows from right or NULLs.
- RIGHT (RIGHT OUTER) JOIN: symmetric to LEFT.
- FULL OUTER JOIN: rows present in either side.
- CROSS JOIN: Cartesian product.
- SELF JOIN: join table to itself (useful for hierarchical queries).



---

# 🔗 Understanding SQL JOIN Types & When to Use Them

In relational databases, data is stored across multiple tables.
**JOINs** allow you to combine related data based on a common key.

Example relationship:

* `customers.customer_id` ↔ `orders.customer_id`

---

# ⭐ The 6 Main SQL Join Types

## 1️⃣ **INNER JOIN**

Returns **only the matching rows** from both tables.

### 📌 Use Case

* Get only customers **who have placed orders**
* Most common join in real-world reporting

### Example:

```sql
SELECT c.customer_name, o.order_id
FROM customers c
INNER JOIN orders o
ON c.customer_id = o.customer_id;
```

✔ Includes customers WITH orders
❌ Excludes customers with NO orders

---

## 2️⃣ **LEFT JOIN (Left Outer Join)**

Returns **all rows from the left table**, and matching rows from the right table.
Rows with no match will show `NULL` values.

### 📌 Use Case

* Find customers **even if they have no orders**
* Generate summary reports with missing data

### Example:

```sql
SELECT c.customer_name, o.order_id
FROM customers c
LEFT JOIN orders o
ON c.customer_id = o.customer_id;
```

✔ All customers
✔ Orders where available
✔ Customers with no orders → order_id = NULL

---

## 3️⃣ **RIGHT JOIN (Right Outer Join)**

Opposite of LEFT JOIN.
Returns **all rows from the right table**, plus matching rows from the left.

### 📌 Use Case

* Rare in real life
* Used when the **primary focus is the right table**
* Can usually be replaced with LEFT JOIN by swapping tables

Example:

```sql
SELECT c.customer_name, o.order_id
FROM customers c
RIGHT JOIN orders o
ON c.customer_id = o.customer_id;
```

---

## 4️⃣ **FULL OUTER JOIN**

Returns **all rows from both tables**, matching or not matching.
Non-matching fields are filled with `NULL`.

### 📌 Use Case

* Compare datasets
* Find mismatched or orphan records
* Useful in data warehousing & reconciliation

Example:

```sql
SELECT c.customer_name, o.order_id
FROM customers c
FULL OUTER JOIN orders o
ON c.customer_id = o.customer_id;
```

✔ All customers
✔ All orders
✔ Highlights mismatches

---

## 5️⃣ **CROSS JOIN**

Returns the **cartesian product**: every row from table A combined with every row from table B.

### 📌 Use Case

* Generate combinations
* Create test data
* Build calendars, grids, permutations

Example:

```sql
SELECT *
FROM colors
CROSS JOIN sizes;
```

If colors = 3 rows and sizes = 4 rows → result = 12 rows.

---

## 6️⃣ **SELF JOIN**

A table joined to itself using aliases.

### 📌 Use Case

* Hierarchies (employee → manager)
* Comparing rows within the same table
* Finding duplicates

Example:

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m
ON e.manager_id = m.employee_id;
```

---

# 🧩 Visual Summary

| Join Type           | Returns                                  |
| ------------------- | ---------------------------------------- |
| **INNER JOIN**      | Only matching rows                       |
| **LEFT JOIN**       | All left table rows + matches from right |
| **RIGHT JOIN**      | All right table rows + matches from left |
| **FULL OUTER JOIN** | All rows from both tables                |
| **CROSS JOIN**      | All combinations (Cartesian product)     |
| **SELF JOIN**       | Table joined to itself                   |

---

# 📘 Real-World Examples

### ✔ Get employees with their department

→ INNER JOIN

### ✔ Get all employees whether assigned a department or not

→ LEFT JOIN

### ✔ Find orphan records (e.g., orders without customers)

→ FULL OUTER JOIN

### ✔ Generate every date × every store combination

→ CROSS JOIN

### ✔ Find manager → employee relationships

→ SELF JOIN

---

# 🔥 Combined Example

```sql
SELECT 
    c.customer_name,
    o.order_id,
    o.amount
FROM customers c
LEFT JOIN orders o
ON c.customer_id = o.customer_id
ORDER BY customer_name;
```

✔ Shows all customers
✔ Orders only where available
✔ NULL for customers with no orders

---



# 🧩 Using Subqueries & Correlated Subqueries

A **subquery** is a query inside another query.
It helps break complex logic into smaller pieces, making SQL more readable and powerful.

There are **two types**:

1️⃣ **Subquery (Non-correlated)**
2️⃣ **Correlated Subquery**

Let's learn both.

---

# 1️⃣ Subqueries (Non-Correlated Subqueries)

A non-correlated subquery **runs independently** of the outer query.
It returns a value (or set of values) that the outer query uses.

### ✔ Features

* Runs **once**
* Outer query uses the result
* Common & easier

---

## 🔹 Example 1: Subquery in WHERE

**Find employees who earn more than the average salary.**

```sql
SELECT employee_name, salary
FROM employees
WHERE salary > (
      SELECT AVG(salary)
      FROM employees
);
```

The inner query calculates the average salary.
The outer query filters employees above that number.

---

## 🔹 Example 2: Subquery in FROM

(Subquery behaves like a temporary table)

```sql
SELECT department, avg_salary
FROM (
     SELECT department, AVG(salary) AS avg_salary
     FROM employees
     GROUP BY department
) AS dept_avg;
```

---

## 🔹 Example 3: Subquery in SELECT

(Useful for adding computed fields)

```sql
SELECT 
    employee_name,
    salary,
    (SELECT AVG(salary) FROM employees) AS avg_salary
FROM employees;
```

✔ Adds the overall average salary next to each row

---

# 2️⃣ Correlated Subqueries

A **correlated subquery depends on the outer query.**
It runs **once per row** of the outer query.

It references a column from the outer query, like:

```sql
WHERE inner_table.column = outer_table.column
```

### ✔ Features

* Slower than normal subqueries
* Extremely useful for row-by-row comparisons
* Often replaceable with joins

---

## 🔹 Example 1: Employees earning above their department’s average salary

```sql
SELECT e.employee_name, e.department, e.salary
FROM employees e
WHERE e.salary > (
      SELECT AVG(salary)
      FROM employees
      WHERE department = e.department   -- depends on outer row
);
```

✔ Average salary recalculated **per department**
✔ Only employees above their department average shown

---

## 🔹 Example 2: Find customers who placed more than 3 orders

```sql
SELECT c.customer_id, c.customer_name
FROM customers c
WHERE 3 < (
      SELECT COUNT(*)
      FROM orders o
      WHERE o.customer_id = c.customer_id
);
```

✔ Outer query loops customers
✔ Inner query counts orders per customer

---

## 🔹 Example 3: Find the most recent order per customer

```sql
SELECT o.order_id, o.customer_id, o.order_date
FROM orders o
WHERE o.order_date = (
      SELECT MAX(order_date)
      FROM orders
      WHERE customer_id = o.customer_id
);
```

✔ Returns latest order for each customer

---

# 🧠 When to Use Subqueries vs. Joins

| Scenario                                           | Best Choice         |
| -------------------------------------------------- | ------------------- |
| Need a single value (AVG, COUNT)                   | Subquery            |
| Compare a row to aggregated data                   | Correlated subquery |
| Retrieve combined row details from multiple tables | JOIN                |
| Filter based on a list                             | Subquery with IN    |
| Check existence                                    | `EXISTS` subquery   |

---

# 🔥 3️⃣ EXISTS & NOT EXISTS (Important Special Case)

Used for checking **if matching rows exist**.

### ✔ Example: Customers who have placed at least one order

```sql
SELECT c.customer_id, c.customer_name
FROM customers c
WHERE EXISTS (
      SELECT 1
      FROM orders o
      WHERE o.customer_id = c.customer_id
);
```

### ✔ Example: Customers with NO orders

```sql
SELECT c.customer_id, c.customer_name
FROM customers c
WHERE NOT EXISTS (
      SELECT 1
      FROM orders o
      WHERE o.customer_id = c.customer_id
);
```

---

# 🎯 Summary Table

| Type                    | Runs    | Depends on outer row? | Common Use Case                 |
| ----------------------- | ------- | --------------------- | ------------------------------- |
| **Subquery**            | Once    | No                    | Filtering, aggregation          |
| **Correlated Subquery** | Per row | Yes                   | Row-by-row comparison           |
| **EXISTS**              | Per row | Yes                   | Check presence of child records |

---

# ✔ Full Example (All Concepts Combined)

```sql
SELECT 
    e.employee_name,
    e.department,
    e.salary,
    dept_avg.avg_salary,
    CASE WHEN e.salary > dept_avg.avg_salary 
         THEN 'Above Avg' 
         ELSE 'Below Avg' 
    END AS salary_band
FROM employees e
JOIN (
      SELECT department, AVG(salary) AS avg_salary
      FROM employees
      GROUP BY department
) dept_avg
ON e.department = dept_avg.department
WHERE EXISTS (
      SELECT 1 
      FROM departments d 
      WHERE d.department = e.department
);
```

---
