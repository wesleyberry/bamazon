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

connection.connect(function(err) {
    if(err) throw err;
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
    ]).then(function(answer) {
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
        }
    ]).then(function(answer) {
        var overHead = Math.floor(Math.random() * (100000 - 10000)) + 10000;
        makeRow(answer.department, overHead);
    });
}
function makeRow(answer, overHead) {
    connection.query("INSERT INTO departments SET ?",
    {
        department_name: answer,
        over_head_costs: overHead
    },
    function(err, res) {
    if(err) throw err;
    introSupervisor();
    });
}
// -----------Views Sales from All Departments
function viewSalesByDepartment() {
    var query = "SELECT departments.department_name, products.product_sales, departments.over_head_costs, departments.department_id ";
    query += "FROM departments JOIN products ON departments.department_name=products.department_name ";
    query += "ORDER BY departments.department_id";
    connection.query(query, function(err, res) {
        if(err) throw err;
        // console.log(res);
        for(var i = 0; i < res.length; i++) {
            var prod = res[i].product_sales;
            var over = res[i].over_head_costs;
            var profit = prod - over;
        console.table([
            {
              Id: res[i].department_id,
              Department: res[i].department_name,
              Over_head_costs: res[i].over_head_costs,
              Product_Sales: res[i].product_sales,
              Total_Profit: profit
            }
          ]);
        }
    });
}