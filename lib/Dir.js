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
   * @override
   */
  exists() {
    return fs.existsSync(this.path) && fs.statSync(this.path).isDirectory();
  }

  /**
   * @override
   */
  create() {
    if (!this.exists()) fsx.mkdirpSync(this.path);
  }

  /**
   * Temporary directory.
   */
  static get TMP_DIR() {
    return os.tmpdir();
  }
}
