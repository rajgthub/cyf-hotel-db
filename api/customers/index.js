const express = require("express");
const router = express.Router();
const filename = "database/database.sqlite";
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database(filename);
router.get('/customers', function (req, res) {
    var sql = 'select * from customers';
    // var sql = `select * from customers where surname in ("O'Connor", 'Trump')`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log('ERROR fetching from the database:', err);
            return;
        }
        console.log('Request succeeded, new data fetched', rows);
        res.status(200).json({
            customers: rows
        });
    });
});


router.get('/customers/:id', function (req, res) {
    // TODO: add code here
    const id = req.params.id
    var regx = new RegExp('^[0-9]$');
    console.log(regx.test(id));
    if (!regx.test(id)) {
        return res.status(400).json({ customers: "bad request!" });
    }
    // var sql = `select * from customers where id = +${id}`;
    var sql = "select * from customers";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log('ERROR fetching from the database:', err);
            return;
        }
        const customer = rows.filter(customer => customer.id == id);
        console.log("Request succeeded, new data fetched", customer);
        res.status(200).json({
            customers: customer
        });
    });
});

router.get("/customers/surname/:surname", function (req, res) {
    // TODO: add code here
    console.log("req.params.surname", req.params.surname);
    var sql = `select * from customers where surname like '${
        req.params.surname
        }'`;
    console.log("sql", sql);
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log("ERROR fetching from the database:", err);
            return;
        }
        // const customer = rows.filter(customer => customer.id == id);
        console.log("Request succeeded, new data fetched", rows);
        res.status(200).json({ customers: rows });
    });
});


router.post('/customers/', function (req, res) {
    const { title, first_name, surname, email } = req.body
    console.log(req.body);
    var sql = `INSERT INTO customers(title, first_name, surname, email) VALUES 
  ('${title}', '${first_name}', '${surname}', '${email}')`;
    db.run(sql)
    return res.status(201).send()

});


router.put('/customers/:id', function (req, res) {
    const { title, first_name, surname, email } = req.body
    var sql = `UPDATE customers 
             SET 
              title = '${title}',
              first_name = '${first_name}', 
              surname = '${surname}',
              email = '${email}'
             WHERE id = '${req.params.id}'`;
    db.run(sql)
    return res.status(200).send()
});
//Exercise 1: updating some fields of a customer
//I added a new endpoint as I want have it separately
router.put("/customers/customer/:id", function (req, res) {
    let id = req.params.id;
    //get the customer by the id
    let sqlGetCustomer = `SELECT  * FROM customers WHERE id = '${id}'`;
    db.all(sqlGetCustomer, [], (err, rows) => {
        if (err) {
            console.log("ERROR fetching from the database:", err);
            return;
        }
        const customer = rows.filter(customer => customer.id == id);
        console.log("Request succeeded, new data fetched", customer);
        console.log("id", id);
        let { title, first_name, surname, email } = req.body;
        //update if values are different
        if (Array.isArray(customer) && customer.length === 1) {
            title === undefined ? title = customer[0].title : title;
            console.log('hi')
            first_name === undefined ? first_name = customer[0].first_name : first_name;
            surname === undefined ? surname = customer[0].surname : surname
            email === undefined ? email = customer[0].email : email
        }

        let data = [title, first_name, surname, email, id];
        console.log("data:", data);
        let sql = `UPDATE customers 
             SET 
              title = ?,
              first_name = ?, 
              surname = ?,
              email = ?
             WHERE id = ?`;
        db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) updated: ${this.changes}`);
            return res.status(200).send();
        });
    });
});

module.exports = router;