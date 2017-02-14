var ServiceModel = require("../models/service");

var router = function(app) {

    app.get("/services", function(request, response) {
        ServiceModel.getAll(function(error, result) {
            if(error) {
                return response.status(401).send({ "success": false, "message": error});
            }
            response.send(result);
        });
    });

    app.get("/service/:id", function(request, response) {
        ServiceModel.getById(request.params.id, function(error, result) {
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
        ServiceModel.save(request.body, function(error, result) {
            if(error) {
                return response.status(401).send({ "success": false, "message": error});
            }
            response.send(result);
        });
    });

}

module.exports = router;