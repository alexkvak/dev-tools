// Generated by CoffeeScript 1.6.3
var page, system;

system = require('system');

page = require('webpage').create();

page.onConsoleMessage = function(msg) {
  return system.stderr.writeLine('console: ' + msg);
};

page.open('http://127.0.0.1:18180/', function() {
  var result;
  page.addCookie({
    name: 'accessToken',
    value: 'af4b4dfedd0ae9cd60fabc5eb4bd34f2b8bfbe9a',
    domain: '127.0.0.1',
    path: '/',
    expires: (new Date()).getTime() + (1000 * 60 * 60)
  });
  page.addCookie({
    name: 'refreshToken',
    value: '1ff9f9d3508fab8b6e346af58daa251776d04d68',
    domain: '127.0.0.1',
    path: '/',
    expires: (new Date()).getTime() + (1000 * 60 * 60)
  });
  page.addCookie({
    name: 'oauthScope',
    value: '1528427',
    domain: '127.0.0.1',
    path: '/',
    expires: (new Date()).getTime() + (1000 * 60 * 60)
  });
  page.addCookie({
    name: 'COOKIEID2',
    value: '1382123434_mnegym4vnvntra54bnmoa',
    domain: '127.0.0.1',
    path: '/',
    expires: (new Date()).getTime() + (1000 * 60 * 60)
  });
  result = page.addCookie({
    name: 'SID2',
    value: '1382123433_71ngxkdirt3070lyd93wg',
    domain: '127.0.0.1',
    path: '/',
    expires: (new Date()).getTime() + (1000 * 60 * 60)
  });
  console.log("result =", result);
  return setTimeout(function() {
    page.evaluate(function() {
      $('.login').val('davojan@ya.ru');
      $('.password').val('ltcznmckjyjd');
      return $('.login-submit').click();
    });
    page.render('example-filled.png');
    return setTimeout(function() {
      page.render('example.png');
      return phantom.exit();
    }, 15000);
  }, 2000);
});
