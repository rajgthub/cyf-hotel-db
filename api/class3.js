const express = require('express');
const sqlite3 = require( 'sqlite3' ).verbose();

const filename = 'database/database.sqlite';
let db = new sqlite3.Database(filename);

const router = express.Router();
//homework 1
router.get('/reservations-and-invoices/', (req, res) => {
  //setup sql
  const sql = `SELECT r.*, i.* FROM reservations r JOIN 
    invoices i ON r.id = i.reservation_id`
  //run the sql
  db.all(sql, [], (err, results) => {
    if (err) return res.send('something went wrong while executing the sql!')
    res.status(200).json({results})
  })
})//end h1

//homework 2
//assumed summer in the UK (between '2017-05-01' and '2017-08-31' )
router.get('/invoices_paid_summer_2017/', (req, res) => {
  //setup sql
  const sql = `SELECT  SUM(total) total FROM invoices 
    WHERE invoice_date_time BETWEEN '2017-05-01' AND '2017-08-31' AND (paid == '1')`;
  //run the sql
  db.all(sql, [], (err, results) => {
    if (err) return res.send('something went wrong while executing the sql!')
    res.status(200).json({ results })
  })
})//end h2

//homework 3
router.get("/reservations-per-customer-hw3/", (req, res) => {
  //setup sql
  const sql = `SELECT  c.*, r.*, COUNT(r.customer_id) reservations_per_customer 
    FROM customers c JOIN reservations r ON  c.id = r.customer_id GROUP BY r.customer_id`;
  //run the sql
  db.all(sql, [], (err, results) => {
    if (err) return res.send("something went wrong while executing the sql!");
    res.status(200).json({ results });
  });
});//end h3

//homework 4
// Get the number of reservations for each room ID and 
//include the details for the room details
router.get("/reservations-to-room-details/", (req, res) => {
  //setup sql
  const sql = `SELECT room_id, COUNT(room_id) number_of_reservations 
    FROM reservations GROUP BY room_id`;
  //run the sql
  db.all(sql, [], (err, results) => {
    if (err) return res.send("something went wrong while executing the sql!");
    const updateSql = `UPDATE rooms SET room_details = ? WHERE id = ?`;
    results.forEach(ele => {
      db.run(updateSql, 
        [ele.number_of_reservations, ele.room_id],
         err => {
           if(err){
             console.log(err)
           }
        });
    })
    db.all('SELECT * FROM rooms', [], (err, results) => {
      if (err) return res.send('something went wrong while fetcing data from rooms')
      return res.status(200).json({results})
    })
  });
});//end h4

//homework 5
router.get("/reservations-to-room-types-details/", (req, res) => {
  //setup sql
  const sql = `SELECT r.room_type_id, COUNT(res.room_id) number_of_reservations 
    FROM reservations res 
    JOIN room r ON res.room_id = r.id 
    JOIN room_types rt ON rt.id = r.room_type_id
    GROUP BY res.room_id`;
  //run the sql
  db.all(sql, [], (err, results) => {
    if (err) return res.send("something went wrong while executing the sql!");
    const updateSql = `UPDATE room_types SET room_details = ? WHERE id = ?`;
    results.forEach(ele => {
      db.run(
        updateSql,
        [ele.number_of_reservations, ele.room_type_id],
        err => {
          if (err) {
            console.log(err);
          }
        }
      );
    })
    db.all('SELECT * FROM rooms', [], (err, results) => {
      if (err) return res.send('something went wrong while fetcing data from rooms')
      return res.status(200).json({ results })
    })
  });
});//end h5

//homework 6
//Get the list of rooms with sea view that were reserved more than 5 times.
router.get("/rooms-with-seaview-5plus/", (req, res) => {
  //setup sql
  const sql = `SELECT room_id, COUNT(room_id) number_of_reservations 
    FROM reservations GROUP BY room_id`;
  //run the sql
  db.all(sql, [], (err, results) => {
    if (err) return res.send("something went wrong while executing the sql!");
    const updateSql = `UPDATE rooms SET room_details = ? WHERE id = ?`;
    results.forEach(ele => {
      db.run(updateSql,
        [ele.number_of_reservations, ele.room_id],
        err => {
          if (err) {
            console.log(err)
          }
        });
    })
    db.all(
      "SELECT * FROM rooms WHERE sea_view = 1 AND room_details >= 1",
      [],
      (err, results) => {
        if (err)
          return res.send(
            "something went wrong while fetcing data from rooms"
          );
        return res.status(200).json({ results });
      }
    );
  });
});//end h6

//homework 7
// Create an endpoint for each previous exercise that doesn't have an endpoint yet.
// You will have to think about what is the context of the query, what parameters you need 
// to receive in the end-point and what makes sense to return as a result and in which format.

//homework 8
router.get("/reservations/details-between/:from_day/:to_day", (req, res) => {
  const {from_day, to_day} = req.params
  //setup sql
  //method 1
  const sql = `
  SELECT res.id reservation_id, res.room_id, c.*
    FROM reservations res 
    LEFT JOIN customers c ON res.customer_id = c.id
    LEFT JOIN rooms r ON res.room_id = r.id
    WHERE res.check_in_date >= ? AND res.check_out_date <= ?`;
  //method 2
  // const sql = `
  // SELECT result.*, r.* FROM (SELECT  res.id reservation_id, res.room_id, c.*
  //   FROM reservations res 
  //   JOIN customers c ON res.customer_id = c.id
  //   WHERE res.check_in_date >= ? AND res.check_out_date <= ?) result 
  //   JOIN rooms r ON result.room_id = r.id`;
  //run the sql
  db.all(sql, [from_day, to_day], (err, results) => {
    if (err) return res.send("something went wrong while executing the sql!");
    res.status(200).json({ results });
  });
});//end h8

//homework 9
router.get("/reservations-per-customer/", (req, res) => {
  //setup sql
  const sql = `SELECT  c.id, COUNT(r.customer_id) reservations_per_customer 
    FROM customers c JOIN reservations r ON  c.id = r.customer_id GROUP BY r.customer_id`;
  //run the sql
  db.all(sql, [], (err, results) => {
    if (err) return res.send("something went wrong while executing the sql!");
    res.status(200).json({ results });
  });
});//end h9

//homework 10
router.get("/stats-price-room/", (req, res) => {
  //setup sql
  const sql = `SELECT AVG(i.total) average_per_reservations, 
        COUNT(res.room_id) number_of_booking,
        SUM(i.total) total_rooms
      FROM reservations res 
      JOIN invoices i ON res.id = i.reservation_id 
      JOIN rooms r ON res.room_id = r.id
      GROUP BY res.room_id`;
  //run the sql
  db.all(sql, [], (err, results) => {
    if (err) return res.send("something went wrong while executing the sql!");
    res.status(200).json({ results });
  });
});//end h10

//homework 11
router.get("/rooms/available-in/:from_day/:to_day", (req, res) => {
  const { from_day, to_day } = req.params;
  //setup sql
  const sql = `
  SELECT r.id
    FROM rooms r 
    LEFT JOIN reservations res ON res.room_id = r.id
    WHERE res.check_in_date > ? OR res.check_out_date < ?`;
  //run the sql
  db.all(sql, [from_day, to_day], (err, results) => {
    console.log(sql);
    if (err) {
      console.log(err);
      return res.send("something went wrong while executing the sql!");
    }
    res.status(200).json({ results });
  });
});//end h11

module.exports = router;
