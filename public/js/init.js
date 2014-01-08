require.config({
  baseUrl:'/js',
  paths:{
    'angular':'../lib/angular',
    'angular-bootstrap':'../lib/ui-bootstrap-tpls',
    'angular-animate':'../lib/angular-animate'
  },
  shim:{
    angular:{
      exports:'angular'
    },
    'angular-bootstrap':{
      deps:['angular'] 
    },
    'angular-animate':{
      deps:['angular'] 
    },
  }
})
define([
  'angular',
  'app',
  'controller/notes',
  'directive/errors'
],function(angular){
  angular.bootstrap(document, ['himingtian']);
  document.body.setAttribute('ng-app', 'himingtian');
})

/*
 * For shit IE
 */
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisArg, t[i], i, t);
    }
  };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
  }