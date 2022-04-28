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

// Get all departments
// db.query(`SELECT * FROM department`, (err, rows) => {
//   console.log(rows);
// });

// Get all roles
// db.query(`SELECT * FROM job_role`, (err, rows) => {
//   console.log(rows);
// });

//Get all employees
// db.query(`SELECT * FROM employee`, (err, rows) => {
//   console.log(rows);
// });