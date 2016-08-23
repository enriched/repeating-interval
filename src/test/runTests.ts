import * as moment from 'moment';
import {Interval} from '../index';

console.log(`Start test`);

var bensInterval = new Interval('R/2016-06-03T19:14:29.674Z/PT30S');
var recurWithBegin = new Interval(`R/${new Date().toISOString()}/PT1H`);
var recurWithEnd = new Interval(`R3/PT1M/${new Date().toISOString()}`);
var recurBeginEnd = new Interval(`R/${new Date(Date.now() - 10000).toISOString()}/${new Date().toISOString()}`);
var recur3TimesWithBegin = new Interval(`R3/${new Date().toISOString()}/PT1M`);
var intervalOnly = new Interval(`${new Date(Date.now() - 10000).toISOString()}/${new Date().toISOString()}`);

printInterval(Interval.extents([bensInterval]));
printInterval(recurWithBegin);
printInterval(recurWithEnd);
printInterval(recurBeginEnd);
printInterval(recur3TimesWithBegin);
printInterval(intervalOnly);

function printInterval(intervalInstance) {
  var current = moment();
  var dayAgo = current.clone().subtract(1, 'day');
  var tomorrow = current.clone().add(1, 'day');
  console.log(`Output for Interval: ${intervalInstance.toISOString()}`);
  console.log(`Start:       ${intervalInstance.start.toString()}`);
  console.log(`End:         ${intervalInstance.end.toString()}`);
  console.log(`Recurs:      ${intervalInstance.recurs}`);
  console.log(`Infinite:    ${intervalInstance.infinite}`);
  console.log(`Repititions: ${intervalInstance.repetitions}`);
  console.log(`First:       ${intervalInstance.first}`);
  console.log(`Last:        ${intervalInstance.last}`);
  if (intervalInstance.recurs) {
    var thisMany = intervalInstance.infinite ? 5 : intervalInstance.repetitions;
    var occurrences = intervalInstance.slice(0, thisMany);
    console.log(`Occurrences: [${occurrences}]`);
  }
  console.log(`0 Occurrence: ${intervalInstance.occurrence(0)}`);
  console.log(`-3 Occurrence: ${intervalInstance.occurrence(-3)}`);
  console.log(`Duration:    ${intervalInstance.duration}`);
  console.log(`Next Index: ${intervalInstance.indexAfter(current)}`);
  console.log(`Next Occurrence: ${intervalInstance.occurrenceAfter(tomorrow)}`);
}
