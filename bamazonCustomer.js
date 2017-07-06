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
    console.log("connected as id " + connection.threadId);
});


var productIDs = [];

var itemID;
var orderQuantity;
var currentQuantity;
var newQuantity;


connection.query("SELECT id, product_name, price FROM products", function (err, res) {
    if (err) throw err;
    console.log(res);

    var values = [];

    for (var i = 0; i < res.length; i++) {
        values.push([res[i].id, res[i].product_name, res[i].price]);
    }

    console.log("++++++++++++++++++++++++++++++++++++++++"
        + "\nWelcome to Bamazon!"
        + "\n++++++++++++++++++++++++++++++++++++++++"
        + "\nThese are the items we currently have for sale:"
        + "\n----------------------------------------");

    console.table(['id', 'product_name', 'price'], values);

    for (var i = 0; i < res.length; i++) {
        productIDs.push(String(res[i].id));
    }
    //console.log(productIDs);

    var start = function () {
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

    start();

});



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
   console.log(newQuantity);
    connection.query("UPDATE products SET ? WHERE ?", [{
        stock_quantity: newQuantity
    }, {
        id: itemID
    }], function (err, res) { });

    console.log("Order Filled!");

}



