var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const adminRoutes = require("./src/routes");
const handleError = require("./src/utils/handleError");
const db = require("./src/config/db.config");
// const session = require("express-session");

var app = express();
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("MongoDB connected successfully.");
});
require("./src/strategies/passport-local");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session());
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const passport = require("passport");
/*Social Logins*/
app.use(passport.initialize());
// app.use(passport.session());
// require("./src/strategies/passport-facebook")(passport);
// require("./src/strategies/passport-google")(passport);

// const socialRoutes = require("./src/routes/social.route");

app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "/src/uploads")));
// app.use("/auth", socialRoutes);
// app.use("/v1/front", frontRoutes);
app.use("/v1/admin", adminRoutes);

// Serve admin build
app.use("/admin", express.static(path.join(__dirname, "../admin/build")));
// Serve frontend build
app.use("/", express.static(path.join(__dirname, "./build")));

// Serve admin and frontend index files
app.get("/admin/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../admin/build", "index.html"));
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

app.use(handleError);

module.exports = app;
