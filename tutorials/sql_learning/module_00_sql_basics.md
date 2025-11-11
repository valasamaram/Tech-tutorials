# Module 00 — SQL Basics

## Learning objectives
- Understand what a relational database is and core concepts (tables, rows, columns, keys).
- Learn basic DDL (CREATE, ALTER, DROP) and DML (SELECT, INSERT, UPDATE, DELETE).
- Run simple queries with filtering and projection.

## Concepts
### Relational model
- Table: collection of rows (records). Each row has columns defined by a schema.
- Primary key: unique identifier for rows.
- Foreign key: reference from one table to another enforcing referential integrity.

### Data types (common)
- Integer types: INT, BIGINT
- Decimal: DECIMAL/NUMERIC, FLOAT
- Strings: VARCHAR(n), TEXT
- Date/time: DATE, TIME, TIMESTAMP
- Boolean: BOOLEAN

## Basic DDL
```sql
CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  hire_date DATE,
  salary DECIMAL(10,2)
);

ALTER TABLE employees ADD COLUMN department_id INT;
DROP TABLE temp_table;
```

## Basic DML
```sql
-- Insert
INSERT INTO employees (employee_id, first_name, last_name, hire_date, salary)
VALUES (1, 'Alice', 'Smith', '2023-01-15', 85000.00);

-- Select
SELECT first_name, last_name, salary FROM employees WHERE salary > 60000 ORDER BY salary DESC;

-- Update
UPDATE employees SET salary = salary * 1.05 WHERE employee_id = 1;

-- Delete
DELETE FROM employees WHERE employee_id = 999;
```

## Hands-on lab
1. Create a database/schema `school` and tables `students`, `courses`, `enrollments`.
2. Insert 10 sample students and 5 courses; enroll students in courses.
3. Query: list students enrolled in each course.

## Troubleshooting
- Syntax errors: check semicolons and matching parentheses.
- NULL handling: use `IS NULL` / `IS NOT NULL` for checks.

## Interview practice
- Explain the difference between primary key and unique constraint.
- Given a table, write a query to find duplicate rows by a set of columns.