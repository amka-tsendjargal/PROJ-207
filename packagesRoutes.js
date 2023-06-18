// This router file handles the packages page.
// The page serves the functionality of displaying all the packages to the Customer.
// Author: Deepa
// When: June 2023
// Importing necessary modules
const express = require("express");
const router = express.Router();
const mysql = require("mysql");


// This get method gives the Packages page all data from the 'packages' table
router.get('/packages', (request, response) => {
    //for db connection
    var dbh = mysql.createConnection({
    host: "localhost",
    user: "xiangshuo",
    password: "password",
    database: "travelexperts"
});
    dbh.connect((err)=>{
    
        console.log('connected');
        //Fetching all package details from packages table.
        var sql= "SELECT `PackageId`, `PkgName`, `PkgStartDate`, `PkgEndDate`, `PkgDesc`, `PkgBasePrice`, `PkgAgencyCommission`,DATEDIFF(`PkgEndDate`,`PkgStartDate`) as days,MONTHNAME(`PkgStartDate`) AS month,DAY(`PkgStartDate`) AS SDAY, DAY(`PkgEndDate`) AS EDAY FROM packages";
        dbh.query(sql,(err,result,field)=>{
            if(err) throw err;
            //send the package information to client side
            response.render("packages", {"pageTitle": "Packages","pkg_array":result})
            dbh.end((err)=>{
                if(err) throw err;
                    console.log("Disconnected from database");
            });
        });
    })
})

module.exports = router;
