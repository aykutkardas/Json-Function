'use strict';Object.defineProperty(exports,'__esModule',{value:!0});// https://github.com/burakcan/mb
// Original
// var mb=p=>o=>p.map(c=>o=(o||{})[c])&&o
// Customize
var mb=function(a){return function(b){return a.split('.').map(function(a){return b=(b||{})[a]})&&b}};exports.default=mb;