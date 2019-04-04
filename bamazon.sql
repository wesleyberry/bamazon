DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL,
    product_sales INTEGER(50) DEFAULT 0
);
CREATE TABLE departments(
	department_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs INTEGER NOT NULL
);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("bananas", "produce", 1.00, 50),
("antifreeze", "automotive", 20.00, 20),
("boxing gloves", "athletic", 25.00, 10),
("coffee", "essentials", 8.00, 1000),
("vapes", "contraceptives", 10.00, 3),
("key lime pies", "dairy", 12.00, 4),
("Parkway Drive Horizons", "awesome", 10.00, 500),
("athletic tape", "athletic", 5.00, 80),
("whey", "essentials", 50.00, 20),
("scrunchies", "fashion", 1.00, 12);

INSERT INTO departments(department_name, over_head_costs)
VALUES("fashion", 15000),
	("essentials", 20000),
    ("athletic", 25000),
    ("awesome", 20000),
    ("dairy", 10000),
    ("contraceptives", 8000),
    ("automotive", 35000),
    ("produce", 5000);
SELECT * FROM products;
SELECT * FROM departments;