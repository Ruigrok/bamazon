DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	id INTEGER(11) auto_increment NOT NULL primary key,
	product_name VARCHAR(38) NOT NULL,
    department_name VARCHAR(38),
	price INTEGER(10),
    stock_quantity INTEGER(10)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Item 1", "A", 10, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Item 2", "A", 20, 90);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Item 3", "A", 30, 80);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Item 4", "A", 40, 70);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Item 5", "B", 50, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Item 6", "B", 60, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Item 7", "C", 70, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Item 8", "D", 80, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Item 9", "D", 90, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Item 10", "D", 100, 10);