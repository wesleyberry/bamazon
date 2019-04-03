var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "aceofspades!1",
    database: "bamazon"
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    introManager();
});
function introManager() {
    inquirer.prompt([
        {
            name: "task",
            type: "list",
            message: "Greetings, manager. Which task are you performing?",
            choices: ["View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"]
        }
    ]).then(function(answer) {
        if(answer.task === "View Products for Sale") {
            viewProducts();
        } else if(answer.task === "View Low Inventory") {
            viewLow();
        } else if(answer.task === "Add to Inventory") {
            addInventory();
        } else if(answer.task === "Add New Product") {
            addNewProduct();
        }
    });
}
function viewProducts() {
    var query = connection.query("SELECT * FROM products", 
        function(err, res) {
            if(err) throw err;
            console.log("id | " + "product |" + "department |" + "price |" + "amount");
            for(var i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            }
        }
    );
    console.log(query.sql);
}
function viewLow() {
    var query = connection.query("SELECT * FROM products WHERE stock_quantity<?", 
    [5],
    function(err, res) {
        if(err) throw err;
        console.log("These are the items are near complete depletion:\n");
        for(var i = 0; i < res.length; i++) {
        console.log(i+1 + ") " + res[i].product_name);
        }
    });
}
function addInventory() {
    var items = [];
    var query = connection.query("SELECT * FROM products",
    function(err, res) {
        if(err) throw err;
        for(var i = 0; i < res.length; i ++) {
            // console.log(res[i].product_name);
            items.push(res[i].product_name);
        }
        // console.log(items);
    });
    inquirer.prompt([
        {
            name: "productChoice",
            type: "list",
            message: "Which product would you like to replenish?\n",
            choices: [items]
        },
        {
            name: "add",
            type: "input",
            message: "How many would you like to add to the inventory?\n"
        }
    ]).then(function(err, res) {
        if(err) throw err;

    });
}
// function returnArray() {
//     var items = [];
//     var query = connection.query("SELECT * FROM products",
//     function(err, res) {
//         if(err) throw err;
//         for(var i = 0; i < res.length; i ++) {
//             // console.log(res[i].product_name);
//             items.push(res[i].product_name);
//         }
//         // console.log(items);
//     });
//     console.log(query.sql);
//     return items;
// }