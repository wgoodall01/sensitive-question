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

// Routes
require("./routes/pages")(app);
require("./routes/api")(app, pool);
require("./routes/tracker")(app, pool);

// Start server
console.log(` >> Listening on http://localhost:${app.get("port")} << `);
app.listen(app.get("port"));