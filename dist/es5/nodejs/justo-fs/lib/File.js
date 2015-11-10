//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require("js-yaml");

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _Entry2 = require("./Entry");

var _Entry3 = _interopRequireDefault(_Entry2);

/**
 * A file entry.
 */

var File = (function (_Entry) {
  _inherits(File, _Entry);

  /**
   * Constructor.
   *
   * @overload
   * @param(attr) path
   *
   * @overload
   * @param dir:string|Dir  The parent directory.
   * @param name:string     The file name.
   */

  function File() {
    _classCallCheck(this, File);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(File.prototype), "constructor", this).apply(this, args);
  }

  /**
   * File extension with point.
   *
   * @type string
   */

  _createClass(File, [{
    key: "exists",

    /**
     * @override
     */
    value: function exists() {
      return _fs2["default"].existsSync(this.path) && _fs2["default"].statSync(this.path).isFile();
    }

    /**
     * @override
     */
  }, {
    key: "create",
    value: function create() {
      _fs2["default"].writeFileSync(this.path, "", "utf8");
    }

    /**
     * Creates the files with the content of a specified file set.
     *
     * @param files:string[]  The files to concatenate.
     * @param [opts]:object   The options: header, separator and footer.
     */
  }, {
    key: "createFrom",
    value: function createFrom(files) {
      var opts = arguments.length <= 1 || arguments[1] === undefined ? { header: "", separator: "", footer: "" } : arguments[1];

      //(1) arguments
      if (typeof files == "string") files = [files];

      //(2) create
      this.create();

      //(3) write content
      if (opts.header) this.appendText(opts.header);

      for (var i = 0, written = false; i < files.length; ++i) {
        var file = new File(files[i]);

        if (file.exists()) {
          if (written && opts.separator) this.appendText(opts.separator);
          _fs2["default"].appendFileSync(this.path, _fs2["default"].readFileSync(file.path));
          written = true;
        }
      }

      if (opts.footer) this.appendText(opts.footer);
    }

    /**
     * Appends a text.
     *
     * @param text:string The text to append.
     */
  }, {
    key: "appendText",
    value: function appendText(text) {
      _fs2["default"].appendFileSync(this.path, text, "utf8");
    }

    /**
     * Truncates the file.
     */
  }, {
    key: "truncate",
    value: function truncate() {
      _fs2["default"].writeFileSync(this.path, "", "utf8");
    }
  }, {
    key: "ext",
    get: function get() {
      return _path2["default"].extname(this.path);
    }

    /**
     * Size in bytes.
     *
     * @type number
     */
  }, {
    key: "size",
    get: function get() {
      return _fs2["default"].statSync(this.path).size;
    }

    /**
     * Text content.
     *
     * @type string
     */
  }, {
    key: "text",
    get: function get() {
      return _fs2["default"].readFileSync(this.path, "utf8");
    },
    set: function set(txt) {
      _fs2["default"].writeFileSync(this.path, txt, "utf8");
    }

    /**
     * The file content is a JSON file.
     *
     * @type object
     */
  }, {
    key: "json",
    get: function get() {
      var con;

      //(1) get object
      con = _fsExtra2["default"].readJsonSync(this.path, { throws: false });

      //(2) return
      if (typeof con != "object") throw new Error("The '" + this.path + "' file is not a JSON file.");
      return con;
    },
    set: function set(obj) {
      //(1) check
      if (typeof obj != "object") {
        throw new Error(util.inspect(obj) + " is not an object.");
      }

      //(2) write
      _fsExtra2["default"].writeJsonSync(this.path, obj);
    }

    /**
     * The file content is a YAML file.
     *
     * @type object
     */
  }, {
    key: "yaml",
    get: function get() {
      var con;

      //(1) get con
      try {
        con = _jsYaml2["default"].safeLoad(_fs2["default"].readFileSync(this.path, "utf8"));
      } catch (e) {}

      //(2) return
      if (typeof con != "object") throw new Error("The '" + this.path + "' is not a YAML file.");
      return con;
    },
    set: function set(obj) {
      //(1) check
      if (typeof obj != "object") {
        throw new Error(util.inspect(obj) + " is not an object.");
      }

      //(2) write
      _fs2["default"].writeFileSync(this.path, _jsYaml2["default"].safeDump(obj), "utf8");
    }
  }]);

  return File;
})(_Entry3["default"]);

exports["default"] = File;
module.exports = exports["default"];
