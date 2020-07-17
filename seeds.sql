INSERT INTO departments (dept_name)
VALUES ("Sales"),("Engineering"),("Finance"),("Legal");

INSERT INTO roles (title,salary,department_id)
VALUES ("Sales Lead",100000,1),("Sales Person",65000,1),("Lead Engineer",150000,2),("Software Engineer",120000,2),
("Account Manager",90000,3),("Accountant",90000,3),("Legal Team Lead",130000,4),("Lawyer",85000,4),("Junior Engineer",70000,2);



SELECT roles.id, roles.id, roles.department_id, departments.id
FROM roles
INNER JOIN departments ON roles.department_id = departments.id;

SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id;

SELECT roles.id, roles.title FROM roles LEFT JOIN employees ON roles.id = employees.role_id

SELECT employees.id, employees.first_name, employees.last_name, roles.title, dept_name, roles.salary, managers.last_name AS Manager
 FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id JOIN employees

SELECT roles.id, roles.title, roles.salary, roles.department_id, departments.dept_name FROM roles LEFT JOIN departments ON roles.department_id = departments.id

SELECT employees.id, employees.first_name, employees.last_name, roles.title, 
dept_name, roles.salary, employees.manager_id AS first_name
FROM employees 
JOIN roles ON employees.role_id = roles.id
JOIN departments ON roles.department_id = departments.id 
