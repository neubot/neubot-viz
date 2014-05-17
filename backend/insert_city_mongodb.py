# Insert the world cities in MongoDB

import fileinput
from pymongo import MongoClient

client = MongoClient()
db = client.cities

if len(sys.argv) < 2:
    print "Usage: python insert_city_mongodb.py [file]"
    sys.exit()

if not os.path.exists(sys.argv[1]):
    print "Error: the file specified doesn't exist"
    sys.exit()
     
file_city = sys.argv[1]
i = 1
for line in fileinput.input([file_city]):
    row = line.split(',')
    try:
        city = { 'country' : row[0], 'city' : row[2], 'lat' : row[5], 'lon' : row[6] }
	db.city.insert(city)
        i += 1
        print i
    except:
 	continue

