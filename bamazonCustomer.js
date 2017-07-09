var mysql = require("mysql");
var inquirer = require("inquirer");
var ct = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
});


var productIDs = [];

var itemID;
var orderQuantity;
var currentQuantity;
var newQuantity;

var start = function () {
    connection.query("SELECT id, product_name, price FROM products", function (err, res) {
        if (err) throw err;

        var values = [];

        for (var i = 0; i < res.length; i++) {
            values.push([res[i].id, res[i].product_name, res[i].price]);
        }

        console.log("++++++++++++++++++++++++++++++++++++++++"
            + "\nWelcome to Bamazon!"
            + "\n++++++++++++++++++++++++++++++++++++++++"
            + "\nThese are the items we currently have for sale:"
            + "\n----------------------------------------");

        console.table(['ID', 'Product Name', 'Price'], values);

        for (var i = 0; i < res.length; i++) {
            productIDs.push(String(res[i].product_name));
        }

        inquirer.prompt([
            {
                type: "confirm",
                name: "purchase",
                message: "Would you like to make a purchase?"
            }

        ]).then(function (answers) {
            if (answers.purchase) {
                promptPurchase(productIDs);
            } else {
                console.log("++++++++++++++++++++++++++++++++++++++++"
                    + "\nCome back again soon to check our latest offers!"
                    + "\n----------------------------------------");
            }

        })
    });
}

start();

function promptPurchase(productIDs) {
    inquirer.prompt([
        {
            type: "list",
            name: "item",
            message: "Which item would you like to purchase?",
            choices: productIDs
        },
        {
            type: "input",
            name: "quantity",
            message: "How many units would you like to purchase?"
        }

    ]).then(function (answers) {

        var itemID = answers.item;
        var orderQuantity = answers.quantity;

        checkQuantity(itemID, orderQuantity);
    })
}


var checkQuantity = function (itemID, orderQuantity) {

    connection.query('SELECT stock_quantity FROM products WHERE id = ?', [itemID], function (err, res) {
        if (err) throw err;

        var currentQuantity = res[0].stock_quantity

        if (orderQuantity > currentQuantity) {
            console.log("Insufficient quantity!")
        } else {
            fulfillOrder(itemID, orderQuantity, currentQuantity);
        }
    });

}


var fulfillOrder = function (itemID, orderQuantity, currentQuantity) {

    var newQuantity = currentQuantity - orderQuantity;

    connection.query("UPDATE products SET ? WHERE ?", [{
        stock_quantity: newQuantity
    }, {
        id: itemID
    }], function (err, res) { });

    console.log("++++++++++++++++++++++++++++++++++++++++"
        + "\nOrder Filled! " + orderQuantity + " units of Item " + itemID + " purchased"
        + "\n----------------------------------------");

    restart();
}

var restart = function () {

    inquirer.prompt([
        {
            type: "confirm",
            name: "restart",
            message: "Would you like to make another purchase?"
        }

    ]).then(function (answers) {
        if (answers.restart) {
            start();
        } else {
            console.log("++++++++++++++++++++++++++++++++++++++++"
                + "\nCome back again soon to check our latest offers!"
                + "\n----------------------------------------");
        }

    })
}


