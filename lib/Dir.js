//imports
import fs from "fs";
import fsx from "fs-extra";
import os from "os";
import path from "path";
import Entry from "./Entry";
import File from "./File";

/**
 * A directory entry.
 */
export default class Dir extends Entry {
  /**
   * Directory entries.
   *
   * @type Entry[]
   */
  get entries() {
    var res = [];

    //(1) get entries
    for (let i = 0, items = fs.readdirSync(this.path); i < items.length; ++i) {
      let item = items[i];
      let stats = fs.statSync(path.join(this.path, item));

      if (stats.isFile()) res.push(new File(this.path, item));
      else if (stats.isDirectory()) res.push(new Dir(this.path, item));
    }

    //(2) return
    return res;
  }

  /**
   * Directory files.
   *
   * @type File[]
   */
  get files() {
    var res = [];

    //(1) get entries
    for (let i = 0, items = fs.readdirSync(this.path); i < items.length; ++i) {
      let item = items[i];
      let stats = fs.statSync(path.join(this.path, item));

      if (stats.isFile()) res.push(new File(this.path, item));
    }

    //(2) return
    return res;
  }

  /**
   * Return a File object.
   *
   * @param path:string The subpath from this dir.
   * @return File
   */
  file(path) {
    return new File(this.path, path);
  }

  /**
   * Return a Dir object.
   *
   * @param path:string The subpath from this dir.
   * @return Dir
   */
  dir(path) {
    return new Dir(this.path, path);
  }

  /**
   * @override
   */
  exists() {
    return fs.existsSync(this.path) && fs.statSync(this.path).isDirectory();
  }

  /**
   * @override
   */
  create() {
    var res;

    //(1) create
    res = false;

    if (!this.exists()) {
      try {
        fsx.mkdirpSync(this.path);
        res = true;
      } catch (e) {

      }
    }

    //(2) return
    return res;
  }

  /**
   * Copies to the destination.
   *
   * @overload
   * @param ...dst:string[] The destination path.
   *
   * @overload
   * @param opts:object     The options: path (string), ignore (string or string[]).
   */
  copyTo(...args) {
    var dst, ignore;

    //(1) arguments
    if (args.length == 1 && typeof(args[0]) == "object") {
      let dst = args[0].path;
      let ignore = args[0].ignore;

      if (typeof(ignore) == "string") ignore = [ignore];

      if (ignore) {
        if (/[\/\\]$/.test(dst)) dst = path.join(dst, this.name);

        fsx.copySync(this.path, dst, {filter: (entry) => {
          var copy;

          //(1) check
          entry = path.normalize(entry);

          copy = true;
          for (let i of ignore) {
            i = path.normalize(i);

            if (entry.startsWith(i)) {
              copy = false;
              break;
            }
          }

          //(2) return
          return copy;
        }});
      } else {
        super.copyTo(dst);
      }
    } else {
      super.copyTo(...args);
    }
  }

  /**
   * Temporary directory.
   *
   * @type string
   */
  static get TMP_DIR() {
    return os.tmpdir();
  }

  /**
   * @alias TMP_DIR
   */
  static get TMP() {
    return os.tmpdir();
  }

  /**
   * Create a temporary directory.
   *
   * @overload
   * @noparams
   * @return Dir
   *
   * @overload
   * @param subdir:string The subdir name.
   * @return Dir
   */
  static createTmpDir(...args) {
    var dir;

    //(1) arguments
    if (args.length === 0) dir = Date.now().toString();
    else dir = path.join(...args);

    //(2) create
    dir = new Dir(Dir.TMP_DIR, dir);
    if (!dir.create()) throw new Error(`The '${dir.path} hasn't been able to be created.`);

    //(3) return
    return dir;
  }
}
