var TenantModel = require("../models/models").TenantModel;
var ServiceModel = require("../models/models").ServiceModel;

var router = function(app) {

    app.get("/tenants", function(request, response) {
        TenantModel.find({}, {load: ["services"]}, function(error, result) {
            if(error) {
                return response.status(401).send({ "success": false, "message": error});
            }
            response.send(result);
        });
    });

    app.get("/tenant/:id", function(request, response) {
        TenantModel.getById(request.params.id, {load: ["services"]}, function(error, result) {
            if(error) {
                return response.status(401).send({ "success": false, "message": error});
            }
            response.send(result);
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
        tenant.save(function(error, result) {
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
        ServiceModel.getById(request.body.service_id, function(error, service) {
            if(error) {
                return response.status(401).send({ "success": false, "message": error});
            }
            TenantModel.getById(request.body.tenant_id, function(error, tenant) {
                if(error) {
                    return response.status(401).send({ "success": false, "message": error});
                }
                if(!tenant.services) {
                    tenant.services = [];
                }
                if(!service.tenants) {
                    service.tenants = [];
                }
                tenant.services.push(ServiceModel.ref(service._id));
                service.tenants.push(TenantModel.ref(tenant._id));
                tenant.save(function(error, result) {});
                service.save(function(error, result) {});
                response.send(tenant);
            });
        });
    });

}

module.exports = router;