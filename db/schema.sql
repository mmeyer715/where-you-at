DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dep_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE job_role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) ,
  role_id INTEGER,
  manager_id INTEGER, 
  FOREIGN KEY(role_id) REFERENCES job_role(id)
    ON DELETE SET NULL, 
  FOREIGN KEY(manager_id) REFERENCES employee(id)
    ON DELETE SET NULL
);