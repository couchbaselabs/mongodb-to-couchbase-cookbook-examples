var Ottoman = require("ottoman");

var ServiceModel = Ottoman.model("Service", {
    name: { type: "string" },
    tenants: [
        {
            ref: "Tenant"
        }
    ]
});

var TenantModel = Ottoman.model("Tenant", {
    firstname: { type: "string" },
    lastname: { type: "string" },
    address: {
        city: { type: "string" },
        state: { type: "string" }
    },
    services: [
        {
            ref: "Service"
        }
    ]
});

module.exports.TenantModel = TenantModel;
module.exports.ServiceModel = ServiceModel;