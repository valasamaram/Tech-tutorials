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

Examples:
```sql
-- Inner join
SELECT e.employee_id, e.first_name, d.name as department
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;

-- Left join: include employees without a department
SELECT e.employee_id, d.name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;
```

## Subqueries
- Non-correlated subquery: runs once and its result is used by outer query.
- Correlated subquery: references outer query columns and runs per row (costly).

Non-correlated example:
```sql
SELECT product_id FROM products WHERE category_id IN (SELECT id FROM categories WHERE name = 'Accessories');
```

Correlated example:
```sql
SELECT o.order_id, o.total,
  (SELECT AVG(total) FROM orders o2 WHERE o2.customer_id = o.customer_id) as cust_avg
FROM orders o;
```

## When to use subqueries vs joins
- Joins are often more performant for combining columns from multiple tables.
- Subqueries are useful for existence checks, scalar aggregation per row, and encapsulation.

## EXISTS vs IN
- `EXISTS` is typically preferred for correlated existence checks (stops at first match).
- `IN` with a subquery works well for small sets but can be slower if subquery returns many rows.

## Lab
- Write queries using LEFT JOIN to find customers with no orders.
- Use correlated subquery to calculate each customer's average order value.

## Troubleshooting
- Unexpected NULLs: check join conditions and cardinality.
- Cartesian joins: missing join condition results in huge result sets — verify ON clauses.

## Interview questions
- Given tables A and B, show results for LEFT JOIN vs INNER JOIN for example data.
- When would you prefer a correlated subquery over a join?