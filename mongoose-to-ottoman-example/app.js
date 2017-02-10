var Mongoose = require("mongoose");
var Couchbase = require("couchbase");
var Ottoman = require("ottoman");
var Express = require("express");
var BodyParser = require("body-parser");

var argv = require("minimist")(process.argv.slice(2));

if(argv.database && argv.database != "couchbase" && argv.database != "mongodb") {
    return console.log("The `database` is invalid.  Choose `couchbase` or `mongodb`.");
}

var app = Express();
app.use(BodyParser.json());

if(argv.database && argv.database == "mongodb") {
    Mongoose.Promise = Promise;
    var tenantRoutes = require("./mongodb/routes/tenants")(app);
    var serviceRoutes = require("./mongodb/routes/services")(app);
    Mongoose.connect("mongodb://localhost:27017/example", function(error, database) {
        if(error) {
            return console.log("Could not establish a connection to MongoDB");
        }
        var server = app.listen(3000, function() {
            console.log("Connected on port 3000...");
        });
    });
} else {
    var bucket = (new Couchbase.Cluster("couchbase://localhost")).openBucket("example");
    Ottoman.store = new Ottoman.CbStoreAdapter(bucket, Couchbase);
    Ottoman.store.debug=true;
    var tenantRoutes = require("./couchbase/routes/tenants")(app);
    var serviceRoutes = require("./couchbase/routes/services")(app);
    var server = app.listen(3000, function() {
        console.log("Connected on port 3000...");
    });
}