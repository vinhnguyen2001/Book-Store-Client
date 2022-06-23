const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const routes = require('./routes/index');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
var cors = require("cors");


require("./middlewares/handlebars")(app);
require('dotenv').config(); // import dotenv

app.use(methodOverride("_method"));
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(routes);
app.use(express.static(path.join(__dirname, "public"))); // publish folder public
app.use("*", require("./controllers/Site/oop.C"))
    // Server listen in port 3000
app.listen(port, () => {
    console.log(`Listen in port ${port}`);
});