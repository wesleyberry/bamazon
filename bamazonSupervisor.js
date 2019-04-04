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
    introSupervisor();
});
// total_profit column - alias
function introSupervisor() {
    inquirer.prompt([
        {
            name: "task",
            type: "list",
            message: "Which task would you like to perform?",
            choices: ["View Product Sales by Department",
                "Create New Department"]
        }
    ]).then(function (answer) {
        switch (answer.task) {
            case "View Product Sales by Department":
                viewSalesByDepartment();
                break;

            case "Create New Department":
                createDepartment();
                break;
        }
    });
}
// -----------Creates a New Department
function createDepartment() {
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "What is the name of the new department?"
        },
        {
            name: "overhead",
            type: "input",
            message: "How much overhead should we commit?",
            validate: function(input) {
                if(isNaN(input) || input < 0) {
                    console.log("You need to provide an valid number");
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function (answer) {
        makeRow(answer.department, answer.overhead);
    });
}
function makeRow(answer, overHead) {
    connection.query("INSERT INTO departments SET ?",
        {
            department_name: answer,
            over_head_costs: overHead
        },
        function (err, res) {
            if (err) throw err;
            console.log("You have added the department: " + answer + 
            "\nwith an overhead of " + overHead);
            makeRowProd(answer);
        });
    }
function makeRowProd(answer) {
    connection.query("INSERT INTO products SET ?",
        {
            product_name: "null",
            department_name: answer,
            price: 0,
            stock_quantity: 0,
            product_sales: 0
        },
        function (err, res) {
            if (err) throw err;
            introSupervisor();
        });
}
// -----------Views Sales from All Departments
function viewSalesByDepartment() {
    var query = "SELECT DISTINCT departments.department_name, products.product_sales, departments.over_head_costs, departments.department_id, ";
    query += "(products.product_sales - departments.over_head_costs) AS profit "
    query += "FROM products RIGHT JOIN departments ON products.department_name=departments.department_name ";
    query += "ORDER BY departments.department_id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        var prod, over, profit;
        var values = [];
        values = [['ID', 'Department', 'Over_head_costs', 'Product_Sales']];
        for (var i = 0; i < res.length; i++) {
            prod = res[i].product_sales;
            over = res[i].over_head_costs;
            profit = prod - over;
            values.push([
                [res[i].department_id,
                res[i].department_name,
                res[i].over_head_costs,
                res[i].product_sales,
                profit]
            ]);
        }
        introSupervisor();
    });
}