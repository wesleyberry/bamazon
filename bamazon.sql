DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL
);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("banana", "produce", 1.00, 50),
("antifreeze", "automotive", 20.00, 20),
("boxing gloves", "athletic", 25.00, 10),
("coffee", "essentials", 8.00, 1000),
("vape", "contraceptives", 10.00, 5),
("key lime pie", "dairy", 12.00, 40),
("Parkway Drive Horizons", "awesome", 10.00, 500),
("athletic tape", "athletic", 5.00, 80),
("whey", "essentials", 50.00, 20),
("scrunchy", "fashion", 1.00, 12);

SELECT * FROM products;