"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _fs = require("fs");var _fs2 = _interopRequireDefault(_fs);
var _fsExtra = require("fs-extra");var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _path = require("path");var _path2 = _interopRequireDefault(_path);
var _Dir = require("./Dir");var _Dir2 = _interopRequireDefault(_Dir);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var






Entry = function () {






  function Entry() {_classCallCheck(this, Entry);for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}

    for (var i = 0; i < args.length; ++i) {args[i] = args[i].toString();}


    Object.defineProperty(this, "_path", { value: _path2.default.normalize(_path2.default.join.apply(_path2.default, args)), writable: true });
  }_createClass(Entry, [{ key: "replacePath", value: function replacePath(


























































    which) {var by = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
      var re = /[\\/]/g;
      return this.path.replace(re, _path2.default.sep).replace(_path2.default.normalize(which.replace(re, _path2.default.sep)), by);
    } }, { key: "exits", value: function exits()





















































    {
      throw new Error("Abstract method.");
    } }, { key: "create", value: function create()






    {
      throw new Error("Abstract method.");
    } }, { key: "copyTo", value: function copyTo()










    {
      var dst;for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {args[_key2] = arguments[_key2];}


      if (args.length == 1 && _typeof(args[0]) == "object") {
        dst = args[0].path;
      } else {
        for (var i = 0; i < args.length; ++i) {args[i] = args[i].toString();}
        dst = _path2.default.join.apply(_path2.default, args);
      }

      if (/[\/\\]$/.test(dst)) dst = _path2.default.join(dst, this.name);


      _fsExtra2.default.copySync(this.path, dst);
    } }, { key: "moveTo", value: function moveTo()






    {
      var dst;for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {args[_key3] = arguments[_key3];}


      for (var i = 0; i < args.length; ++i) {args[i] = args[i].toString();}
      dst = _path2.default.join.apply(_path2.default, args);
      if (/[\/\\]$/.test(dst)) dst = _path2.default.join(dst, this.name);


      _fs2.default.renameSync(this.path, dst);
      this._path = _path2.default.normalize(dst);
    } }, { key: "remove", value: function remove()




    {
      if (this.exists()) _fsExtra2.default.removeSync(this.path);
    } }, { key: "chown", value: function chown(













    user) {
      var group, opts;for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {rest[_key4 - 1] = arguments[_key4];}


      if (rest.length == 1) {
        if (typeof rest[0] == "number") group = rest[0];else
        opts = rest[0];
      } else if (rest.length >= 2) {
        group = rest[0];opts = rest[1];
      }


      if (user === undefined || user === null) user = _fs2.default.statSync(this.path).uid;
      if (group === undefined || group === null) group = _fs2.default.statSync(this.path).gid;


      _fs2.default.chownSync(this.path, user, group);
    } }, { key: "chmod", value: function chmod(






    mode, opts) {
      _fs2.default.chmodSync(this.path, mode);
    } }, { key: "toString", value: function toString()




    {
      return this.path;
    } }, { key: "path", get: function get() {return this._path;} }, { key: "name", get: function get() {return _path2.default.basename(this.path);}, set: function set(newName) {var newPath;if (newName.indexOf("/") >= 0 || newName.indexOf("\\") >= 0) {throw new Error("The new name contains / or \\. To move, use moveTo().");}newPath = _path2.default.join(this.parentPath, newName);_fs2.default.renameSync(this.path, newPath);this._path = _path2.default.normalize(newPath);} }, { key: "parentPath", get: function get() {return _path2.default.dirname(this.path);} }, { key: "parent", get: function get() {return new _Dir2.default(this.parentPath);} }, { key: "times", get: function get() {var stat;stat = _fs2.default.statSync(this.path);return { modified: stat.mtime, change: stat.ctime, access: stat.atime, creation: stat.birthtime };} }, { key: "uid", get: function get() {return _fs2.default.statSync(this.path).uid;}, set: function set(value) {this.chown(value);} }, { key: "gid", get: function get() {return _fs2.default.statSync(this.path).gid;}, set: function set(value) {this.chown(undefined, value);} }]);return Entry;}();exports.default = Entry;
