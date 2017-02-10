var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var ObjectId = Mongoose.SchemaTypes.ObjectId;

var ServiceSchema = new Mongoose.Schema({
    name: String,
    tenants: [
        {
            type: ObjectId,
            ref: TenantSchema
        }
    ]
});

var TenantSchema = new Mongoose.Schema({
    firstname: String,
    lastname: String,
    address: {
        city: String,
        state: String
    },
    services: [
        {
            type: ObjectId,
            ref: ServiceSchema
        }
    ]
});

var MappingSchema = new Mongoose.Schema({
    name: String
});

module.exports.ServiceModel = Mongoose.model("Service", ServiceSchema);
module.exports.TenantModel = Mongoose.model("Tenant", TenantSchema);