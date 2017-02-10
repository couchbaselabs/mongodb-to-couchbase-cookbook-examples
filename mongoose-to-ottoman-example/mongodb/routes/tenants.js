var ServiceModel = require("../models/models").ServiceModel;
var TenantModel = require("../models/models").TenantModel;

var router = function(app) {

    app.get("/tenants", function(request, response) {
        TenantModel.find({}).then(function(result) {
            response.send(result);
        }, function(error) {
            response.status(401).send({ "success": false, "message": error});
        });
    });

    app.get("/tenant/:id", function(request, response) {
        TenantModel.findOne({"_id": request.params.id}).then(function(result) {
            response.send(result);
        }, function(error) {
            response.status(401).send({ "success": false, "message": error});
        });
    });

    app.post("/tenants", function(request, response) {
        if(!request.body.firstname) {
            return response.status(401).send({ "success": false, "message": "A `firstname` is required"});
        } else if(!request.body.lastname) {
            return response.status(401).send({ "success": false, "message": "A `lastname` is required"});
        } else if(!request.body.address) {
            return response.status(401).send({ "success": false, "message": "An `address` is required"});
        }
        var tenant = new TenantModel({
            "firstname": request.body.firstname,
            "lastname": request.body.lastname,
            "address": {
                "city": request.body.address.city,
                "state": request.body.address.state
            }
        });
        tenant.save(function(error, tenant) {
            if(error) {
                return response.status(401).send({ "success": false, "message": error});
            }
            response.send(tenant);
        });
    });

    app.post("/tenant/service", function(request, response) {
        if(!request.body.tenant_id) {
            return response.status(401).send({ "success": false, "message": "A `tenant_id` is required" });
        } else if(!request.body.service_id) {
            return response.status(401).send({ "success": false, "message": "A `service_id` is required" });
        }
        ServiceModel.findOne({"_id": request.body.service_id}).then(function(service) {
            TenantModel.findOne({"_id": request.body.tenant_id}).then(function(tenant) {
                if(service != null && tenant != null) {
                    if(!tenant.services) {
                        tenant.services = [];
                    }
                    if(!service.tenants) {
                        service.tenants = [];
                    }
                    tenant.services.push(service._id);
                    service.tenants.push(tenant._id);
                    tenant.save();
                    service.save();
                    response.send(tenant);
                } else {
                    return response.status(401).send({ "success": false, "message": "The `tenant_id` or `service_id` was invalid"});
                }
            }, function(error) {
                return response.status(401).send({ "success": false, "message": error});
            });
        }, function(error) {
            return response.status(401).send({ "success": false, "message": error});
        });
    });

}

module.exports = router;