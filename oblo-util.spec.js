var util = require('./oblo-util');

describe('debug', function() {
  it('defaults to true', function() {
    expect( util.debug ).toEqual(true);
  });
});

describe('log', function() {
  it('calls console.log when util.debug == true', function() {
    console.log = jasmine.createSpy('log');
    util.debug = true;
    util.log('log test');
    expect(console.log).toHaveBeenCalledWith('log test');
  });
  it('does not call console.log when util.debug == false', function() {
    console.log = jasmine.createSpy('log');
    util.debug = false;
    util.log('log test');
    expect(console.log).not.toHaveBeenCalled();
  });
});

describe('error', function() {
  it('calls console.error', function() {
    console.log = jasmine.createSpy('log');
    util.debug = true;
    util.log('log test');
    expect(console.log).toHaveBeenCalledWith('log test');
  });
  it('does not call console.log when util.debug == false', function() {
    console.log = jasmine.createSpy('log');
    util.debug = false;
    util.log('log test');
    expect(console.log).not.toHaveBeenCalled();
  });
});

describe('square', function() {
  it('squares positive values', function() {
    expect( util.square(4.2) ).toEqual(4.2*4.2);
  });
  it('squares negative values', function() {
    expect( util.square(-3.4) ).toEqual(3.4*3.4);
  });
});

describe('clip', function() {
  it('handles float values lower than minimum', function() {
      expect( util.clip(50.5, 99.5, 20) ).toEqual(50.5);
  });
  it('handles float value equal to minimum', function() {
      expect( util.clip(50.5, 99.5, 50.5) ).toEqual(50.5);
  });
  it('handles float values inside interval', function() {
      expect( util.clip(50.5, 99.5, 80.1) ).toEqual(80.1);
  });
  it('handles float value equal to maximum', function() {
      expect( util.clip(50.5, 99.5, 99.5) ).toEqual(99.5);
  });
  it('handles float values higher than maximum', function() {
      expect( util.clip(50.5, 99.5, 102.5) ).toEqual(99.5);
  });
  it('handles int values lower than minimum', function() {
      expect( util.clip(50, 100, 20) ).toEqual(50);
  });
  it('handles int value equal to minimum', function() {
      expect( util.clip(50, 100, 50) ).toEqual(50);
  });
  it('handles int values inside interval', function() {
      expect( util.clip(50, 100, 80) ).toEqual(80);
  });
  it('handles int value equal to maximum', function() {
      expect( util.clip(50, 100, 100) ).toEqual(100);
  });
  it('handles int values higher than maximum', function() {
      expect( util.clip(50, 100, 130) ).toEqual(100);
  });
});

describe('replicate', function() {
  it('handles positive values', function() {
    expect( util.replicate(3,'x') ).toEqual(['x','x','x']);
  });
  it('handles zero', function() {
    expect( util.replicate(0,'x') ).toEqual([]);
  });
  it('handles positive values', function() {
    expect( util.replicate(-1,'x') ).toEqual([]);
  });
});

describe('pad', function() {
  it('handles extreme padding', function() {
    expect( util.pad('x',35,1) ).toEqual('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1');
  });
  it('doesn\'t clip string wider than padding', function() {
    expect( util.pad('x',2,'a larger string') ).toEqual('a larger string');
  });
  it('ignores negative padding', function() {
    expect( util.pad(-2,'x','some string') ).toEqual('some string');
  });
});

describe('padZero', function() {
  it('handles extreme padding', function() {
    expect( util.padZero(35,1) ).toEqual('00000000000000000000000000000000001');
  });
  it('doesn\'t clip number when wider than padding', function() {
    expect( util.padZero(2,1234) ).toEqual('1234');
  });
  it('ignores negative padding', function() {
    expect( util.padZero(-2,23) ).toEqual('23');
  });
});

describe('addslashes', function() {
  it('adds a slash to \\, " and \'', function() {
    expect( util.addslashes('\\ " \'') ).toEqual('\\\\ \\" \\\'');
  });
});

describe('showJSON', function() {
  it('shows an empty object as {}', function() {
    expect( util.showJSON({}) ).toEqual('{}');
  });
  it('shows an empty array as []', function() {
    expect( util.showJSON([]) ).toEqual('[]');
  });
  it('handles object with undefined, null, string, and array properties', function() {
    obj = { p1: undefined, p2: null, p3: 'string\n', p4: [1,2] }
    str = '{ p1: undefined\n'
        + ', p2: null\n'
        + ', p3: \'string\n\'\n'
        + ', p4:\n'
        + '    [ 1\n'
        + '    , 2\n'
        + '    ]\n'
        + '}'
    expect( util.showJSON(obj) ).toEqual(str);
  });
  it('prefixes each line with indentStr', function() {
    expect( util.showJSON({p1: 1, p2: 2},'XX',2) )
    .toEqual('{ p1: 1\nXX, p2: 2\nXX}');
  });
  it('respects maxDepth for arrays and objects', function() {
    expect( util.showJSON({a: [2,[3]], o: {p2:{p3:{}}}},'',2) )
    .toEqual('{ a:\n    [ 2\n    , [...]\n    ]\n, o:\n    { p2:\n        {...}\n    }\n}');
  });
});

describe('showTime', function() {
  it('shows a time', function() {
    expect( util.showTime(new Date(10,1,2013,1,2,3)) ).toEqual('01:02:03');
  });
  it('handles afternoon', function() {
    expect( util.showTime(new Date(10,1,2013,13,2,3)) ).toEqual('13:02:03');
  });
});

describe('showDate', function() {
  it('shows a date', function() {
    expect( util.showDate(new Date(2012,0,2)) ).toEqual('02-01-2012');
  });
});

describe('readDate', function() {
  it('reads a date', function() {
    var date = util.readDate('01-03-2013');
    expect( date.getDate() ).toEqual(1);
    expect( date.getMonth() ).toEqual(2);
    expect( date.getFullYear() ).toEqual(2013);
  });
  it('throws an error on an invalid date string', function() {
    expect( function() {util.readDate('no date');} )
      .toThrow(new Error("Incorrect date: 'no date'"));
  });
});
