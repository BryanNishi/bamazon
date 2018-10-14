var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

var chosenItem = [];



connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to the Bamazon Managment Portal");
    commands();
})

function commands() {
    inquirer.prompt([{
            type: "list",
            name: "command",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Change Inventory", "Add New Item", "Exit the Managment Portal"]
        }])
        .then(function (answer) {
            if (answer.command === "View Products for Sale") {
                listProducts();
            } else if (answer.command === "View Low Inventory") {
                lowInventory();
            } else if (answer.command === "Change Inventory") {
                addInventory();
            } else if (answer.command === "Add New Item") {
                newItem();
            } else {
                process.exit();
            }
        })
};

function listProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        var inventory = [];

        for (var i = 0; i < res.length; i++) {
            inventory.push(res[i]);
        }
        console.log("*********************************************Items For Sale**********************************************************");
        console.table(inventory);
        commands();
    });

};

function lowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        var lowInventory = [];

        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 6) {
                lowInventory.push(res[i]);
            }

        }
        console.log("*******************************************Low Inventory Items**********************************************************");
        console.table(lowInventory);

        commands();
    });
};

function addInventory() {
    inquirer.prompt([{
                type: "input",
                name: "add",
                message: "What item number you like to add stock for?"
            },
            {
                type: "input",
                name: "newStock",
                message: "What would you like to set the total stock to?"
            },
        ])
        .then(function (answer) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{
                            stock_quantity: answer.newStock
                        },
                        {
                            item_id: answer.add
                        }
                    ],

                );
                commands();
            })
        };





function newItem() {
    inquirer
        .prompt([{
                name: "product",
                type: "input",
                message: "What is the product name you would like to add?"
            },
            {
                name: "department",
                type: "input",
                message: "What department would you like to place your item in?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price per unit?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "stock",
                type: "input",
                message: "How many are in stock?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?", {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function (err) {
                    if (err) throw err;
                    console.log("You have added your new product successfully!");

                    commands();
                }
            );
        });
};