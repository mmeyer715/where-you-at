// required packages
const mysql = require('mysql2');
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

// View departments total utilized budget
function viewDepartmentBudget (department) {
    const sql = `SELECT
                    SUM(salary) AS "Total Utilized Budget"
                 FROM department A, job_role B, employee C 
                 WHERE A.id = B.department_id 
                 AND B.id = C.role_id
                 AND A.dep_name = '${department}'`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      console.table(rows);
      menuOptions();
    });
};

// add department
function addDepartment () {
    const sql = `INSERT INTO department (dep_name)
                 VALUES ('Information Technology')`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        menuOptions();
    })

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

function addRole () {
    const sql = `INSERT INTO job_role (title, salary, department_id)
                 VALUES ('Software Engineer', 90000.00, 1)`
    db.query(sql, (err, rows) => {
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

// View all Employees By Manager
function viewEmployeeManager (manager) {
    const sql = `SELECT 
	                A.first_name AS "employee_first", 
	                A.last_name AS "employee_last", 
	                B.first_name AS "manager_first", 
	                B.last_name AS "manger_last" 
                FROM employee A, employee B 
                WHERE A.manager_id = B.id 
                AND B.id = '${manager}'`

    db.query(sql, (err, rows) => {
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
                AND C.dep_name = '${department}'`

    db.query(sql, (err, rows) => {
        if (err) {
         throw err
        }
        console.table(rows);
        menuOptions();
    });
};
addEmployee();
// Add employee
function addEmployee () {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                 VALUES ('Rommel', 'Villagomez', 5, 1)`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        menuOptions();
    });
};