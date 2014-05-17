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

var config = require("./config");
var path = require("path");
var mimetype = require("./mimetype");
var utils = require("./utils");

var RE_API = /^[a-z]+$/;
var RE_MONTH = /^[0-1][0-9]$/;
var RE_MONTH_SHORT = /^[1-9]$/;
var RE_YEAR = /^[1-2][0-9][0-9][0-9]$/;

var translateAPI = function (pathName) {

    var parameter = pathName.split("/");

    console.info("router: %j", parameter);

    //
    // Step #1: make sure that the parameters are correct
    //

    if (parameter[0] !== "") {
        console.warn("router: invalid first parameter");
        return undefined;
    }

    if (!parameter[1].match(RE_API)) {
        console.warn("router: invalid API selector");
        return undefined;
    }

    if (parameter[2] !== "1.0") {
        console.warn("router: invalid API version");
        return undefined;
    }

    if (parameter[3] !== "data") {
        console.warn("router: invalid command");
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

    var pathTranslated = "/var/www/" + parameter[1] + "/1.0/data/result";

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

    utils.logRequest(request);

    if (pathName.length >= 1 && pathName.substr(pathName.length -1) === "/")
        pathName += "index.html";

    pathTranslated = config.toStaticPath(pathName);
    if (pathTranslated === undefined)
        pathTranslated = translateAPI(pathName);

    console.info("Path resource: " + pathTranslated)

    if (pathTranslated === undefined) {
        utils.badRequest(response);
        return;
    }

    var contentType = mimetype.reqtype(pathTranslated);

    utils.servePath__(pathTranslated, response, contentType);
};

if (require.main === module) {
    console.info("router: unit test...");

    if (translateAPI("neuviz/1.0/data/2013/01/") !== undefined) {
        console.error("router: return something with wrong 0th param");
        process.exit(1);
    }

    if (translateAPI("/foobar/1.0/data/2013/01/") !== undefined) {
        console.error("router: return something with wrong 1st param");
        process.exit(1);
    }

    if (translateAPI("/neuviz/foobar/data/2013/01/") !== undefined) {
        console.error("router: return something with wrong 2nd param");
        process.exit(1);
    }

    if (translateAPI("/neuviz/1.0/foobar42/2013/01/") !== undefined) {
        console.error("router: return something with wrong 3th param");
        process.exit(1);
    }

    if (translateAPI("/neuviz/1.0/data/foobar/01/") !== undefined) {
        console.error("router: return something with wrong 4th param");
        process.exit(1);
    }

    if (translateAPI("/neuviz/1.0/data/2013/foobar/") !== undefined) {
        console.error("router: return something with wrong 5th param");
        process.exit(1);
    }

    if (translateAPI("/neuviz/1.0/data/2013/01/") === undefined) {
        console.error("router: return undefined for correct API");
        process.exit(1);
    }

    console.info("router: unit test... ok");
}
