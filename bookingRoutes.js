const express = require("express");
const mysql = require("mysql");
const router = express.Router();
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = Math.floor(Math.random() * 4) + 6; // Random length between 6 and 9
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

const connection = mysql.createConnection({
  host: "localhost",
  user: "xiangshuo",
  password: "password",
  database: "travelexperts",
});
let pkg_id;
router.get("/booking", (req, res) => {
  pkg_id = req.query.id;
  var sql= "SELECT `PackageId`, `PkgName`, `PkgStartDate`, `PkgEndDate`, `PkgDesc`, `PkgBasePrice`, `PkgAgencyCommission`,DATEDIFF(`PkgEndDate`,`PkgStartDate`) as days,MONTHNAME(`PkgStartDate`) AS month,DAY(`PkgStartDate`) AS SDAY, DAY(`PkgEndDate`) AS EDAY FROM packages WHERE `PackageId` = ?";
  connection.query({"sql":sql,"values": [pkg_id]},(err,result,fields)=>{
            if(err) throw err;
            console.log(result);
            res.render("booking", { pageTitle: "Booking" ,"pkg_array":result});
  });
});

router.post('/submit-payment', (req, res) => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "xiangshuo",
    password: "password",
    database: "travelexperts",
  });
  const { name, cardNumber, expiryDate } = req.body;
  const customerId = req.session.customerId;
  console.log(pkg_id)
  //const pkg_id = req.query.id;
 let lastBookingId; 
  const bookingQuery = "INSERT INTO `bookings`(`BookingId`, `BookingDate`, `BookingNo`, `CustomerId`) VALUES (?, ?, ?, ?)"
  connection.query({'sql': bookingQuery, 'values': [0, new Date(), generateRandomString(), customerId]}, (err, result) => {
    if (err) throw err;
    lastBookingId = result.insertId;
    console.log('Booking entry successful')
  });
 
  var sql= "SELECT `PackageId`, `PkgName`, `PkgStartDate`, `PkgEndDate`, `PkgDesc`, `PkgBasePrice`, `PkgAgencyCommission`,DATEDIFF(`PkgEndDate`,`PkgStartDate`) as days,MONTHNAME(`PkgStartDate`) AS month,DAY(`PkgStartDate`) AS SDAY, DAY(`PkgEndDate`) AS EDAY FROM packages WHERE `PackageId` = ?";
  console.log(pkg_id)
  connection.query({"sql":sql,"values": [pkg_id]},(err,result)=>{
            if(err) throw err;
            console.log(result)
            var bookingDetailQuery = "INSERT INTO `bookingdetails`(`BookingDetailId`, `TripStart`, `TripEnd`, `BasePrice`, `AgencyCommission`, `BookingId`) VALUES (?,?,?,?,?,?)";
            var bookingDetailValues = [0, result[0].PkgStartDate, result[0].PkgEndDate, result[0].PkgBasePrice, result[0].PkgAgencyCommission, lastBookingId];
            
            connection.query({'sql': bookingDetailQuery, 'values': bookingDetailValues}, (err) => {
              if (err) throw err;
              console.log('Booking detail entry successful')
            })
  });

  const query = 'INSERT INTO creditcards (CCName, CCNumber, CCExpiry, CustomerId) VALUES (?, ?, ?, ?)';
  
  connection.query(query, [name, cardNumber, expiryDate, customerId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    connection.end((err)=>{
      if(err) throw err;
          console.log("Disconnected from database");
  });

    return res.status(200).json({ message: 'Payment submitted successfully' });
  });
});

module.exports = router;