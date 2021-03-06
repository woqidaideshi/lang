var config = require('systemconfig'),
  utils = require('utils'),
  flowctl = utils.Flowctl(),
  json4line = utils.Json4line(),
  fs = require('fs'),
  util = require('util'),
  event = require('events'),
  localPath = config.LANG[0] + '/locale.conf',
  globalPath = config.LANG[1] + '/locale.conf',
  initPera = {};

function Language(ret_) {
  var ret = ret_ || {
    success: function() {},
    fail: function() {}
  };
  this._gConf = {
    langList: []
  };
  this._lConf = {
    langList: []
  };
  this.__init = false;
  event.EventEmitter.call(this);

  this._loadlangList(function(err) {
    if (err) {
      return ret.fail(err);
    }
    ret.success();
  });
}

util.inherits(Language, event.EventEmitter);

// load langList from system
Language.prototype._loadlangList = function(callback_) {
  var cb_ = callback_ || function() {};
  var _this = this;
  // initialize this list from local to global
  flowctl.series([{
    fn: function(pera_, callback_) {
      json4line.readJSONFile(localPath, function(err_, json_) {
        if (err_) {
          return callback_(null);
        } else {
          _this._lConf = json_;
          callback_(null);
        }
      });
    }
  }, {
    fn: function(pera_, callback_) {
      json4line.readJSONFile(globalPath, function(err_, json_) {
        if (err_) {
          return callback_(err_);
        } else {
          _this._gConf = json_;
          callback_(null);
        }
      });
    }
  }], function(err_, rets_) {
    if (err_) return cb_('Fail to load lang list: ' + err_);
    _this.__init = true;
    _this.__emit('init');
    cb_(null);
  });
}

Language.prototype.__emit = function(event) {
  var listeners = this.listeners(event);
  for (var i = 0; i < listeners.length; ++i) {
    if (listeners[i] == this.getLang) {
      this.getLang.apply(this, initPera['getLang']);
    } else if (listeners[i] == this.getLangByName) {
      this.getLangByName.apply(this, initPera['getLangByName']);
    } else if (listeners[i] == this.setLocale) {
      this.setLocale.apply(this, initPera['setLocale']);
    } else if (listeners[i] == this.getCurLocale) {
      this.getCurLocale.apply(this, initPera['getCurLocale']);
    } else if (listeners[i] == this.getLangList) {
      this.getLangList.apply(this, initPera['getLangList']);
    } else if (listeners[i] == this.addLang) {
      this.addLang.apply(this, initPera['addLang']);
    } else if (listeners[i] == this.removeLang) {
      this.removeLang.apply(this, initPera['removeLang']);
    } else {}
  }
  this.removeAllListeners('init');
}

// for outside app, they can their own language file by this interface
Language.prototype.getLang = function(path_, callback_) {
  var cb_ = callback_ || function() {};
  if (path_ == '') {
    json4line.readJSONFile(localPath, function(err_, json_) {
      if (err_) return callback_(err_);
      cb_(null, json_);
    });
  } else {
    json4line.readJSONFile(path_, function(err_, json_) {
      if (err_) return callback_(err_);
      cb_(null, json_);
    });
  }
}

// this interface is for inside app
Language.prototype.getLangByName = function(name_, callback_) {
  if (!this.__init) {
    initPera['getLangByName'] = arguments;
    return this.on('init', this.getLangByName);
  }
  var cb_ = callback_ || function() {},
    locale = this._lConf.locale || this._gConf.locale;
  // local -> global -> default
  flowctl.series([{
    fn: function(pera_, callback_) {
      json4line.readJSONFile(config.LANG[0] + '/' + locale + '/' + name_, function(err_, json_) {
        if (err_) return callback_(null);
        cb_(null, json_);
      });
    }
  }, {
    fn: function(pera_, callback_) {
      json4line.readJSONFile(config.LANG[1] + '/' + locale + '/' + name_, function(err_, json_) {
        if (err_) return callback_(null);
        cb_(null, json_);
      });
    }
  }, {
    fn: function(pera_, callback_) {
      json4line.readJSONFile(config.LANG[1] + '/default/' + name_, function(err_, json_) {
        if (err_) return callback_(err_);
        cb_(null, json_);
      });
    }
  }], function(err_, rets_) {
    if (err_) return cb_('Fail to get lang file');
  });
}

Language.prototype.notify = function(event_, locale_) {
  stub.notify(event_, {
    Data: {
      event: event_,
      locale: locale_
    }
  });
  /*router.wsNotify({
    'Action': 'notify',
    'Event': 'locale',
    'Data': {
      'event': event_, 
      'locale': locale_
    }
  });*/
}

Language.prototype.setLocale = function(locale_, callback_) {
  if (!this.__init) return this.on('init', this.setLocale);
  var cb_ = callback_ || function() {};
  if (this._lConf.locale == locale_) return cb_('Locale is not changed')
  this._lConf.locale = locale_;
  var _this = this;

  json4line.writeJSONFile(localPath, this._lConf, function(err_) {
    _this.notify('change', locale_);
    cb_(null);
  });
}

Language.prototype.getCurLocale = function(callback_) {
  if (!this.__init) {
    initPera['getCurLocale'] = arguments;
    return this.on('init', this.getCurLocale);
  }
  var cb_ = callback_ || function() {},
    ret = this._lConf.locale || this._gConf.locale;
  cb_(null, ret);
}

Language.prototype.getLangList = function(callback_) {
  if (!this.__init) {
    initPera['getLangList'] = arguments;
    return this.on('init', this.getLangList);
  }
  var cb_ = callback_ || function() {},
    tmp = {},
    ret = this._lConf.langList;
  for (var i = 0; i < this._lConf.langList.length; ++i) {
    tmp[this._lConf.langList[i]] = 1;
  }
  for (var i = 0; i < this._gConf.langList.length; ++i) {
    if (typeof tmp[this._gConf.langList[i]] === 'undefined') {
      tmp[this._gConf.langList[i]] = 1;
      ret.push(this._gConf.langList[i]);
    }
  }
  cb_(null, ret);
}

function languageValidate(lang_) {
  var path_exists = fs.existsSync(lang_.path);
  return path_exists;
}

Language.prototype.addLang = function(lang_, callback_) {
  if (!this.__init) return this.on('init', this.addLang);
  var cb_ = callback_ || function() {},
    _this = this,
    stat = fs.stat;
  // validate the new language
  if (!languageValidate(lang_)) return cb_('Illage language');

  // move lang files from lang_.path to config.LANG[0]
  var copy = function(src, dst) {
    fs.readdir(src, function(err, paths) {
      if (err) {
        throw err;
      }
      paths.forEach(function(path) {
        var _src = src + '/' + path,
          _dst = dst + '/' + path,
          readable, writable;
        stat(_src, function(err, st) {
          if (err) {
            throw err;
          }
          if (st.isFile()) {
            readable = fs.createReadStream(_src);
            writable = fs.createWriteStream(_dst);
            readable.pipe(writable);
          } else if (st.isDirectory()) {
            exists(_src, _dst, copy);
          }
        });
      });
    });
  };
  var exists = function(src, dst, callback) {
    fs.exists(dst, function(exists) {
      if (exists) {
        callback(src, dst);
      } else {
        fs.mkdir(dst, function() {
          callback(src, dst);
        });
      }
    });
  };
  exists(lang_.path, config.LANG[0] + '/' + lang_.name, copy);

  // add lang name to locale.conf
  _this._lConf.langList.push(lang_.name);
  json4line.writeJSONFile(localPath, _this._lConf, function(err_) {
    if (err_) {
      for (var i = 0; i < _this._lConf.langList.length; ++i) {
        if (_this._lConf.langList[i] == lang_.name) {
          _this._lConf.langList[i].splice(i, 1);
          break;
        }
      }
      return cb_(err_);
    }
    _this.notify('add', lang_.name);
    cb_(null);
  });
}

Language.prototype.removeLang = function(lang_, callback_) {
  if (!this.__init) return this.on('init', this.removeLang);
  var cb_ = callback_ || function() {},
    _this = this;
  var deleteFolderRecursive = function(path) {
    var files = [];
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path);
      files.forEach(function(file, index) {
        var curPath = path + "/" + file;
        if (fs.statSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };
  for (var i = 0; i < _this._lConf.langList.length; ++i) {
    if (_this._lConf.langList[i] == lang_.name) {
      // remove langage files first
      deleteFolderRecursive(config.LANG[0] + '/' + lang_.name);

      //remove lang name from locale.conf
      _this._lConf.langList.splice(i, 1);
      return json4line.writeJSONFile(localPath, _this._lConf, function(err_) {
        if (err_) {
          _this._lConf.langList.push(lang_.name);
          return cb_(err_);
        }
        _this.notify('remove', lang_.name);
        cb_(null);
      });
    }
  }
  cb_('Language not found');
}

var stub = null;
(function main() {
  var langMgr = new Language({
    success: function() {
      stub = require('../interface/langStub').getStub(langMgr);
      console.log('language manager start OK');
    },
    fail: function(reason) {
      langMgr = null;
      console.log('language manager start failed:', reason);
    }
  });
})();