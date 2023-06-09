const mysql = require("mysql");
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.listen(8000, (err)=>{
    if (err) throw err;
    console.log("Server is running at port 8000!");
});

function getDBH(){
    
    return mysql.createConnection({
        host: "localhost",
        user: "gabriel",
        password: "password",
        database: "travelexperts"
    });
};

app.set('views', './views');
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/register", (request, response) => {
    response.render("registerform", {"myTitle": "Customer Registration"});
});

app.post("/register1", (request, response) => {
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

// app.get("/getagent/:id", (request, response)=>{
// 	var dbh = getDBH();
	
// 	dbh.connect((err)=>{
// 		if (err) throw err;
// 		console.log(request.params.id);
// 		var sql = "select * from agents where AgentId=?";
// 		dbh.query({ "sql": sql, "values":[ request.params.id ] }, (err, result, fields)=>{
// 			if (err) throw err;
// 			console.log(result);
			
// 			res.render("agentdisplay", 
// 				{ "myTitle":"Agent Detail", "agent": result });
// 			dbh.end((err)=>{
// 				if (err) throw err;
// 				console.log("Disconnected from the database");
// 			});
// 		});
// 	});
// });
