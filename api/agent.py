# neuviz/agent.py

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


from twisted.internet import reactor
from twisted.internet.defer import Deferred
from twisted.internet.protocol import Protocol

from twisted.web.client import Agent
from twisted.web.http_headers import Headers


class AgentTester(Protocol):
    ''' AgentTester for Neuviz API '''

    def __init__(self, finished):
        self.finished = finished
        self.remaining = 1024 * 10

    def dataReceived(self, bytes):
        if self.remaining:
            display = bytes[:self.remaining]
            print 'Some data received:'
            print display
            self.remaining -= len(display)

    def connectionLost(self, reason):
        print 'Finished receiving body:', reason.getErrorMessage()
        self.finished.callback(None)

agent = Agent(reactor)

deferred = agent.request(
    'GET',
    'http://localhost:8000/neuviz/1.0/data/2013/4/',
    Headers({'User-Agent': ['Neuviz/0.1']}),
    None)

def printResult(response):
    print 'Response received'
    print 'Response version:', response.version
    print 'Response code:', response.code
    print 'Response phrase:', response.phrase
    finished = Deferred()
    response.deliverBody(AgentTester(finished))
    return finished
deferred.addCallback(printResult)

def cbShutdown(ignored):
    reactor.stop()
    
deferred.addBoth(cbShutdown)
reactor.run()