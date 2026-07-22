CREATE DATABASE IF NOT EXISTS employee_db;
 
USE employee_db;
 
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    department VARCHAR(100)
);
 
INSERT INTO employees (name,email,department)
VALUES
('Arun','arun@gmail.com','DevOps'),
('Kumar','kumar@gmail.com','Cloud');
has context menu
