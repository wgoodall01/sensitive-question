module.exports = function(app){
    // Render page on request of /
    app.get("/", function(req, res){ res.render("index"); });

    // Show results on request of results URL
    // URL isn't hard-coded because URL secrecy is used as bad janky authentication
    app.get("/" + app.get("resultsURL"), function(req, res){res.render("results"); });
};