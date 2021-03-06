// Generated by CoffeeScript 1.6.3
var Future, fs, path, requirejsConfig, templateFile;

fs = require('fs');

path = require('path');

Future = require('../utils/Future');

requirejsConfig = require('./requirejsConfig');

templateFile = 'public/bundles/cord/core/init/browser-init.opt.tmpl.js';

exports.generate = function(params, jsGroupMap, cssGroupMap) {
  /*
  Generates optimized browser-init script based on template with precomputed requirejs configuration including
   group optimization map.
  @param Map[String -> Array[String]] groupMap optimized group map
  @param Object params build params to get target dir
  @return Future[String]
  */

  var e;
  try {
    return requirejsConfig.collect(params.targetDir).zip(Future.call(fs.readFile, path.join(params.targetDir, templateFile), 'utf8')).map(function(requireConf, tmplString) {
      return tmplString.replace('COMPUTED_REQUIREJS_CONFIG', JSON.stringify(requireConf, null, 2)).replace('JS_GROUP_MAP', JSON.stringify(jsGroupMap, null, 2)).replace('CSS_GROUP_MAP', JSON.stringify(cssGroupMap, null, 2));
    }).failAloud();
  } catch (_error) {
    e = _error;
    console.error("Error in browser-init generator:", e);
    throw e;
  }
};
