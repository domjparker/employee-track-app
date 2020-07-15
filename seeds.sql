INSERT INTO departments (id,dept_name)
VALUES (1,"Sales"),(2,"Engineering"),(3,"Finance"),(4,"Legal");

INSERT INTO roles (id,title,salary,department_id)
VALUES (1,"Sales Lead",100000,1),(2,"Sales Person",65000,1),(3,"Lead Engineer",150000,2),(4,"Software Engineer",120000,2),
(5,"Account Manager",90000,3),(6,"Accountant",90000,3),(7,"Legal Team Lead",130000,4),(8,"Lawyer",85000,4),(9,"Junior Engineer",70000,2);

INSERT INTO employees (id,first_name,last_name,role_id,manager_id)
VALUES (1,"Dom","Parker",3,NULL),(2,"Evan","Pach",7,NULL),(3,"Nicole","Remy",8,NULL),
(4,"Zach","Deacon",6,NULL),(5,"Enrique","Garcia",1,NULL);

SELECT roles.id, roles.id, roles.department_id, departments.id
FROM roles
INNER JOIN departments ON roles.department_id = departments.id;