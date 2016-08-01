module.exports = function(app, pool){
    // API to get results
    app.get("/" + app.get("resultsURL") + "/results", function(req, res){
        var data = {};
        pool.query("SELECT lastname, firstname, response, timestamp_added \
                    FROM response_students;")
                .then( result => {
                    data.responses = result.rows;
                    return pool.query("SELECT COUNT(response) FROM response_students \
                        WHERE (response = true)");
                }).then( result => {
                    data.countTrue = parseInt(result.rows[0].count);

                    return pool.query("SELECT COUNT(response) FROM response_students\
                        WHERE (response = false)");
                }).then( result => {
                    data.countFalse = parseInt(result.rows[0].count);

                    return pool.query("SELECT lastname, firstname, timestamp_visited \
                                        FROM non_response_students;");
                }).then( result => {
                    data.nonResponses = result.rows;
                })

                .then(() => {res.json(data);});
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
};