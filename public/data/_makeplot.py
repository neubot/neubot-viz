#!/usr/bin/env python

import json
import sys
import pylab

DATASET = {
}

def process_filep(filep):
    dictionary = json.load(filep)
    for country in ("Canada", "United States"):
        for key in range(24):
            ddd = country, dictionary["features"][country].get(unicode(key))
            if not ddd or not ddd[1]:
                continue
            diff = ddd[1]["speedtest"]["upload"] - \
              ddd[1]["bittorrent"]["upload"]
            diff = diff / 1024
            DATASET.setdefault(country, {})
            DATASET[country].setdefault(diff, 0)
            DATASET[country][diff] += 1

def process_file(path):
    filep = open(path, "r")
    process_filep(filep)
    filep.close()

def main():
    for path in sys.argv[1:]:
        process_file(path)
    pylab.hist(DATASET["Canada"].keys(), bins=12, normed=1, cumulative=0,
               histtype="stepfilled", label="Canada", alpha=0.6)
    pylab.hist(DATASET["United States"].keys(), bins=12, normed=1,
               cumulative=0, histtype="stepfilled", label="US",
               alpha=0.6)
    pylab.xlim([-60, 60])
    pylab.title("Comparison of Median Upload Speeds", size="18")
    pylab.legend(loc="upper right")
    pylab.xlabel("Speedtest - BitTorrent [Kbit/s]", size="18")
    pylab.ylabel("Empirical PDF", size="18")
    pylab.grid()
    pylab.show()

if __name__ == "__main__":
    main()
