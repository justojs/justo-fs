/**
 * A directory entry.
 */
export class Dir extends Entry {
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
  constructor(...args) {
    super(...args);
  }

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
}

Object.defineProperty(Dir, "TMP_DIR", {value: os.tmpdir(), enumerable: true});
