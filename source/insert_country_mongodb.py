# Insert the countries in MongoDB

import fileinput
from pymongo import MongoClient

client = MongoClient()
db = client.countries
countries = {}

if len(sys.argv) < 2:
    print "Usage: python insert_country_mongodb.py [file]"
    sys.exit()

if not os.path.exists(sys.argv[1]):
    print "Error: the file specified doesn't exist"
    sys.exit()
     
file_country = sys.argv[1]

i = 1
for line in fileinput.input([file_country]):
    row = [x.replace("\n",'').replace("\"",'') for x in line.split(',')]
    if not row[4] in countries:
        country = { 'country' : row[5], 'code' : row[4] }
        db.country.insert(country)
        i += 1
        print i
        countries[row[4]] = row[5]

