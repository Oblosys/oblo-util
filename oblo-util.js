//     oblo-util.js 0.6.4

//     (c) 2015-2011 Martijn M. Schrage, Oblomomov Systems
//     Oblo-util may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/oblosys/oblo-util

(function(util){ // Cannot have '-' in name, so use 'util' rather than the verbose 'oblo_util'


  // Notes: basic modules, no active importing, mainly experiment for using npm also on client
  // needs to be defined before we call it.
  // NOTE: on client, use last elt of path for object ref, goes wrong with -'s in name.., so need to specify it in that case
  if (typeof window != 'undefined') // on client, NOTE: we have to manually include the required module scripts in the HTML
    window.require = function(moduleName, clientModuleObject) {
      return window[clientModuleObject ? clientModuleObject : moduleName.split('/').pop()];
    };

  var _ = require('underscore', '_'); // underscore calls itself '_' on client

  util.debug = true; // set this to false on deployment

  // Call console.log with all parameters, but only when util.debug == true
  util.log = function() {
    if (util.debug && typeof console != 'undefined') {
      var log = Function.prototype.bind.call(console.log, console);
      log.apply(null, Array.prototype.slice.call(arguments));
    }
  };

  util.error = function() {
    if (typeof console != 'undefined') {
      var error = Function.prototype.bind.call(console.error, console);
      error.apply(null, Array.prototype.slice.call(arguments));
    }
  };

  // Constrain x to the interval [min .. max]
  util.clip = function(min, max, x) {
    return Math.max(min, Math.min(x, max));
  };

  util.square = function(x) {
    return x*x;
  };

  // NOTE: replicated objects are only cloned on top-level
  util.replicate = function(n,x) {
    var xs = [];
    for (var i=0; i<n; i++)
      xs.push(_.clone(x));
    return xs;
  };

  // pad str with leading c's for a result string of length l (c is assumed to be a character)
  // NOTE: str is not clipped, so result may get longer than l
  util.pad = function(c, l, str) {
    var paddingLength = Math.max(0, l-(''+str).length);
    return util.replicate(paddingLength,c).join('')+str;
  };

  // pad integer with leading 0's when necessary
  util.padZero = function(l, n) {
    return util.pad('0', l, n);
  };

  util.addslashes = function( str ) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  }

  // optional arg indentStr is to prefix every generated line after the first with indentation
  // optional arg maxDepth is to prevent hanging on circular objects
  util.showJSON = function(json,indentStr,maxDepth) {
    indentStr = indentStr || '';
    maxDepth = typeof maxDepth == 'undefined' ? 20 : maxDepth;
    var str = '';

    if (typeof json == 'undefined') {
      str += 'undefined';
    } else if (json == null) {
      str += 'null';
    } else if (typeof json == 'string') {
      str += '\''+util.addslashes(json)+'\'';
    } else if (typeof json != 'object') {
      str += json;
    } else if (maxDepth<=0) {
      str += Array.isArray(json) ? '[...]' : '{...}';
    } else if (Array.isArray(json)) {
      if (json.length ==0 )
        str += '[]';
      else {
        for (var i = 0; i<json.length; i++)
          str += (i==0 ? '[ ' : indentStr + ', ') + util.showJSON(json[i],indentStr+'  ', maxDepth-1)+'\n';
        str += indentStr + ']';
      }
    } else if (typeof json == 'object') {
      var keys = Object.keys(json); // TODO: use underscore version for safety
      if (keys.length ==0 )
        str += '{}';
      else {
        for (var i = 0; i<keys.length; i++)
          str += (i==0 ? '{ ' : indentStr + ', ') + keys[i] + ':' +
          (typeof json[keys[i]] == 'object' && json[keys[i]] != null ? '\n' + indentStr + '    ' : ' ') + // for object children start new line
          util.showJSON(json[keys[i]], indentStr+'    ', maxDepth-1) + '\n';
        str += indentStr + '}';
      }
    } else {
      console.error('util.showJSON: internal error, unhandled type: \'' + typeof json + '\'');
    }
    return str;
  };

  util.showTime = function(date) {
    return util.padZero(2, date.getHours()) + ':' + util.padZero(2, date.getMinutes()) + ':' + util.padZero(2, date.getSeconds());
  };

  util.showDate = function(date) {
    return util.padZero(2, date.getDate()) + '-' + util.padZero(2, date.getMonth()+1) + '-' + util.padZero(4, date.getFullYear());
  };

  util.readDate = function(dateStr) {
    var parts = dateStr.split('-');
    if (parts.length == 3)
      return new Date(parts[2], parts[1]-1, parts[0]);
    else
      throw new Error("Incorrect date: '"+dateStr+"'");
  };

  /* Set boolean DOM attribute for jQuery object $elt according to HTML standard.
   * (absence denotes false, attrName=attrName denotes true) */
  util.setAttr = function($elt, attrName, isSet) {
    if (isSet)
      $elt.attr(attrName, attrName);
    else
      $elt.removeAttr(attrName);
  };

})(typeof exports == 'undefined' ? this.util={} : exports); // pass exports if we're on the server, otherwise, create object util
