import * as moment from 'moment';
/**
 * Class to describe ISO 8601 time intervals, including the repeating functionality.
 *
 * The class is primarily backed by moment.js and contains the start, end, duration,
 * and number of repetitions found in the ISO8601 string or overridden in the constructor.
 * Typical usage of the class is to construct one with a ISO8601 string in the constructor.
 */
export declare class Interval {
    private _start;
    private _end;
    private _duration;
    private _recurs;
    private _repetitions;
    private _first;
    private _last;
    private _infiniteSpan;
    /**
     * The start of all intervals, if this is a repeating interval
     * then this is the start of the first repitition.
     * Returns an invalid moment if there are infinite negative repetitions
     */
    start: moment.Moment;
    /**
     * The end of all intervals, if this is a repeating interval
     * then this is then end of the last repitition.
     * Returns an invalid moment if there are infinite positive repetitions
     */
    end: moment.Moment;
    /**
     * The duration of a single repition of the interval
     */
    duration: moment.Duration;
    /**
     * True if the schedule is infintely long
     * @returns {boolean}
     */
    infinite: boolean;
    /**
     * True if the schedule progresses infinitely in the positive
     * @returns {boolean}
     */
    infinitePositive: boolean;
    /**
     * True if the schedule progresses infinitely in the negative
     * @returns {boolean}
     */
    infiniteNegative: boolean;
    /**
     * The recurrence in milliseconds, 0 means that there is only one occurrence
     * @returns {number}
     */
    recurs: boolean;
    /**
     * The number of repetitions
     * @returns {number}
     */
    repetitions: number;
    /**
     * Index of the first occurrence,
     * Number.NEGATIVE_INFINITY if the interval is reverse repeating indefinitely
     * @returns {number}
     */
    first: number;
    /**
     * Index of the last occurrence,
     * Number.POSITIVE_INFINITY if the interval is forward repeating indefinitely
     * @returns {number}
     */
    last: number;
    /**
     * @param interval either ISO8601 string or an instance to copy
     * @param repetitions the number of times to repeat, null for infinite
     */
    constructor(interval?: string | Interval, repetitions?: number);
    occurrence(idx: number): moment.Moment;
    /**
     * Get a list of the occurrences for an interval,
     * if no parameters are supplied then all occurrences are returned
     */
    slice(from?: number, to?: number): moment.Moment[];
    /**
     * Get the recurrence (the index of the occurrence) after the supplied time
     * @param after Moment or something that it parses (if a number, then in epoc ms)
     */
    indexAfter(after: string | number | moment.Moment): number;
    indexBefore(before: string | number | moment.Moment): number;
    /**
     * Get the occurrence happening after the supplied date.
     * Throws Error if there is no occurrence after the supplied date
     */
    occurrenceAfter(after: string | number | moment.Moment): moment.Moment;
    durationBetween(from: number, to: number): moment.Duration;
    static extents(intervalList: Interval[]): Interval;
    toISOString(): string;
    toString(): string;
}
