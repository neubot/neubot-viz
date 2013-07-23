# Reduce the Neubot data from MongoDB to JSON
# -------------------------------------------
#
# Extract the data by month/year and aggregate by:
# - hour, provider, city, country
# Elaborate the median of each value:
# - download, upload, connection_time
#
# Author: Enrico Zimuel (e.zimuel@gmail.com)
#
import sys
import numpy
import math
import json
from pymongo import MongoClient  

if len(sys.argv) < 4:
    print "Usage: python reduce.py [month] [year] [fileout]"
    sys.exit()

month = int(sys.argv[1])
year = int(sys.argv[2])
fileout = sys.argv[3]

client = MongoClient()
db = client.neubot

print "Ensure index on MongoDB"
db.samples.ensure_index([('year', 1), ('month', 1), ('country', 1)])
db.samples.ensure_index([('year', 1), ('month', 1), ('country', 1), ('city', 1)])
db.samples.ensure_index([('year', 1), ('month', 1), ('country', 1), ('city', 1), ('provider', 1)])
db.samples.ensure_index([('year', 1), ('month', 1), ('country', 1), ('city', 1), ('provider', 1), ('uuid', 1)])
db.samples.ensure_index([('year', 1), ('month', 1), ('hour', 1), ('country', 1), ('city', 1), ('provider', 1)])
db.samples.ensure_index([('year', 1), ('month', 1), ('hour', 1), ('country', 1), ('city', 1), ('provider', 1), ('uuid', 1)])
db.samples.ensure_index([('year', 1), ('month', 1), ('country', 1), ('city', 1), ('uuid', 1)])
db.samples.ensure_index([('year', 1), ('month', 1), ('hour', 1), ('country', 1), ('city', 1)])
db.samples.ensure_index([('year', 1), ('month', 1), ('hour', 1), ('country', 1), ('city', 1), ('uuid', 1)])
db.samples.ensure_index([('year', 1), ('month', 1), ('country', 1), ('uuid', 1)])
db.samples.ensure_index([('year', 1), ('month', 1), ('hour', 1), ('country', 1)])
db.samples.ensure_index([('year', 1), ('month', 1), ('hour', 1), ('country', 1), ('uuid', 1)])

def lat_city(city, db):
    result = db.samples.find_one({ 'city' : city })
    return result['lat']

def lon_city(city, db):
    result = db.samples.find_one({ 'city' : city })
    return result['lon']

def get_max(max_value, data):
    if data['speedtest']['download'] > max_value['speedtest']['download']:
        max_value['speedtest']['download'] = data['speedtest']['download']
    if data['speedtest']['upload'] > max_value['speedtest']['upload']:
        max_value['speedtest']['upload'] = data['speedtest']['upload']
    if data['speedtest']['conn_time'] > max_value['speedtest']['conn_time']:
        max_value['speedtest']['conn_time'] = data['speedtest']['conn_time']
    if data['bittorrent']['download'] > max_value['bittorrent']['download']:
        max_value['bittorrent']['download'] = data['bittorrent']['download']
    if data['bittorrent']['upload'] > max_value['bittorrent']['upload']:
        max_value['bittorrent']['upload'] = data['bittorrent']['upload']
    if data['bittorrent']['conn_time'] > max_value['bittorrent']['conn_time']:
        max_value['bittorrent']['conn_time'] = data['bittorrent']['conn_time']
    return max_value         
            
def get_min(min_value, data):
    if data['speedtest']['download'] < min_value['speedtest']['download']:
        min_value['speedtest']['download'] = data['speedtest']['download']
    if data['speedtest']['upload'] < min_value['speedtest']['upload']:
        min_value['speedtest']['upload'] = data['speedtest']['upload']
    if data['speedtest']['conn_time'] < min_value['speedtest']['conn_time']:
        min_value['speedtest']['conn_time'] = data['speedtest']['conn_time']
    if data['bittorrent']['download'] < min_value['bittorrent']['download']:
        min_value['bittorrent']['download'] = data['bittorrent']['download']
    if data['bittorrent']['upload'] < min_value['bittorrent']['upload']:
        min_value['bittorrent']['upload'] = data['bittorrent']['upload']
    if data['bittorrent']['conn_time'] < min_value['bittorrent']['conn_time']:
        min_value['bittorrent']['conn_time'] = data['bittorrent']['conn_time']
    return min_value       
             
max_value = {
    'speedtest' : {
        'download'  : 0,
        'upload'    : 0,
        'conn_time' : 0
    },
    'bittorrent' : {
        'download'  : 0,
        'upload'    : 0,
        'conn_time' : 0
    }
}

min_value = {
    'speedtest' : {
        'download'  : sys.maxint,
        'upload'    : sys.maxint,
        'conn_time' : sys.maxint
    },
    'bittorrent' : {
        'download'  : sys.maxint,
        'upload'    : sys.maxint,
        'conn_time' : sys.maxint
    }
}

# Median of the Neubot data 
def median(clients):
    data  = {
        'num_sample' : 0,
        'bittorrent' : {
            'download'  : [],
            'upload'    : [],
            'conn_time' : []
         },
         'speedtest' : {
            'download'  : [],
            'upload'    : [],
            'conn_time' : []
         },
    } 
    for client in clients:
        data[client['type']]['download'].append(client['download'])
        data[client['type']]['upload'].append(client['upload'])
        data[client['type']]['conn_time'].append(client['conn_time'])
        data['num_sample'] += 1
    if 'bittorrent' in data:
        data['bittorrent']['download']  = numpy.median(data['bittorrent']['download'])
        data['bittorrent']['upload']    = numpy.median(data['bittorrent']['upload'])
        data['bittorrent']['conn_time'] = numpy.median(data['bittorrent']['conn_time'])  
    if 'speedtest' in data:
        data['speedtest']['download']   = numpy.median(data['speedtest']['download'])
        data['speedtest']['upload']     = numpy.median(data['speedtest']['upload'])
        data['speedtest']['conn_time']  = numpy.median(data['speedtest']['conn_time'])
    return data

# Query the MongoDB with params and calculate the median 
def aggregate(params, min_value, max_value):
    num_client = db.samples.find(params).distinct('uuid')
    data_client = {
        'num_client' : len(num_client),
        'num_sample' : 0
    }
    # Median
    for hour in range(0,23):
        params['hour'] = hour
        clients =  db.samples.find(params)
        med = median(clients)
        if not(math.isnan(med['speedtest']['download'])) and not(math.isnan(med['bittorrent']['download'])):
            data_client[hour] = med
            data_client['num_sample'] += med['num_sample']
            num_client = clients.distinct('uuid')
            data_client[hour]['num_client'] = len(num_client)
            max_value = get_max(max_value, med)
            min_value = get_min(min_value, med)

    return { 'data' : data_client, 'min' : min_value, 'max' : max_value }


print "Extracting data from MongoDB"

data_country = {}
for country in db.samples.find({ 'year' : year, 'month' : month}).distinct('country'):
    print country
    data_city = {}
    lat = 0
    lon = 0
    for city in db.samples.find({ 'year' : year, 'month' : month, 'country' : country}).distinct('city'):
        print "\t%s" % city
        data_provider = {}
        for provider in db.samples.find({ 'year' : year, 'month' : month, 'country' : country, 'city' : city }).distinct('provider'):
            print "\t\t%s" % provider
            # Provider
            result = aggregate({ 'year' : year, 'month' : month, 'country' : country, 'city' : city, 'provider' : provider }, min_value, max_value) 
            if provider == "":
                provider = "Unknown"
            data_provider[provider] = result['data']
            min_value = result['min']
            max_value = result['max']
                
        # City
        result = aggregate({ 'year' : year, 'month' : month, 'country' : country, 'city' : city }, min_value, max_value)  
        data_city[city] = result['data']
        min_value = result['min']
        max_value = result['max']
        data_city[city]['lat'] = lat_city(city, db)
        data_city[city]['lon'] = lon_city(city, db)
        data_city[city]['providers'] = data_provider

    # Country
    result = aggregate({ 'year' : year, 'month' : month, 'country' : country }, min_value, max_value)
    data_country[country] = result['data']
    min_value = result['min']
    max_value = result['max']

    # City by country
    data_country[country]['cities'] = data_city
  
    # Provider by country
    data_provider = {}
    for provider in db.samples.find({ 'year' : year, 'month' : month, 'country' : country }).distinct('provider'):
        result = aggregate({ 'year' : year, 'month' : month, 'country' : country, 'provider' : provider }, min_value, max_value)
        if provider == "":
            provider = "Unknown"
        data_provider[provider] = result['data']
        min_value = result['min']
        max_value = result['max']
        
    data_country[country]['providers'] = data_provider
         

data_for_d3 = {
    "type"     : "cityCollection",
    "features" : data_country,
    "max"      : max_value,
    "min"      : min_value
}

print "Done. Result stored in %s" % fileout

with open(fileout, 'w') as outfile:
  json.dump(data_for_d3, outfile)

