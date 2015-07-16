// This file is auto generated based on user-defined interface.
// Please make sure that you have checked all TODOs in this file.
// TODO: please replace types with peramters' name you wanted of any functions
// TODO: please replace $ipcType with one of dbus, binder, websocket and socket

var utils = require('utils'),
  flowctl = utils.Flowctl();
var initObj = {
  "address": "nodejs.webde.lang",
  "path": "/nodejs/webde/lang",
  "name": "nodejs.webde.lang",
  "type": "dbus",
  "service": true,
  "interface": [{
    "name": "getInitInfo",
    "in": [
      "String"
    ],
    "show": "l"
  }, {
    "name": "getLang",
    "in": [
      "String"
    ],
    "show": "l"
  }, {
    "name": "getLangByName",
    "in": [
      "String"
    ],
    "show": "l"
  }, {
    "name": "setLocale",
    "in": [
      "String"
    ],
    "show": "l"
  }, {
    "name": "getCurLocale",
    "in": [],
    "show": "l"
  }, {
    "name": "getLangList",
    "in": [],
    "show": "l"
  }, {
    "name": "addLang",
    "in": [
      "Object"
    ],
    "show": "l"
  }, {
    "name": "removeLang",
    "in": [
      "Object"
    ],
    "show": "l"
  }],
  "serviceObj": {
    getInitInfo: function(name, callback_) {
      flowctl.parallel([{
        fn: function(pera_, callback) {
          lang.getCurLocale(function(err, locale) {
            if (err) {
              return callback({
                err: err
              });
            }
            callback(null, locale);
          });
        }
      }, {
        fn: function(pera_, callback) {
          lang.getLangList(function(err, list) {
            if (err) {
              return callback({
                err: err
              });
            }
            callback(null, list);
          });
        }
      }, {
        fn: function(pera_, callback) {
          lang.getLangByName(pera_, function(err, langObj) {
            if (err) {
              return callback({
                err: err
              });
            }
            callback(null, langObj);
          });
        },
        pera: name
      }], function(err, rets) {
        if (err) {
          return callback_({
            err: err
          });
        }
        callback_({
          ret: rets
        });
      });
    },
    getLang: function(path, callback) {
      lang.getLang(path, function(err, langObj) {
        if (err) {
          return callback({
            err: err
          });
        }
        callback({
          ret: langObj
        });
      });
    },
    getLangByName: function(name, callback) {
      lang.getLangByName(name, function(err, langObj) {
        if (err) {
          return callback({
            err: err
          });
        }
        callback({
          ret: langObj
        });
      });
    },
    setLocale: function(locale, callback) {
      lang.setLocale(locale, function(err) {
        if (err) {
          return callback({
            err: err
          });
        }
        callback({});
      });
    },
    getCurLocale: function(callback) {
      lang.getCurLocale(function(err, locale) {
        if (err) {
          return callback({
            err: err
          });
        }
        callback({
          ret: locale
        });
      });
    },
    getLangList: function(callback) {
      lang.getLangList(function(err, list) {
        if (err) {
          return callback({
            err: err
          });
        }
        callback({
          ret: list
        });
      });
    },
    addLang: function(langObject, callback) {
      lang.addLang(langObject, function(err) {
        if (err) {
          return callback({
            err: err
          });
        }
        callback({});
      });
    },
    removeLang: function(langObject, callback) {
      lang.removeLang(langObject, function(err) {
        if (err) {
          return callback({
            err: err
          });
        }
        callback({});
      });
    }
  }
}

function Stub() {
  // TODO: please replace $IPC with the real path of webde-rpc module in your project
  this._ipc = require('webde-rpc').getIPC(initObj);
}

Stub.prototype.notify = function(event) {
  this._ipc.notify.apply(this._ipc, arguments);
};

var stub = null,
  lang = null;
exports.getStub = function(lang_) {
  if (stub == null) {
    stub = new Stub();
    lang = lang_;
  }
  return stub;
}
