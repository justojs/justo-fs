"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _fs = require("fs");var _fs2 = _interopRequireDefault(_fs);
var _fsExtra = require("fs-extra");var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _path = require("path");var _path2 = _interopRequireDefault(_path);
var _jsYaml = require("js-yaml");var _jsYaml2 = _interopRequireDefault(_jsYaml);
var _Entry2 = require("./Entry");var _Entry3 = _interopRequireDefault(_Entry2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var 




File = function (_Entry) {_inherits(File, _Entry);function File() {_classCallCheck(this, File);return _possibleConstructorReturn(this, Object.getPrototypeOf(File).apply(this, arguments));}_createClass(File, [{ key: "exists", value: function exists() 



























































































    {
      return _fs2.default.existsSync(this.path) && _fs2.default.statSync(this.path).isFile();} }, { key: "create", value: function create() 





    {var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var res = void 0;


      if (this.exists() && opts.hasOwnProperty("overwrite") && !opts.overwrite) {
        res = false;} else 
      {
        var content = void 0;


        if (opts.content) {
          if (_typeof(opts.content) == "object") content = JSON.stringify(opts.content);else 
          content = opts.content;} else 
        {
          content = "";}



        _fs2.default.writeFileSync(this.path, content, "utf8");
        res = true;}



      return res;} }, { key: "createFrom", value: function createFrom(








    files) {var opts = arguments.length <= 1 || arguments[1] === undefined ? { header: "", separator: "", footer: "" } : arguments[1];

      if (typeof files == "string") files = [files];


      this.create();


      if (opts.header) this.appendText(opts.header);

      for (var i = 0, written = false; i < files.length; ++i) {
        var file = new File(files[i]);

        if (file.exists()) {
          if (written && opts.separator) this.appendText(opts.separator);
          _fs2.default.appendFileSync(this.path, _fs2.default.readFileSync(file.path));
          written = true;}}



      if (opts.footer) this.appendText(opts.footer);} }, { key: "appendText", value: function appendText(
















    text, opts) {

      if (typeof opts == "undefined") opts = {};else 
      if (typeof opts == "number") opts = { line: opts };


      if (typeof opts.line === "undefined" || this.text === "") {
        _fs2.default.appendFileSync(this.path, text, "utf8");} else 
      {
        var content = this.text;
        var line = opts.line;
        var type = opts.type || "start";
        var eol = this.text.indexOf("\r") >= 0 ? "\r\n" : "\n";
        var ca = this.text.split(eol);

        if (line < 0) line += ca.length;

        if (line < 0) {
          this.text = text + content;} else 
        if (line === 0) {
          if (type == "start") this.text = text + content;else 
          this.text = ca[0] + text + eol + ca.slice(1).join(eol);} else 
        if (line + 1 >= ca.length) {
          this.appendText(text);} else 
        {
          if (type == "start") {
            this.text = ca.slice(0, line).join(eol) + eol + text + ca.slice(line).join(eol);} else 
          {
            this.text = ca.slice(0, line + 1).join(eol) + text + eol + ca.slice(line + 1).join(eol);}}}} }, { key: "truncate", value: function truncate() 








    {
      _fs2.default.writeFileSync(this.path, "", "utf8");} }, { key: "ext", get: function get() {return _path2.default.extname(this.path);} }, { key: "size", get: function get() {return _fs2.default.statSync(this.path).size;} }, { key: "text", get: function get() {return _fs2.default.readFileSync(this.path, "utf8");}, set: function set(txt) {_fs2.default.writeFileSync(this.path, txt, "utf8");} }, { key: "json", get: function get() {var con;con = _fsExtra2.default.readJsonSync(this.path, { throws: false });if ((typeof con === "undefined" ? "undefined" : _typeof(con)) != "object") throw new Error("The '" + this.path + "' file is not a JSON file.");return con;}, set: function set(obj) {if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) != "object") {throw new Error(util.inspect(obj) + " is not an object.");}_fsExtra2.default.writeJsonSync(this.path, obj);} }, { key: "yaml", get: function get() {var con;try {con = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(this.path, "utf8"));} catch (e) {}if ((typeof con === "undefined" ? "undefined" : _typeof(con)) != "object") throw new Error("The '" + this.path + "' is not a YAML file.");return con;}, set: function set(obj) {if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) != "object") {throw new Error(util.inspect(obj) + " is not an object.");}_fs2.default.writeFileSync(this.path, _jsYaml2.default.safeDump(obj), "utf8");} }]);return File;}(_Entry3.default);exports.default = File;
