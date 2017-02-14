var MongoClient = require("mongodb").MongoClient;
var Couchbase = require("couchbase");
var Express = require("express");
var BodyParser = require("body-parser");

var argv = require("minimist")(process.argv.slice(2));

if(argv.database && argv.database != "couchbase" && argv.database != "mongodb") {
    return console.log("The `database` is invalid.  Choose `couchbase` or `mongodb`.");
}

var app = Express();
app.use(BodyParser.json());

if(argv.database && argv.database == "mongodb") {
    MongoClient.connect("mongodb://localhost:27017/example", function(error, database) {
        if(error) {
            return console.log("Could not establish a connection to MongoDB");
        }
        module.exports.database = database;
        var tenantRoutes = require("./mongodb/routes/tenants")(app);
        var serviceRoutes = require("./mongodb/routes/services")(app);
        var server = app.listen(3000, function() {
            console.log("Connected on port 3000...");
        });
    });
} else {
    module.exports.bucket = (new Couchbase.Cluster("couchbase://localhost")).openBucket("example");
    var tenantRoutes = require("./couchbase/routes/tenants")(app);
    var serviceRoutes = require("./couchbase/routes/services")(app);
    var server = app.listen(3000, function() {
        console.log("Connected on port 3000...");
    });
}