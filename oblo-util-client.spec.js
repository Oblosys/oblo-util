// Since these tests use jsdom to include the scripts directly, Istanbul will not record their coverage.
// It's not impossible to include an instrumented version and merge the results, but it does not
// seem worth the added complexity.

var jsdom = require('jsdom');

describe('Client-loaded oblo-util', function(){
  var window, $;
  beforeEach(function(done){
    jsdom.env({
      html: '<html><body></body></html>',
      scripts: ['node_modules/jquery/dist/jquery.min.js', './oblo-util.js'],
      done: function(err, win) {
        window = win;
        $ = window.jQuery;
        done();
      }
    });
  });

  it('declares window.util', function() {
    expect( window.util ).toBeDefined();
  });

  it('declares window.require', function() {
    expect( window.require ).toBeDefined();
  });

  it('window.require(\'.../module\') returns \'module\' property on window object, ignoring path', function() {
    window.dummy = 'dummy module';
    expect( window.require('/some/path/to/dummy') ).toEqual('dummy module');
  });

  it('window.require(\'.../module\', \'client-module\') returns \'client-module\' property on window object, ignoring path', function() {
    window.clientDummy = 'dummy module';
    expect( window.require('node-dummy', 'clientDummy') ).toEqual('dummy module');
  });

  it('setAttr sets the attribute on true', function(){
    var $div = $('<div></div>');
    window.util.setAttr($div, 'boolAttr', true);
    expect( $div.attr('boolAttr') ).toBe('boolAttr');
  });

  it('setAttr removes the attribute on false', function(){
    var $div = $('<div boolAttr="boolAttr"></div>');
    window.util.setAttr($div, 'boolAttr', false);
    expect( $div.attr('boolAttr') ).not.toBeDefined();
  });
});
