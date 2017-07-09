var mysql = require("mysql");
var inquirer = require("inquirer");
var ct = require("console.table");

//cli-table	

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
});


var start = function () {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "++++++++++++++++++++++++++++++++++++++++"
            + "\nBamazon Management Portal"
            + "\nWhat task do you need to perform?"
            + "\n++++++++++++++++++++++++++++++++++++++++++",
            choices: ["View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"]
        }

    ]).then(function (answers) {

        if (answers.menu === "View Products for Sale") {
            var query = "SELECT id, product_name, price, stock_quantity FROM products";
            connection.query(query, function (err, res) {
                if (err) throw err;

                var values = [];

                for (var i = 0; i < res.length; i++) {
                    values.push([res[i].id, res[i].product_name, res[i].price, res[i].stock_quantity]);
                }

                console.log("++++++++++++++++++++++++++++++++++++++++"
                    + "\nCurrent Inventory:"
                    + "\n----------------------------------------");

                console.table(['ID', 'Product Name', 'Price', 'Stock Quantity'], values);

                restart();

            });

        } else if (answers.menu === "View Low Inventory") {

            var reorderPoint = 5;
            var query = "SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity <= ?";
            connection.query(query, [reorderPoint], function (err, res) {
                if (err) throw err;

                var values = [];

                if (res.length == 0) {
                    console.log("++++++++++++++++++++++++++++++++++++++++"
                        + "\nThere is currently no inventory at or below the reorder point"
                        + "\n----------------------------------------");
                } else {

                    for (var i = 0; i < res.length; i++) {
                        values.push([res[i].id, res[i].product_name, res[i].price, res[i].stock_quantity]);
                    }

                    console.log("++++++++++++++++++++++++++++++++++++++++"
                        + "\nCurrent Low Inventory at or below the reorder point:"
                        + "\n----------------------------------------");

                    console.table(['ID', 'Product Name', 'Price', 'Stock Quantity'], values);
                }

                restart();

            });

        } else if (answers.menu === "Add to Inventory") {
            var query = "SELECT id, stock_quantity FROM products";
            connection.query(query, function (err, res) {
                if (err) throw err;

                var productIDs = [];

                for (var i = 0; i < res.length; i++) {
                    productIDs.push(String(res[i].id));
                }

                //addInventory(productIDs);


                inquirer.prompt([
                    {
                        type: "list",
                        name: "item",
                        message: "Which item would you like to make a new order for?",
                        choices: productIDs
                    },
                    {
                        type: "input",
                        name: "quantity",
                        message: "How many units would you like to order for inventory?"
                    }

                ]).then(function (answers) {

                    var itemID = answers.item;
                    var orderQuantity = answers.quantity;

                    var query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?"
                    connection.query(query, [orderQuantity, itemID], function (err, res) { });

                    console.log(orderQuantity + " units of Item " + itemID + " successfully ordered");

                    restart();
                })

            })

        } else if (answers.menu === "Add New Product") {
            
            inquirer.prompt([

                {
                    type: "input",
                    name: "product",
                    message: "What is the name of the new product?"
                },
                {
                    type: "input",
                    name: "department",
                    message: "Which department will this product be under?"
                },
                {
                    type: "input",
                    name: "price",
                    message: "What will be the price of this new product?"
                },
                {
                    type: "input",
                    name: "quantity",
                    message: "How many units would you like to order for inventory?"
                }

            ]).then(function (answers) {

                var productName = answers.product;
                var productDep = answers.department;
                var productPrice = answers.price;
                var productQuant = answers.quantity;

                connection.query("INSERT INTO products SET ?", {
                    product_name: productName,
                    department_name: productDep,
                    price: productPrice,
                    stock_quantity: productQuant
                }, function (err, res) { });


                console.log("++++++++++++++++++++++++++++++++++++++++"
                    + "\nProduct Successfully added!"
                    + "\n----------------------------------------");

                restart();



            })

        }

    })
}

start();

var restart = function () {

    inquirer.prompt([
        {
            type: "confirm",
            name: "restart",
            message: "Would you like to perform another task?"
        }

    ]).then(function (answers) {
        if (answers.restart) {
            start();
        }

    })
}

function addInventory(productIDs) {

}

