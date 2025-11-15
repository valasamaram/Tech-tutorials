# Module 03 — Aggregation & Window Functions

## Learning objectives
- Use aggregate functions with GROUP BY and HAVING.
- Understand window functions and apply them for analytics (ranking, moving averages, running totals).

## Aggregation
- Aggregates: COUNT, SUM, AVG, MIN, MAX
- GROUP BY groups rows; HAVING filters groups.



---

# 📊 Aggregate Functions, GROUP BY & HAVING

Understanding how to summarize and analyze data is a key SQL skill. Aggregate functions help you compute totals, averages, counts, and other summary values. Combined with `GROUP BY` and `HAVING`, they allow powerful analytical queries.

---

## 🔢 1. Aggregate Functions

Aggregate functions work **across multiple rows** and return a **single value**.

Common aggregate functions:

| Function  | Description      |
| --------- | ---------------- |
| `COUNT()` | Counts rows      |
| `SUM()`   | Computes total   |
| `AVG()`   | Computes average |
| `MIN()`   | Smallest value   |
| `MAX()`   | Largest value    |

### Example

```sql
SELECT COUNT(*) AS total_employees
FROM employees;
```

---

## 📦 2. GROUP BY (Group Rows Before Aggregation)

`GROUP BY` groups rows that have the same values in one or more columns, then applies aggregate functions to each group.

### Example: Count employees in each department

```sql
SELECT department, COUNT(*) AS headcount
FROM employees
GROUP BY department;
```

✔ Groups employees by department
✔ Counts how many in each department

---

## 🎯 3. GROUP BY with Multiple Columns

You can group by more than one column.

```sql
SELECT department, job_title, COUNT(*) AS total
FROM employees
GROUP BY department, job_title;
```

---

## 🚫 4. HAVING (Filter After Grouping)

`HAVING` is like `WHERE`, but it works **after** grouping.
Use it to filter groups based on aggregate values.

### Example: Show only departments with more than 10 employees

```sql
SELECT department, COUNT(*) AS headcount
FROM employees
GROUP BY department
HAVING COUNT(*) > 10;
```

❗ **Important:**

* `WHERE` → filters **before** grouping
* `HAVING` → filters **after** grouping

---

## 🎛️ 5. Combined Example

```sql
SELECT department,
       AVG(salary) AS avg_salary,
       MAX(salary) AS highest_salary
FROM employees
WHERE status = 'Active'              -- Filter rows first
GROUP BY department                  -- Group rows
HAVING AVG(salary) > 60000;          -- Filter groups
```

This query:
✔ Filters inactive employees
✔ Groups remaining rows by department
✔ Calculates average & max salary
✔ Shows only departments with avg salary > 60K

---

## 📌 Summary

| Concept             | Purpose                                      |
| ------------------- | -------------------------------------------- |
| Aggregate Functions | Summarize values (COUNT, SUM, AVG, MIN, MAX) |
| GROUP BY            | Group rows before aggregating                |
| HAVING              | Filter aggregates after grouping             |
| WHERE vs HAVING     | WHERE = before grouping; HAVING = after      |

---


---

# 🪟 Window Functions (Analytics)

Window functions let you perform calculations **across a set of rows *related* to the current row**—without collapsing them into a single group (unlike `GROUP BY`).

A “window” is simply the set of rows the function is allowed to look at.

Window functions use the syntax:

```sql
function_name(...) OVER (
    PARTITION BY ...
    ORDER BY ...
    ROWS/RANGE ...
)
```

---

# 📌 Why Window Functions Matter?

They help you answer questions like:

* What is each employee’s rank in their department?
* What is the running total of sales over time?
* What is the moving average of website traffic?
* What is the difference between a row value and the previous row?

All **without** grouping or losing detail.

---

# 🏆 1. Ranking Functions

Ranking functions assign a rank to each row based on sort order.

## ⭐ `ROW_NUMBER()`

Gives a unique sequence number per row.

```sql
SELECT employee_id, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank_by_salary
FROM employees;
```

---

## 🥈 `RANK()`

Gives the same rank for ties, but skips numbers.

```sql
SELECT employee_id, score,
       RANK() OVER (ORDER BY score DESC) AS rank_position
FROM results;
```

---

## 🥉 `DENSE_RANK()`

Like `RANK()` but **doesn't skip ranks**.

```sql
SELECT employee_id, score,
       DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank_position
FROM results;
```

---

# 📈 2. Running Totals (Cumulative Sums)

Used for financial reporting, revenue tracking, etc.

```sql
SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
           AS running_total
FROM sales;
```

✔ Shows total up to *each* date
✔ Not grouped—every row remains visible

---

# 📉 3. Moving Averages (Rolling Window)

Often used in analytics dashboards.

Example: 7-day moving average of daily sales.

```sql
SELECT sale_date, revenue,
       AVG(revenue) OVER (
          ORDER BY sale_date
          ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS moving_avg_7_days
FROM daily_sales;
```

✔ Smooths trends
✔ Not affected by one-off spikes

---

# 🔄 4. LAG & LEAD (Access Previous/Next Row)

Compare values from adjacent rows.

## 🔙 `LAG()`

Look *backward* one or more rows.

```sql
SELECT sale_date, revenue,
       LAG(revenue, 1) OVER (ORDER BY sale_date) AS previous_day_revenue
FROM daily_sales;
```

---

## 🔜 `LEAD()`

Look *forward* one or more rows.

```sql
SELECT sale_date, revenue,
       LEAD(revenue, 1) OVER (ORDER BY sale_date) AS next_day_revenue
FROM daily_sales;
```

---

# 🧮 5. Percentiles, N-Tiles, and Distribution Functions

Useful in BI dashboards and analytics:

### `NTILE(n)`

Splits data into equal-sized buckets (quartiles, deciles, etc.)

```sql
SELECT employee_id, salary,
       NTILE(4) OVER (ORDER BY salary) AS salary_quartile
FROM employees;
```

---

# 🧠 Summary Table

| Category     | Functions                                | Purpose                          |
| ------------ | ---------------------------------------- | -------------------------------- |
| Ranking      | ROW_NUMBER, RANK, DENSE_RANK             | Ordering & ranking rows          |
| Distribution | NTILE                                    | Percentile grouping              |
| Navigation   | LAG, LEAD                                | Access previous/next row         |
| Aggregation  | SUM, AVG, MIN, MAX (as window functions) | Running totals, moving averages  |
| Window Frame | ROWS/RANGE                               | Controls which rows are included |

---

