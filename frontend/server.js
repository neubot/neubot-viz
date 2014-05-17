/** neuviz/frontend/server.js
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
var http = require('http');

var WEB_SERVER_PORT = 4000;

var errorResponse = function (res, code, reason, log_message) {
    console.error('%s', log_message);
    res.writeHead(code, {
        'Content-Type': 'text/plain'
    });
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


/**
 *
 * Manage the HTTP request
 *
 */

var start = function (route, serve, reqtype) {

    var onRequest = function (req, res) {
        if (req.url == "/favicon.ico")
            return;

        var pathResource = route(req.url);

        console.info("Path resource: " + pathResource)


        if (pathResource === undefined) {
            badRequest(res, "Bad Request");
            return;
        }

        var resource = serve(pathResource);

        if (resource === "UNABLE TO READ FILE") {
            notFound(res, "Resource not found");
            return;
        }

        var contentType = reqtype(pathResource);
        res.writeHead(200, {
            'Content-Type': contentType
        });
        res.write(resource);
        res.end();
    }

    var webServer = http.createServer(onRequest);
    webServer.on('listening', function () {
        console.info('Web Server running at port %d', WEB_SERVER_PORT);
    });

    webServer.on('error', function (err) {
        console.info('Error occurred with the Web Server:', err.message);
    });

    webServer.listen(WEB_SERVER_PORT);

};

exports.start = start;
