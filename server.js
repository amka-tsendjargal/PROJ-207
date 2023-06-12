const express = require("express");
const session = require("express-session");
const indexRouter = require("./indexRoutes");
const contactRouter = require("./contactRoutes");
const loginRouter = require("./loginRoutes");
const userRouter = require("./userRoutes");
const registerRouter = require("./registerRoutes")
const packagesRouter = require("./packagesRoutes")
const bookingRouter = require("./booking_server")
const policyRouter = require("./policyRoutes")
const app = express();

// Start the server
app.listen(8000, () => {
  console.log("Server listening on port 8000");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Create session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to set session variables for navbar display.
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.userProfile = req.session.userProfile || null;
  res.locals.customerId = req.session.customerId || null;
  next();
});

app.use("/", indexRouter);
app.use("/", contactRouter);
app.use("/", loginRouter);
app.use("/", userRouter);
app.use("/", registerRouter)
app.use("/", packagesRouter)
app.use("/", bookingRouter)
app.use("/", policyRouter)

// These will be change to utilize Router when done.
app.get("/packages", (request, response) => {
  response.render("packages", { pageTitle: "Packages" });
});
