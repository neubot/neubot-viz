import collections
import csv
import json
import sys

from provincefinder import create_provinces_dict

def process(row, provinces, provincesdict):
    key_istat = int(row[0])
    name = row[1]
    rowtable = collections.OrderedDict()
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
        provinces[province]['municipalities'].update({key_istat: {
          'name': name, 'values': rowtable}})
        for key, _ in provinces[province]['values'].items():
            provinces[province]['values'][key] += rowtable[key]

def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python convert.py [file]")

    provinces = {}
    provincesdict = create_provinces_dict()
    with open(sys.argv[1], 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        firstline = True
        for row in reader:
            if firstline:
                firstline = False
                continue
            process(row, provinces, provincesdict)

    root = {'type': 'cityCollection', 'features': provinces}
    out_file = open('result.json', 'w')
    json.dump(root, out_file, indent=4)
    out_file.close()

if __name__ == '__main__':
    main()
