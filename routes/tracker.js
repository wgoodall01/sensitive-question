module.exports = function(app, pool){
    // Tracker image endpoint for emails.
    app.get("/:id/tracker.png", function(req, res) {
    var personid = parseInt(req.params.id);
    
    // Insert into db tracker table
    pool.query("INSERT INTO tracker(personid, timestamp_visited) \
                values($1, current_timestamp)", [personid])
        .then(function(result){
            console.log("TRACKER: hit on " + personid);
            var buf = new Buffer([
                0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
                0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
                0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
                0x02, 0x44, 0x01, 0x00, 0x3b
            ]);
            res.set("Content-Type", "image/png");
            res.end(buf, "binary");
        })
        .catch(function(err){
            res.status(500).end();
        });
    });
};