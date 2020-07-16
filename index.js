const mysql = require("mysql");
const inquirer = require("inquirer");

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "password",
    database: "employeeTrack_db",
});

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    initQuestions();
});

// function which prompts the user for what action they should take
const initQuestions = async () => {
    // async function start() {
    const { whatToDo } = await inquirer.prompt({
        name: "whatToDo",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Employees", "View Roles", "View Departments", "Add Employee", "Add Role", "Add Department", "Update Employee Role", "Update Manager", "Delete Employee", "Quit"],
    });

    switch (whatToDo) {
        case "View Employees":
            viewEmployees();
            break;
        case "View Roles":
            viewRoles();
            break;
        case "View Departments":
            viewDepartments();
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "Add Role":
            addRole();
            break;
        case "Add Department":
            addDepartment();
            break;
        case "Update Employee Role":
            updateEmployeeRole();
            break;
        case "Update Manager":
            updateManager();
            break;
        case "Delete Employee":
            deleteEmployee();
            break;
        default:
            console.log("You have exited the application");
            connection.end();
            break;
    }
}

function viewEmployees() {
    console.log("Viewing all employees.")
    var query = "SELECT employees.id, employees.first_name, employees.last_name, roles.title,";
    query += " dept_name, roles.salary, employees.manager_id AS manager FROM employees JOIN roles ";
    query += "ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        initQuestions();
    })
}



function viewRoles() {
    console.log("Viewing all employee roles.")
    var query = "SELECT * FROM roles;"
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        initQuestions();
    })
}


function viewDepartments() {
    console.log("Viewing all departments.")
    var query = "SELECT * FROM departments;"
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        initQuestions();
    })
}

const addEmployee = async () => {
    // query database for list of current roles
    var query = "SELECT * FROM roles"
    connection.query(query, async (err, roleResults) => {
        if (err) throw err;

        let myRoles = await roleResults.map(function (role) {
            return {
                name: role.title,
                value: role.id
            }
        })
        // query database for list of current managers
        var query = "SELECT * FROM employees"
        connection.query(query, async (err, employeeResults) => {
            if (err) throw err;

            let myManagers = await employeeResults.map(function (employee) {
                return {
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id
                }
            })
            // prompt with - what is the first name, last name, employee role, and employee manager?
            const answers = await inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is the first name of the person you would like to add as an employee?",
                    validate: (value) => (isNaN(value) ? true : false),
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the last name of the person you would like to add as an employee?",
                    validate: (value) => (isNaN(value) ? true : false),
                },
                {
                    name: "role_title",
                    type: "list",
                    message: "What will the person's role be?",
                    choices: myRoles
                },
                {
                    name: "employee_manager",
                    type: "list",
                    message: "Who will the person's manager be? (If the person currently does not have a manager, leave this blank",
                    choices: myManagers
                },
            ]);
            // need to convert 
            console.log(answers)
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO employees SET ?",
                {
                    first_name: answers.first_name,
                    last_name: answers.last_name,
                    role_id: answers.role_title,
                    manager_id: answers.employee_manager
                },
                (err) => {
                    if (err) throw err;
                    console.log(answers.first_name + " " + answers.last_name + "was added as an employee");
                    initQuestions();
                }
            );
        })
    })
}

const addRole = async () => {
    // query database for list of current roles and salaries
    connection.query("SELECT * FROM roles", async (err, roleResults) => {
        if (err) throw err;
        console.table(roleResults);
        // query database for list of departments as choices for 3rd question.
        connection.query("SELECT * FROM departments", async (err, departmentResults) => {
            if (err) throw err;
            let myDepts = departmentResults.map(function (dept) {
                return {
                    name: dept.dept_name,
                    value: dept.id
                }
            })
            // prompt with - what is the new role, it's salary, and department?
            const answers = await inquirer.prompt([
                {
                    name: "new_role",
                    type: "input",
                    message: "What role would you like to add to the list above?",
                    validate: (value) => (isNaN(value) ? true : false),
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary amount?",
                    validate: (value) => (!isNaN(value) ? true : false),
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department will this role be in?",
                    choices: myDepts
                },
            ])
            console.log(answers)
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO roles SET ?",
                {
                    title: answers.new_role,
                    salary: answers.salary,
                    department_id: answers.department
                },
                (err) => {
                    if (err) throw err;
                    console.log("The role of " + answers.new_role + " has been added.");
                    initQuestions();
                }
            );
        })
    })
    // take answers and add role into database
}

// addDepartment()
const addDepartment = async () => {
    // query database for list of current departments
    connection.query("SELECT * FROM departments", async (err, deptResults) => {
        if (err) throw err;
        console.table(deptResults);
        // prompt with - what new department?
        const { new_dept } = await inquirer.prompt([
            {
                name: "new_dept",
                type: "input",
                message: "What new department would you like to add to the list above?",
                validate: (value) => (isNaN(value) ? true : false),
            },
        ])
    })
    // take answer and add department into database
}


const updateEmployeeRole = async () => {
    // show table of employees, their titles,departments, and managers
    var query = "SELECT * FROM employees"
    connection.query(query, async (err, employeeResults) => {
        if (err) throw err;
        console.table(employeeResults)
        let employeesList = await employeeResults.map(function (employee) {
            return {
                name: employee.first_name + " " + employee.last_name,
                value: employee.id
            }
        })
        // query database for list of current roles
        connection.query("SELECT * FROM roles", async (err, roleResults) => {
            if (err) throw err;

            let myRoles = await roleResults.map(function (role) {
                return {
                    name: role.title,
                    value: role.id
                }
            })
            // prompt with - which employee, and role?
            const answers = await inquirer.prompt([
                {
                    name: "whichEmployee",
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: employeesList
                },
                {
                    name: "whatRole",
                    type: "list",
                    message: "What role would you like to update the employee to?",
                    choices: myRoles
                }
            ])
            // when finished prompting, update employee's role in database
            connection.query(
                "UPDATE employees SET ? WHERE ?",
                [
                    {
                        role_id: answers.whatRole
                    },
                    {
                        id: answers.whichEmployee
                    }
                ],
                function (err) {
                    if (err) throw err;
                    console.log("The employee's role has been updated.");
                    initQuestions();
                }
            )
        })
    })
}
const updateManager = async () => {
    // show table of employees, their titles,departments, and managers
    var query = "SELECT * FROM employees"
    connection.query(query, async (err, employeeResults) => {
        if (err) throw err;
        console.table(employeeResults)
        let employeesList = await employeeResults.map(function (employee) {
            return {
                name: employee.first_name + " " + employee.last_name,
                value: employee.id
            }
        })
        // reuse list of choices for managers from recent query
        // prompt with - which employee, and role?
        const answers = await inquirer.prompt([
            {
                name: "whichEmployee",
                type: "list",
                message: "For which employee would you like to assign a new manager?",
                choices: employeesList
            },
            {
                name: "whichManager",
                type: "list",
                message: "What role would you like to update the employee to?",
                choices: employeesList
            }
        ])
        // when finished prompting, update employee's manager in database
        connection.query(
            "UPDATE employees SET ? WHERE ?",
            [
                {
                    manager_id: answers.whichEmployee
                },
                {
                    id: answers.whichEmployee
                }
            ],
            function (err) {
                if (err) throw err;
                console.log("The employee has been assigned an updated manager.");
                initQuestions();
            }
        )
    })
};

const deleteEmployee = async () => {
    // show table of employees, their titles,departments, and managers
    var query = "SELECT * FROM employees"
    connection.query(query, async (err, employeeResults) => {
        if (err) throw err;
        console.table(employeeResults)
        let employeesList = await employeeResults.map(function (employee) {
            return {
                name: employee.first_name + " " + employee.last_name,
                value: employee.id
            }
        })
        // prompt with - which employee, and role?
        const answers = await inquirer.prompt([
            {
                name: "whichEmployee",
                type: "list",
                message: "Which employee would you like to delete?",
                choices: employeesList
            }
        ])
        // when finished prompting, delete employee in database
        connection.query(
            "DELETE FROM employees WHERE ?",
            [
                {
                    id: answers.whichEmployee
                }
            ],
            function (err) {
                if (err) throw err;
                console.log("The employee deleted from the system.");
                initQuestions();
            }
        )
    })
}

