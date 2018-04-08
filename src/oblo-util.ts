//     oblo-util.ts 1.0.0

//     (c) 2011-2018 Martijn M. Schrage, Oblomomov Systems
//     Oblo-util may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/oblosys/oblo-util

// Constrain `x`, so `min <= x <= max`
function clamp(min : number, max : number, x : number) {
  return Math.max(min, Math.min(x, max));
};

function addslashes(str : string) {
  return ('' + str).replace(/[\\'']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function clipLeft(n : number, str : string) {
  if (!str) {
    return str;
  }
  return str.length <= n ? str : '…' + str.slice(-n + 1);
}

function clipRight(n : number, str : string) {
  if (!str) {
    return str;
  }
  return str.length <= n ? str : str.slice(0, n - 1) + '…';
}

// optional arg indentStr is to prefix every generated line after the first with indentation
// optional arg maxDepth is to prevent hanging on circular objects
function showJSON(json : any, indentStr : string = '', maxDepth : number = 20) {
  let str = '';

  if (typeof json == 'undefined') {
    str += 'undefined';
  } else if (json == null) {
    str += 'null';
  } else if (typeof json == 'string') {
    str += '\''+addslashes(json)+'\'';
  } else if (typeof json != 'object') {
    str += json;
  } else if (maxDepth<=0) {
    str += Array.isArray(json) ? '[...]' : '{...}';
  } else if (Array.isArray(json)) {
    if (json.length ==0 )
      str += '[]';
    else {
      for (var i = 0; i<json.length; i++)
        str += (i==0 ? '[ ' : indentStr + ', ') + showJSON(json[i],indentStr+'  ', maxDepth-1)+'\n';
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
        showJSON(json[keys[i]], indentStr+'    ', maxDepth-1) + '\n';
      str += indentStr + '}';
    }
  } else {
    console.error('showJSON: internal error, unhandled type: \'' + typeof json + '\'');
  }
  return str;
};

function showDate(date : Date) {
  return ('' + date.getDate()       ).padStart(2, '0') + '-' +
         ('' + (date.getMonth() + 1)).padStart(2, '0') + '-' +
         ('' + date.getFullYear()   ).padStart(4, '0');
}

function showTime(date : Date) {
  return ('' + date.getHours()  ).padStart(2, '0') + ':' +
         ('' + date.getMinutes()).padStart(2, '0') + ':' +
         ('' + date.getSeconds()).padStart(2, '0');
}

function parseDate(dateStr : string) {
  const parts = (dateStr).match(/([0-9]{2})-([0-9]{2})-([0-9]{4})/);
  if (parts && parts.length === 4) {
    const [day, month, year] = parts.slice(1);
    const date = new Date(`${year}-${month}-${day}T00:00:00+00:00`);
    if (!isNaN(+date)) { // ugly check for Invalid Date
      return date;
    }
  }
  throw new Error(`parseDate: Date '${dateStr}' is not formatted as DD-MM-YYY`);
};
