// Generated by CoffeeScript 1.6.3
var ByWidgetGroupDetector, Future, appConfig, fs, path, sha1, _;

fs = require('fs');

path = require('path');

_ = require('underscore');

Future = require('../utils/Future');

sha1 = require('../utils/sha1');

appConfig = require('../appConfig');

ByWidgetGroupDetector = (function() {
  /*
  Groups all widget's js files together.
  */

  ByWidgetGroupDetector.prototype._widgetGroups = null;

  function ByWidgetGroupDetector(groupRepo, targetDir) {
    this.groupRepo = groupRepo;
    this.targetDir = targetDir;
    this._widgetGroups = {};
  }

  ByWidgetGroupDetector.prototype._processDir = function(target) {
    /*
    Recursively scans the given directory to group widgets files together.
    @param String target absolute path to the file/directory to be removed
    @return Future
    */

    var _this = this;
    return Future.call(fs.stat, target).flatMap(function(stat) {
      var key, moduleName;
      if (stat.isDirectory()) {
        _this._widgetGroups[target.substr(target.indexOf('/bundles/') + 1)] = [];
        return Future.call(fs.readdir, target).flatMap(function(items) {
          var futures, item;
          futures = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              item = items[_i];
              _results.push(this._processDir(path.join(target, item)));
            }
            return _results;
          }).call(_this);
          return Future.sequence(futures);
        });
      } else if (path.extname(target) === '.js') {
        moduleName = target.slice(target.indexOf('/bundles/') + 1, -3);
        key = path.dirname(moduleName);
        _this._widgetGroups[key].push(moduleName);
        return Future.resolved();
      } else {
        return Future.resolved();
      }
    });
  };

  ByWidgetGroupDetector.prototype.process = function(stat) {
    var _this = this;
    return appConfig.getBundles(this.targetDir).flatMap(function(bundles) {
      var bundle, futures;
      futures = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = bundles.length; _i < _len; _i++) {
          bundle = bundles[_i];
          _results.push(this._processDir(path.join(this.targetDir, 'public/bundles', bundle, 'widgets')));
        }
        return _results;
      }).call(_this);
      return Future.sequence(futures);
    }).map(function() {
      var gr, group, items, lengthBefore, moduleList, modules, optimizedStat, page, resultGroups, _i, _len, _ref;
      resultGroups = [];
      _ref = _this._widgetGroups;
      for (gr in _ref) {
        items = _ref[gr];
        if (items.length > 1) {
          resultGroups.push(_this.groupRepo.createGroup(_this._generateGroupId(items, gr), items));
        }
      }
      optimizedStat = {};
      for (page in stat) {
        moduleList = stat[page];
        modules = _.clone(moduleList);
        for (_i = 0, _len = resultGroups.length; _i < _len; _i++) {
          group = resultGroups[_i];
          lengthBefore = modules.length;
          modules = _.difference(modules, group.getItems());
          if (lengthBefore > modules.length) {
            modules.push(group.id);
          }
        }
        optimizedStat[page] = modules;
      }
      return optimizedStat;
    }).failAloud();
  };

  ByWidgetGroupDetector.prototype._generateGroupId = function(items, groupDir) {
    var itemsStr;
    itemsStr = items.sort().join();
    return 'group-widget-' + sha1(itemsStr) + '-' + items.length + '-' + groupDir.substr(-12);
  };

  return ByWidgetGroupDetector;

})();

module.exports = ByWidgetGroupDetector;
