const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "xiangshuo",
  password: "password",
  database: "travelexperts",
});

router.get("/login", (req, res) => {
  res.render("login", { pageTitle: "Log In" });
});

router.get("/forgot-password", (req, res) => {
  res.render("404", { pageTitle: "404 Not Found" });
});

router.post("/login", (req, res) => {
  const customerId = req.body.customerId;
  const homePhoneNumber = req.body.homePhoneNumber;
  const query =
    "SELECT * FROM customers WHERE CustomerId = ? AND CustHomePhone = ?";
  // Find user from Database, log in will fail if no matches.
  connection.query(query, [customerId, homePhoneNumber], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (rows.length === 0) {
      res.send(
        '<script>alert("Login failed. Please try again."); window.location.href="/login";</script>'
      );
      return;
    }
    const userProfile = rows[0];
    // Add the customerId to res.locals to make it available in all views
    // Store user profile and set isLoggedIn flag in session
    req.session.isLoggedIn = true;
    req.session.userProfile = userProfile;
    req.session.customerId = customerId;
    res.redirect(`/user?customerId=${customerId}`);
  });
});

module.exports = router;
