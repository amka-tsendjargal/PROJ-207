// This router displays our policy page
const express = require("express");
const router = express.Router();

router.get("/policy", (request, response) => {
  response.render("policy", { pageTitle: "Policy" });
});

module.exports = router;
