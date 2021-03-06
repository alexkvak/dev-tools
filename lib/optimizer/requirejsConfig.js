// Generated by CoffeeScript 1.6.3
var Future, appConfig, path, pathConfigFile, requirejs, savedConfigFuture, _,
  __slice = [].slice;

path = require('path');

requirejs = require('requirejs');

_ = require('lodash');

Future = require('../utils/Future');

appConfig = require('../appConfig');

pathConfigFile = 'public/bundles/cord/core/requirejs/pathConfig';

savedConfigFuture = null;

exports.collect = function(targetDir) {
  /*
  Collects and merges requirejs configuration into single config object from the different sources:
  * cordjs path-config
  * enabled bundles configs
  @param String targetDir directory with compiled cordjs project
  @return Future[Object]
  */

  var pathConfig, resultConfig;
  if (savedConfigFuture) {
    return savedConfigFuture;
  } else {
    pathConfig = require("" + (path.join(targetDir, pathConfigFile)));
    resultConfig = {
      baseUrl: '/',
      urlArgs: 'release=' + Math.random(),
      paths: pathConfig
    };
    requirejs.config({
      baseUrl: path.join(targetDir, 'public'),
      paths: pathConfig
    });
    return savedConfigFuture = appConfig.getBundles(targetDir).flatMap(function(bundles) {
      var bundle, configs;
      configs = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = bundles.length; _i < _len; _i++) {
          bundle = bundles[_i];
          _results.push("cord!/" + bundle + "/config");
        }
        return _results;
      })();
      return Future.require(configs);
    }).map(function() {
      var config, configs, _i, _len;
      configs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = configs.length; _i < _len; _i++) {
        config = configs[_i];
        if (config.requirejs) {
          _.merge(resultConfig, config.requirejs);
        }
      }
      return resultConfig;
    });
  }
};
