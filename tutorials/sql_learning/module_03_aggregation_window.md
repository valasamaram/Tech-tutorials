# Module 03 — Aggregation & Window Functions

## Learning objectives
- Use aggregate functions with GROUP BY and HAVING.
- Understand window functions and apply them for analytics (ranking, moving averages, running totals).

## Aggregation
- Aggregates: COUNT, SUM, AVG, MIN, MAX
- GROUP BY groups rows; HAVING filters groups.

Example:
```sql
SELECT department_id, COUNT(*) as headcount, AVG(salary) as avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 50000;
```

## Window functions (analytic)
- Syntax: `FUNCTION(...) OVER (PARTITION BY ... ORDER BY ...)`
- Common functions: ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE(), SUM() OVER(), AVG() OVER()

Examples:
```sql
-- Rank employees by salary within each department
SELECT employee_id, department_id, salary,
  RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as salary_rank
FROM employees;

-- Running total
SELECT order_id, order_date, amount,
  SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total
FROM orders;
```

## Use-cases
- Top-N per group (ROW_NUMBER + partition)
- Moving averages for time-series
- Percentile calculation (NTILE)

## Lab
- Produce top 3 paid employees per department using window functions.
- Compute a 7-day moving average of daily sales.

## Troubleshooting
- Window functions do not reduce row count — combine with CTE or subquery when you need aggregated rows only.

## Interview questions
- Explain difference between RANK and DENSE_RANK.
- How to compute a moving average using window functions?