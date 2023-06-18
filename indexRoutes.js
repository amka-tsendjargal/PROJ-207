// Simple page that render our home page.
// Author: Amka, Deepa, Gabriel, Shuo
// When: June 2023.

const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
  response.render("index", { pageTitle: "Home" });
});

module.exports = router;
