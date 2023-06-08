const express = require("express");
const mysql = require("mysql");
const app = express();
const nodemailer = require("nodemailer");

// Start the server
app.listen(8000, () => {
  console.log("Server listening on port 8000");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.render("index", { pageTitle: "Home" });
});

app.get("/packages", (request, response) => {
  response.render("packages", { pageTitle: "Packages" });
});

app.get("/register", (request, response) => {
  response.render("register", { pageTitle: "Join Us" });
});
app.get("/contact", (request, response) => {
  response.render("contact", { pageTitle: "Contact Us" });
});

// --------------------- Contact Us Server Code ------------------------
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

//Save JSON file into "/agents" endpoint.
app.get("/agents", (req, res) => {
  connection.query("SELECT * FROM agents", (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }
    res.json(rows);
  });
});

// Form and Email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "xiangshuo9988@gmail.com",
    pass: "mpeabobcvrrzmofz",
  },
});

app.post("/send-email", (req, res) => {
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
