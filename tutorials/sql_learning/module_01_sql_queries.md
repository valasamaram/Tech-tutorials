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

## Filtering & expressions
- Comparison operators: =, <>, >, <, >=, <=
- Logical operators: AND, OR, NOT
- LIKE with wildcards (`%`, `_`), ILIKE for case-insensitive (Postgres)
- IN, BETWEEN, IS NULL

Examples:
```sql
SELECT * FROM orders
WHERE order_date >= '2024-01-01' AND status IN ('shipped','delivered');

SELECT customer_id, UPPER(last_name) as name_upper FROM customers WHERE email LIKE '%@example.com';
```

## Built-in functions
- String: CONCAT, SUBSTRING, TRIM, LENGTH
- Numeric: ROUND, CEIL/FLOOR, ABS
- Date/time: DATEADD/DATE_TRUNC (engine-specific), DATEDIFF
- Conditional: COALESCE, NULLIF, CASE

CASE example:
```sql
SELECT order_id,
  CASE
    WHEN amount >= 1000 THEN 'Large'
    WHEN amount >= 100 THEN 'Medium'
    ELSE 'Small'
  END as order_size
FROM orders;
```

## Pagination & performance
- Use `LIMIT/OFFSET` for small datasets; prefer keyset pagination for large result sets.

Keyset example (pseudo):
```sql
SELECT * FROM items WHERE (category_id = 5) AND (id > :last_id) ORDER BY id LIMIT 50;
```

## Lab
- Build queries to produce a monthly revenue report, top 10 customers by revenue, and orders with missing shipping address.

## Troubleshooting
- Wrong results due to implicit type conversion — cast explicitly.
- Performance: avoid SELECT * in production; project only required columns.

## Interview questions
- Explain when to use CASE vs COALESCE.
- Describe keyset vs offset pagination and trade-offs.