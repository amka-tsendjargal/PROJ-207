const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "xiangshuo",
  password: "password",
  database: "travelexperts",
});

router.get("/user", (req, res) => {
  const customerId = req.query.customerId;
  //Fetching user's profile.
  const queryUser = "SELECT * FROM customers WHERE CustomerId = ?";
  const queryBookings = "SELECT * FROM bookings WHERE CustomerId = ?";

  connection.query(queryUser, [customerId], (err, userRows) => {
    if (err) {
      console.error("Error executing user query:", err);
      res.status(500).send("Error fetching user data");
      return;
    }
    // if length is 0 that means we don't have match.
    if (userRows.length === 0) {
      res.status(404).send("User not found");
      return;
    }

    const userProfile = userRows[0];
    //Fetching user's Booking INFO
    connection.query(queryBookings, [customerId], (err, bookingRows) => {
      if (err) {
        console.error("Error executing bookings query:", err);
        res.status(500).send("Error fetching booking data");
        return;
      }

      const bookings = bookingRows;
      // Send the data to client side.
      res.render("user", { userProfile, bookings, pageTitle: "User" });
    });
  });
});

// Fetching user's booking details(not same as booking INFO)
router.get("/booking-details/:id", function (req, res) {
  const bookingId = req.params.id;
  const queryBookingDetails =
    "SELECT * FROM bookingdetails WHERE BookingId = ?";

  connection.query(queryBookingDetails, [bookingId], (err, detailRows) => {
    if (err) {
      console.error("Error executing booking details query:", err);
      res.status(500).send("Error fetching booking details");
      return;
    }

    if (detailRows.length === 0) {
      res.status(404).send("Booking details not found");
      return;
    }

    const bookingDetails = detailRows;

    // Make a HTML Table to shows the details
    let html = '<table class="table table-striped mt-3">';
    html +=
      "<thead><tr><th>Detail ID</th><th>Itinerary No</th><th>Trip Start</th><th>Trip End</th><th>Description</th><th>Destination</th><th>Base Price</th><th>Agency Commission</th></tr></thead>";
    html += "<tbody>";
    for (let detail of bookingDetails) {
      html += "<tr>";
      html += `<td>${detail.BookingDetailId}</td>`;
      html += `<td>${detail.ItineraryNo}</td>`;
      html += `<td>${detail.TripStart}</td>`;
      html += `<td>${detail.TripEnd}</td>`;
      html += `<td>${detail.Description}</td>`;
      html += `<td>${detail.Destination}</td>`;
      html += `<td>${detail.BasePrice}</td>`;
      html += `<td>${detail.AgencyCommission}</td>`;
      html += "</tr>";
    }
    html += "</tbody></table>";

    res.send(html);
  });
});

router.get("/user/logout", (req, res) => {
  // Clear session variables and mark as not logged in
  req.session.isLoggedIn = false;
  req.session.userProfile = null;
  req.session.customerId = null;
  res.render("logout");
});

module.exports = router;
