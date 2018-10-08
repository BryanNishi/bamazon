CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NULL,
department_name VARCHAR(100) NULL,
price DECIMAL(10,2) NULL,
stock_quantity DECIMAL(4) NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Towels", "Housewares", 19.99, 291);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sheets", "Housewares", 29.99, 140);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pillows", "Housewares", 9.99, 77);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Silverware", "Kitchenwares", 59.99, 126);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pots", "Kitchenwares", 14.99, 220);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pans", "Kitchenwares", 17.99, 61);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tires", "Automotive", 150.00, 87);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wipers", "Automotive", 13.99, 64);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Oil", "Automotive", 33.99, 96);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("4k TV", "Electronics", 999.99 , 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Playstation 4", "Electronics", 399.99 , 80);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bamazon Alexo", "Electronics", 29.99 , 8971);

SELECT * FROM products