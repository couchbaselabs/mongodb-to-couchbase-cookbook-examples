var ServiceModel = require("../models/models").ServiceModel;

var router = function(app) {

    app.get("/services", function(request, response) {
        ServiceModel.find({}, {load: ["tenants"]}, function(error, result) {
            if(error) {
                return response.status(401).send({ "success": false, "message": error});
            }
            response.send(result);
        });
    });

    app.get("/service/:id", function(request, response) {
        ServiceModel.getById(request.params.id, {load: ["tenants"]}, function(error, result) {
            if(error) {
                return response.status(401).send({ "success": false, "message": error});
            }
            response.send(result);
        });
    });

    app.post("/services", function(request, response) {
        if(!request.body.name) {
            return response.status(401).send({ "success": false, "message": "A `name` is required"});
        }
        var service = new ServiceModel({
            "name": request.body.name
        });
        service.save(function(error, result) {
            if(error) {
                return response.status(401).send({ "success": false, "message": error});
            }
            response.send(service);
        });
    });

}

module.exports = router;