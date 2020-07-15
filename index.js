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
    choices: ["View Employees","View Roles","View Departments","Add Employee","Add Role","Add Department","Update Employee Role","Quit"],
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
    connection.query(query, function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        connection.end();
    })
}


    
// viewRoles()

// viewDepartments()

// addEmployee()

// addRole()

// addDepartment()

// updateEmployeeRole()