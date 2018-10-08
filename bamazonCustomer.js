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
});

function listProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
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
        .then(function(answer) {
            connection.query("SELECT * FROM products WHERE ?", { item_id: answer.shop }, function(err, res) {
                console.log(
                  "Product: " +
                    res[0].product_name +
                    " || Department: " +
                    res[0].department_name +
                    " || Price: " +
                    res[0].price +
                    " || In-Stock: " +
                    res[0].stock_quantity
                ); 
        })     
})};