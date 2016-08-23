"use strict";
var moment = require('moment');
var millisPerSecond = 1000;
var millisPerMinute = millisPerSecond * 60;
var millisPerHour = millisPerMinute * 60;
var millisPerDay = millisPerHour * 24;
var millisPerWeek = millisPerDay * 7;
var millisPerYear = millisPerDay * 365;
var recurrenceRegex = /^R(\d*)/;
var recurrenceIndex = {
    repetitions: 1
};
// From https://gist.github.com/philipashlock/8830168
var dateRegex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
var durationRegex = /^(R(\d*)?\/)?P(?:(\d+(?:\.\d+)?)?Y)?(?:(\d+(?:\.\d+)?)?M)?(?:(\d+(?:\.\d+)?)?W)?(?:(\d+(?:\.\d+)?)?D)?(?:T(?:(\d+(?:\.\d+)?)?H)?(?:(\d+(?:\.\d+)?)?M)?(?:(\d+(?:\.\d+)?)?S)?)?$/;
var durationIndex = {
    hasRecurrence: 0,
    repetitionCount: 1,
    year: 2,
    month: 3,
    week: 4,
    day: 5,
    hour: 6,
    minute: 7,
    second: 8
};
var rangeDateDateRegex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?(\/)([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
var rangeDateDurationRegex = /^(R\d*\/)?([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\4([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\18[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?(\/)P(?:\d+(?:\.\d+)?Y)?(?:\d+(?:\.\d+)?M)?(?:\d+(?:\.\d+)?W)?(?:\d+(?:\.\d+)?D)?(?:T(?:\d+(?:\.\d+)?H)?(?:\d+(?:\.\d+)?M)?(?:\d+(?:\.\d+)?S)?)?$/;
var rangeDurationDateRegex = /^(R\d*\/)?P(?:\d+(?:\.\d+)?Y)?(?:\d+(?:\.\d+)?M)?(?:\d+(?:\.\d+)?W)?(?:\d+(?:\.\d+)?D)?(?:T(?:\d+(?:\.\d+)?H)?(?:\d+(?:\.\d+)?M)?(?:\d+(?:\.\d+)?S)?)?\/([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\4([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\18[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
function isInfinite(s) {
    return s.length === 0;
}
function isDuration(s) {
    return s[0] === 'P';
}
function isRepeating(s) {
    return s[0] === 'R';
}
function isTime(s) {
    return moment(s).isValid();
}
var String8601Type;
(function (String8601Type) {
    String8601Type[String8601Type["repeating"] = 0] = "repeating";
    String8601Type[String8601Type["time"] = 1] = "time";
    String8601Type[String8601Type["duration"] = 2] = "duration";
    String8601Type[String8601Type["infinite"] = 3] = "infinite";
})(String8601Type || (String8601Type = {}));
function parse8601String(s) {
    if (isInfinite(s)) {
        return {
            type: String8601Type.infinite,
            value: null
        };
    }
    else if (isDuration(s)) {
        return {
            type: String8601Type.duration,
            value: moment.duration(s)
        };
    }
    else if (isRepeating(s)) {
        var result = recurrenceRegex.exec(s);
        return {
            type: String8601Type.repeating,
            value: typeof result[recurrenceIndex.repetitions] === 'string' ?
                parseInt(result[recurrenceIndex.repetitions]) : Number.POSITIVE_INFINITY
        };
    }
    else if (isTime(s)) {
        return {
            type: String8601Type.time,
            value: moment(s).valueOf()
        };
    }
    else {
        throw new Error("[" + s + "] Is not a valid part of an ISO8601 time string");
    }
}
/**
 * Class to describe ISO 8601 time intervals, including the repeating functionality.
 *
 * The class is primarily backed by moment.js and contains the start, end, duration,
 * and number of repetitions found in the ISO8601 string or overridden in the constructor.
 * Typical usage of the class is to construct one with a ISO8601 string in the constructor.
 */
var Interval = (function () {
    /**
     * @param interval either ISO8601 string or an instance to copy
     * @param repetitions the number of times to repeat, null for infinite
     */
    function Interval(interval, repetitions) {
        this._recurs = false;
        this._repetitions = 0;
        this._infiniteSpan = false;
        if (typeof interval === 'string') {
            // Parse out the ISO 8601 string
            var split = interval.split('/');
            if (split.length > 3) {
                throw new Error("Invalid ISO 8601 string[" + interval + "]");
            }
            for (var i = 0; i < split.length; i++) {
                var fragment = split[i];
                var parsed = parse8601String(fragment);
                switch (parsed.type) {
                    case String8601Type.repeating:
                        if (i !== 0) {
                            throw new Error("Incorrect placement of recurrence");
                        }
                        if (parsed.value !== 0) {
                            this._recurs = true;
                            this._repetitions = parsed.value;
                        }
                        break;
                    case String8601Type.time:
                        if (this._duration || this._start || this._infiniteSpan) {
                            this._end = parsed.value;
                        }
                        else if (!this._start) {
                            this._start = parsed.value;
                        }
                        else {
                            throw new Error("Invalid interval[" + interval + "] end time must come after a duration, start time or be an infinite span");
                        }
                        break;
                    case String8601Type.duration:
                        if (this._duration) {
                            throw new Error("Invalid interval[" + interval + "] two durations found");
                        }
                        this._duration = parsed.value;
                        break;
                    case String8601Type.infinite:
                        if (this._duration || this._recurs) {
                            throw new Error("Invalid interval[" + interval + "] single span infinite not compatible with durations or recurrence");
                        }
                        this._infiniteSpan = true;
                        break;
                    default:
                        throw new Error("Experienced unhandled type");
                }
            }
        }
        else {
            this._start = interval._start;
            this._end = interval._end;
            this._duration = moment.duration(interval._duration);
            this._recurs = interval._recurs;
            this._repetitions = interval._repetitions;
            this._infiniteSpan = interval._infiniteSpan;
        }
        if (typeof repetitions === 'number') {
            if (repetitions === 0) {
                this._recurs = false;
            }
            this._repetitions = repetitions;
        }
        else if (repetitions === null) {
            this._recurs = true;
            this._repetitions = repetitions;
        }
        // Throw an error if this this is just bunk
        if (this._start && this._end && this._duration) {
            throw new Error("Error creating interval with args[" + arguments + "]");
        }
        // Determine the first and last occurrence indexes
        if (!this._recurs) {
            // Non recurring case
            this._first = 0;
            if (this._end || this._duration) {
                this._last = 1;
            }
            else {
                this._last = 0;
            }
        }
        else if (this._start && (this._end || this._duration)) {
            // Forward progressing case
            this._first = 0;
            this._last = this._repetitions;
        }
        else {
            // Backward progressing case
            this._last = 0;
            this._first = -this._repetitions;
        }
    }
    Object.defineProperty(Interval.prototype, "start", {
        /**
         * The start of all intervals, if this is a repeating interval
         * then this is the start of the first repitition.
         * Returns an invalid moment if there are infinite negative repetitions
         */
        get: function () {
            if (this.isInfiniteNegative) {
                return moment.invalid();
            }
            else {
                return this.occurrence(this.first);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Interval.prototype, "end", {
        /**
         * The end of all intervals, if this is a repeating interval
         * then this is then end of the last repitition.
         * Returns an invalid moment if there are infinite positive repetitions
         */
        get: function () {
            if (this.isInfinitePositive) {
                return moment.invalid();
            }
            else {
                return this.occurrence(this.last);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Interval.prototype, "duration", {
        /**
         * The duration of a single repition of the interval
         */
        get: function () {
            if (this._duration) {
                return this._duration;
            }
            if (this._start && this._end) {
                return moment.duration(this._end - this._start);
            }
            else {
                return moment.duration(0);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Interval.prototype, "isInfinite", {
        /**
         * True if the schedule is infintely long
         * @returns {boolean}
         */
        get: function () {
            return !isFinite(this._repetitions) || this._infiniteSpan;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Interval.prototype, "isInfinitePositive", {
        /**
         * True if the schedule progresses infinitely in the positive
         * @returns {boolean}
         */
        get: function () {
            return !isFinite(this.last) || (this._infiniteSpan && !this._end);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Interval.prototype, "isInfiniteNegative", {
        /**
         * True if the schedule progresses infinitely in the negative
         * @returns {boolean}
         */
        get: function () {
            return !isFinite(this.first) || (this._infiniteSpan && !this._start);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Interval.prototype, "isRepeating", {
        /**
         * The recurrence in milliseconds, 0 means that there is only one occurrence
         * @returns {number}
         */
        get: function () {
            return this._recurs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Interval.prototype, "repetitions", {
        /**
         * The number of repetitions
         * @returns {number}
         */
        get: function () {
            return this._repetitions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Interval.prototype, "first", {
        /**
         * Index of the first occurrence,
         * Number.NEGATIVE_INFINITY if the interval is reverse repeating indefinitely
         * @returns {number}
         */
        get: function () {
            return this._first;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Interval.prototype, "last", {
        /**
         * Index of the last occurrence,
         * Number.POSITIVE_INFINITY if the interval is forward repeating indefinitely
         * @returns {number}
         */
        get: function () {
            return this._last;
        },
        enumerable: true,
        configurable: true
    });
    Interval.prototype.occurrence = function (idx) {
        if (idx > this.last || idx < this.first) {
            return moment.invalid();
        }
        if (this.isInfiniteNegative) {
            return moment(this._end).subtract(this.durationBetween(idx, this.last));
        }
        else {
            return moment(this._start).add(this.durationBetween(this.first, idx));
        }
    };
    /**
     * Get a list of the occurrences for an interval,
     * if no parameters are supplied then all occurrences are returned.
     *
     * @param {number} [from] the starting occurrence index
     * @param {number} [to] the ending occurrence index
     * @returns {moment.Moment[]}
     */
    Interval.prototype.slice = function (from, to) {
        // Check for being out of bounds
        if (from > this.last || to < this.first) {
            return [];
        }
        if (from == null) {
            if (this.isInfiniteNegative) {
                throw new Error("Tried to get all occurrences with no lower bound[" + this.toISOString() + "]");
            }
            from = this.first;
        }
        else if (from < this.first) {
            from = this.first;
        }
        if (to == null) {
            if (this.isInfinitePositive) {
                throw new Error("Tried to get all occurrences with no upper bound[" + this.toISOString() + "]");
            }
            to = this.last;
        }
        else if (to > this.last) {
            to = this.last;
        }
        var count = to - from + 1;
        var initialDuration = this.durationBetween(from, to);
        var currentOccurrence;
        if (this.isInfiniteNegative) {
            currentOccurrence = moment(this._end).subtract(initialDuration);
        }
        else {
            currentOccurrence = moment(this._start).add(initialDuration);
        }
        var occurrences = [];
        for (var i = 0; i < count; i++) {
            occurrences.push(currentOccurrence);
            currentOccurrence.add(this.duration);
        }
        return occurrences;
    };
    /**
     * Get the recurrence (the index of the occurrence) after the supplied time
     * @param after Moment or something that it parses (if a number, then in epoc ms)
     */
    Interval.prototype.indexAfter = function (after) {
        var afterMs = moment(after).valueOf();
        var deltaMs;
        if (this._start) {
            deltaMs = afterMs - this._start;
        }
        else {
            deltaMs = afterMs - this._end;
        }
        var durationMs = this.duration.asMilliseconds();
        return Math.ceil(deltaMs / durationMs);
    };
    Interval.prototype.indexBefore = function (before) {
        return this.indexAfter(before) - 1;
    };
    /**
     * Get the occurrence happening after the supplied date.
     * Throws Error if there is no occurrence after the supplied date
     */
    Interval.prototype.occurrenceAfter = function (after) {
        var afterMoment = moment(after);
        var recurrence = this.indexAfter(afterMoment);
        return this.occurrence(recurrence);
    };
    Interval.prototype.durationBetween = function (from, to) {
        return moment.duration(this.duration.asMilliseconds() * (to - from));
    };
    Interval.extents = function (intervalList) {
        var start = moment.min(intervalList.map(function (s) { return s.start; }));
        var end = moment.max(intervalList.map(function (s) { return s.end; }));
        return new Interval((start.isValid() ? start.toISOString() : '') + "/" + (end.isValid() ? end.toISOString() : ''));
    };
    Interval.prototype.toISOString = function () {
        var parts = [];
        if (this._recurs) {
            parts.push("R" + (isFinite(this._repetitions) ? this._repetitions.toString() : ''));
        }
        if (this._start) {
            parts.push(moment(this._start).toISOString());
            if (this._infiniteSpan) {
                parts.push('');
            }
        }
        if (this._duration) {
            parts.push(this._duration.toISOString());
        }
        if (this._end) {
            parts.push(moment(this._end).toISOString());
            if (this._infiniteSpan) {
                parts.push('');
            }
        }
        return parts.join('/');
    };
    Interval.prototype.toString = function () {
        return this.toISOString();
    };
    return Interval;
}());
exports.Interval = Interval;
//# sourceMappingURL=interval.js.map