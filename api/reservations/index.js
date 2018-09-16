const express = require("express");
const router = express.Router();
const filename = "../database/database.sqlite";
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database(filename);
// get '/reservations'
router.get("/reservations", function (req, res) {
    var sql = "select * from reservations";
    // var sql = `select * from customers where surname in ("O'Connor", 'Trump')`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log("ERROR fetching from the database:", err);
            return;
        }
        console.log("Request succeeded, new data fetched", rows);
        res.status(200).json({
            reservations: rows
        });
    });
});


// get '/reservations/:id'
// TODO: add code here


// delete '/reservations/:id'
router.delete("/reservations/:id", function (req, res) {
    // const { title, first_name, surname, email } = req.body
    console.log(req.params.id);
    var sql = `delete from reservations where id = ${req.params.id}`;
    db.run(sql);
    return res.status(200).send();
});


// get '/reservations/starting-on/:startDate'
// TODO: add code here
router.get("/reservations/starting-on/:startDate", (req, res) => {
    res.send(req.params.startDate)
});

// get '/reservations/active-on/:date'
// TODO: add code here


// post '/reservations'
// EXPECTED JSON Object:
// {
//   customer_id: 1,
//   room_id: 1,
//   check_in_date: '2018-01-20',
//   check_out_date: '2018-01-22',
//   room_price: 129.90
// }
// TODO: add code here


// get `/detailed-invoices'
// TODO: add code here


// get `/reservations/details-between/:from_day/:to_day`
// TODO: add code here

module.exports = router;