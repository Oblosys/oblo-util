//     oblo-util.js 1.0.0

//     (c) 2011-2018 Martijn M. Schrage, Oblomomov Systems
//     Oblo-util may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/oblosys/oblo-util

// Constrain x to the interval [min .. max]
export function clip(min, max, x) {
  return Math.max(min, Math.min(x, max));
};

// NOTE: replicated objects are only cloned on top-level
export function replicate(n,x) {
  var xs = [];
  for (var i=0; i<n; i++)
    xs.push(_.clone(x));
  return xs;
};

export function addslashes( str ) {
  return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

// optional arg indentStr is to prefix every generated line after the first with indentation
// optional arg maxDepth is to prevent hanging on circular objects
export function showJSON(json,indentStr,maxDepth) {
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

export function showTime(date) {
  return util.padZero(2, date.getHours()) + ':' + util.padZero(2, date.getMinutes()) + ':' + util.padZero(2, date.getSeconds());
};

export function showDate(date) {
  return util.padZero(2, date.getDate()) + '-' + util.padZero(2, date.getMonth()+1) + '-' + util.padZero(4, date.getFullYear());
};

export function readDate(dateStr) {
  var parts = dateStr.split('-');
  if (parts.length == 3)
    return new Date(parts[2], parts[1]-1, parts[0]);
  else
    throw new Error("Incorrect date: '"+dateStr+"'");
};
