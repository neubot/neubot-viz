// frontend/router.js

/*-
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
 */

//
// Requests router
//

var path = require("path");
var mimetype = require("./mimetype");
var utils = require("./utils");

var ROOT = "/var/www/";
var API = "/neuviz/1.0/data/";

var RE_DESCRIPTOR = /^[a-z]+$/;
var RE_YEAR = /^[1-2][0-9][0-9][0-9]$/;
var RE_MONTH = /^[0-1][0-9]$/;
var RE_MONTH_SHORT = /^[1-9]$/;

var URLS = [
    "/BebasNeue.otf",
    "/geo-data/world-110m.json",
    "/geo-data/world-country-names.tsv",
    "/index.html",
    "/libs/d3.v3.min.js",
    "/libs/queue.v1.min.js",
    "/libs/topojson.js",
    "/libs/topojson.v1.min.js"
];

var URL_TO_PATH = {
};

for (i = 0; i < URLS.length; ++i) {
    URL_TO_PATH[URLS[i]] = "/var/www" + URLS[i];
}

var translatePath = function (pathName) {

    var parameter = pathName.split("/");

    console.info("router: %j", parameter);

    //
    // Step #1: make sure that the parameters are correct
    //

    if (parameter[0] !== "") {
        console.warn("router: invalid first parameter");
        return undefined;
    }

    if (parameter[1] !== "neuviz") {
        console.warn("router: invalid API selector");
        return undefined;
    }

    if (parameter[2] !== "1.0") {
        console.warn("router: invalid API version");
        return undefined;
    }

    if (!parameter[3].match(RE_DESCRIPTOR)) {
        console.warn("router: invalid data descriptor");
        return undefined;
    }

    if (parameter.length >= 5 && !parameter[4].match(RE_YEAR)) {
        console.warn("router: invalid year");
        return undefined;
    }

    if (parameter.length >= 6 && !parameter[5].match(RE_MONTH)) {
        if (!parameter[5].match(RE_MONTH_SHORT)) {
            console.warn("router: invalid month");
            return undefined;
        }
        parameter[5] = "0" + parameter[5];
    }

    //
    // Step #2: translate the path
    //

    var pathTranslated = "/var/www/neuviz/1.0/" + parameter[3] + "/result";

    if (parameter.length >= 6) {
        pathTranslated += "_" + parameter[5] + "_" + parameter[4];
    } else if (parameter.length >= 5) {
        pathTranslated += "_XX_" + parameter[4];
    }

    return pathTranslated + ".json";
};

exports.route = function (request, response) {
    var pathName = request.url;
    var pathTranslated;

    if (pathName === "/") {
        pathName = "/index.html";
    }

    if (URL_TO_PATH[pathName]) {
        pathTranslated = path.join(ROOT, pathName);
    } else {
        pathTranslated = translatePath(pathName);
    }

    console.info("Path resource: " + pathTranslated)

    if (pathTranslated === undefined) {
        utils.badRequest(response);
        return;
    }

    var contentType = mimetype.reqtype(pathTranslated);

    utils.servePath__(pathTranslated, response, contentType);
};
