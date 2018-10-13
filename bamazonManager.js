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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Item"]
        }])
        .then(function (answer) {
            if (answer.command === "View Products for Sale") {
                listProducts();
            } else if (answer.command === "View Low Inventory") {
                lowInventory();
            } else if (answer.command === "Add to Inventory") {
                addInventory();
            } else {
                newItem();
            }
        })
}

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
        name: "shop",
        message: "Welcome to Bamazon! What item number you like to buy?"
    },
    {
        type: "input",
        name: "count",
        message: "How many would you like to buy?"
    },
])
.then(function (answer) {
    connection.query("SELECT * FROM products WHERE ?", {
        item_id: answer.shop
    }, function (err, res) {

        chosenItem.push(
            "Product: " +
            res[0].product_name +
            " || Department: " +
            res[0].department_name +
            " || Price: " +
            res[0].price +
            " || In-Stock: " +
            res[0].stock_quantity
        );

        console.log("You have chosen to buy " + answer.count + " " + res[0].product_name + " from the " + res[0].department_name + " department at a price of $" + res[0].price + " each");

        var total = parseFloat(answer.count * res[0].price).toFixed(2);
        if (answer.count > res[0].stock_quantity) {
            console.log("Sorry, we don't have enough " + res[0].product_name + " in stock. We only have " + res[0].stock_quantity + " available.")
            keepShopping();
        } else {
            console.log("You purchased " + answer.count + " " + res[0].product_name + "! Your total today is $" + total + ".")
            var newCount = res[0].stock_quantity - answer.count;
            var product = res[0].product_name;
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [{
                        stock_quantity: newCount
                    },
                    {
                        product_name: product
                    }
                ],

            );
            keepShopping();
        }
    })

})
commands();
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
                message: "Ho many are in stock?",
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