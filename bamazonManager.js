var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "aceofspades!1",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    introManager();
});
function introManager() {
    inquirer.prompt([
        {
            name: "task",
            type: "list",
            message: "Greetings, manager. Which task are you performing?\n",
            choices: ["View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"]
        }
    ]).then(function (answer) {
        if (answer.task === "View Products for Sale") {
            viewProducts();
        } else if (answer.task === "View Low Inventory") {
            viewLow();
        } else if (answer.task === "Add to Inventory") {
            addInventory();
        } else if (answer.task === "Add New Product") {
            addNewProduct();
        }
    });
}
function moreTasks() {
    inquirer.prompt([
        {
            name: "task",
            type: "list",
            message: "Would you like to perform another task?\n",
            choices: ["View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"]
        }
    ]).then(function (answer) {
        if (answer.task === "View Products for Sale") {
            viewProducts();
        } else if (answer.task === "View Low Inventory") {
            viewLow();
        } else if (answer.task === "Add to Inventory") {
            addInventory();
        } else if (answer.task === "Add New Product") {
            addNewProduct();
        }
    });
}
function viewProducts() {
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("\n");
            moreTasks();
        }
    );
}
function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity<?",
        [5],
        function (err, res) {
            if (err) throw err;
            console.log("These are the items are near complete depletion:\n");
            for (var i = 0; i < res.length; i++) {
                console.log(i + 1 + ") " + res[i].product_name);
            }
            console.log("\n");
            moreTasks();
        });
}
function addInventory() {
    var items = [];
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                items.push(res[i].product_name);
            }
            inquirer.prompt([
                {
                    name: "productChoice",
                    type: "list",
                    message: "Which product would you like to replenish?\n",
                    choices: items
                },
                {
                    name: "add",
                    type: "input",
                    message: "How many would you like to add to the inventory?\n"
                }
            ]).then(function (answer) {
                checkWares(answer.productChoice, answer.add);
            });
        });
}
function checkWares(product, add) {
    connection.query("SELECT * FROM products WHERE ?",
        { product_name: product }, function (err, res) {
            if (err) throw err;
            var stock = res[0].stock_quantity;
            addWares(stock, product, add);
        });
}
function addWares(stock, answer, add) {
    var total = parseInt(stock) + parseInt(add);
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: total
            },
            {
                product_name: answer
            }
        ]
        , function (err, res2) {
            if (err) throw err;
            console.log("You have added " + add + " " +
                answer + " to the inventory\n");
            moreTasks();
        }
    );
}
function addNewProduct() {
    var items = [];
    connection.query("SELECT department_name FROM departments GROUP BY department_name",
        function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                items.push(res[i].department_name);
            }
            inquirer.prompt([
                {
                    type: "input",
                    message: "What product would you like to add to Wesley's Wares?\n",
                    name: "product"
                },
                {
                    type: "list",
                    message: "Which department will this item be placed?\n",
                    choices: items,
                    name: "department"
                },
                {
                    type: "input",
                    message: "How many items will be added to the stock?\n",
                    name: "quantity"
                },
                {
                    type: "input",
                    message: "How much will one cost?\n",
                    name: "cost"
                }
            ]).then(function (answer) {
                var prod = answer.product;
                var dep = answer.department;
                var price = answer.cost;
                var stock = answer.quantity;
                var query = connection.query("INSERT INTO products SET ?",
                    {
                        product_name: prod,
                        department_name: dep,
                        price: price,
                        stock_quantity: stock
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log("You added:\n" +
                            "Product: " + prod + "\n" +
                            "Department: " + dep + "\n" +
                            "Quantity: " + stock + "\n" +
                            "Price: " + price + "\n");
                        moreTasks();
                    }
                );
            });
        }
    );
}