/*
	Author: LAB
	Fast weak random module with 10^6 pre-generated
    random number to cycle through.

    LICENSE: GPLv3
*/

"use strict";
var app = app || {};

app.Random = (function() {
    let lookupIndex = 0;

    const lookupTable = Array.from({
        length: 1e6
    }, () => Math.random());

    return {
        next() {
            return lookupIndex++ >= lookupTable.length
                ? lookupTable[lookupIndex = 0]
                : lookupTable[lookupIndex];
        }
    }
}());
