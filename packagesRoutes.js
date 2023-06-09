const express = require("express");
const router = express.Router();
const mysql = require("mysql");



router.get('/packages', (request, response) => {
    var dbh = mysql.createConnection({
    host: "localhost",
    user: "xiangshuo",
    password: "password",
    database: "travelexperts"
});
    dbh.connect((err)=>{
    
        console.log('connected');
        var sql= "SELECT `PackageId`, `PkgName`, `PkgStartDate`, `PkgEndDate`, `PkgDesc`, `PkgBasePrice`, `PkgAgencyCommission`,DATEDIFF(`PkgEndDate`,`PkgStartDate`) as days,MONTHNAME(`PkgStartDate`) AS month,DAY(`PkgStartDate`) AS SDAY, DAY(`PkgEndDate`) AS EDAY FROM packages";
        dbh.query(sql,(err,result,field)=>{
            if(err) throw err;
            
            response.render("packages", {"pageTitle": "Packages","pkg_array":result})
            dbh.end((err)=>{
                if(err) throw err;
                    console.log("Disconnected from database");
            });
        });
    })
})

module.exports = router;