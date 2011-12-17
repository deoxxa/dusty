#!/usr/bin/env node

var fs = require("fs"),
    dust = require("dust"),
    async = require("async"),
    _ = require("underscore");

function Dusty(location) {
  this.location = location;
}

Dusty.prototype._compile = function(location, cb) {
  var self = this;

  fs.stat(location, function(err, stat) {
    if (err) {
      cb(err);
      return;
    }

    if (stat.isDirectory()) {
      fs.readdir(location, function(err, files) {
        if (err) {
          cb(err);
          return;
        }

        async.map(files, function(file, cb) {
          self._compile(location + "/" + file, cb);
        }, function(err, res) {
          if (err) {
            cb(err);
            return;
          }

          cb(null, res);
        });
      });
    } else if (stat.isFile() && location.match(/\.dust$/)) {
      var filename = location.replace(new RegExp("^" + self.location + "/(.+?)\.dust$"), "$1");

      fs.readFile(location, "utf8", function(err, data) {
        if (err) {
          cb(err);
          return;
        }

        var compiled = dust.compile(data, filename);
        cb(null, {name: filename, js: compiled});
      });
    } else {
      cb();
    }
  }, function(err, compiled) {
    if (err) {
      cb(err);
      return;
    }

    // Filter out empty objects caused by non-dust files
    cb(null, compiled);
  });
};

Dusty.prototype.compile = function(location, cb) {
  if (!cb && typeof location == "function") {
    cb = location;
    location = null;
  }

  location = location || this.location;

  this._compile(location, function(err, compiled) {
    if (err) {
      cb(err);
      return;
    }

    var templates = {};

    _(compiled).chain().flatten().filter(function(e) { return e && !!e.name; }).each(function(template) {
      templates[template.name] = template.js;
    });

    cb(null, templates);
  });
};

module.exports = Dusty;
