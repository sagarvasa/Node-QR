var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'server/core/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader("Cache-Control", "no-cache");
    next();
})

require("./server/core/routes/index")(app);

app.use(function (req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).jsonp({ message: error.message });
});

app.listen(PORT, function () {
    console.log("server is up and running on port " + PORT);
})

module.exports = app;