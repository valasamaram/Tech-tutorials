# Module 01 — SQL Queries & Filtering

## Learning objectives
- Master the SELECT statement: projections, filtering, sorting, and pagination.
- Use expressions, functions, and conditional logic inside queries.

## SELECT fundamentals
```sql
SELECT column1, column2 AS alias
FROM schema.table
WHERE <condition>
GROUP BY grouping_cols
HAVING <group_condition>
ORDER BY col1 DESC, col2 ASC
LIMIT 50 OFFSET 100; -- pagination
```
Here is a **complete, clear, and beginner-friendly explanation** of mastering the SQL **SELECT** statement — covering **projection, filtering, sorting, and pagination**.
You can paste this directly into your GitHub learning module.

---

# 🎯 Mastering the `SELECT` Statement

The `SELECT` statement is the **most important SQL command** — it retrieves data from a table.
To master SQL, you must master these four pillars:

1. **Projection** → selecting columns
2. **Filtering** → selecting rows
3. **Sorting** → ordering results
4. **Pagination** → breaking results into pages

Let’s explore each with examples.

---

# 🧱 1. Projection (Choosing Columns)

Projection controls **which columns** appear in the result.

### Syntax:

```sql
SELECT column1, column2
FROM table_name;
```

### Example:

```sql
SELECT first_name, last_name, email
FROM employees;
```

### Select All Columns:

```sql
SELECT *
FROM employees;
```

💡 Best practice: Avoid `SELECT *` in production for performance & clarity.

---

# 🔍 2. Filtering (Choosing Rows)

Filtering uses the **WHERE** clause to limit rows based on a condition.

### Syntax:

```sql
SELECT columns
FROM table_name
WHERE condition;
```

### Example:

```sql
SELECT *
FROM employees
WHERE department = 'HR';
```

### Common Operators:

| Type       | Operators           |
| ---------- | ------------------- |
| Comparison | =, <>, >, <, >=, <= |
| Logical    | AND, OR, NOT        |
| Range      | BETWEEN             |
| List       | IN                  |
| Pattern    | LIKE                |

### Example with multiple filters:

```sql
SELECT first_name, salary
FROM employees
WHERE department = 'IT'
  AND salary > 60000;
```

---

# 🗂️ 3. Sorting (Ordering Results)

Sorting uses **ORDER BY** to arrange results in ascending or descending order.

### Syntax:

```sql
SELECT columns
FROM table
ORDER BY column [ASC|DESC];
```

### Example:

```sql
SELECT first_name, salary
FROM employees
ORDER BY salary DESC;
```

### Sorting on multiple columns:

```sql
SELECT first_name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;
```

---

# 📄 4. Pagination (Limit Results for Page-wise Display)

Pagination helps return data **in chunks** instead of all at once.
Useful for UI, dashboards, APIs, and large datasets.

---

## 🔹 MySQL / PostgreSQL Style

### LIMIT

```sql
SELECT *
FROM products
LIMIT 10;       -- first 10 rows
```

### LIMIT + OFFSET

```sql
SELECT *
FROM products
LIMIT 10 OFFSET 20;   -- rows 21–30
```

---

## 🔹 SQL Server Style

Uses **OFFSET … FETCH**.

```sql
SELECT *
FROM products
ORDER BY product_id
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
```

---

## 🔹 Oracle Style

```sql
SELECT *
FROM products
ORDER BY product_id
FETCH FIRST 10 ROWS ONLY;
```

---

# 🔥 Putting It All Together

A real-world query using **projection + filtering + sorting + pagination**:

```sql
SELECT product_name, price, category
FROM products
WHERE category IN ('Electronics', 'Mobiles')
  AND price BETWEEN 5000 AND 20000
ORDER BY price DESC
OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;
```

✔ Only required columns
✔ Filtered by category & price
✔ Sorted by price
✔ First 10 rows only

---

# ✔️ Summary Table

| Concept    | Clause                     | Purpose                          |
| ---------- | -------------------------- | -------------------------------- |
| Projection | `SELECT`                   | Choose columns                   |
| Filtering  | `WHERE`                    | Choose rows                      |
| Sorting    | `ORDER BY`                 | Arrange rows                     |
| Pagination | `LIMIT`, `OFFSET`, `FETCH` | Return specific slice of results |

---



# 🧠 Using Expressions, Functions & Conditional Logic in SQL Queries

SQL isn’t just for retrieving data — you can **calculate**, **transform**, and **conditionally manipulate** data directly inside your `SELECT` queries.

This is where SQL becomes powerful.

---

# 🧮 1. Expressions (Calculations Inside Queries)

Expressions allow you to perform math or string operations.

### 🔢 Numeric Expressions

```sql
SELECT product_name,
       price,
       price * 0.10 AS discount_amount
FROM products;
```

✔ Calculates 10% discount
✔ Adds a computed column

### 🔤 String Expressions

```sql
SELECT first_name || ' ' || last_name AS full_name
FROM employees;
```

(*In SQL Server use `+`, in MySQL use `CONCAT()`.*)

---

# 🧰 2. SQL Functions

Functions help manipulate numbers, strings, dates, and aggregates.

---

## 📌 a) String Functions

| Function             | Example               | Meaning                |
| -------------------- | --------------------- | ---------------------- |
| `UPPER()`            | `UPPER(name)`         | Convert to uppercase   |
| `LOWER()`            | `LOWER(email)`        | Convert to lowercase   |
| `LENGTH()` / `LEN()` | `LEN(city)`           | Length of string       |
| `SUBSTRING()`        | `SUBSTRING(name,1,3)` | Extract part of string |
| `TRIM()`             | `TRIM(name)`          | Remove spaces          |

### Example:

```sql
SELECT UPPER(city) AS city_upper,
       LENGTH(city) AS city_length
FROM customers;
```

---

## 📌 b) Numeric Functions

| Function     | Example             |
| ------------ | ------------------- |
| `ABS(x)`     | Absolute value      |
| `ROUND(x,n)` | Round to n decimals |
| `CEILING(x)` | Round up            |
| `FLOOR(x)`   | Round down          |

### Example:

```sql
SELECT salary,
       ROUND(salary * 1.15, 2) AS revised_salary
FROM employees;
```

---

## 📌 c) Date & Time Functions

| Function              | Example                  | Meaning |
| --------------------- | ------------------------ | ------- |
| `NOW()` / `GETDATE()` | Current date & time      |         |
| `DATEADD()`           | Add days, months, years  |         |
| `DATEDIFF()`          | Difference between dates |         |
| `YEAR()`              | Extract year             |         |
| `MONTH()`             | Extract month            |         |

### Example:

```sql
SELECT order_id,
       order_date,
       DATEDIFF(day, order_date, GETDATE()) AS days_since_order
FROM orders;
```

---

## 📌 d) Aggregate Functions (Used with GROUP BY)

| Function  | Meaning    |
| --------- | ---------- |
| `COUNT()` | Count rows |
| `SUM()`   | Add values |
| `AVG()`   | Average    |
| `MIN()`   | Minimum    |
| `MAX()`   | Maximum    |

### Example:

```sql
SELECT department,
       COUNT(*) AS total_employees,
       AVG(salary) AS avg_salary
FROM employees
GROUP BY department;
```

---

# ⚙️ 3. Conditional Logic (CASE Expression)

`CASE` allows IF-THEN-ELSE logic inside SQL.

### Basic Syntax:

```sql
CASE
   WHEN condition THEN result
   ELSE fallback
END
```

---

### Example: Salary Grade

```sql
SELECT employee_name,
       salary,
       CASE 
           WHEN salary > 100000 THEN 'High'
           WHEN salary BETWEEN 50000 AND 100000 THEN 'Medium'
           ELSE 'Low'
       END AS salary_band
FROM employees;
```

---

### Example: Status Label

```sql
SELECT order_id,
       status,
       CASE status
           WHEN 'P' THEN 'Pending'
           WHEN 'C' THEN 'Completed'
           WHEN 'X' THEN 'Cancelled'
       END AS status_description
FROM orders;
```

---

# 🔥 4. Combine Everything in One Query

```sql
SELECT 
    first_name,
    last_name,
    CONCAT(first_name, ' ', last_name) AS full_name,
    salary,
    ROUND(salary * 1.10, 2) AS incremented_salary,
    CASE 
        WHEN salary > 100000 THEN 'Top Tier'
        WHEN salary > 50000 THEN 'Mid Tier'
        ELSE 'Entry Level'
    END AS category,
    YEAR(joined_date) AS joining_year
FROM employees
WHERE salary > 30000
ORDER BY incremented_salary DESC;
```

✔ Expressions
✔ Functions
✔ CASE logic
✔ Filtering + sorting

---

# ✔️ Summary Table

| Feature           | Purpose              | Example          |
| ----------------- | -------------------- | ---------------- |
| Expressions       | Perform calculations | `salary * 1.1`   |
| String functions  | Manipulate text      | `UPPER(name)`    |
| Numeric functions | Math operations      | `ROUND(price,2)` |
| Date functions    | Work with dates      | `DATEDIFF()`     |
| Conditional logic | IF-ELSE in SQL       | `CASE WHEN …`    |

---

