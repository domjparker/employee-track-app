INSERT INTO departments (dept_name)
VALUES ("Sales"),("Engineering"),("Finance"),("Legal");

INSERT INTO roles (title,salary,department_id)
VALUES ("Sales Lead",100000,1),("Sales Person",65000,1),("Lead Engineer",150000,2),("Software Engineer",120000,2),
("Account Manager",90000,3),("Accountant",90000,3),("Legal Team Lead",130000,4),("Lawyer",85000,4),("Junior Engineer",70000,2);

INSERT INTO employees (first_name,last_name,role_id,manager_id)
VALUES ("Dom","Parker",3,NULL),("Evan","Pach",7,NULL),("Nicole","Remy",8,null),
("Zach","Deacon",6,NULL),("Enrique","Garcia",1,NULL);

SELECT roles.id, roles.id, roles.department_id, departments.id
FROM roles
INNER JOIN departments ON roles.department_id = departments.id;

SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id;

SELECT roles.id, roles.title FROM roles LEFT JOIN employees ON roles.id = employees.role_id