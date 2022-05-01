const departmentQueries = {
	VIEW_DEPTS: `SELECT dep_name FROM department`,
	VIEW_DEPT_BUDGET: `SELECT
                    IFNULL(SUM(salary), 0) AS "Total Utilized Budget"
                   FROM department A, job_role B, employee C 
                   WHERE A.id = B.department_id 
                   AND B.id = C.role_id
                   AND A.dep_name = ?`,
   ADD_DEPT: `INSERT IGNORE INTO department (dep_name)
                 VALUES (?)`,
   DEL_DEPT: `DELETE FROM department WHERE dep_name = ?`,
   GET_DEPT_ID: `SELECT id FROM department
                   WHERE dep_name = ?`
};

const roleQueries = {
	VIEW_ROLES: `SELECT 
                    A.id,
                    A.title,
                    A.salary,
                    B.dep_name
                 FROM job_role A
                 LEFT JOIN department B
                 ON A.department_id = B.id`,
	ADD_ROLE: `INSERT INTO job_role (title, salary, department_id)
                 VALUES (?, ?, ?)`,
	GET_ROLE_ID: `SELECT CONCAT(id, ' ', title) AS "role" FROM job_role`,
    DEL_ROLES: `DELETE FROM job_role WHERE id = ?`
}

const employeeQueries = {
	VIEW_EMPLOYEES: `SELECT 
                    A.id AS "employee_ID",
                    A.first_name AS "employee_first", 
                    A.last_name AS "employee_last",
                    C.title AS "employee_role",
                    D.dep_name AS "department",
                    B.id AS "manager_ID", 
                    B.first_name AS "manager_first", 
                    B.last_name AS "manger_last"
                FROM employee A
                LEFT JOIN employee B
                ON A.manager_id = B.id
                LEFT JOIN job_role C
                ON A.role_id = C.id
                LEFT JOIN department D
                ON C.department_id = D.id`,
	VIEW_BY_MANAGER: `SELECT 
	                A.first_name AS "employee_first", 
	                A.last_name AS "employee_last", 
	                B.first_name AS "manager_first", 
	                B.last_name AS "manager_last" 
                FROM employee A, employee B 
                WHERE A.manager_id = B.id 
                AND B.id = ?`,
	VIEW_BY_DEPT: `SELECT 
	                A.first_name AS "employee_first", 
	                A.last_name AS "employee_last", 
	                B.title, 
	                C.dep_name 
                FROM employee A, job_role B, department C 
                WHERE A.role_id = B.id 
                AND B.department_id = C.id 
                AND C.dep_name = ?`,
	GET_EMPLOYEES: `SELECT CONCAT(id, ' ', first_name, ' ' ,last_name) AS employeeName FROM employee `,
	ADD_EMPLOYEES: `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`,
	UPDATE_EMPLOYEE_ROLE: `UPDATE employee 
                    SET role_id = ?
                    WHERE id = ?`,
	UPDATE_EMPLOYEE_MANAGER: `UPDATE employee 
                    SET manager_id = ?
                    WHERE id = ?`,
	DEL_EMPLOYEE: `DELETE FROM employee WHERE id = ?`
}

module.exports = {departmentQueries, roleQueries, employeeQueries};