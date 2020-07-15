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
        // ? prompt with would you like to add an employee? IF yes, do. If no, initQuestions()
        initQuestions();
    })
}


    
function viewRoles() {
    console.log("Viewing all employee roles.")
    var query = "SELECT * FROM roles;"
    connection.query(query, function(err, res) {
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
    connection.query(query, function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        // ? prompt with would you like to add a department? IF yes, do. If no, initQuestions()
    
        initQuestions();
    })
}

const addEmployee = async () => {
    // query database for list of current roles
    connection.query("SELECT * FROM roles", async (err, roleResults) => {
        if (err) throw err;
        connection.query("SELECT * FROM roles", async (err, roleResults) => {
            if (err) throw err;
            // prompt with - what is the first name, last name, employee role, and employee manager?
            const { first_name, last_name, employee_role, employee_manager } = await inquirer.prompt([
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
                    name: "employee_role",
                    type: "list",
                    message: "What will the person's role be?",
                    choices: roleResults.map((departmentResult) => departmentResult.dept_name)
                },
                // {
                //     name: "employee_manager",
                //     type: "list",
                //     message: "Who will the person's manager be?",
                //     choices: 
                // },
            ])
        })
    })
    // take answers and add employee into database
}



const addRole = async () => {
    // query database for list of current roles and salaries
    connection.query("SELECT * FROM roles", async (err, roleResults) => {
        if (err) throw err;
        console.table(roleResults);
        connection.query("SELECT * FROM departments", async (err, departmentResults) => {
            if (err) throw err;
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
                    choices: departmentResults.map((departmentResult) => departmentResult.dept_name)
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


// function bidAuction() {
//     // query the database for all items being auctioned
//     connection.query("SELECT * FROM auctions", function(err, results) {
//       if (err) throw err;
//       // once you have the items, prompt the user for which they'd like to bid on
//       inquirer
//         .prompt([
//           {
//             name: "choice",
//             type: "rawlist",
//             choices: function() {
//               var choiceArray = [];
//               for (var i = 0; i < results.length; i++) {
//                 choiceArray.push(results[i].item_name);
//               }
//               return choiceArray;
//             },
//             message: "What auction would you like to place a bid in?"
//           },
//           {
//             name: "bid",
//             type: "input",
//             message: "How much would you like to bid?"
//           }
//         ])
//         .then(function(answer) {
//           // get the information of the chosen item
//           var chosenItem;
//           for (var i = 0; i < results.length; i++) {
//             if (results[i].item_name === answer.choice) {
//               chosenItem = results[i];
//             }
//           }
  
//           // determine if bid was high enough
//           if (chosenItem.highest_bid < parseInt(answer.bid)) {
//             // bid was high enough, so update db, let the user know, and start over
//             connection.query(
//               "UPDATE auctions SET ? WHERE ?",
//               [
//                 {
//                   highest_bid: answer.bid
//                 },
//                 {
//                   id: chosenItem.id
//                 }
//               ],
//               function(error) {
//                 if (error) throw err;
//                 console.log("Bid placed successfully!");
//                 start();
//               }
//             );
//           }
//           else {
//             // bid wasn't high enough, so apologize and start over
//             console.log("Your bid was too low. Try again...");
//             start();
//           }
//         });
//     });
//   }
  


// addRole()

// addDepartment()

// updateEmployeeRole()