//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _Dir = require("./Dir");

var _Dir2 = _interopRequireDefault(_Dir);

/**
 * A file system entry.
 *
 * @abstract
 */

var Entry = (function () {
  /**
   * Constructor.
   *
   * @overload
   * @param(attr) path
   */

  function Entry() {
    _classCallCheck(this, Entry);

    Object.defineProperty(this, "_path", { value: _path2["default"].normalize(_path2["default"].join.apply(_path2["default"], arguments)), writable: true });
  }

  /**
   * The entry path.
   *
   * @type string
   */

  _createClass(Entry, [{
    key: "exits",

    /**
     * Checks whether the file exists.
     *
     * @abstract
     * @return boolean
     */
    value: function exits() {
      throw new Error("Abstract method.");
    }

    /**
     * Creates the entry.
     *
     * @abstract
     */
  }, {
    key: "create",
    value: function create() {
      throw new Error("Abstract method.");
    }

    /**
     * Copies to the destination.
     *
     * @overload Using a path.
     * @param dst:string  The destination path.
     *
     * @overload Using a parent directory and an entry name.
     * @param parent:string|Dir The parent directory.
     * @param name:string       The entry name.
     *
     */
  }, {
    key: "copyTo",
    value: function copyTo() {
      var dst;

      //(1) arguments

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length == 1) {
        dst = args[0];
        if (/[\/\\]$/.test(dst)) dst = _path2["default"].join(dst, this.name);
      } else if (args.length > 1) {
        var _parent = args[0];
        var _name = args[1];

        if (_parent instanceof _Dir2["default"]) _parent = _parent.path;

        dst = _path2["default"].join(_parent, _name);
      }

      //(2) copy
      _fsExtra2["default"].copySync(this.path, dst);
    }

    /**
     * Moves the entry to another location.
     *
     * @overload Using a path.
     * @param dst:string  The new location.
     *
     * @overload Using a parent directory and an entry name.
     * @param parent:string|Dir The parent directory.
     * @param name:string       The entry name.
     */
  }, {
    key: "moveTo",
    value: function moveTo() {
      var dst;

      //(1) arguments

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (args.length == 1) {
        dst = args[0];
        if (/[\/\\]$/.test(dst)) dst = _path2["default"].join(dst, this.name);
      } else if (args.length > 1) {
        var _parent2 = args[0];
        var _name2 = args[1];

        if (_parent2 instanceof _Dir2["default"]) _parent2 = _parent2.path;

        dst = _path2["default"].join(_parent2, _name2);
      }

      //(2) move
      _fs2["default"].renameSync(this.path, dst);
      this._path = _path2["default"].normalize(dst);
    }

    /**
     * Removes the entry.
     */
  }, {
    key: "remove",
    value: function remove() {
      if (this.exists()) _fsExtra2["default"].removeSync(this.path);
    }
  }, {
    key: "path",
    get: function get() {
      return this._path;
    }

    /**
     * Entry name.
     *
     * @type string
     */
  }, {
    key: "name",
    get: function get() {
      return _path2["default"].basename(this.path);
    },
    set: function set(newName) {
      var newPath;

      //(1) pre: check only name
      if (newName.indexOf("/") >= 0 || newName.indexOf("\\") >= 0) {
        throw new Error("The new name contains / or \\. To move, use moveTo().");
      }

      //(2) rename
      newPath = _path2["default"].join(this.parentPath, newName);
      _fs2["default"].renameSync(this.path, newPath);
      this._path = _path2["default"].normalize(newPath);
    }

    /**
     * The parent path.
     *
     * @type string
     */
  }, {
    key: "parentPath",
    get: function get() {
      return _path2["default"].dirname(this.path);
    }

    /**
     * The parent.
     *
     * @type Dir
     */
  }, {
    key: "parent",
    get: function get() {
      return new _Dir2["default"](this.parentPath);
    }

    /**
     * The times: modified, change, access and creation.
     *
     * @type object
     */
  }, {
    key: "times",
    get: function get() {
      var stat;

      //(1) get attributes
      stat = _fs2["default"].statSync(this.path);

      //(2) return
      return {
        modified: stat.mtime,
        change: stat.ctime,
        access: stat.atime,
        creation: stat.birthtime
      };
    }
  }]);

  return Entry;
})();

exports["default"] = Entry;
module.exports = exports["default"];
