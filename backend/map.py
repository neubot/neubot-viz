# Map the Neubot data (.csv) in MongoDB 
# -------------------------------------
#
# Read the NeuBot CSV file, add the latitude, longitude and country name
# and store the values into MongoDB
#
# Author: Enrico Zimuel (e.zimuel@gmail.com)
#
import fileinput
import sys
import os.path
from pymongo import MongoClient  

if len(sys.argv) < 2:
    print "Usage: python neubot.py [file]"
    sys.exit()

if not os.path.exists(sys.argv[1]):
    print "Error: the file specified doesn't exist"
    sys.exit()

file_neubot = sys.argv[1]

client = MongoClient()
db_city = client.cities
db_neubot = client.neubot
db_country = client.countries

# Ensure index on MongoDB
db_city.city.ensure_index([('city',1), ('country',1)])
db_country.country.ensure_index('code', unique=True)

cities = {}
countries = {}

i = 0
for line in fileinput.input([file_neubot]):
    row = [x.replace('\"','').replace("\n",'') for x in line.split(', ')]
    
    # Get the geoinformation (lat,lon) for the city
    city_country = ''.join([row[14],'-',row[1].lower()])
    if not city_country in cities:
    	cities[city_country] =  db_city.city.find_one({ 'city' : row[14], 'country' : row[1].lower()})

    if (cities[city_country] == None) or (cities[city_country] == 'Error'):
        cities[city_country] = 'Error'
        continue

    # Get the full country name
    if not row[1] in countries:
        result = db_country.country.find_one({ 'code' : row[1] })
        countries[row[1]] = result['country']

    i += 1
    data = { 
        'ip'        : row[0],
        'uuid'      : row[11],
    	'download'  : float(row[4]),
    	'upload'    : float(row[10]),
        'conn_time' : float(row[3]),
    	'country'   : countries[row[1]],
    	'provider'  : row[2],
    	'city'      : row[14],
      	'lat'       : float(cities[city_country]['lat']),
       	'lon'       : float(cities[city_country]['lon']),
        'type'      : row[8],
        'month'     : int(row[16]),
        'year'      : int(row[17]),
        'hour'      : int(row[15])
	}
    db_neubot.samples.insert(data)
    print i

print "DONE"
