var Database = require("../../app").database;
var ObjectId = require("mongodb").ObjectId;

function ServiceModel() { };

ServiceModel.save = function(data, callback) {
    Database.collection("services").insertOne(data, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
}

ServiceModel.updateTenants = function(id, tenants, callback) {
    Database.collection("services").updateOne({ "_id": new ObjectId(id) },
        {
            $set: { "tenants": tenants }
        }, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        }
    );
}

ServiceModel.getById = function(documentId, callback) {
    var cursor = Database.collection("services").aggregate([
        { "$match": { "_id": new ObjectId(documentId) } },
        { "$unwind": { "path": "$tenants", "preserveNullAndEmptyArrays": true } },
        {
            "$lookup": {
                "from": "tenants",
                "localField": "tenants",
                "foreignField": "_id",
                "as": "tenantObjects"
            }
        },
        { "$unwind": { "path": "$tenantObjects", "preserveNullAndEmptyArrays": true} },
        { "$group": {
            "_id": {
                "_id": "$_id",
                "name": "$name"
            },
            "tenants": { "$push": "$tenantObjects" }
        }},
        {
            "$project": {
                "_id": "$_id._id",
                "name": "$_id.name",
                "tenants": "$tenants"
            }
        },
        { "$limit": 1 }
    ]);
    cursor.toArray(callback);
};

ServiceModel.getAll = function(callback) {
    var cursor = Database.collection("services").aggregate([
        { "$unwind": { "path": "$tenants", "preserveNullAndEmptyArrays": true} },
        {
            "$lookup": {
                "from": "tenants",
                "localField": "tenants",
                "foreignField": "_id",
                "as": "tenantObjects"
            }
        },
        { "$unwind": { "path": "$tenantObjects", "preserveNullAndEmptyArrays": true} },
        { "$group": {
            "_id": {
                "_id": "$_id",
                "name": "$name"
            },
            "tenants": { "$push": "$tenantObjects" }
        }},
        {
            "$project": {
                "_id": "$_id._id",
                "name": "$_id.name",
                "tenants": "$tenants"
            }
        }
    ]);
    cursor.toArray(callback);
};

module.exports = ServiceModel;