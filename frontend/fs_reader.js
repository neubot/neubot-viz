// frontend/fs_reader.js

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
// File system reader
//

var path = require("path");
var utils = require("./utils");

exports.serve__ = function (pathResource, response, contentType) {
    utils.servePath__(pathResource, response, contentType);
};

exports.reqtype = function(pathName) {
    var extension = path.extname(pathName);
    
    if (extension === "")
        extension = "plain";

    var contentType = {};
    contentType[".json"] = "application/json"
    contentType[".html"] = "text/html"
    contentType[".js"] = "application/javascript"
    contentType["plain"] = "text/plain"
    
    return contentType[extension];
};
