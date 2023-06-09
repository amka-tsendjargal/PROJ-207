const express = require("express");
const app = express();
const indexRouter = require("./indexRoutes");
const contactRouter = require("./contactRoutes");

// Start the server
app.listen(8000, () => {
  console.log("Server listening on port 8000");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/", contactRouter);

// These will be change to utilize Router when done.
app.get('/packages', (request, response) => {
    response.render('packages', {pageTitle: 'Packages'})
})

app.get('/register', (request, response) => {
    response.render('register', {pageTitle: 'Join Us'})
})
