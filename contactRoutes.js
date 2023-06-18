// This router file handles the contact us page.
// The page serves the functionality of displaying the agent list and sending emails via the contact form
// Author: Shuo
// When: June 2023

const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const nodemailer = require("nodemailer");

// Database connection
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

// Form and Email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "xiangshuo9988@gmail.com",
    pass: "mpeabobcvrrzmofz",
  },
});

router.get("/contact", (request, response) => {
  response.render("contact", { pageTitle: "Contact Us" });
});

//Save JSON file into "/agents" endpoint.
router.get("/agents", (req, res) => {
  connection.query("SELECT * FROM agents", (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }
    res.json(rows);
  });
});

// Use nodemailer package to format and send email
router.post("/send-email", (req, res) => {
  const { name, email, dropdown, message } = req.body;
  console.log({ name, email, dropdown, message });
  const mailOptions = {
    from: email,
    to: "xiangshuo9988@gmail.com",
    subject: "New Form Submission",
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Purpose:</strong> ${dropdown}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.render("result", { success: false });
    } else {
      console.log("Email sent: " + info.response);
      res.render("result", { success: true });
    }
  });
});

module.exports = router;
