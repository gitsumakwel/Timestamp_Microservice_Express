// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

//11-13-2021
var bodyParser = require('body-parser');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');


//11-13-2021
//request object, response object, next function
const posthandler = (req,res,next) => {
    //log the request
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    // you need to declare, coz your server will get stuck
    next();
}

//11-14-2021
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Time Stamp",
      description: "FCC Backend Project - Timestamp Microservice",
      contact: {
        name: "Brill Jasper Amisola Rayel"
      },
    }
  },
  // ['.routes/*.js']
  apis: ["server.js"]
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


/**
 * @swagger
*  /api/{date}:
*    get:
*      description: Date in unix and utc
*      parameters:
*        - in: path
*          name: date
*          description: input date yyyy-mm-dd or unix 10-digit
*          schema:
*            type: string
*      responses:
*        '200':
*          description: Success
*          content:
*            application/json; charset=utf-8:
*              schema:
*                type: string
*              examples: {}
*      servers:
*        - url: https://boilerplate-project-timestamp.gitsumakwel.repl.co
*    servers:
*      - url: https://boilerplate-project-timestamp.gitsumakwel.repl.co
 */
const getJsonDate = (req,res,next) => {
  //regexp to check for letters and format
  const regAlphaNum = new RegExp('[a-z]','gi');
  const regDate = new RegExp('\\d\\d\\d\\d-\\d\\d-\\d\\d');
  const date = req.params.date===undefined? undefined : (req.params.date || "date");
  //empty date
  if (date===undefined){
    res.json( { unix : Math.floor((new Date(Date.now())/1)), utc : new Date(Date.now()).toUTCString() });
    return;
  }
  //invalid date
  if (regAlphaNum.test(date)) {
    res.json({ error : "Invalid Date" });
    return;
  }

  //for valid date
  if (regDate.test(date) || !isNaN(date)) {
    //get unix
    const unix = Math.floor((new Date(date))/1) || date;
    //get utc
    let utc = new Date(date).toUTCString();
    if (!isNaN(date)) utc = new Date(Number.parseInt(date)).toUTCString();
    res.json({ unix: Number.parseInt(unix), utc: utc});
    return;
  }
  //invalid format
  res.json({ error : "Invalid Date" });
}

const jsonDate = (req,res) => {
   res.json( { unix : Math.floor((new Date(Date.now())/1)), utc : new Date(Date.now()).toUTCString() });
}


const postJsonDate = (req,res) => {
  console.log(req.body);
  const date = req.body.date || "date";
  res.json({ date: `${date}`});
}

//app.use - only for GET request
//use to include static assets needed by your application (stylesheets, scripts, images)
app.use('/public',express.static(__dirname + '/public'));
app.use('/src',express.static(__dirname + '/src'));
// will be called for any request
// use for loging request
app.use(posthandler);
// use for 'POST' request
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
app.route('/api/undefined').get(jsonDate).post(jsonDate);
app.route('/api/:date?').get(getJsonDate);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
