//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require("util");
var path = require("path");
var fs = require("fs");
var fsx = require("fs-extra");
var os = require("os");
var jsyaml = require("js-yaml");

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
   *
   * @overload
   * @param parent:string The directory parent.
   * @param name:string   The entry name.
   */

  function Entry() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, Entry);

    var ep;

    //(1) arguments
    if (args.length == 1) ep = args[0];else if (args.length > 1) ep = path.join.apply(path, args);

    //(2) init
    Object.defineProperty(this, "_path", { value: path.normalize(ep), writable: true });
  }

  _createClass(Entry, [{
    key: "path",

    /**
     * The entry path.
     *
     * @type string
     */
    get: function () {
      return this._path;
    }
  }, {
    key: "name",

    /**
     * Entry name.
     *
     * @type string
     */
    get: function () {
      return path.basename(this.path);
    },
    set: function (newName) {
      var newPath;

      //(1) pre: check only name
      if (newName.indexOf("/") >= 0 || newName.indexOf("\\") >= 0) {
        throw new Error("The new name contains / or \\. To move, use moveTo().");
      }

      //(2) rename
      newPath = path.join(this.parentPath, newName);
      fs.renameSync(this.path, newPath);
      this._path = path.normalize(newPath);
    }
  }, {
    key: "parentPath",

    /**
     * The parent path.
     *
     * @type string
     */
    get: function () {
      return path.dirname(this.path);
    }
  }, {
    key: "parent",

    /**
     * The parent.
     *
     * @type Dir
     */
    get: function () {
      return new Dir(this.parentPath);
    }
  }, {
    key: "times",

    /**
     * The times: modified, change, access and creation.
     *
     * @type object
     */
    get: function () {
      var stat;

      //(1) get attributes
      stat = fs.statSync(this.path);

      //(2) return
      return {
        modified: stat.mtime,
        change: stat.ctime,
        access: stat.atime,
        creation: stat.birthtime
      };
    }
  }, {
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
  }, {
    key: "create",

    /**
     * Creates the entry.
     *
     * @abstract
     */
    value: function create() {
      throw new Error("Abstract method.");
    }
  }, {
    key: "copyTo",

    /**
     * Copies to the destination.
     *
     * @overload Using a path.
     * @param dst:string  The destination path.
     *
     * @overload Using a parent directory and an entry name.
     * @param parent:string The parent directory.
     * @param name:string   The entry name.
     *
     */
    value: function copyTo() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var dst;

      //(1) arguments
      if (args.length == 1) {
        dst = args[0];
        if (/[\/\\]$/.test(dst)) dst = path.join(dst, this.name);
      } else if (args.length > 1) {
        dst = path.join.apply(path, args);
      }

      //(2) copy
      fsx.copySync(this.path, dst);
    }
  }, {
    key: "moveTo",

    /**
     * Moves the entry to another location.
     *
     * @overload Using a path.
     * @param dst:string  The new location.
     *
     * @overload Using a parent directory and an entry name.
     * @param parent:string The parent directory.
     * @param name:string   The entry name.
     */
    value: function moveTo() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var dst;

      //(1) arguments
      if (args.length == 1) {
        dst = args[0];
        if (/[\/\\]$/.test(dst)) dst = path.join(dst, this.name);
      } else if (args.length > 1) {
        dst = path.join.apply(path, args);
      }

      //(2) move
      fs.renameSync(this.path, dst);
      this._path = path.normalize(dst);
    }
  }, {
    key: "remove",

    /**
     * Removes the entry.
     */
    value: function remove() {
      if (this.exists()) fsx.removeSync(this.path);
    }
  }]);

  return Entry;
})();

/**
 * A file entry.
 */

var File = (function (_Entry) {
  /**
   * Constructor.
   *
   * @overload
   * @param(attr) path
   *
   * @overload
   * @param dir:string  The parent directory.
   * @param name:string The file name.
   */

  function File() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    _classCallCheck(this, File);

    _get(Object.getPrototypeOf(File.prototype), "constructor", this).apply(this, args);
  }

  _inherits(File, _Entry);

  _createClass(File, [{
    key: "ext",

    /**
     * File extension with point.
     *
     * @type string
     */
    get: function () {
      return path.extname(this.path);
    }
  }, {
    key: "size",

    /**
     * Size in bytes.
     *
     * @type number
     */
    get: function () {
      return fs.statSync(this.path).size;
    }
  }, {
    key: "text",

    /**
     * Text content.
     *
     * @type string
     */
    get: function () {
      return fs.readFileSync(this.path, "utf8");
    },
    set: function (txt) {
      fs.writeFileSync(this.path, txt, "utf8");
    }
  }, {
    key: "json",

    /**
     * The file content is a JSON file.
     *
     * @type object
     */
    get: function () {
      var con;

      //(1) get object
      con = fsx.readJsonSync(this.path, { throws: false });

      //(2) return
      if (typeof con != "object") throw new Error("The '" + this.path + "' file is not a JSON file.");
      return con;
    },
    set: function (obj) {
      //(1) check
      if (typeof obj != "object") {
        throw new Error("" + util.inspect(obj) + " is not an object.");
      }

      //(2) write
      fsx.writeJsonSync(this.path, obj);
    }
  }, {
    key: "yaml",

    /**
     * The file content is a YAML file.
     *
     * @type object
     */
    get: function () {
      var con;

      //(1) get con
      try {
        con = jsyaml.safeLoad(fs.readFileSync(this.path, "utf8"));
      } catch (e) {}

      //(2) return
      if (typeof con != "object") throw new Error("The '" + this.path + "' is not a YAML file.");
      return con;
    },
    set: function (obj) {
      //(1) check
      if (typeof obj != "object") {
        throw new Error("" + util.inspect(obj) + " is not an object.");
      }

      //(2) write
      fs.writeFileSync(this.path, jsyaml.safeDump(obj), "utf8");
    }
  }, {
    key: "exists",

    /**
     * @override
     */
    value: function exists() {
      return fs.existsSync(this.path) && fs.statSync(this.path).isFile();
    }
  }, {
    key: "create",

    /**
     * @override
     */
    value: function create() {
      fs.writeFileSync(this.path, "", "utf8");
    }
  }, {
    key: "createFrom",

    /**
     * Creates the files with the content of a specified file set.
     *
     * @param files:string[]  The files to concatenate.
     * @param sep:string      The separator.
     */
    value: function createFrom(files) {
      var sep = arguments[1] === undefined ? "" : arguments[1];

      //(1) arguments
      if (typeof files == "string") files = [files];

      //(2) create
      this.create();

      //(3) write content
      for (var i = 0, written = false; i < files.length; ++i) {
        var file = new File(files[i]);

        if (file.exists()) {
          if (written && sep) fs.appendFileSync(this.path, sep);
          fs.appendFileSync(this.path, fs.readFileSync(file.path));
          written = true;
        }
      }
    }
  }, {
    key: "appendText",

    /**
     * Appends a text.
     *
     * @param text:string The text to append.
     */
    value: function appendText(text) {
      fs.appendFileSync(this.path, text, "utf8");
    }
  }, {
    key: "truncate",

    /**
     * Truncates the file.
     */
    value: function truncate() {
      fs.writeFileSync(this.path, "", "utf8");
    }
  }]);

  return File;
})(Entry);

exports.File = File;

/**
 * A directory entry.
 */

var Dir = (function (_Entry2) {
  /**
   * Constructor.
   *
   * @overload
   * @param(attr) path
   *
   * @overload
   * @param parent:string The parent directory.
   * @param name:string   The directory name.
   */

  function Dir() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    _classCallCheck(this, Dir);

    _get(Object.getPrototypeOf(Dir.prototype), "constructor", this).apply(this, args);
  }

  _inherits(Dir, _Entry2);

  _createClass(Dir, [{
    key: "entries",

    /**
     * Directory entries.
     *
     * @type Entry[]
     */
    get: function () {
      var res = [];

      //(1) get entries
      for (var i = 0, items = fs.readdirSync(this.path); i < items.length; ++i) {
        var item = items[i];
        var stats = fs.statSync(path.join(this.path, item));

        if (stats.isFile()) res.push(new File(this.path, item));else if (stats.isDirectory()) res.push(new Dir(this.path, item));
      }

      //(2) return
      return res;
    }
  }, {
    key: "exists",

    /**
     * @override
     */
    value: function exists() {
      return fs.existsSync(this.path) && fs.statSync(this.path).isDirectory();
    }
  }, {
    key: "create",

    /**
     * @override
     */
    value: function create() {
      if (!this.exists()) fsx.mkdirpSync(this.path);
    }
  }]);

  return Dir;
})(Entry);

exports.Dir = Dir;

Object.defineProperty(Dir, "TMP_DIR", { value: os.tmpdir(), enumerable: true });