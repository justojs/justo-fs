//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _Entry2 = require("./Entry");

var _Entry3 = _interopRequireDefault(_Entry2);

var _File = require("./File");

var _File2 = _interopRequireDefault(_File);

/**
 * A directory entry.
 */

var Dir = (function (_Entry) {
  _inherits(Dir, _Entry);

  function Dir() {
    _classCallCheck(this, Dir);

    _get(Object.getPrototypeOf(Dir.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Dir, [{
    key: "exists",

    /**
     * @override
     */
    value: function exists() {
      return _fs2["default"].existsSync(this.path) && _fs2["default"].statSync(this.path).isDirectory();
    }

    /**
     * @override
     */
  }, {
    key: "create",
    value: function create() {
      var res;

      //(1) create
      res = false;

      if (!this.exists()) {
        try {
          _fsExtra2["default"].mkdirpSync(this.path);
          res = true;
        } catch (e) {}
      }

      //(2) return
      return res;
    }

    /**
     * Temporary directory.
     */
  }, {
    key: "entries",

    /**
     * Directory entries.
     *
     * @type Entry[]
     */
    get: function get() {
      var res = [];

      //(1) get entries
      for (var i = 0, items = _fs2["default"].readdirSync(this.path); i < items.length; ++i) {
        var item = items[i];
        var stats = _fs2["default"].statSync(_path2["default"].join(this.path, item));

        if (stats.isFile()) res.push(new _File2["default"](this.path, item));else if (stats.isDirectory()) res.push(new Dir(this.path, item));
      }

      //(2) return
      return res;
    }
  }], [{
    key: "TMP_DIR",
    get: function get() {
      return _os2["default"].tmpdir();
    }
  }]);

  return Dir;
})(_Entry3["default"]);

exports["default"] = Dir;
module.exports = exports["default"];
