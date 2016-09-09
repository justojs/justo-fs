"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _get = function get(object, property, receiver) {if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {return get(parent, property, receiver);}} else if ("value" in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}};
var _fs = require("fs");var _fs2 = _interopRequireDefault(_fs);
var _fsExtra = require("fs-extra");var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _os = require("os");var _os2 = _interopRequireDefault(_os);
var _path = require("path");var _path2 = _interopRequireDefault(_path);
var _justoSync = require("justo-sync");var _justoSync2 = _interopRequireDefault(_justoSync);
var _Entry2 = require("./Entry");var _Entry3 = _interopRequireDefault(_Entry2);
var _File = require("./File");var _File2 = _interopRequireDefault(_File);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var




Dir = function (_Entry) {_inherits(Dir, _Entry);function Dir() {_classCallCheck(this, Dir);return _possibleConstructorReturn(this, (Dir.__proto__ || Object.getPrototypeOf(Dir)).apply(this, arguments));}_createClass(Dir, [{ key: "hasEntries", value: function hasEntries()





    {
      return _fs2.default.readdirSync(this.path).length > 0;
    } }, { key: "getEntryNames", value: function getEntryNames()


























    {
      return _fs2.default.readdirSync(this.path);
    } }, { key: "getFileNames", value: function getFileNames()

























    {var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var res = [],ext = true,ignore = [];


      if (!opts) opts = {};
      if (opts.hasOwnProperty("ext")) ext = !!opts.ext;
      if (typeof opts.ignore == "string") ignore = [opts.ignore];else
      if (opts.ignore instanceof Array) ignore = opts.ignore;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {


        for (var _iterator = _fs2.default.readdirSync(this.path)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var item = _step.value;
          if (ignore.indexOf(item) < 0) {
            var stats = _fs2.default.statSync(_path2.default.join(this.path, item));

            if (stats.isFile()) {
              if (ext) res.push(item);else
              res.push(_path2.default.basename(item, _path2.default.extname(item)));
            }
          }
        }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}


      return res;
    } }, { key: "getDirNames", value: function getDirNames(







    opts) {
      var res = [],ignore = [];


      if (!opts) opts = {};
      if (typeof opts.ignore == "string") ignore = [opts.ignore];else
      if (opts.ignore instanceof Array) ignore = opts.ignore;var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {


        for (var _iterator2 = _fs2.default.readdirSync(this.path)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var item = _step2.value;
          if (ignore.indexOf(item) < 0) {
            var stats = _fs2.default.statSync(_path2.default.join(this.path, item));
            if (stats.isDirectory()) res.push(item);
          }
        }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}


      return res;
    } }, { key: "file", value: function file(







    path) {
      return new _File2.default(this.path, path);
    } }, { key: "dir", value: function dir(







    path) {
      return new Dir(this.path, path);
    } }, { key: "exists", value: function exists()




    {
      return _fs2.default.existsSync(this.path) && _fs2.default.statSync(this.path).isDirectory();
    } }, { key: "create", value: function create()




    {
      var res;


      res = false;

      if (!this.exists()) {
        try {
          _fsExtra2.default.mkdirpSync(this.path);
          res = true;
        } catch (e) {

        }
      }


      return res;
    } }, { key: "copyTo", value: function copyTo()










    {var _this2 = this;
      var dst, ignore;for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}


      if (args.length == 1 && _typeof(args[0]) == "object") {(function () {
          var dst = args[0].path;
          var ignore = args[0].ignore;

          if (!ignore) ignore = [];
          if (typeof ignore == "string") ignore = [ignore];

          if (ignore.length > 0) {
            if (/[\/\\]$/.test(dst)) dst = _path2.default.join(dst, _this2.name);

            (0, _justoSync2.default)(function (done) {
              _fsExtra2.default.copy(_this2.path, dst, {
                filter: function filter(entry) {
                  var copy;


                  entry = _path2.default.normalize(entry);

                  copy = true;var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {
                    for (var _iterator3 = ignore[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var i = _step3.value;
                      i = _path2.default.normalize(i);
                      if (entry.endsWith(i)) {
                        copy = false;
                        break;
                      }
                    }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3.return) {_iterator3.return();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}

                  return copy;
                } },
              function (err) {
                if (err) done(err);
                done();
              });
            });
          } else {
            _get(Dir.prototype.__proto__ || Object.getPrototypeOf(Dir.prototype), "copyTo", _this2).call(_this2, dst);
          }})();
      } else {var _get2;
        (_get2 = _get(Dir.prototype.__proto__ || Object.getPrototypeOf(Dir.prototype), "copyTo", this)).call.apply(_get2, [this].concat(args));
      }
    } }, { key: "chown", value: function chown(














































    user) {
      var group, opts;for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {rest[_key2 - 1] = arguments[_key2];}


      if (rest.length == 1) {
        if (typeof rest[0] == "number") group = rest[0];else
        opts = rest[0];
      } else if (rest.length >= 2) {
        group = rest[0];opts = rest[1];
      }

      if (!opts) opts = {};


      if (opts.recurse) {var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {
          for (var _iterator4 = this.entries[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var entry = _step4.value;entry.chown(user, group, opts);}} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4.return) {_iterator4.return();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}
      }

      _get(Dir.prototype.__proto__ || Object.getPrototypeOf(Dir.prototype), "chown", this).call(this, user, group, opts);
    } }, { key: "chmod", value: function chmod(




    mode, opts) {

      if (!opts) opts = {};


      if (opts.recurse) {var _iteratorNormalCompletion5 = true;var _didIteratorError5 = false;var _iteratorError5 = undefined;try {
          for (var _iterator5 = this.entries[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {var entry = _step5.value;entry.chmod(mode, opts);}} catch (err) {_didIteratorError5 = true;_iteratorError5 = err;} finally {try {if (!_iteratorNormalCompletion5 && _iterator5.return) {_iterator5.return();}} finally {if (_didIteratorError5) {throw _iteratorError5;}}}
      }

      _get(Dir.prototype.__proto__ || Object.getPrototypeOf(Dir.prototype), "chmod", this).call(this, mode, opts);
    } }, { key: "entries", get: function get() {var res = [];var _iteratorNormalCompletion6 = true;var _didIteratorError6 = false;var _iteratorError6 = undefined;try {for (var _iterator6 = _fs2.default.readdirSync(this.path)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {var item = _step6.value;var stats = _fs2.default.statSync(_path2.default.join(this.path, item));if (stats.isFile()) res.push(new _File2.default(this.path, item));else if (stats.isDirectory()) res.push(new Dir(this.path, item));}} catch (err) {_didIteratorError6 = true;_iteratorError6 = err;} finally {try {if (!_iteratorNormalCompletion6 && _iterator6.return) {_iterator6.return();}} finally {if (_didIteratorError6) {throw _iteratorError6;}}}return res;} }, { key: "files", get: function get() {var res = [];var _iteratorNormalCompletion7 = true;var _didIteratorError7 = false;var _iteratorError7 = undefined;try {for (var _iterator7 = _fs2.default.readdirSync(this.path)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {var item = _step7.value;var stats = _fs2.default.statSync(_path2.default.join(this.path, item));if (stats.isFile()) res.push(new _File2.default(this.path, item));}} catch (err) {_didIteratorError7 = true;_iteratorError7 = err;} finally {try {if (!_iteratorNormalCompletion7 && _iterator7.return) {_iterator7.return();}} finally {if (_didIteratorError7) {throw _iteratorError7;}}}return res;} }], [{ key: "createTmpDir", value: function createTmpDir() {var dir;if (arguments.length === 0) dir = Date.now().toString();else dir = _path2.default.join.apply(_path2.default, arguments);dir = new Dir(Dir.TMP_DIR, dir);if (!dir.create()) throw new Error("The '" + dir.path + " hasn't been able to be created.");return dir;} }, { key: "TMP_DIR", get: function get() {return _os2.default.tmpdir();} }, { key: "TMP", get: function get() {return _os2.default.tmpdir();} }]);return Dir;}(_Entry3.default);exports.default = Dir;
