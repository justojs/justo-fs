/**
 * A file system entry.
 *
 * @abstract
 */
class Entry {
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
  constructor(...args) {
    var ep;

    //(1) arguments
    if (args.length == 1) {
      ep = args[0];
    } else if (args.length > 1) {
      let prnt = args[0];
      let name = args[1];

      ep = path.join(prnt instanceof Dir ? prnt.path : prnt, name.toString());
    }

    //(2) init
    Object.defineProperty(this, "_path", {value: path.normalize(ep), writable: true});
  }

  /**
   * The entry path.
   *
   * @type string
   */
  get path() {
    return this._path;
  }

  /**
   * Entry name.
   *
   * @type string
   */
  get name() {
    return path.basename(this.path);
  }

  set name(newName) {
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
  get parentPath() {
    return path.dirname(this.path);
  }

  /**
   * The parent.
   *
   * @type Dir
   */
  get parent() {
    return new Dir(this.parentPath);
  }

  /**
   * The times: modified, change, access and creation.
   *
   * @type object
   */
  get times() {
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

  /**
   * Checks whether the file exists.
   *
   * @abstract
   * @return boolean
   */
  exits() {
    throw new Error("Abstract method.");
  }

  /**
   * Creates the entry.
   *
   * @abstract
   */
  create() {
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
  copyTo(...args) {
    var dst;

    //(1) arguments
    if (args.length == 1) {
      dst = args[0];
      if (/[\/\\]$/.test(dst)) dst = path.join(dst, this.name);
    } else if (args.length > 1) {
      let parent = args[0];
      let name = args[1];

      if (parent instanceof Dir) parent = parent.path;

      dst = path.join(parent, name);
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
  moveTo(...args) {
    var dst;

    //(1) arguments
    if (args.length == 1) {
      dst = args[0];
      if (/[\/\\]$/.test(dst)) dst = path.join(dst, this.name);
    } else if (args.length > 1) {
      let parent = args[0];
      let name = args[1];

      if (parent instanceof Dir) parent = parent.path;

      dst = path.join(parent, name);
    }

    //(2) move
    fs.renameSync(this.path, dst);
    this._path = path.normalize(dst);
  }

  /**
   * Removes the entry.
   */
  remove() {
    if (this.exists()) fsx.removeSync(this.path);
  }
}
