"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _get = function get(object, property, receiver) {if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {return get(parent, property, receiver);}} else if ("value" in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}};
var _fs = require("fs");var _fs2 = _interopRequireDefault(_fs);
var _fsExtra = require("fs-extra");var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _os = require("os");var _os2 = _interopRequireDefault(_os);
var _path = require("path");var _path2 = _interopRequireDefault(_path);
var _Entry2 = require("./Entry");var _Entry3 = _interopRequireDefault(_Entry2);
var _File = require("./File");var _File2 = _interopRequireDefault(_File);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var 




Dir = function (_Entry) {_inherits(Dir, _Entry);function Dir() {_classCallCheck(this, Dir);return _possibleConstructorReturn(this, Object.getPrototypeOf(Dir).apply(this, arguments));}_createClass(Dir, [{ key: "file", value: function file(



























    path) {
      return new _File2.default(this.path, path);} }, { key: "dir", value: function dir(








    path) {
      return new Dir(this.path, path);} }, { key: "exists", value: function exists() 





    {
      return _fs2.default.existsSync(this.path) && _fs2.default.statSync(this.path).isDirectory();} }, { key: "create", value: function create() 





    {
      var res;


      res = false;

      if (!this.exists()) {
        try {
          _fsExtra2.default.mkdirpSync(this.path);
          res = true;} 
        catch (e) {}}





      return res;} }, { key: "copyTo", value: function copyTo() 











    {var _this2 = this;
      var dst, ignore;for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}


      if (args.length == 1 && _typeof(args[0]) == "object") {(function () {
          var dst = args[0].path;
          var ignore = args[0].ignore;

          if (typeof ignore == "string") ignore = [ignore];

          if (ignore) {
            if (/[\/\\]$/.test(dst)) dst = _path2.default.join(dst, _this2.name);

            _fsExtra2.default.copySync(_this2.path, dst, { filter: function filter(entry) {
                var copy;


                entry = _path2.default.normalize(entry);

                copy = true;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
                  for (var _iterator = ignore[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var i = _step.value;
                    i = _path2.default.normalize(i);

                    if (entry.startsWith(i)) {
                      copy = false;
                      break;}}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}




                return copy;} });} else 

          {
            _get(Object.getPrototypeOf(Dir.prototype), "copyTo", _this2).call(_this2, dst);}})();} else 

      {var _get2;
        (_get2 = _get(Object.getPrototypeOf(Dir.prototype), "copyTo", this)).call.apply(_get2, [this].concat(args));}} }, { key: "entries", get: function get() {var res = [];for (var i = 0, items = _fs2.default.readdirSync(this.path); i < items.length; ++i) {var item = items[i];var stats = _fs2.default.statSync(_path2.default.join(this.path, item));if (stats.isFile()) res.push(new _File2.default(this.path, item));else if (stats.isDirectory()) res.push(new Dir(this.path, item));}return res;} }], [{ key: "createTmpDir", value: function createTmpDir() 






























    {
      var dir;


      if (arguments.length === 0) dir = Date.now().toString();else 
      dir = _path2.default.join.apply(_path2.default, arguments);


      dir = new Dir(Dir.TMP_DIR, dir);
      if (!dir.create()) throw new Error("The '" + dir.path + " hasn't been able to be created.");


      return dir;} }, { key: "TMP_DIR", get: function get() {return _os2.default.tmpdir();} }, { key: "TMP", get: function get() {return _os2.default.tmpdir();} }]);return Dir;}(_Entry3.default);exports.default = Dir;
