import csv

def process_(row, table):
    province = int(row[0])
    key_istat = int(row[1])
    #name_mun = row[2]
    table[key_istat] = province

def create_provinces_dict():
    with open('02-impianti-termici.csv', 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter=';')
        table = {}
        firstline = True
        for row in reader:
            if firstline:
                firstline = False
                continue
            process_(row, table)
    return table
