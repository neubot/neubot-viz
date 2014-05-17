/** neuviz/frontend/router.js
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
var path = require("path");
var fsReader = require("./fs_reader");
var utils = require("./utils");
var ROOT = "/var/www/";
var API = "/neuviz/1.0/data/";

var regYear = /^[1-2][0-9][0-9][0-9]$/;
var regMonth = /^[0-1][0-9]$/;

var paths = {
    "/BebasNeue.otf": "/var/www/BebasNeue.otf",
    "/geo-data/world-110m.json": "/var/www/geo-data/world-110m.json",
    "/geo-data/world-country-names.tsv": "/var/www/geo-data/world-country-names.tsv",
    "/index.html": "/var/www/index.html",
    "/libs/d3.v3.min.js": "/var/www/libs/d3.v3.min.js",
    "/libs/queue.v1.min.js": "/var/www/libs/queue.v1.min.js",
    "/libs/topojson.js": "/var/www/libs/topojson.js",
    "/libs/topojson.v1.min.js": "/var/www/libs/topojson.v1.min.js"
};


/**
 *
 * Check if the parameters used in the Web API are acceptable
 *
 */

var checkParameters = function (pathName) {
    var parameter = pathName.split("/");
    console.info("router: " + parameter);
    if (parameter[0] === "" && parameter[1] === "neuviz" && parameter[2] === "1.0"
        && parameter[3] === "data" && parameter[4].match(regYear) 
        && parameter[5].match(regMonth)) {
        return ("/var/www/neuviz/1.0/data/result_" + parameter[5] +
            "_" + parameter[4] + ".json");
    }
    return undefined;
};


/**
 *
 * Use request parameters to retrieve data as a JSON resource
 * on the file system
 *
 */


var formatJSON = function (parameters) {

    /* TODO: improve the output of the python data processor
    to obtain a cleaner file name and a cleaner code */

    var file = "result_";
    var time = parameters[1].split("/");
    if (time[1].length == 1)
        file += "0" + time[1];
    else file += time[1];
    file += "_" + time[0] + ".json";
    return file;

}

/**
 *
 * Route toward the requested resource
 *
 */

var old_route = function (pathName) {

    if (pathName === "/") {
        pathName = "/index.html";
    }

    if (paths[pathName]) {
        return (path.join(ROOT, pathName));
    }

    return (checkParameters(pathName));
}

var route = function (request, response) {
    var pathResource = old_route(request.url);

    console.info("Path resource: " + pathResource)

    if (pathResource === undefined) {
        utils.badRequest(response);
        return;
    }

    var contentType = fsReader.reqtype(pathResource);

    fsReader.serve__(pathResource, response, contentType);
}

exports.route = route;
