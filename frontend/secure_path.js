/** neuviz/frontend/secure_path.js
*
* Copyright (c) 2014
*    Nexa Center for Internet & Society, Politecnico di Torino (DAUIN),
*    Giuseppe Futia <giuseppe.futia@polito.it>,
*    Simone Basso <simone.basso@polito.it>.
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
var fs = require("fs");

var sanitizePath = function (rootdir, upath) {
    var mapped, stats;

    mapped = path.join(rootdir, upath); 

    if (mapped.indexOf(rootdir, 0) !== 0) {
        return (-1);
    }

    try {
        stats = fs.statSync(mapped);
    } catch (error) {
        return (-2);
    }

    if (!stats.isFile()) {
        return (-3);
    }
    return (0);
};

exports.sanitizePath = sanitizePath;