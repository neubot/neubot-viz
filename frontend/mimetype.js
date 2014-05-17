// frontend/mimetype.js

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
 */

//
// Mimetype module
//

var path = require("path");

var CONTENT_TYPE = {
    ".json": "application/json",
    ".html": "text/html",
    ".js": "application/javascript"
};

exports.reqtype = function(pathName) {
    var extension = path.extname(pathName);
    
    var mimeType = CONTENT_TYPE[extension];
    if (!mimeType)
        mimeType = "text/plain";

    return mimeType;
};

if (require.main === module) {
    console.info("mimetype: unit test...");

    if (exports.reqtype("foo.json") !== "application/json") {
        console.error("mimetype: wrong mime type for .json");
        process.exit(1);
    }

    if (exports.reqtype("foo.html") !== "text/html") {
        console.error("mimetype: wrong mime type for .html");
        process.exit(1);
    }

    if (exports.reqtype("foo.js") !== "application/javascript") {
        console.error("mimetype: wrong mime type for .js");
        process.exit(1);
    }

    if (exports.reqtype("foo") !== "text/plain") {
        console.error("mimetype: wrong default mime type");
        process.exit(1);
    }

    console.info("fs_reader: unit test... ok");
}
