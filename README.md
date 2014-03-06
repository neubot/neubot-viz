NeuViz
======

NeuViz is a data processing and visualization architecture for network measurement experiments. NeuViz has been tailored to work on the data produced by [Neubot](http://neubot.org/) (Net Neutrality Bot), an Internet bot that performs periodic, active network performance tests.

How it works
------------

The Python scripts used for the Elaboration stage are stored in the `backend` folder. The scripts for the Web API (written in Node.js) are stored in the 'frontend' folder. The files for of the Web user interface (HTML + D3.js) are available in the 'frontend/www/var' folder.

Elaboration stage
-----------------

In the backend folder you can find the Python scripts of the Elaboration stage. We started from the Neubot data [CSV files](http://data.neubot.org/2013/06/20/bigdive/) and we imported using the map.py script into a MongoDB database. After this import step we executed the reduce.py script to elaborate the aggregate the data by country, city, and provider for each month. We elaborated the median of these values and we exported it into a JSON structure, in order to be read from the Visualization client.

Web API
-------
TODO

Web user interface
-------------------

We developed a Web client in HTML and Javascript (using the [D3.js](http://d3js.org/) library) in order to show the results of the Elaboration stage on a world map.
We developed an interactive map that is able to zoom in (and out) to a specific country, showing all the data aggregated by country, city and provider. The user can choose the type of Neubot test (speedtest, bittorrent) to show in the map and the data type (number of Neubot instances, number of tests, download and upload speed, connection time). Moreover, the client can elaborate the difference between the speed test and the bittorrent test. All these parameters can be selected from the interactive panel at the bottom of the web page.

Requirements
------------

- Python 2.7.3 (with pymongo, numpy)
- Node.js v0.10.25
- MongoDB

How to execute the Elaboration stage
------------------------------------

In order to elaborate the Neubot data from the CSV files we need to execute a couple of Python scripts to insert some geographical information about the country and the city that we are going to use. This step is needed because the Neubot data don't contain the latitude and longitude of the information reported.

To prepare the Elaboration stage you need to download the [world city database](http://download.maxmind.com/download/worldcities/worldcitiespop.txt.gz) and the [GeoIPCountry](http://geolite.maxmind.com/download/geoip/database/GeoIPCountryCSV.zip) database from MaxMind (all these db are free to use). 

You need to execute the following scripts:

```bash
$ python insert_city_mongodb.py worldcitiespop.txt
$ python insert_country_mongodb.py GeoIPCountryWhois.csv
```

After that you can execute the map and reduce scripts to elaborate the Neubot data:

1) Execute the map.py script to insert the Neubot data in MongoDB:

```bash
$ python map.py neubot.csv
```

where neubot.csv is the Neubot CSV file related to a specific month.

2) Execute the reduce.py script to aggregate the data and elaborate the median values.

```bash
$ python reduce.py [month] [year] [fileout]
```    

Where month is the month number and year is the year expressed using four digits. The fileout is the file name for the JSON result.

We already elaborated all the Neubot data from January 2012 to May 2013 and we stored the result in the folder `/public/data`.

How to visualize the result of the project
------------------------------------------

We implemented an interactive world map to visualize the Network Neutrality results of the collected Neubot data.

In order to visualize the world map you need to execute the public folder inside a web server. We suggest to use the built in web server of python without any configuration. You can go inside the public folder and execute the following command:

```bash
$ python -m SimpleHTTPServer
```
   
Now you can point your browser to the URL http://localhost:8000/Network_Neutrality.html and enjoy the interactive world map of the Neubot data (the port 8000 is the default one provided by python).


Authors
-------

Simone Basso (simone.basso@polito.it), Giuseppe Futia (giuseppe.futia@polito.it) and Enrico Zimuel (e.zimuel@gmail.com).


Publications
-------
TODO


Thanks
------

A special thanks to Christian Racca of the TOP-IX Consortium, and all the staff and teachers of the [BigDive](http://www.bigdive.eu/) 2013 course for their support during the development of the first prototype of NeuViz (aka ["GramsciDevoted"](https://github.com/ezimuel/BigDive2Gramsci) project).
 
