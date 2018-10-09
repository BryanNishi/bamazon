var mysql = require("mysql");

var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});




connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to Bamazon!");
    listProducts();
})


function listProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        var inventory = [];
        for (var i = 0; i < res.length; i++) {
            inventory.push(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log(inventory);
        shopping();
    });

}

function shopping() {
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
                var chosenItem = []
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
                console.log("You have chosen to buy " + answer.count + " " + res[0].product_name + " from the " + res[0].department_name + " department at a price of " + res[0].price + " each");

                var total = answer.count * res[0].price;
                if (answer.count > res[0].stock_quantity) {
                    console.log("Sorry, we don't have enough " + res[0].product_name + " in stock. We only have " + res[0].stock_quantity + " available.")
                    keepShopping();
                } else {
                    console.log("You purchased " + answer.count + " " + res[0].product_name + "! Your total today is " + total + ".")
                    var newCount = res[0].stock_quantity - answer.count;
                    // connection.query(
                    //     "UPDATE products SET ? WHERE ?",
                    //     [
                    //       {
                    //         stock_quantity: newCount
                    //       },
                    //       {
                    //         id: chosenItem.id
                    //       }
                    //     ],
                    //     console.log(res[0].stock_quantity)
                    //   );
                    keepShopping();
                }
            })

        })
};

function keepShopping() {
    inquirer.prompt([{
                type: "list",
                name: "continue",
                message: "Would you like to keep shopping?",
                choices: ["Yes!", "No"]
            }

        ])
        .then(function (answer) {
            if (answer.continue === "Yes!") {
                listProducts();
            } else {
                process.exit();
            }
        })
};