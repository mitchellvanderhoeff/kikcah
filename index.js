/**
 * Created by mitch on 2014-03-31.
 */

var express = require('express');
var server = express();

server.use(express.static(__dirname + "/app"));

var port = process.env.PORT || 8000;
server.listen(port, function () {
   console.log("Listening on port " + port)
});