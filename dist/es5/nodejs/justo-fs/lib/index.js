"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.exists = exists;exports.remove = remove;exports.entry = entry;exports.copy = copy;exports.rename = rename;function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj["default"] = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}var _fs = require(
"fs");var _fs2 = _interopRequireDefault(_fs);var _fsExtra = require(
"fs-extra");var fsx = _interopRequireWildcard(_fsExtra);var _path = require(
"path");var _path2 = _interopRequireDefault(_path);


var Dir = require("./Dir");exports.Dir = Dir;
var File = require("./File");exports.File = File;







function exists() {
  var entry, res;for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}


  if (args.length === 0) {
    throw new Error("Invalid number of arguments. At least, expected one.");}



  entry = _path2["default"].join.apply(_path2["default"], args);

  try {
    _fs2["default"].statSync(entry);
    res = true;} 
  catch (e) {
    res = false;}



  return res;}








function remove() {
  fsx.removeSync(_path2["default"].join.apply(_path2["default"], arguments));}










function entry() {
  var ent, stat;


  ent = _path2["default"].join.apply(_path2["default"], arguments);

  try {
    stat = _fs2["default"].statSync(ent);} 
  catch (e) {}




  if (stat) {
    if (stat.isFile()) return new File(ent);else 
    if (stat.isDirectory()) return new Dir(ent);} else 
  {
    return undefined;}}









function copy(src, dst) {
  entry(src).copyTo(dst);}









function rename(from, to) {
  var res, e = entry(from);


  if (e) {
    e.name = to;
    res = true;} else 
  {
    res = false;}



  return res;}
