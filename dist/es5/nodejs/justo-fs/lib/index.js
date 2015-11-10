//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exists = exists;
exports.remove = remove;
exports.entry = entry;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require("fs-extra");

var fsx = _interopRequireWildcard(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

//API
var Dir = require("./Dir");
exports.Dir = Dir;
var File = require("./File");

exports.File = File;
/**
 * Checks if a file system entry exists.
 *
 * @overload
 * @param path:...string  The path.
 */

function exists() {
  var entry, res;

  //(1) arguments

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 0) {
    throw new Error("Invalid number of arguments. At least, expected one.");
  }

  //(2) check
  entry = _path2["default"].join.apply(_path2["default"], args);

  try {
    _fs2["default"].statSync(entry);
    res = true;
  } catch (e) {
    res = false;
  }

  //(3) return
  return res;
}

/**
 * Removes an entry.
 *
 * @overload
 * @param path:...string  The path.
 */

function remove() {
  fsx.removeSync(_path2["default"].join.apply(_path2["default"], arguments));
}

/**
 * Returns a file or directory.
 *
 * @overload
 * @param path:...string  The path.
 */

function entry() {
  var ent, stat;

  //(1) get entry info
  ent = _path2["default"].join.apply(_path2["default"], arguments);

  try {
    stat = _fs2["default"].statSync(ent);
  } catch (e) {
    throw new Error("The '" + ent + "' entry doesn't exist.");
  }

  //(2) return
  if (stat.isFile()) return new File(ent);else if (stat.isDirectory()) return new Dir(ent);
}
