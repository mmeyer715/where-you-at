// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const util = require('util');
require('dotenv').config();

// connect to db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log('Connected to the ' + process.env.DB_NAME  + ' database!')
);

// TODO: create inquirer functionality
function menuOptions () {
    inquirer.prompt(
        {
            type: 'list',
            pageSize: 15,
            name: 'menu',
            message: 'What would like to do?',
            choices: [
                'I\'m Done',
                'View All Departments',
                'View Department Utilized Budget',
                'Add Department',
                'Delete Department',
                'View All Roles',
                'Add Role',
                'Delete Role',
                'View All Employees',
                'View Employees by Manager',
                'View Employees by Department',
                'Add Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'Delete Employee'
            ]
        }
    )
    .then(function (menuChoice) {
        if (menuChoice.menu === 'I\'m Done') {
            process.exit();
        };
        if (menuChoice.menu === 'View All Departments') {
            viewDepartments();
        };
        if (menuChoice.menu === 'View Department Utilized Budget') {
            viewDepartmentBudget();
        };
        if (menuChoice.menu === 'View All Roles') {
            viewRoles();
        };
        if (menuChoice.menu === 'View All Employees') {
            viewEmployees();
        };
    });
};

/* Department Queries */

// View all Departments
function viewDepartments () {
    const sql = `SELECT * FROM department`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      console.table(rows);
      menuOptions();
    });
};

// View Departments Total Utilized Budget
function viewDepartmentBudget () {

    let array = [];
    
    db.query('SELECT dep_name FROM department', (err, rows) => {
        if (err) {
          throw err;
        }

        Object.keys(rows).forEach(function(key) {
            var row = rows[key];
            array.push(row.dep_name);
        });

        inquirer.prompt(
            {
                type: 'list',
                name: 'departmentBudget',
                message: 'Which department budget would you like to see?',
                choices: array
            }
        )
        .then(function (menuChoice) {
            const sql = `SELECT
                    SUM(salary) AS "Total Utilized Budget"
                 FROM department A, job_role B, employee C 
                 WHERE A.id = B.department_id 
                 AND B.id = C.role_id
                 AND A.dep_name = ?`;
  
            db.query(sql, [menuChoice.departmentBudget], (err, rows) => {
            if (err) {
                throw err;
            }
            console.table(rows);
            menuOptions();
            });
        });
    });
};

// Add Department
function addDepartment (departmentName) {
    const sql = `INSERT INTO department (dep_name)
                 VALUES (?)`
    db.query(sql, [departmentName], (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        menuOptions();
    })

};

// Delete Department
function deleteDepartment (id) {
    const sql = `DELETE FROM department WHERE id = ?`

    db.query(sql, [id], (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        menuOptions();
    });
};

/* Role Queries */

// View all Roles
function viewRoles () {
    const sql = `SELECT * FROM job_role`

    db.query(sql, (err, rows) => {
        if (err) {
         throw err
        }
        console.table(rows);
        menuOptions();
    });
};

// Add Role
function addRole (title, salary, departmentId) {
    const sql = `INSERT INTO job_role (title, salary, department_id)
                 VALUES (?, ?, ?)`
    db.query(sql, [title, salary, departmentId], (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        menuOptions();
    });
};

// Delete Role
function deleteRole (id) {
    const sql = `DELETE FROM job_role WHERE id = ?`

    db.query(sql, [id], (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        menuOptions();
    });
};


/* Employee Queries */

// View all Employees
function viewEmployees () {
    const sql = `SELECT * FROM employee`

    db.query(sql, (err, rows) => {
        if (err) {
         throw err
        }
        console.table(rows);
        menuOptions();
    });
};

// View all Employees by Manager
function viewEmployeeManager (manager) {
    const sql = `SELECT 
	                A.first_name AS "employee_first", 
	                A.last_name AS "employee_last", 
	                B.first_name AS "manager_first", 
	                B.last_name AS "manger_last" 
                FROM employee A, employee B 
                WHERE A.manager_id = B.id 
                AND B.id = ?`

    db.query(sql, [manager], (err, rows) => {
        if (err) {
         throw err
        }
        console.table(rows);
        menuOptions();
    });
};

// View all Employees by Department
function viewEmployeeDepartment (department) {
    const sql = `SELECT 
	                A.first_name AS "employee_first", 
	                A.last_name AS "employee_last", 
	                B.title, 
	                C.dep_name 
                FROM employee A, job_role B, department C 
                WHERE A.role_id = B.id 
                AND B.department_id = C.id 
                AND C.dep_name = ?`

    db.query(sql, [department], (err, rows) => {
        if (err) {
         throw err
        }
        console.table(rows);
        menuOptions();
    });
};

// Add Employee
function addEmployee (firstName, lastName, roleId, managerId) {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                 VALUES (?, ?, ?, ?)`
    
    db.query(sql, [firstName, lastName, roleId, managerId], (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        menuOptions();
    });

};

// Update Employee Role
function updateEmployee (employeeId, role) {
    const sql = `UPDATE employee 
                 SET role_id = ?
                 WHERE id = ?`

    db.query(sql, [employeeId, role], (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        menuOptions();
    });
};

// Update Manager ID
function updateEmployee (employeeId, managerId) {
    const sql = `UPDATE employee 
                 SET manager_id = ?
                 WHERE id = ?`

    db.query(sql, [employeeId, managerId], (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        menuOptions();
    });
};

// Delete Employee
function deleteEmployee (id) {
    const sql = `DELETE FROM employee WHERE id = ${id}`

    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        menuOptions();
    });
};

/* Inquirer List Builder */
async function buildListChoices (column, table) {
    const sql = `SELECT ${column} FROM ${table}`;
    let array = [];
  
    const query = util.promisify(db.query).bind(db);

    try{
        const result = await query(sql);
        Object.keys(result).forEach(function(key) {
            var row = result[key];
            array.push(row[column]);
        });
        return array;

    } catch (error){
        console.log(error);
        return [];
    } finally {
        db.end();
    }
}

async function InitialProcess() {
    var DbResult = await buildListChoices('dep_name', 'department');
    return DbResult;
}

// Start App
menuOptions();
