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
var securePath = require("./secure_path.js")

var ROOT = "/var/www/";

var route = function (pathName) {
	var resource;
	
	if (pathName === "" || pathName === "/" || pathName === "index" || pathName === "index.html") {
        pathName = "/index.html"; // Sets it to the index page
        resource = path.join(ROOT,pathName);
	    return resource;
    }

	if(securePath.sanitizePath(ROOT,pathName) != 0) {
        resource = "BAD REQUEST";
        return resource;
	}

	resource = path.join(ROOT,pathName);
	return resource;

}

exports.route = route;