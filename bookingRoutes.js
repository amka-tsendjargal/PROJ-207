// This router file handles the booking page.
// The page displays user's selected package information
// Takes in user's payment information and adds it to database
// After payment, it adds the bought package to user's records
// Author: Amka, Shuo , Deepa
// When: June 2023

// Necessary module imports
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

// This function generates a random string of 6 to 9 letters and numbers to be used as the booking number
// (DOES NOT YET CHECK FOR DUPLICATES)
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

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "xiangshuo",
  password: "password",
  database: "travelexperts",
});
let pkg_id; // Storing which package they selected from the previous page by its id

// This get method displays database information about previously selected package
router.get("/booking", (req, res) => {
  pkg_id = req.query.id;
  var sql= "SELECT `PackageId`, `PkgName`, `PkgStartDate`, `PkgEndDate`, `PkgDesc`, `PkgBasePrice`, `PkgAgencyCommission`,DATEDIFF(`PkgEndDate`,`PkgStartDate`) as days,MONTHNAME(`PkgStartDate`) AS month,DAY(`PkgStartDate`) AS SDAY, DAY(`PkgEndDate`) AS EDAY FROM packages WHERE `PackageId` = ?";
  connection.query({"sql":sql,"values": [pkg_id]},(err,result,fields)=>{
            if(err) throw err;
            console.log(result);
            res.render("booking", { pageTitle: "Booking" ,"pkg_array":result});
  });
});

// This post method adds the appropriate info into the 'bookings', 'bookingdetails', and 'creditcards' tables
// The INSERT into bookings table occurs seperately before INSERT into 'bookingdetails' so we use the 'bookings' last insert id
// to get details needed for 'bookingdetail' information
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

 let lastBookingId; 
  const bookingQuery = "INSERT INTO `bookings`(`BookingId`, `BookingDate`, `BookingNo`, `CustomerId`) VALUES (?, ?, ?, ?)"
  connection.query({'sql': bookingQuery, 'values': [0, new Date(), generateRandomString(), customerId]}, (err, result) => {
    if (err) throw err;
    lastBookingId = result.insertId; // Storing id of last entry into 'bookings' table
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
      res.render("confirmation", { success: false });
    }
    connection.end((err)=>{
      if(err) throw err;
          console.log("Disconnected from database");
  });
    res.render("confirmation", { success: true });
  });
});

module.exports = router;
