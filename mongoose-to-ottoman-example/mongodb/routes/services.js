var ServiceModel = require("../models/models").ServiceModel;

var router = function(app) {

    app.get("/services", function(request, response) {
        ServiceModel.find({}).then(function(result) {
            response.send(result);
        }, function(error) {
            response.status(401).send({ "success": false, "message": error});
        });
    });

    app.get("/service/:id", function(request, response) {
        ServiceModel.findOne({"_id": request.params.id}).then(function(result) {
            response.send(result);
        }, function(error) {
            response.status(401).send({ "success": false, "message": error});
        });
    });

    app.post("/services", function(request, response) {
        if(!request.body.name) {
            return response.status(401).send({ "success": false, "message": "A `name` is required"});
        }
        var service = new ServiceModel({
            "name": request.body.name
        });
        service.save(function(error, service) {
            if(error) {
                return response.status(401).send({ "success": false, "message": error});
            }
            response.send(service);
        });
    });

}

module.exports = router;