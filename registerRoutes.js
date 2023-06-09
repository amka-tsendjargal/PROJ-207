const mysql = require("mysql");
const express = require("express");
const app = express();
const router = express.Router();


function getDBH(){
    
    return mysql.createConnection({
        host: "localhost",
        user: "xiangshuo",
        password: "password",
        database: "travelexperts"
    });
};


router.get("/register", (request, response) => {
    response.render("registerform", {pageTitle: "Customer Registration"});
});

router.post("/register1", (request, response) => {
    var dbh = getDBH();

    dbh.connect ((err) => {
        if (err) throw err;
        var sql = "INSERT INTO `customers`(`CustomerId`, `CustFirstName`, `CustLastName`, `CustAddress`, `CustCity`, `CustProv`, `CustPostal`, `CustCountry`, `CustHomePhone`, `CustEmail`) VALUES (0,?,?,?,?,?,?,?,?,?)";

        var data = [request.body.CustFirstName, request.body.CustLastName, request.body.CustAddress, request.body.CustCity, request.body.CustProv, request.body.CustPostal, request.body.CustCountry, request.body.CustHomePhone, request.body.CustEmail];


        dbh.query({"sql": sql, "values": data}, (err, result) =>{
            if (err) throw err;
            console.log(result);

            var message = " ";
            if(result.affectedRows == 0)
            {
                message = "Registration failed, something is missing!"
            }
            else {
                message = "Welcome to Travel Experts!"
            }
            response.render("thanks", {"myTitle": "Confirmation", "message": message });

            dbh.end((err)=>{
                if (err) throw err;
                console.log("Database disconnected!");
            });
        });
    });
});

module.exports = router;
