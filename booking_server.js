const express = require("express");
const mysql = require("mysql");
const router = express.Router();

router.get("/booking", (req, res) => {
  const pkg_id = req.query.id;
  var sql= "SELECT `PackageId`, `PkgName`, `PkgStartDate`, `PkgEndDate`, `PkgDesc`, `PkgBasePrice`, `PkgAgencyCommission`,DATEDIFF(`PkgEndDate`,`PkgStartDate`) as days,MONTHNAME(`PkgStartDate`) AS month,DAY(`PkgStartDate`) AS SDAY, DAY(`PkgEndDate`) AS EDAY FROM packages WHERE `PackageId` = ?";
  connection.query({"sql":sql,"values": [pkg_id]},(err,result,fields)=>{
            if(err) throw err;
            console.log(result);
            res.render("booking", { pageTitle: "Booking" ,"pkg_array":result});
            connection.end((err)=>{
                if(err) throw err;
                    console.log("Disconnected from database");
            });
        });
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "xiangshuo",
  password: "password",
  database: "travelexperts",
});

router.post('/submit-payment', (req, res) => {
  const { name, cardNumber, expiryDate } = req.body;
  const customerId = req.session.customerId;

  const query = 'INSERT INTO creditcards (CCName, CCNumber, CCExpiry, CustomerId) VALUES (?, ?, ?, ?)';
  
  connection.query(query, [name, cardNumber, expiryDate, customerId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    return res.status(200).json({ message: 'Payment submitted successfully' });
  });
});

module.exports = router;

