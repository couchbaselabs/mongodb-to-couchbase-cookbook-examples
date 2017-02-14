var Uuid = require("uuid");
var Bucket = require("../../app").bucket;
var N1qlQuery = require("couchbase").N1qlQuery;

function ServiceModel() { };

ServiceModel.save = function(data, callback) {
    data.id = Uuid.v4();
    data.type = "service";
    data.tenants = [];
    var statement = "INSERT INTO `" + Bucket._name + "` (KEY, VALUE) VALUES ($1, $2) RETURNING `" + Bucket._name + "`.*";
    var query = N1qlQuery.fromString(statement);
    Bucket.query(query, [data.id, data], function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, result);
    });
}

ServiceModel.updateTenants = function(id, services, callback) {
    var statement = "UPDATE `" + Bucket._name + "` USE KEYS $1 SET tenants = $2 RETURNING `" + Bucket._name + "`.*";
    var query = N1qlQuery.fromString(statement);
    Bucket.query(query, [id, services], function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, result);
    });
}

ServiceModel.getById = function(documentId, callback) {
    var statement = "SELECT s.id, s.type, s.name, " +
                    "(SELECT t.* FROM `" + Bucket._name + "` AS t USE KEYS s.tenants) AS tenants " +
                    "FROM `" + Bucket._name + "` AS s " +
                    "WHERE s.type = 'service' AND s.id = $1";
    var query = N1qlQuery.fromString(statement);
    Bucket.query(query, [documentId], function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

ServiceModel.getAll = function(callback) {
    var statement = "SELECT s.id, s.type, s.name, " +
                    "(SELECT t.* FROM `" + Bucket._name + "` AS t USE KEYS s.tenants) AS tenants " +
                    "FROM `" + Bucket._name + "` AS s " +
                    "WHERE s.type = 'service'";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    Bucket.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

module.exports = ServiceModel;