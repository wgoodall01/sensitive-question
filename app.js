var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.set("question", process.env.QUESTION || "Have you ever lied to a close friend in order to mislead them?");
app.set("port", process.env.PORT || 80);

// Middleware
app.use(bodyParser.json());
app.use("/", express.static(__dirname + "/static"));
app.use(morgan(app.get("dev") ? "dev" : "combined"));

// Render page on request of /
app.get("/", function(req, res){ res.render("index"); });

// API to get question
app.get("/question", function(req, res){
    res.json({status: "ok", question: app.locals.question});
});

// API to submit answer
app.post("/answer", function(req, res){
    var answer;
    if(req.body.answer === true){
        res.status(200).json({status:"ok"});
        answer = true;
    } else if(req.body.answer === false){
        res.status(200).json({status:"ok"});
        answer = false;
    }else{
        res.status(400).json({status: "error", error: "`answer` was not `true` or `false`"});
        return; 
    }

    // Write answer to database
    console.log("Answer recv: " + answer); // Demo code, remove this.
});

// Start server
console.log(` >> Listening on http://localhost:${app.get("port")} << `);
app.listen(app.get("port"));