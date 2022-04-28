const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    port: 3306,
    host: 'localhost',
    user: 'root',
    database: 'employee_db',
    password: process.env.DB_PASSWORD
});

// optional*
connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log('Connected to Database!');
    menuOptions();
});

function menuOptions () {
    inquirer.prompt({
        type: 'list',
        name: 'menu',
        message: 'What would like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update An Employee role']
    })
    .then(function (menuChoice) {
        if (menuChoice.menu === 'View All Departments') {
            viewDepartments();
        };
        if (menuChoice.menu === 'View All Roles') {
            viewRoles();
        };
        if (menuChoice.menu === 'View All Employees') {
            viewEmployees();
        };
    });
};
// view all departments
function viewDepartments () {
    const sql = `SELECT * FROM department`;
  
    connection.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      console.table(rows);
      menuOptions();
    });
};

function viewRoles () {
    const sql = `SELECT * FROM job_role`

    connection.query(sql, (err, rows) => {
        if (err) {
         throw err
        }
        console.table(rows);
        menuOptions();
    });
};

function viewEmployees () {
    const sql = `SELECT * FROM employee`

    connection.query(sql, (err, rows) => {
        if (err) {
         throw err
        }
        console.table(rows);
        menuOptions();
    });
};

// add department function, inquire prompt-input, take value INSERT INTO seeds ("${}"), connection query- should get err, if no error console.log('success')