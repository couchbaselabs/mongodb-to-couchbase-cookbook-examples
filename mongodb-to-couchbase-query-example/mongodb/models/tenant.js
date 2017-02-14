var Database = require("../../app").database;
var ObjectId = require("mongodb").ObjectId;

function TenantModel() { };

TenantModel.save = function(data, callback) {
    Database.collection("tenants").insertOne(data, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
}

TenantModel.updateServices = function(id, services, callback) {
    Database.collection("tenants").updateOne({ "_id": new ObjectId(id) },
        {
            $set: { "services": services }
        }, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        }
    );
}

TenantModel.getById = function(documentId, callback) {
    var cursor = Database.collection("tenants").aggregate([
        { "$match": { "_id": new ObjectId(documentId) } },
        { "$unwind": { "path": "$services", "preserveNullAndEmptyArrays": true } },
        {
            "$lookup": {
                "from": "services",
                "localField": "services",
                "foreignField": "_id",
                "as": "serviceObjects"
            }
        },
        { "$unwind": { "path": "$serviceObjects", "preserveNullAndEmptyArrays": true } },
        { "$group": {
            "_id": {
                "_id": "$_id",
                "name": "$name"
            },
            "services": { "$push": "$serviceObjects" }
        }},
        {
            "$project": {
                "_id": "$_id._id",
                "name": "$_id.name",
                "services": "$services"
            }
        },
        { "$limit": 1 }
    ]);
    cursor.toArray(callback);
};

TenantModel.getAll = function(callback) {
    var cursor = Database.collection("tenants").aggregate([
        { "$unwind": { "path": "$services", "preserveNullAndEmptyArrays": true } },
        {
            "$lookup": {
                "from": "services",
                "localField": "services",
                "foreignField": "_id",
                "as": "serviceObjects"
            }
        },
        { "$unwind": { "path": "$serviceObjects", "preserveNullAndEmptyArrays": true } },
        { "$group": {
            "_id": {
                "_id": "$_id",
                "firstname": "$firstname",
                "lastname": "$lastname",
                "address": "$address"
            },
            "services": { "$push": "$serviceObjects" }
        }},
        {
            "$project": {
                "_id": "$_id._id",
                "firstname": "$_id.firstname",
                "lastname": "$_id.lastname",
                "address": "$_id.address",
                "services": "$services"
            }
        }
    ]);
    cursor.toArray(callback);
};

module.exports = TenantModel;