INSERT INTO department (dep_name)
VALUES
    ('Customer Service'),
    ('Financing'),
    ('Warehouse'),
    ('Retail');

INSERT INTO job_role (title, salary, department_id)
VALUES
    ('Manager', 85000.00, 1),
    ('Employee Relations', 70000.00, 3),
    ('Picker', 45000.00, 2),
    ('Cashier', 25000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Lucas', 'Zimmerman', 1, NULL),
    ('Maria', 'Meyer', 2, 1),
    ('Zachary', 'Meyer', 4, 2),
    ('Cora', 'Bean', 3, 1),
    ('Zayne', 'Nguyen', 2, 1);

-- UPDATE employee SET manager_id = 2 WHERE id = 1;

-- UPDATE employee SET manager_id = 1 WHERE id = 2;

-- UPDATE employee SET manager_id = 2 WHERE id = 3;

-- UPDATE employee SET manager_id = 5 WHERE id = 4;
