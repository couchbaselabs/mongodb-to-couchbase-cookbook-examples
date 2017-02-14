var Uuid = require("uuid");
var Bucket = require("../../app").bucket;
var N1qlQuery = require("couchbase").N1qlQuery;

function TenantModel() { };

TenantModel.save = function(data, callback) {
    data.id = Uuid.v4();
    data.type = "tenant";
    data.services = [];
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

TenantModel.updateServices = function(id, services, callback) {
    var statement = "UPDATE `" + Bucket._name + "` USE KEYS $1 SET services = $2 RETURNING `" + Bucket._name + "`.*";
    var query = N1qlQuery.fromString(statement);
    Bucket.query(query, [id, services], function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, result);
    });
}

TenantModel.getById = function(documentId, callback) {
    var statement = "SELECT t.id, t.type, t.firstname, t.lastname, t.address, " +
                    "(SELECT s.* FROM `" + Bucket._name + "` AS s USE KEYS t.services) AS services " +
                    "FROM `" + Bucket._name + "` AS t " +
                    "WHERE t.type = 'tenant' AND t.id = $1";
    var query = N1qlQuery.fromString(statement);
    Bucket.query(query, [documentId], function(error, result) {
        if(error) {
            console.log(error);
            return callback(error, null);
        }
        callback(null, result);
    });
};

TenantModel.getAll = function(callback) {
    var statement = "SELECT t.id, t.type, t.firstname, t.lastname, t.address, " +
                    "(SELECT s.* FROM `" + Bucket._name + "` AS s USE KEYS t.services) AS services " +
                    "FROM `" + Bucket._name + "` AS t " +
                    "WHERE t.type = 'tenant'";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    Bucket.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

module.exports = TenantModel;