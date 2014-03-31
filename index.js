/**
 * Created by mitch on 2014-03-31.
 */

var express = require('express');
var server = express();

server.use(express.static(__dirname + "/app"));

server.listen(process.env.PORT || 8000, function(port) {
    console.log("Listening on port " + port)
});