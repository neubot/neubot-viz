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

var years = {};
var months = {};

/**
 *
 * Set year paramaters available for the Web API
 *
 */

var fillYears = function () {
    years["2012"] = true;
    years["2013"] = true;
};


/**
 *
 * Set month paramaters available for the Web API
 *
 */

var fillMonths = function () {
    for (var i = 1; i <= 12; i++) {
        months[i] = true;
    }
};


/**
 *
 * Check if the parameters used in the Web API are acceptable
 *
 */

var checkParameters = function (parameters) {
    fillYears();
    fillMonths();
    var parameter = parameters.split("/");
    if (parameter.length > 2) return false;
    if (years[parameter[0]] === undefined) return false;
    if (months[parameter[1]] === undefined) return false;
    return true;
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
    var resource = undefined;

    if (pathName.indexOf(API, 0) === 0) {
        var mapped = path.join(ROOT, pathName);
        var pathController = path.join(ROOT, API);

        if (mapped.indexOf(pathController, 0) === 0) {

            var parameters = mapped.split(pathController);

            if (checkParameters(parameters[1])) {
                resource = ROOT + API + formatJSON(parameters);
            }
        }
    } else if (pathName === "" || pathName === "/" || pathName === "index" || pathName === "index.html") {
        pathName = "/index.html";
        resource = path.join(ROOT, pathName);
    } else {
        var staticResource = path.join(ROOT, pathName);
        if (staticResource.indexOf(ROOT, 0) === 0) {
            resource = staticResource;
        }
    }

    return resource;
}

var route = function (request, response) {
    var pathResource = old_route(request.url);

    console.info("Path resource: " + pathResource)


    if (pathResource === undefined) {
        utils.badRequest(request, response);
        return;
    }

    var resource = fsReader.serve(pathResource);

    if (resource === "UNABLE TO READ FILE") {
        utils.notFound(request, response);
        return;
    }

    var contentType = fsReader.reqtype(pathResource);
    res.writeHead(200, {
        'Content-Type': contentType
    });

    res.write(resource);
    res.end();
}

exports.route = route;
