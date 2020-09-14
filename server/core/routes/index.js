var controller = require("../controllers");

const router = function (app) {

    app.route("/ping")
        .get(function (req, res) {
            res.status(200).send({ message: "pong" })
        })
    
    app.route("/")
        .get(controller.renderForm)
        .post(controller.generateQR)

    app.route("/uri")
        .post(controller.generateQRURI)
    
    app.route("/save")
        .post(controller.downloadQR)

}


module.exports = router;