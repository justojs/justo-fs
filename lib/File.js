//imports
import fs from "fs";
import fsx from "fs-extra";
import path from "path";
import jsyaml from "js-yaml";
import Entry from "./Entry";

/**
 * A file entry.
 */
export default class File extends Entry {
  /**
   * File extension with point.
   *
   * @type string
   */
  get ext() {
    return path.extname(this.path);
  }

  /**
   * Size in bytes.
   *
   * @type number
   */
  get size() {
    return fs.statSync(this.path).size;
  }

  /**
   * Text content.
   *
   * @type string
   */
  get text() {
    return fs.readFileSync(this.path, "utf8");
  }

  set text(txt) {
    fs.writeFileSync(this.path, txt, "utf8");
  }

  /**
   * The file content is a JSON file.
   *
   * @type object
   */
  get json() {
    var con;

    //(1) get object
    con = fsx.readJsonSync(this.path, {throws: false});

    //(2) return
    if (typeof(con) != "object") throw new Error(`The '${this.path}' file is not a JSON file.`);
    return con;
  }

  set json(obj) {
    //(1) check
    if (typeof(obj) != "object") {
      throw new Error(`${util.inspect(obj)} is not an object.`);
    }

    //(2) write
    fsx.writeJsonSync(this.path, obj);
  }

  /**
   * The file content is a YAML file.
   *
   * @type object
   */
  get yaml() {
    var con;

    //(1) get con
    try {
      con = jsyaml.safeLoad(fs.readFileSync(this.path, "utf8"));
    } catch (e) {

    }


    //(2) return
    if (typeof(con) != "object") throw new Error(`The '${this.path}' is not a YAML file.`);
    return con;
  }

  set yaml(obj) {
    //(1) check
    if (typeof(obj) != "object") {
      throw new Error(`${util.inspect(obj)} is not an object.`);
    }

    //(2) write
    fs.writeFileSync(this.path, jsyaml.safeDump(obj), "utf8");
  }

  /**
   * @override
   */
  exists() {
    return fs.existsSync(this.path) && fs.statSync(this.path).isFile();
  }

  /**
   * @override
   */
  create(opts = {}) {
    let res;

    //(1) create
    if (this.exists() && (opts.hasOwnProperty("overwrite") && !opts.overwrite)) {
      res = false;
    } else {
      let content;

      //determine content
      if (opts.content) {
        if (typeof(opts.content) == "object") content = JSON.stringify(opts.content);
        else content = opts.content;
      } else {
        content = "";
      }

      //create/write
      fs.writeFileSync(this.path, content, "utf8");
      res = true;
    }

    //(2) return
    return res;
  }

  /**
   * Creates the files with the content of a specified file set.
   *
   * @param files:string[]  The files to concatenate.
   * @param [opts]:object   The options: header, separator and footer.
   */
  createFrom(files, opts = {header: "", separator: "", footer: ""}) {
    //(1) arguments
    if (typeof(files) == "string") files = [files];

    //(2) create
    this.create();

    //(3) write content
    if (opts.header) this.appendText(opts.header);

    for (let i = 0, written = false; i < files.length; ++i) {
      let file = new File(files[i]);

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
   * @overload In the end.
   * @param text:string The text to append.
   *
   * @overload In a position.
   * @param text:string The text to append.
   * @param line:number In the line.
   *
   * @overload With options.
   * @param text:string The text to append.
   * @param opts:object The options: line (number), type (string: "start" or "end").
   */
  appendText(text, opts) {
    //(1) arguments
    if (typeof(opts) == "undefined") opts = {};
    else if (typeof(opts) == "number") opts = {line: opts};

    //(2) append
    if (typeof(opts.line) === "undefined" || this.text === "") {
      fs.appendFileSync(this.path, text, "utf8");
    } else {
      let content = this.text;
      let line = opts.line;
      let type = opts.type || "start";
      let eol = (this.text.indexOf("\r") >= 0 ? "\r\n" : "\n");
      let ca = this.text.split(eol);

      if (line < 0) line += ca.length;

      if (line < 0) {
        this.text = text + content;
      } else if (line === 0) {
        if (type == "start") this.text = text + content;
        else this.text = ca[0] + text + eol + ca.slice(1).join(eol);
      } else if (line + 1 >= ca.length) {
        this.appendText(text);
      } else {
        if (type == "start") {
          this.text = ca.slice(0, line).join(eol) + eol + text + ca.slice(line).join(eol);
        } else {
          this.text = ca.slice(0, line + 1).join(eol) + text + eol + ca.slice(line + 1).join(eol);
        }
      }
    }
  }

  /**
   * Truncates the file.
   */
  truncate() {
    fs.writeFileSync(this.path, "", "utf8");
  }
}
