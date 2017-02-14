var TenantModel = require("../models/tenant");
var ServiceModel = require("../models/service");

var router = function(app) {

    app.get("/tenants", function(request, response) {
        TenantModel.getAll(function(error, result) {
            if(error) {
                response.status(401).send({ "success": false, "message": error});
            }
            response.send(result);
        });
    });

    app.get("/tenant/:id", function(request, response) {
        TenantModel.getById(request.params.id, function(error, result) {
            if(error) {
                response.status(401).send({ "success": false, "message": error});
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
        TenantModel.save(request.body, function(error, tenant) {
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
                if(service != null && tenant != null) {
                    if(!tenant[0].services) {
                        tenant[0].services = [];
                    }
                    if(!service[0].tenants) {
                        service[0].tenants = [];
                    }
                    var services = [];
                    var tenants = [];
                    for(var i = 0; i < tenant[0].services.length; i++) {
                        services.push(tenant[0].services[i]._id);
                    }
                    for(var i = 0; i < service[0].tenants.length; i++) {
                        tenants.push(service[0].tenants[i]._id);
                    }
                    services.push(service[0]._id);
                    tenants.push(tenant[0]._id);
                    TenantModel.updateServices(tenant[0]._id, services, function(error, result) {});
                    ServiceModel.updateTenants(service[0]._id, tenants, function(error, result) {});
                    response.send(tenant[0]);
                } else {
                    return response.status(401).send({ "success": false, "message": "The `tenant_id` or `service_id` was invalid"});
                }
            });
        });
    });

}

module.exports = router;