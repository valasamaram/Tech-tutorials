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

Here’s a clear, engaging, and **GitHub-ready Markdown section** explaining **relational databases and their core concepts** — written in the same visual and structural style as your *Azure Cloud Foundations* module.

You can directly add this under your **Database Services** section or as a new topic.

---


## 🧮 Understanding Relational Databases & Core Concepts

---

### 💡 What is a Relational Database?

A **Relational Database (RDB)** is a structured way to store and manage data organized into **tables** that are related to each other through **keys**.  
It uses **Structured Query Language (SQL)** for defining, manipulating, and querying data.

Relational databases ensure:
- ✅ **Data Integrity** – Accurate and consistent data  
- 🔄 **Relationships** – Logical links between data entities  
- 🔍 **Query Efficiency** – Powerful filtering and joining capabilities  

**Examples:**  
Microsoft SQL Server, Azure SQL Database, MySQL, PostgreSQL, Oracle Database

---

### 🧱 Core Building Blocks

| Concept | Description | Example |
|----------|--------------|----------|
| **Table** | A collection of related data, similar to a spreadsheet | `Customers`, `Orders`, `Products` |
| **Row (Record)** | A single entry in a table | One customer’s data |
| **Column (Field)** | A data attribute of the table | `CustomerID`, `Name`, `Email` |
| **Schema** | Logical structure that defines how tables relate | Sales, HR, Finance schemas |

> 💡 Think of a **table** as an Excel sheet, **columns** as headers, and **rows** as individual data entries.

---

### 🔑 Keys and Relationships

Keys define how tables connect and maintain data consistency.

| Key Type | Description | Example |
|-----------|--------------|----------|
| **Primary Key (PK)** | Uniquely identifies each record in a table | `CustomerID` in `Customers` table |
| **Foreign Key (FK)** | References a primary key in another table | `CustomerID` in `Orders` refers to `Customers.CustomerID` |
| **Composite Key** | Combination of two or more columns to uniquely identify a record | `OrderID` + `ProductID` |
| **Candidate Key** | Columns that can potentially serve as a primary key | `Email`, `Username` |

#### 🔗 Example Relationship Diagram



## Customers

CustomerID (PK)
Name
Email

## Orders

OrderID (PK)
OrderDate
CustomerID (FK → Customers.CustomerID)



➡️ Each **Customer** can have multiple **Orders** — a **One-to-Many Relationship**.

---

### 🧠 SQL Essentials

Relational databases use SQL to manage and query data.

| Operation | SQL Keyword | Example |
|------------|--------------|----------|
| Create a table | `CREATE TABLE` | `CREATE TABLE Customers (...)` |
| Add data | `INSERT INTO` | `INSERT INTO Customers VALUES (...)` |
| Retrieve data | `SELECT` | `SELECT * FROM Customers` |
| Update data | `UPDATE` | `UPDATE Customers SET Name='John'` |
| Delete data | `DELETE` | `DELETE FROM Customers WHERE ID=1` |

> 🧩 **Tip:** SQL commands follow the CRUD pattern — **Create, Read, Update, Delete**.

---

### 🏁 Summary

- 📋 Relational databases organize data into **tables** with **rows and columns**.  
- 🔑 **Keys** ensure data integrity and define relationships.  
- 🔗 **Foreign keys** connect data across tables.  
- 💬 **SQL** is used for data definition and manipulation.

> 🏆 You now understand the fundamentals of relational databases — a key concept before exploring Azure SQL Database and data services.


---

Excellent — here’s a **ready-to-drop Markdown section** for your Azure learning module, covering the **basics of DDL and DML in SQL** in a clear, visually enriched GitHub format (matching your existing style).

You can insert this after your **Relational Database** section or under a new heading like *SQL Fundamentals*.

---


## 💾 SQL Fundamentals: DDL and DML Commands

---

### 🧱 What is SQL?

**Structured Query Language (SQL)** is the standard language used to interact with **relational databases**.  
It allows you to define the structure of your database and manipulate the data stored within it.

SQL commands are mainly divided into two key categories:

- 🧩 **DDL (Data Definition Language)** — Defines and modifies **database structures**
- 🧮 **DML (Data Manipulation Language)** — Handles the **data itself**

---

## 🧩 Data Definition Language (DDL)

DDL commands define or change the structure of database objects such as **tables**, **schemas**, or **indexes**.

| Command | Purpose | Example |
|----------|----------|----------|
| `CREATE` | Create new database objects | `CREATE TABLE Employees (...)` |
| `ALTER` | Modify existing database structures | `ALTER TABLE Employees ADD Department VARCHAR(50);` |
| `DROP` | Delete database objects permanently | `DROP TABLE Employees;` |

### 🏗️ Example: Create and Modify a Table

```sql
-- Create a new table
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,
    Name NVARCHAR(100),
    Department NVARCHAR(50),
    HireDate DATE
);

-- Add a new column
ALTER TABLE Employees
ADD Salary DECIMAL(10,2);

-- Remove a table
DROP TABLE Employees;
````

> ⚠️ **Caution:** `DROP` deletes both structure and data permanently — use with care!

---

## 🧮 Data Manipulation Language (DML)

DML commands are used to **insert, modify, delete, and retrieve** data from tables.

| Command  | Purpose                 | Example                                                                 |
| -------- | ----------------------- | ----------------------------------------------------------------------- |
| `SELECT` | Retrieve data           | `SELECT * FROM Employees;`                                              |
| `INSERT` | Add new records         | `INSERT INTO Employees VALUES (1, 'Alice', 'HR', '2022-01-10', 60000);` |
| `UPDATE` | Modify existing records | `UPDATE Employees SET Salary = 65000 WHERE EmployeeID = 1;`             |
| `DELETE` | Remove records          | `DELETE FROM Employees WHERE Department = 'HR';`                        |

### 📊 Example: Working with Data

```sql
-- Add new employee
INSERT INTO Employees (EmployeeID, Name, Department, HireDate, Salary)
VALUES (2, 'Bob', 'Finance', '2022-03-05', 70000);

-- Retrieve all employees
SELECT * FROM Employees;

-- Update a record
UPDATE Employees
SET Department = 'Operations'
WHERE EmployeeID = 2;

-- Delete an employee record
DELETE FROM Employees
WHERE EmployeeID = 2;
```

> 💡 **Tip:** Always use a `WHERE` clause with `UPDATE` and `DELETE` to avoid changing or deleting all rows unintentionally.

---

## 🧠 Quick Reference

| Category | Command  | Description             |
| -------- | -------- | ----------------------- |
| **DDL**  | `CREATE` | Create new objects      |
|          | `ALTER`  | Modify existing objects |
|          | `DROP`   | Remove objects          |
| **DML**  | `SELECT` | Retrieve data           |
|          | `INSERT` | Add new data            |
|          | `UPDATE` | Modify existing data    |
|          | `DELETE` | Remove data             |

---

### 🏁 Summary

* 🧩 **DDL** defines the structure (tables, columns, schema).
* 🧮 **DML** manages the data within those structures.
* ⚙️ These two categories form the backbone of working with SQL-based systems.
* 🚀 Understanding both is crucial before exploring **Azure SQL Database** or **Data Services**.

> 🏆 You’ve learned the core SQL operations — next, you’ll see how Azure automates and secures these using **Azure SQL Database** and **Managed Instances**.



---

Excellent question 👏 — yes, **SQL** includes several **other categories of commands** beyond **DDL** and **DML**, each serving a different purpose in managing, controlling, and maintaining databases.

Here’s a full, well-structured explanation you can add right after your DDL/DML section — written in your same engaging, Markdown-friendly style.

---


## 🧠 Other SQL Command Categories (Beyond DDL & DML)

SQL is much broader than just defining (DDL) and manipulating (DML) data.  
It includes other specialized command groups to handle transactions, permissions, and data control.

---

### 🔒 1. DCL – Data Control Language

DCL commands manage **user permissions and access control** within a database.  
They ensure that only authorized users can perform specific actions.

| Command | Description | Example |
|----------|--------------|----------|
| `GRANT` | Give user permissions | `GRANT SELECT ON Employees TO Analyst;` |
| `REVOKE` | Remove user permissions | `REVOKE SELECT ON Employees FROM Analyst;` |

> 💡 **Tip:** DCL is critical in enterprise environments to implement the *principle of least privilege* — give users only the access they need.

---

### 🔁 2. TCL – Transaction Control Language

TCL commands manage **transactions** — sets of SQL operations that must succeed or fail as a single unit.  
They ensure **data consistency** and **rollback capability**.

| Command | Description | Example |
|----------|--------------|----------|
| `BEGIN TRANSACTION` | Start a transaction | `BEGIN TRANSACTION;` |
| `COMMIT` | Save changes permanently | `COMMIT;` |
| `ROLLBACK` | Undo changes if something goes wrong | `ROLLBACK;` |
| `SAVEPOINT` | Set a checkpoint to partially roll back | `SAVE TRANSACTION SavePoint1;` |

🧩 **Example:**

```sql
BEGIN TRANSACTION;

UPDATE Accounts SET Balance = Balance - 500 WHERE AccountID = 101;
UPDATE Accounts SET Balance = Balance + 500 WHERE AccountID = 102;

COMMIT; -- both succeed or both rollback
````

> ⚙️ **ACID Principle:** Transactions must be *Atomic, Consistent, Isolated, Durable*.

---

### 📊 3. DQL – Data Query Language

Technically, **DQL** focuses on querying and retrieving data using `SELECT`.
Though often grouped under DML, it’s distinct because it doesn’t modify data.

| Command  | Description               | Example                                                        |
| -------- | ------------------------- | -------------------------------------------------------------- |
| `SELECT` | Retrieve data from tables | `SELECT Name, Department FROM Employees WHERE Salary > 50000;` |

> 💡 DQL powers analytics, reporting, and dashboard queries in systems like Power BI or Azure Data Explorer.

---

### ⚙️ 4. DTL – Data Transaction Language *(less common term)*

Some systems refer to DTL as the combination of **TCL + DML** commands used to manage **data change transactions**.
While not a standard category, it’s sometimes mentioned in enterprise SQL documentation.

---

### 🧩 Summary Table

| Category | Full Form                    | Purpose                    | Example Commands                  |
| -------- | ---------------------------- | -------------------------- | --------------------------------- |
| **DDL**  | Data Definition Language     | Define database structures | `CREATE`, `ALTER`, `DROP`         |
| **DML**  | Data Manipulation Language   | Manage and modify data     | `INSERT`, `UPDATE`, `DELETE`      |
| **DQL**  | Data Query Language          | Retrieve/query data        | `SELECT`                          |
| **DCL**  | Data Control Language        | Manage permissions & roles | `GRANT`, `REVOKE`                 |
| **TCL**  | Transaction Control Language | Manage transactions        | `COMMIT`, `ROLLBACK`, `SAVEPOINT` |

---

### 🏁 Key Takeaways

* SQL is a complete ecosystem for **defining**, **managing**, **querying**, and **securing** data.
* Beyond DDL/DML, you must understand **DCL**, **TCL**, and **DQL** for real-world database operations.
* These categories align closely with **Azure SQL Database features** like **role-based access control**, **point-in-time recovery**, and **transaction consistency**.



---


## 🧪 Run Simple Queries: Filtering & Projection

In SQL, two of the most common tasks you’ll perform when querying data are:

### ✅ **Projection**

Selecting *which columns* you want to see.

### ✅ **Filtering**

Selecting *which rows* you want to see.

These two ideas together form the foundation of almost every SQL query.

---

## 🎯 1. **Projection (Choosing Columns)**

Projection means returning only the columns you need — not the entire table.

### Example:

```sql
SELECT first_name, last_name, email
FROM employees;
```

🔍 *This retrieves only three columns instead of the entire `employees` table.*

---

## 🎯 2. **Filtering (Choosing Rows)**

Filtering uses the `WHERE` clause to restrict results to only those rows that match a specific condition.

### Example:

```sql
SELECT *
FROM employees
WHERE department = 'Finance';
```

🔍 *Returns only employees who belong to the Finance department.*

---

## 🎯 3. **Filtering + Projection Together**

Most real-world queries combine both:

### Example:

```sql
SELECT first_name, salary
FROM employees
WHERE salary > 50000;
```

✔ Only two columns returned
✔ Only employees with salary above 50,000

---

## 🔍 4. Filtering Operators

You can filter using:

### **Comparison operators**

* `=`
* `>`
* `<`
* `>=`
* `<=`
* `<>` (not equal)

### Example:

```sql
SELECT *
FROM products
WHERE price < 100;
```

---

### **Logical operators**

* `AND`
* `OR`
* `NOT`

### Example:

```sql
SELECT *
FROM employees
WHERE department = 'IT'
  AND status = 'Active';
```

---

### **Range filtering**

```sql
SELECT *
FROM orders
WHERE amount BETWEEN 100 AND 500;
```

---

### **List filtering**

```sql
SELECT *
FROM users
WHERE country IN ('India', 'USA', 'UK');
```

---

### **Pattern search (LIKE)**

```sql
SELECT *
FROM customers
WHERE email LIKE '%gmail.com';
```

---

## 🧠 Summary

| Concept        | Meaning                          | Keyword                         |
| -------------- | -------------------------------- | ------------------------------- |
| Projection     | Select which **columns** to show | `SELECT col1, col2`             |
| Filtering      | Select which **rows** to show    | `WHERE`                         |
| Combined Query | Most common SQL pattern          | `SELECT ... FROM ... WHERE ...` |

These fundamentals are the base for writing more advanced SQL such as joins, aggregations, subqueries, and window functions.

---

Here is a clear, structured, and easy-to-learn explanation of **SQL Data Types** — perfect for beginners and suitable for adding directly to your GitHub README.

---

# 🗂️ SQL Data Types — Explained

SQL data types define **what kind of data** can be stored in a table column. Choosing the correct data type ensures:

* ✔ Efficient storage
* ✔ Correct data validation
* ✔ Better performance
* ✔ Avoiding data errors

SQL has several categories of data types. Here are the most common ones used in relational databases (SQL Server, MySQL, PostgreSQL, Oracle).

---

## 🔢 1. Numeric Data Types

These store numbers — integers or decimals.

### **Integer Types**

| Type       | Description               | Example     |
| ---------- | ------------------------- | ----------- |
| `INT`      | Whole numbers             | 10, 200, -5 |
| `SMALLINT` | Smaller range of integers | 1, 120      |
| `BIGINT`   | Very large integers       | 9000000000  |

### **Decimal / Floating Types**

| Type            | Description                          | Example |
| --------------- | ------------------------------------ | ------- |
| `DECIMAL(p, s)` | Exact numeric values; good for money | 123.45  |
| `NUMERIC(p, s)` | Same as DECIMAL                      | 99.99   |
| `FLOAT`         | Approximate values                   | 3.14159 |
| `REAL`          | Smaller floating type                | 1.23    |

💡 **Rule of thumb:**
➡️ For money → use `DECIMAL`
➡️ For scientific values → use `FLOAT`

---

## 🔤 2. Character (String) Data Types

Used for storing text.

| Type         | Description                    | Example    |
| ------------ | ------------------------------ | ---------- |
| `CHAR(n)`    | Fixed-length text (exact size) | 'ABC'      |
| `VARCHAR(n)` | Variable-length text           | 'John Doe' |
| `TEXT`       | Large text blocks              | Paragraphs |

📌 **CHAR vs VARCHAR**

* `CHAR` = fixed length → good for codes (e.g., country code “IN”)
* `VARCHAR` = variable length → good for names, emails, titles

---

## 📅 3. Date & Time Data Types

Used to store time-related data.

| Type        | Description                | Example             |
| ----------- | -------------------------- | ------------------- |
| `DATE`      | Stores only the date       | 2025-11-15          |
| `TIME`      | Stores only the time       | 14:35:10            |
| `DATETIME`  | Date + time                | 2025-11-15 14:35:10 |
| `TIMESTAMP` | Auto-generated time record | CreatedAt column    |

💡 **TIMESTAMP** is often used for tracking record creation/update times.

---

## 🔘 4. Boolean Data Type

Stores True/False values.

| Type               | Example     |
| ------------------ | ----------- |
| `BOOLEAN` / `BOOL` | TRUE, FALSE |

Some SQL engines use:

* `0` for FALSE
* `1` for TRUE

---

## 🧳 5. Binary Data Types

Stores raw binary data (images, PDFs, videos, executables).

| Type        | Description            |
| ----------- | ---------------------- |
| `BINARY`    | Fixed-length binary    |
| `VARBINARY` | Variable-length binary |
| `BLOB`      | Binary large object    |

---

## 📚 6. Miscellaneous Data Types

| Type   | Description                   | Example                  |
| ------ | ----------------------------- | ------------------------ |
| `JSON` | Stores JSON documents         | {"id":1,"name":"Sam"}    |
| `UUID` | Universally unique identifier | a8f5f167-…               |
| `XML`  | XML document                  | `<data>...</data>`       |
| `ENUM` | Limited set of static values  | 'NEW', 'PENDING', 'DONE' |

---

# 🧠 How to Choose Correct Data Types

| Data Type           | Best Use Case                  |
| ------------------- | ------------------------------ |
| `INT`               | IDs, counts                    |
| `VARCHAR`           | Names, emails, addresses       |
| `CHAR`              | Codes like country/state codes |
| `DECIMAL`           | Money, precise values          |
| `DATE` / `DATETIME` | Timestamps, logs               |
| `BOOLEAN`           | True/false flags               |
| `BLOB`              | Images, files                  |
| `JSON`              | Semi-structured data           |

---

# ✔️ Example Table Using Various Data Types

```sql
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,
    FullName VARCHAR(100),
    Email VARCHAR(150),
    Salary DECIMAL(10,2),
    IsActive BOOLEAN,
    JoiningDate DATE,
    ProfilePhoto BLOB,
    Metadata JSON
);
```

---

