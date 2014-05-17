import sys
import os.path

import csv
import json

from provincefinder import create_provinces_dict

def process(row, provinces, provincesdict):
    key_istat = int(row[0])
    name = row[1]
    rowtable = {} 
    rowtable['A+'] = int(row[2])
    rowtable['A'] = int(row[3])
    rowtable['B'] = int(row[4])
    rowtable['C'] = int(row[5])
    rowtable['D'] = int(row[6])
    rowtable['E'] = int(row[7])
    rowtable['F'] = int(row[8])
    rowtable['G'] = int(row[9])
    rowtable['NC'] = int(row[10])
    province = provincesdict[key_istat]
    if not province in provinces:
        provinces[province] = {'municipalities': {}, 'values': rowtable}
        provinces[province]['values'] = rowtable
    else:
        provinces[province]['municipalities'].update({key_istat: { 'name': name, 'values': rowtable}})
        for key, value in provinces[province]['values'].items():
            provinces[province]['values'][key] += rowtable[key]
 
def main():
    if len(sys.argv) < 2:
        print "Usage: python convert.py [file]"
        sys.exit()

    if not os.path.exists(sys.argv[1]):
        print "Error: the file specified doesn't exist"
        sys.exit()

    provinces ={} 
    provincesdict = create_provinces_dict()
    with open(sys.argv[1], 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter = ',')
        firstline = True;
        for row in reader:
            if firstline:
                firstline = False
                continue
            process(row, provinces, provincesdict)
    root = {'type': 'cityCollection', 'features': provinces}
    out_file = open('result.json', 'w')
    out_file.write(json.dumps(root))
    out_file.close()

if __name__ == '__main__':
    main()
