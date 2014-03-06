/** neuviz/frontend/frontend.js
*
* Copyright (c) 2014
*    Nexa Center for Internet & Society, Politecnico di Torino (DAUIN)
*    and Giuseppe Futia <giuseppe.futia@polito.it>.
*
* This file is part of NeuViz.
*
* NeuViz is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* NeuViz is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with NeuViz.  If not, see <http://www.gnu.org/licenses/>.
*
**/

//var fs = require('fs');
//var http = require('http');
//var path = require('path');

//var API = "/neuviz/1.0/data/";
//var ROOT = "/var/www/";
//var RE_PATH = /^[a-z0-9/-]+$/;
//var WEB_API_PORT = 8000;
//var years = {};
//var months = {};

/*String.prototype.startsWith = function (prefix) {
    if(this.indexOf(prefix) === 0) {
        return true;
    }
    return false;
};*/

/*

var errorResponse = function (res, code, reason, log_message) {
    console.error('%s', log_message);
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(code + " " + reason + "\r\n");
};

var badRequest = function (res, log_message) {
    errorResponse(res, 400, 'Bad Request', log_message);
};

var internalError = function (res, log_message) {
	errorResponse(res, 500, 'Internal Server Error', log_message);
};

var notFound = function (res, log_message) {
	errorResponse(res, 404, 'File not found', log_message);
};


var fillYears = function () {
    years["2012"] = true;
    years["2013"] = true;
};

var fillMonths = function () {
    for (var i = 1; i<=12; i++) {
       months[i] = true;
    }
};

var checkParameters = function (parameters) {
    var parameter = parameters.split("/");
    if (parameter.length>2) return false;
    if (years[parameter[0]] === undefined) return false;
    if (months[parameter[1]] === undefined) return false;
    return true;
}

var webAPIResponse = function (req, res) {

    var url = req.url; 
    var mapped = path.join(ROOT, url);
    var checker = path.join(ROOT, API);
    
    if (mapped.startsWith(checker)) {
        var parameters = mapped.split(checker);
        if (!RE_PATH.test(parameters[1]) || !checkParameters(parameters[1])) {
            badRequest(res, "Invalid request");
            return;
        }
        
        var file = "result_";
        var time = parameters[1].split("/");
        if (time[1].length == 1)
            file += "0" + time[1];  
        else file += time[1];
        file += "_" + time[0] + ".json";

        var pathResource = path.join(checker, file);
        var pathOK = false;
        
        try {
            var stats = fs.statSync(pathResource);
            pathOK = true;
        } catch (error) {
            console.info(error);
        }

        if (pathOK) {
            fs.readFile(pathResource, function (err, file) {
                if(err) {        
                    internalError("Internal Error")
                    return;
                }
                res.writeHead(200, {'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin' : '*' });
                res.write(file);
                res.end();
            });
        } else {
             notFound(res, "Resource not found");
        }

    } else {
        badRequest(res, "Request not supported by NeuViz API" +mapped);
    }
};

var webAPI = http.createServer(webAPIResponse); 

webAPI.on('listening', function (){
    fillYears();
    fillMonths();
	console.info('Web API running at port %d', WEB_API_PORT);
});

webAPI.on('error', function (err) {
    console.error('Error occurred with the Web API Server:', err.message);
});

webAPI.listen(WEB_API_PORT); */

var webServer = require('./server.js');
var router = require('./router.js');
var fsReader = require('./fs_reader.js')

webServer.start(router.route, fsReader.serve, fsReader.reqtype);