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
        choices: ["View Employees", "View Roles", "View Departments", "Add Employee", "Add Role", "Add Department", "Update Employee Role", "Quit"],
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
        default:
            console.log("You have exited the application");
            connection.end();
            break;
    }
}

function viewEmployees() {
    console.log("Viewing all employees.")
    var query = "SELECT * FROM employees;"
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        // ? prompt with would you like to add an employee? IF yes, do. If no, initQuestions()
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
        // ? prompt with would you like to add a role? IF yes, do. If no, initQuestions()
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
        // ? prompt with would you like to add a department? IF yes, do. If no, initQuestions()

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
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the last name of the person you would like to add as an employee?",
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
        connection.query("SELECT * FROM departments", async (err, departmentResults) => {
            if (err) throw err;
            let myDep = departmentResults.map(function (dep) {
                return {
                    name: dep.dept_name,
                    value: dep.id
                }
            })
            // prompt with - what is the new role, it's salary, and department?
            const { new_role, salary, department } = await inquirer.prompt([
                {
                    name: "new_role",
                    type: "input",
                    message: "What role would you like to add to the list above?",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary amount?",
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department will this role be in?",
                    choices: myDep
                },
            ])
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
            },
        ])
    })
    // take answer and add department into database
}


const updateEmployeeRole = async () => {
    // show table of employees, their titles,departments, and managers
    var query = "SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id"
    connection.query(query, async (err, employeeResults) => {
        if (err) throw err;
        console.table(employeeResults);
        connection.query("SELECT * FROM roles", async (err, roleResults) => {
            if (err) throw err;
            // prompt with - which employee, and role?
            const { whichEmployee, } = await inquirer.prompt([
                {
                    name: "whichEmployee",
                    type: "list",
                    message: "Which employee would you like to update? (choose by id)",
                    choices: employeeResults.map((employeeResult) => employeeResult.id)
                },
                {
                    name: "whatRole",
                    type: "list",
                    message: "What role would you like to update that employee to?",
                    choices: roleResults.map((roleResult) => roleResult.title)
                },
            ])
        })
    })
}