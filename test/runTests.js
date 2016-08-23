"use strict";
var moment = require('moment');
var index_1 = require('../index');
console.log("Start test");
var bensInterval = new index_1.Interval('R/2016-06-03T19:14:29.674Z/PT30S');
var recurWithBegin = new index_1.Interval("R/" + new Date().toISOString() + "/PT1H");
var recurWithEnd = new index_1.Interval("R3/PT1M/" + new Date().toISOString());
var recurBeginEnd = new index_1.Interval("R/" + new Date(Date.now() - 10000).toISOString() + "/" + new Date().toISOString());
var recur3TimesWithBegin = new index_1.Interval("R3/" + new Date().toISOString() + "/PT1M");
var intervalOnly = new index_1.Interval(new Date(Date.now() - 10000).toISOString() + "/" + new Date().toISOString());
printInterval(index_1.Interval.extents([bensInterval]));
printInterval(recurWithBegin);
printInterval(recurWithEnd);
printInterval(recurBeginEnd);
printInterval(recur3TimesWithBegin);
printInterval(intervalOnly);
function printInterval(intervalInstance) {
    var current = moment();
    var dayAgo = current.clone().subtract(1, 'day');
    var tomorrow = current.clone().add(1, 'day');
    console.log("Output for Interval: " + intervalInstance.toISOString());
    console.log("Start:       " + intervalInstance.start.toString());
    console.log("End:         " + intervalInstance.end.toString());
    console.log("Recurs:      " + intervalInstance.recurs);
    console.log("Infinite:    " + intervalInstance.infinite);
    console.log("Repititions: " + intervalInstance.repetitions);
    console.log("First:       " + intervalInstance.first);
    console.log("Last:        " + intervalInstance.last);
    if (intervalInstance.recurs) {
        var thisMany = intervalInstance.infinite ? 5 : intervalInstance.repetitions;
        var occurrences = intervalInstance.slice(0, thisMany);
        console.log("Occurrences: [" + occurrences + "]");
    }
    console.log("0 Occurrence: " + intervalInstance.occurrence(0));
    console.log("-3 Occurrence: " + intervalInstance.occurrence(-3));
    console.log("Duration:    " + intervalInstance.duration);
    console.log("Next Index: " + intervalInstance.indexAfter(current));
    console.log("Next Occurrence: " + intervalInstance.occurrenceAfter(tomorrow));
}
//# sourceMappingURL=runTests.js.map