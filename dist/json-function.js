"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _=require("."),JsonFunction=/** @class */function(){function a(){this.data=[],this.option={orderBy:null,where:null,limit:null,select:null}}return a.prototype.reset=function(){return this.option={orderBy:null,where:null,limit:null,select:null},this.data=[],this},a.prototype.orderBy=function(a,b){return void 0===b&&(b="ASC"),this.option.orderBy=[a,b],this},a.prototype.where=function(a){return this.option.where=a,this},a.prototype.limit=function(a,b){return void 0===a&&(a=10),void 0===b&&(b=0),this.option.limit=[a,b],this},a.prototype.select=function(a){return this.option.select=a,this},a.prototype.get=function(a,b){this.data=a;var c=this.option,d=c.orderBy,e=c.where,f=c.limit,g=c.select;if(d){var h=d[0],i=d[1];this.data=(0,_.OrderBy)(this.data,h,i)}if(e&&(this.data=(0,_.Where)(this.data,e)),f){var j=f[0],k=f[1];this.data=(0,_.Limit)(this.data,j,k)}g&&(this.data=(0,_.Select)(this.data,g));var l=this.data.slice();return b&&!1!==b.resetRecord&&this.reset(),l},a}();exports.default=new JsonFunction;