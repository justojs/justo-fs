//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _classCallCheck(this, Entry);

    var ep;

    //(1) arguments

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length == 1) {
      ep = args[0];
    } else if (args.length > 1) {
      var prnt = args[0];
      var _name = args[1];

      ep = path.join(prnt instanceof Dir ? prnt.path : prnt, _name.toString());
    }

    //(2) init
    Object.defineProperty(this, "_path", { value: path.normalize(ep), writable: true });
  }

  /**
   * A file entry.
   */

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

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (args.length == 1) {
        dst = args[0];
        if (/[\/\\]$/.test(dst)) dst = path.join(dst, this.name);
      } else if (args.length > 1) {
        var _parent = args[0];
        var _name2 = args[1];

        if (_parent instanceof Dir) _parent = _parent.path;

        dst = path.join(_parent, _name2);
      }

      //(2) copy
      fsx.copySync(this.path, dst);
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

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      if (args.length == 1) {
        dst = args[0];
        if (/[\/\\]$/.test(dst)) dst = path.join(dst, this.name);
      } else if (args.length > 1) {
        var _parent2 = args[0];
        var _name3 = args[1];

        if (_parent2 instanceof Dir) _parent2 = _parent2.path;

        dst = path.join(_parent2, _name3);
      }

      //(2) move
      fs.renameSync(this.path, dst);
      this._path = path.normalize(dst);
    }

    /**
     * Removes the entry.
     */
  }, {
    key: "remove",
    value: function remove() {
      if (this.exists()) fsx.removeSync(this.path);
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
      return path.basename(this.path);
    },
    set: function set(newName) {
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

    /**
     * The parent path.
     *
     * @type string
     */
  }, {
    key: "parentPath",
    get: function get() {
      return path.dirname(this.path);
    }

    /**
     * The parent.
     *
     * @type Dir
     */
  }, {
    key: "parent",
    get: function get() {
      return new Dir(this.parentPath);
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
      stat = fs.statSync(this.path);

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

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    _get(Object.getPrototypeOf(File.prototype), "constructor", this).apply(this, args);
  }

  /**
   * A directory entry.
   */

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
      return fs.existsSync(this.path) && fs.statSync(this.path).isFile();
    }

    /**
     * @override
     */
  }, {
    key: "create",
    value: function create() {
      fs.writeFileSync(this.path, "", "utf8");
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
          fs.appendFileSync(this.path, fs.readFileSync(file.path));
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
      fs.appendFileSync(this.path, text, "utf8");
    }

    /**
     * Truncates the file.
     */
  }, {
    key: "truncate",
    value: function truncate() {
      fs.writeFileSync(this.path, "", "utf8");
    }
  }, {
    key: "ext",
    get: function get() {
      return path.extname(this.path);
    }

    /**
     * Size in bytes.
     *
     * @type number
     */
  }, {
    key: "size",
    get: function get() {
      return fs.statSync(this.path).size;
    }

    /**
     * Text content.
     *
     * @type string
     */
  }, {
    key: "text",
    get: function get() {
      return fs.readFileSync(this.path, "utf8");
    },
    set: function set(txt) {
      fs.writeFileSync(this.path, txt, "utf8");
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
      con = fsx.readJsonSync(this.path, { throws: false });

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
      fsx.writeJsonSync(this.path, obj);
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
        con = jsyaml.safeLoad(fs.readFileSync(this.path, "utf8"));
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
      fs.writeFileSync(this.path, jsyaml.safeDump(obj), "utf8");
    }
  }]);

  return File;
})(Entry);

exports.File = File;

var Dir = (function (_Entry2) {
  _inherits(Dir, _Entry2);

  /**
   * Constructor.
   *
   * @overload
   * @param(attr) path
   *
   * @overload
   * @param parent:string|Dir The parent directory.
   * @param name:string       The directory name.
   */

  function Dir() {
    _classCallCheck(this, Dir);

    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    _get(Object.getPrototypeOf(Dir.prototype), "constructor", this).apply(this, args);
  }

  /**
   * Directory entries.
   *
   * @type Entry[]
   */

  _createClass(Dir, [{
    key: "exists",

    /**
     * @override
     */
    value: function exists() {
      return fs.existsSync(this.path) && fs.statSync(this.path).isDirectory();
    }

    /**
     * @override
     */
  }, {
    key: "create",
    value: function create() {
      if (!this.exists()) fsx.mkdirpSync(this.path);
    }
  }, {
    key: "entries",
    get: function get() {
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
  }]);

  return Dir;
})(Entry);

exports.Dir = Dir;

Object.defineProperty(Dir, "TMP_DIR", { value: os.tmpdir(), enumerable: true });
