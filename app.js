var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var pg = require("pg");
var url = require("url");

// Set up postgres pool
pg.defaults.ssl = true;

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(":");

var pool = new pg.Pool({
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  ssl: true
});

process.on("unhandledRejection", function(e) {
  console.log(e.message, e.stack);
});

var app = express();
app.set("view engine", "pug");
app.set("views", "./views");

app.set("question", process.env.QUESTION || "Have you ever manipulated a friend to your own advantage?");
app.set("port", process.env.PORT || 80);
app.set("resultsURL", process.env.RESULTS_URL || "results");

// Middleware
app.use(bodyParser.json());
app.use("/", express.static(__dirname + "/static"));
app.use(morgan(app.get("dev") ? "dev" : "combined"));

// Render page on request of /
app.get("/", function(req, res){ res.render("index"); });

// Show results on request of results URL
// URL isn't hard-coded because URL secrecy is used as bad janky authentication
app.get("/" + app.get("resultsURL"), function(req, res){res.render("results"); });

// API to get results
app.get("/" + app.get("resultsURL") + "/results", function(req, res){
    var data = {};
    pool.query("SELECT * FROM response_students;")
            .then( result => {
                data.responses = result.rows;
                return pool.query("SELECT COUNT(response) FROM responses \
                    WHERE (response = true) AND (personid IS NOT NULL)");
            }).then( result => {
                data.countTrue = parseInt(result.rows[0].count);

                return pool.query("SELECT COUNT(response) FROM responses \
                    WHERE (response = false) AND (personid IS NOT NULL)");
            }).then( result => {
                data.countFalse = parseInt(result.rows[0].count);

                res.json(data);
            });
});

// API to get question
app.get("/question", function(req, res){
    res.json({status: "ok", question: app.get("question")});
});

// API to submit answer
app.post("/answer", function(req, res){
    var answer;
    if(req.body.answer === true){
        answer = true;
    } else if(req.body.answer === false){
        answer = false;
    }else{
        res.status(400).json({status: "error", error: "`answer` was not `true` or `false`"});
        return; 
    }

    var personid;
    if(typeof req.body.personid == "number"){
        personid = req.body.personid;
    }else if(typeof req.body.personid == "undefined" || typeof req.body.personid == "null"){
        personid = null;
    }else{
        res.status(400).json({status: "error", error: "`personid` was not a `number` or `undefined` or `null``"});
        return;
    }

    // Write answer to database
    pool.query("INSERT INTO responses(response, personid, timestamp_added) VALUES($1, $2, current_timestamp);", [answer, personid])
        .then(function(){
            res.status(200).json({status:"ok"});
        }).catch(function(err){
            res.status(500).json({status:"error", error:"Database error."});
            console.log(err);
        });
});

// Start server
console.log(` >> Listening on http://localhost:${app.get("port")} << `);
app.listen(app.get("port"));