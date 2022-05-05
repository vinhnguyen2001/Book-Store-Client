const express= require('express');
const app = express();
const port =3000;
const exhbs = require('express-handlebars');
const methodOverride = require('method-override');

// import cookie parser
const cookieParser = require('cookie-parser');

//body parser
const bodyParser = require('body-parser');