// frontend/frontend.js

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
// The main file of the Neuviz frontend
//

var webServer = require('./server');
var router = require('./router');
var fsReader = require('./fs_reader');

webServer.start(router.route, fsReader.reqtype);
