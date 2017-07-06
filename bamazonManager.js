var mysql = require("mysql");
var inquirer = require("inquirer");
var ct = require("console.table");

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
        },

    ]).then(function (answers) {

        if (answers.menu === "View Products for Sale") {

            connection.query("SELECT id, product_name, price, stock_quantity FROM products", function (err, res) {
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

            connection.query("SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity <= ?",
                [reorderPoint], function (err, res) {
                    if (err) throw err;

                    var values = [];

                    for (var i = 0; i < res.length; i++) {
                        values.push([res[i].id, res[i].product_name, res[i].price, res[i].stock_quantity]);
                    }

                    console.log("++++++++++++++++++++++++++++++++++++++++"
                        + "\nCurrent Low Inventory at or below the reorder point:"
                        + "\n----------------------------------------");

                    console.table(['ID', 'Product Name', 'Price', 'Stock Quantity'], values);

                    restart();

                });

        } else if (answers.menu === "Add to Inventory") {



        } else if (answers.menu === "Add New Product") {



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


var lookup = {

    "displayProducts": function () {

    },

    "viewLowInventory": function () {

    },

    "addInventory": function () {

    },

    "addProduct": function () {

    }

}
