// frontend/config.js

/*-
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
 */

//
// Configuration manager
//

var fs = require("fs");
var utils = require("./utils");

var STATIC_PATH = {};

exports.toStaticPath = function (pathName) {
    return STATIC_PATH[pathName];
};

exports.readConfig = function (callback) {
    console.info("config: reading configuration...");
    fs.readFile("etc/neuviz.json", "utf8", function (error, data) {
        var i, serveList, wholeConf;

        if (error) {
            console.error("config: missing 'etc/neuviz.json' file");
            process.exit(1);
        }

        console.info("config: opening 'etc/neuviz.json'");
        wholeConf = utils.safelyParseJSON(data);
        if (wholeConf === null) {
            console.error("config: invalid 'etc/neuviz.json' file");
            process.exit(1);
        }

        serveList = wholeConf.staticPaths;
        if (serveList === undefined) {
            console.error("config: missing staticPaths field");
            process.exit(1);
        }
        for (i = 0; i < serveList.length; ++i) {
            STATIC_PATH[serveList[i]] = "/var/www" + serveList[i];
            console.info("config: static route: %s => %s", serveList[i],
                STATIC_PATH[serveList[i]]);
        }

        console.info("config: reading configuration... ok");
        callback();
    });
};

if (require.main === module) {
    console.info("config: test suite...");
    exports.readConfig(function () {
        console.info("config: test suite... ok");
    });
}
