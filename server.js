const express = require("express");
const app = express();

const exphbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();
const port = process.env.PORT || 3000;
// import cookie parser
const cookieParser = require("cookie-parser");

//body parser
const bodyParser = require("body-parser");

//override post method
app.use(methodOverride("_method"));

// only return middleware that parse json
app.use(express.json());

//let the system know we use shallow parsing or deep parsing
app.use(express.urlencoded({ extended: true }));

// public directory public
app.use(express.static(__dirname + "/public"));

//use handlebars

// register helper functions
var hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});
hbs.handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

// view engine
app.engine("hbs", exphbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// router
app.use("/", require("./controllers/Site/home.C"));

app.listen(port, () => {
  console.log(`Listen in port http://localhost:${port}`);
});
