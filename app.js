var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

// Load config
dotenv.config({ path: "./config/config.env" });
connectDB();

var indexRouter = require("./routes/index");
var transactionRouter = require("./routes/transactions");

var app = express();
//CORS middleware

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/v1/transactions/", transactionRouter);

module.exports = app;
