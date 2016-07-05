var path = require('path');
var test = require('tape');
var sinon = require('sinon');
var setupVDOM = require(path.join(process.cwd(), 'test-utils/utils.js')).setupVDOM;
var fs = require('fs');
var MainController = fs.readFileSync('src/scripts/controllers/MainController.js');

test('main controller exists', function(t) {
  setupVDOM([MainController])
  .then(function(window) {
    t.ok(window.app.controllers.MainController,
         'window.app.controllers.MainController variable exists');
    window.close();
    t.end();
  });
});

test.skip('main controller gets all stored data', function(t) {

});

test.skip('main controller gets specific stored data', function(t) {

});

test.skip('main controller sets about view', function(t) {

});

test.skip('main controller sets blog view', function(t) {

});

test.skip('main controller sets portfolio view', function(t) {

});
