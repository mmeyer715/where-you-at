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

// Base Inquirer Question
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

        // Exit From Program
        if (menuChoice.menu === 'I\'m Done') {
            process.exit();
        };

        // Department Options
        if (menuChoice.menu === 'View All Departments') {
            viewDepartments();
        };
        if (menuChoice.menu === 'View Department Utilized Budget') {
            viewDepartmentBudget();
        };
        if (menuChoice.menu === 'Add Department') {
            addDepartment();
        };
        if (menuChoice.menu === 'Delete Department') {
            deleteDepartment();
        };
    
        // Roles Options
        if (menuChoice.menu === 'View All Roles') {
            viewRoles();
        };
        if (menuChoice.menu === 'Add Role') {
            addRole();
        };
        if (menuChoice.menu === 'Delete Role') {
            deleteRole();
        };

        // Employee Options
        if (menuChoice.menu === 'View All Employees') {
            viewEmployees();
        };
        if (menuChoice.menu === 'Delete Employee') {
            deleteEmployee();
        };
        if (menuChoice.menu === 'View Employees by Manager') {
            viewEmployeeByManager();
        };
        if (menuChoice.menu === 'View Employees by Department') {
            viewEmployeeDepartment();
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
    let sql = 'SELECT dep_name FROM department';

    db.query(sql, (err, rows) => {
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
            sql = `SELECT
                    IFNULL(SUM(salary), 0) AS "Total Utilized Budget"
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
function addDepartment () {

    inquirer.prompt(
        {
            type: 'input',
            name: 'name',
            message: 'Input new department name:'
        }
    )
    .then(function (menuChoice) {
        const sql = `INSERT IGNORE INTO department (dep_name)
                 VALUES (?)`
        db.query(sql, [menuChoice.name], (err, rows) => {
            if (err) {
                throw err;
            }
            console.table(rows);
            menuOptions();
        });
    });
};

// Delete Department
function deleteDepartment (id) {

    let array = [];
    let sql = 'SELECT dep_name FROM department';

    db.query(sql, (err, rows) => {
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
                name: 'department',
                message: 'Which department would you like to remove?',
                choices: array
            }
        )
        .then(function (menuChoice) {
            sql = `DELETE FROM department WHERE dep_name = ?`

            db.query(sql, [menuChoice.department], (err, rows) => {
                if (err) {
                    throw err;
                }
                console.table(rows);
                menuOptions();
            });
        });
    });
};

/* Role Queries */

// View all Roles
function viewRoles () {
    const sql = `SELECT 
                    A.id,
                    A.title,
                    A.salary,
                    B.dep_name
                 FROM job_role A
                 LEFT JOIN department B
                 ON A.department_id = B.id`

    db.query(sql, (err, rows) => {
        if (err) {
         throw err
        }
        console.table(rows);
        menuOptions();
    });
};

// Add Role
function addRole () {

    let array = [];
    let sql = 'SELECT dep_name FROM department';

    db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }

        Object.keys(rows).forEach(function(key) {
            var row = rows[key];
            array.push(row.dep_name);
        });

        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Input role title:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Input salary:'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Choose a department:',
                choices: array
            }
        ])
        .then(function (menuChoice) {
            let depId = 0;

            sql = `SELECT id FROM department
                   WHERE dep_name = ?`
            db.query(sql, [menuChoice.department], (err, rows) => {
                if (err) {
                    throw err;
                }
                depId = rows[0].id;
                console.log(depId);

                sql = `INSERT INTO job_role (title, salary, department_id)
                 VALUES (?, ?, ?)`
                db.query(sql, [menuChoice.title, menuChoice.salary, depId], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.table(rows);
                    menuOptions();
                });
            });
        });
    });
};

// Delete Role
function deleteRole () {

    let array = [];
    let sql = `SELECT CONCAT(
                   A.id, ' ', 
                   A.title, ' ', 
                   A.salary, ' ',
                   B.dep_name) AS "roles" 
               FROM job_role A, department B 
               WHERE A.department_id = B.id`;

    db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }

        Object.keys(rows).forEach(function(key) {
            var row = rows[key];
            array.push(row.roles);
        });

        inquirer.prompt(
            {
                type: 'list',
                name: 'role',
                message: 'Which role would you like to remove?',
                choices: array
            }
        )
        .then(function (menuChoice) {

            const nameSplit = menuChoice.role.split(' ');
            sql = `DELETE FROM job_role WHERE id = ?`

            db.query(sql, [nameSplit[0]], (err, rows) => {
                if (err) {
                    throw err;
                }
                console.table(rows);
                menuOptions();
            });
        });
    });
};

/* Employee Queries */

// View all Employees
function viewEmployees () {
    const sql = `SELECT 
                    A.id AS "employee_ID",
                    A.first_name AS "employee_first", 
                    A.last_name AS "employee_last",
                    C.title AS "employee_role",
                    D.dep_name AS "department",
                    B.id AS "manager_ID", 
                    B.first_name AS "manager_first", 
                    B.last_name AS "manger_last" 
                FROM employee A, employee B, job_role C, department D
                WHERE A.manager_id = B.id 
                AND A.role_id = C.id
                OR A.role_id is NULL
                AND C.department_id = D.id`

    db.query(sql, (err, rows) => {
        if (err) {
         throw err
        }
        console.table(rows);
        menuOptions();
    });
};

// View all Employees by Manager
function viewEmployeeByManager () {
	
	let array = [];
	let sql = `SELECT CONCAT(id, ' ', first_name, ' ' ,last_name) AS employeeName FROM employee `;
	
	db.query(sql, (err, rows) => {
		if (err) {
			throw err;
		}
		
		Object.keys(rows).forEach(function(key) {
			var row = rows[key];
			array.push(row.employeeName);
		});
		
		inquirer.prompt(
			{
				type: 'list',
				name: 'employeeByManager',
				message: 'Which manager do you want to view employees from?',
				choices: array
			}
		)
		.then(function (menuChoice) {
			const nameSplit = menuChoice.employeeByManager.split(' ');
			sql = `SELECT 
	                A.first_name AS "employee_first", 
	                A.last_name AS "employee_last", 
	                B.first_name AS "manager_first", 
	                B.last_name AS "manager_last" 
                FROM employee A, employee B 
                WHERE A.manager_id = B.id 
                AND B.id = ?`;
				
			db.query(sql, [nameSplit[0]], (err, rows) => {
			if (err) {
				throw err;
			}
			console.table(rows);
			menuOptions();
			});
		});
	});
};

// View all Employees by Department
function viewEmployeeDepartment () {
	
	let array = [];
	let sql = 'SELECT dep_name FROM department';
	
	db.query(sql, (err, rows) => {
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
				name: 'departmentEmployees',
				message: 'Which department do you want to view employees from?',
				choices: array
			}
		)
		.then(function (menuChoice) {
			sql = `SELECT 
	                A.first_name AS "employee_first", 
	                A.last_name AS "employee_last", 
	                B.title, 
	                C.dep_name 
                FROM employee A, job_role B, department C 
                WHERE A.role_id = B.id 
                AND B.department_id = C.id 
                AND C.dep_name = ?`;
				
			db.query(sql, [menuChoice.departmentEmployees], (err, rows) => {
			if (err) {
				throw err;
			}
			console.table(rows);
			menuOptions();
			});
		});
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
function updateEmployeeManager (employeeId, managerId) {
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
function deleteEmployee () {

    let array = [];
    let sql = `SELECT CONCAT(id, ' ', first_name, ' ' ,last_name) AS employeeName FROM employee `;

    db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }

        Object.keys(rows).forEach(function(key) {
            var row = rows[key];
            array.push(row.employeeName);
            console.log(row.employeeName);
        });

        inquirer.prompt(
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to remove?',
                choices: array
            }
        )
        .then(function (menuChoice) {
            const nameSplit = menuChoice.employee.split(' ');
            sql = `DELETE FROM employee WHERE id = ?`
            
            db.query(sql, nameSplit[0], (err, rows) => {
                if (err) {
                    throw err;
                }
                console.table(rows);
                menuOptions();
            });
        });
     });
};

// Start App
menuOptions();
