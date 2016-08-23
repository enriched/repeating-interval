# repeating-interval
[![Build Status](https://travis-ci.org/enriched/repeating-interval.svg?branch=master)](https://travis-ci.org/enriched/repeating-interval)

A simple library for parsing and interpreting ISO 8601 repeating time intervals.

The library also has the ability to handle non repeating intervals.

## Installation
`npm install repeating-interval --save`

## Usage
```
var ri = require('repeating-interval');
```

## Examples of ISO 8601 repeating intervals
ISO 8601 repeating intervals are of the form:
`R<number of repetitions>/<ISO 8601 duration>`

If the number of repititions is omitted then the interval repeats indefinitely.
eg. `R/2016-08-23T04:00:00Z/P1D` would occur every one day at 4am UTC starting on the 23rd of August.

It is also possible to recur into the past by putting the duration (`P1D`) before the time (`2016-08-23T04:00:00Z`)
eg. `R/P1D/2016-08-23T04:00:00Z` would occur every day before the 23rd of August, with the last occurance being at
4am UTC on the 23rd of August.

Further reading on ISO 8601 intervals can be found on [Wikipedia](https://en.wikipedia.org/wiki/ISO_8601)