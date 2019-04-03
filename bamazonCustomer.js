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
    intro();
});

function intro() {
    console.log("Hello, and welcome to Wesley's Wares\nDisplayed below are available products\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        console.log("id | " + "product |" + "department |" + "price |" + "amount");
        for(var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        askCustomer();
    });
}

function askCustomer() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the ID of the product you would like to purchase:\n",
            name: "product"
        },
        {
            type: "input",
            message: "How many of this item would you like to purchase?\n",
            name: "amount",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
            }
        }
    ]).then(function(answer) {
        console.log("You answered that you would like to buy " + answer.amount + " of id:" + answer.product + ".");
        checkWares(answer.product, answer.amount);
    });
}

function checkWares(id, amount) {
    console.log("Checking wares...\n");
    var query = connection.query("SELECT * FROM products WHERE item_id=?", 
    [id],
    function(err, res) {
        if(err) throw err;
        var stores = res[0].stock_quantity;
        var product = res[0].product_name;
        if(amount > stores) {
            console.log("We're sorry, but we do not have at least " + amount + " " + product + "\n");
            askCustomer();
        } else {
            stores = stores - amount;
            console.log("You want to purchase " + amount+ " " + product + "\n");
            updateData(id, stores);
            givePrice(id, amount);
        }
    });
    console.log(query.sql);
}

function updateData(id, stores) {
    var query = connection.query("UPDATE products SET ? WHERE ?",
    [
        {
            stock_quantity: stores
        },
        {
            item_id: id
        }
    ],
        function(err, res) {
            if(err) throw err;
            connection.end();
        }
    );
    console.log(query.sql);
}
function givePrice(id, amount) {
    var query = connection.query("SELECT price FROM products WHERE ?",
    {
        item_id: id
    },
        function(err, res) {
            if(err) throw err;
            var price = res[0].price * amount;
            console.log("Your total is $" + price);
        }
    );
}