const express = require('express');
const app = express();
const mysql = require("mysql");

// Start the server
app.listen(8000, () => {
    console.log("Server listening on port 8000");
});

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: "localhost",
    user: "xiangshuo",
    password: "password",
    database: "travelexperts",
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to the database");
});

app.get('/user', (req, res) => {
    connection.query("SELECT * FROM customers", (err, rows) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Error fetching data");
            return;
        }
        const userProfile = rows[0]; // Assuming you only want the first row from the result
        res.render('user', { userProfile });
    });
});
