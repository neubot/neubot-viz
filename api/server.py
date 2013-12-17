# neuviz/server.py

#
# Copyright (c) 2013
#     Nexa Center for Internet & Society, Politecnico di Torino (DAUIN)
#     and Giuseppe Futia <giuseppe.futia@polito.it>.
#
# This file is part of NeuViz.
#
# NeuViz is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# NeuViz is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with NeuViz.  If not, see <http://www.gnu.org/licenses/>.
#

    
import logging


from twisted.internet import reactor

from twisted.protocols.basic import FileSender

from twisted.python.log import err

from twisted.web.resource import Resource, NoResource
from twisted.web.server import Site, NOT_DONE_YET
from twisted.web.static import File



class HttpRouter(Resource):
    ''' HttpRouter to manage NeuViz API requests ''' 
    
    isLeaf = False;

    def getChild(self, name, request):
        if name == 'neuviz':
            return FileLoader(dataRoot)

        else: 
            return NoResource()


class FileLoader(Resource):
    '''FileLoader to load data from json files'''          
    
    isLeaf = True;

    def __init__(self, dataRoot):
        self.dataRoot = dataRoot

    def isNumber(self, s):
        try:
            float(s)
            return True
        except ValueError:
            return False

    def fileCheck(self, fn):
        try:
            open(fn, "rb")
            return 1
        except IOError:
            print "No data available for this period!"
        return 0

    def cbFinished(self, ignored, fp, request):
        logging.debug("[START --- FileLoader.cbFinished]")
        fp.close()
        request.finish()
        logging.debug("[END --- FileLoader.cbFinished]")

    def render_GET(self, request):
        logging.debug("[START --- FileLoader.render_GET]")
        apiStr = "/neuviz/1.0/data/"
        uri = request.uri

        if apiStr in uri:    
            request.setHeader('Content-Type', 'application/json')
            request.setHeader('Access-Control-Allow-Origin', '*')  
            
            try:
                children = uri.split('/');
                initStr = children[1]
                year = children[4]
                month = children[5]
                endStr = children[6]
            except Exception, e:
                return '{"success": "false", "response": "The request is not properly formatted"}'

            if initStr != "neuviz":
                return '{"success": "false", "response": "Invalid request"}'
            if not (self.isNumber(year) and 2012 <= float(year) <= 2013):
                return '{"success": "false", "response": "Invalid request"}'
            if not(self.isNumber(month) and 1 <= float(month) <= 12):
                return '{"success": "false", "response": "Invalid request"}'
            if endStr != "":
                return '{"success": "false", "response": "Invalid request"}'        

            fileName = self.dataRoot+"result_"+month+"_"+year+".json"
            
            if not (self.fileCheck(fileName)):
                return '{"success": "false", "response": "No data available for this period"}'

            fp = open(fileName, "rb")
            sender = FileSender()
            sender.CHUNK_SIZE = 2 ** 16   
            d = sender.beginFileTransfer(fp, request)  
            d.addCallback(self.cbFinished, fp, request)
            d.addErrback(err, "Streaming data to client failed")
            
            logging.debug("[END --- FileLoader.render_GET]")
            return NOT_DONE_YET    
        else: 
            return '{"success": "false", "response": "The request is not properly formatted"}'

if __name__ == '__main__':
    logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)
    dataRoot = '../public/data/'
    site = Site(HttpRouter())	
    reactor.listenTCP(8000, site)
    print 'Server is responding at http://localhost:8000/'
    reactor.run()