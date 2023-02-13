require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const router = express.Router();
app.use(express.json());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(helmet());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

sequelize
  .sync()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

const userRoutes = require("./Routes/Users.route");
const postRoutes = require("./Routes/Posts.route");
const comRoutes = require("./Routes/Comments.route");

// Routes
app.use("/images/posts", express.static(path.join(__dirname, "images")));
app.use("/images/", express.static(path.join(__dirname, "images")));
app.use("/home", userRoutes);
app.use("/api", postRoutes);
app.use("/api/comments", comRoutes);

module.exports = app;
