// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const util = require('util');
require('dotenv').config();
const queries = require('./db/constants');



//connect to db
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
        if (menuChoice.menu === 'View Employees by Manager') {
            viewEmployeeByManager();
        };
        if (menuChoice.menu === 'View Employees by Department') {
            viewEmployeeDepartment();
        };
        if (menuChoice.menu === 'Add Employee') {
            addEmployee();
        };
        if (menuChoice.menu === 'Update Employee Role') {
            updateEmployeeRole();
        };
        if (menuChoice.menu === 'Update Employee Manager') {
            updateEmployeeManager();
        };
        if (menuChoice.menu === 'Delete Employee') {
            deleteEmployee();
        };
    });
};

/* Department Queries */

// View all Departments
function viewDepartments () {
    const sql = queries.departmentQueries.VIEW_DEPTS;
  
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
    let sql = queries.departmentQueries.VIEW_DEPTS;

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
                pageSize: array.length,
                choices: array
            }
        )
        .then(function (menuChoice) {
            sql = queries.departmentQueries.VIEW_DEPT_BUDGET;
  
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
        const sql = queries.departmentQueries.ADD_DEPT;
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
function deleteDepartment () {

    let array = [];
    let sql = queries.departmentQueries.VIEW_DEPTS;

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
                pageSize: array.length,
                choices: array
            }
        )
        .then(function (menuChoice) {
            sql = queries.departmentQueries.DEL_DEPT;

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
    const sql = queries.roleQueries.VIEW_ROLES;

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
    let sql = queries.departmentQueries.VIEW_DEPTS;

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
                pageSize: array.length,
                choices: array
            }
        ])
        .then(function (menuChoice) {
            let depId = 0;

            sql = queries.departmentQueries.GET_DEPT_ID;
            db.query(sql, [menuChoice.department], (err, rows) => {
                if (err) {
                    throw err;
                }
                depId = rows[0].id;
                console.log(depId);

                sql = queries.roleQueries.ADD_ROLE;
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
    let sql = queries.roleQueries.GET_ROLE_ID;

    db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }

        Object.keys(rows).forEach(function(key) {
            var row = rows[key];
            array.push(row.role);
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
            sql = queries.roleQueries.DEL_ROLES;

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
    const sql = queries.employeeQueries.VIEW_EMPLOYEES;

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
	let sql = queries.employeeQueries.GET_EMPLOYEES;
	
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
                pageSize: array.length,
				choices: array
			}
		)
		.then(function (menuChoice) {
			const nameSplit = menuChoice.employeeByManager.split(' ');
			sql = queries.employeeQueries.VIEW_BY_MANAGER;
				
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
	let sql = queries.departmentQueries.VIEW_DEPTS;
	
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
                pageSize: array.length,
				choices: array
			}
		)
		.then(function (menuChoice) {
			sql = queries.employeeQueries.VIEW_BY_DEPT;
				
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
function addEmployee () {

     // Select Title
    let titleArray = [];
    let sql = queries.roleQueries.GET_ROLE_ID;

    db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }

        Object.keys(rows).forEach(function(key) {
            var row = rows[key];
            titleArray.push(row.role);
        });

        titleArray.push("NONE")

        // Select Manager
        let managerArray = [];
        sql = queries.employeeQueries.GET_EMPLOYEES;

        db.query(sql, (err, rows) => {
            if (err) {
            throw err;
            }

            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                managerArray.push(row.employeeName);
            });

            managerArray.push("NONE")

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Input employee\'s first name:'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Input employee\'s last name:'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Choose employee\'s role:',
                    pageSize: titleArray.length,
                    choices: titleArray
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Choose employee\'s manager:',
                    pageSize: managerArray.length,
                    choices: managerArray
                }
            ])
            .then(function (menuChoice) {
                
                let roleID = null;
                if(menuChoice.role != 'NONE'){
                    const roleChoice = menuChoice.role.split(' ');
                    roleID = roleChoice[0];
                }
                
                let manID = null;
                if(menuChoice.manager != 'NONE'){
                    const manChoice = menuChoice.manager.split(' ');
                    manID = manChoice[0];
                }
                
                const sql = queries.employeeQueries.ADD_EMPLOYEES;
            
                db.query(sql, [menuChoice.firstName, menuChoice.lastName, roleID, manID], (err, rows) => {
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

// Update Employee Role
function updateEmployeeRole () {
    let employeeArray = [];
    let sql = queries.employeeQueries.GET_EMPLOYEES;
	
	db.query(sql, (err, rows) => {
		if (err) {
			throw err;
		}
		
		Object.keys(rows).forEach(function(key) {
			var row = rows[key];
			employeeArray.push(row.employeeName);
		});

        let roleArray = [];
        sql = queries.roleQueries.GET_ROLE_ID;
        db.query(sql, (err, rows) => {
            if (err) {
            throw err;
            }

            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                roleArray.push(row.role);
            });

            roleArray.push("NONE")

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Choose employee:',
                    pageSize: employeeArray.length,
                    choices: employeeArray
                },
                {
                    type: 'list',
                    name: 'newRole',
                    message: 'Choose employee\'s new role:',
                    pageSize: roleArray.length,
                    choices: roleArray
                }
            ])
            .then(function (menuChoice) {
                const employeeName = menuChoice.employee.split(' ');
                let roleID = null;
                if(menuChoice.role != 'NONE'){
                    const roleChoice = menuChoice.newRole.split(' ');
                    roleID = roleChoice[0];
                }
                sql = queries.employeeQueries.UPDATE_EMPLOYEE_ROLE;

                db.query(sql, [roleID, employeeName[0]], (err, rows) => {
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

// Update Manager ID
function updateEmployeeManager () {
    
    let employeeArray = [];
    let sql = queries.employeeQueries.GET_EMPLOYEES;
	
	db.query(sql, (err, rows) => {
		if (err) {
			throw err;
		}
		
		Object.keys(rows).forEach(function(key) {
			var row = rows[key];
			employeeArray.push(row.employeeName);
		});

        let manArray = [];

        db.query(sql, (err, rows) => {
            if (err) {
            throw err;
            }

            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                manArray.push(row.employeeName);
            });

            manArray.push("NONE")

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Choose employee:',
                    pageSize: employeeArray.length,
                    choices: employeeArray
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Choose employee\'s new manager:',
                    pageSize: manArray.length,
                    choices: manArray
                }
            ])
            .then(function (menuChoice) {
                const employeeName = menuChoice.employee.split(' ');
                let manID = null;
                if(menuChoice.manager != 'NONE'){
                    const manChoice = menuChoice.manager.split(' ');
                    manID = manChoice[0];
                }
                const sql = queries.employeeQueries.UPDATE_EMPLOYEE_MANAGER;

                db.query(sql, [manID, employeeName[0]], (err, rows) => {
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

// Delete Employee
function deleteEmployee () {

    let array = [];
    let sql = queries.employeeQueries.GET_EMPLOYEES;

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
            sql = queries.employeeQueries.DEL_EMPLOYEE;
            
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