//imports
import fs from "fs";
import fsx from "fs-extra";
import path from "path";
import Dir from "./Dir";

/**
 * A file system entry.
 *
 * @abstract
 */
export default class Entry {
  /**
   * Constructor.
   *
   * @overload
   * @param(attr) path
   */
  constructor(...args) {
    //(1) arguments
    for (let i = 0; i < args.length; ++i) args[i] = args[i].toString();

    //(2) this
    Object.defineProperty(this, "_path", {value: path.normalize(path.join(...args)), writable: true});
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
   * Replace a part.
   *
   * @param which:string  The part to replace.
   * @param by:string     The replacer string.
   * @return string
   */
  replacePath(which, by="") {
    const re = /[\\/]/g;
    return this.path.replace(re, path.sep).replace(path.normalize(which.replace(re, path.sep)), by);
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
   * The owner UID.
   *
   * @type number
   */
  get uid() {
    return fs.statSync(this.path).uid;
  }

  set uid(value) {
    this.chown(value, this.gid);
  }

  /**
   * The group GID.
   *
   * @type number
   */
  get gid() {
    return fs.statSync(this.path).gid;
  }

  set gid(value) {
    this.chown(this.uid, value);
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
   * @param dst:string  The destination path.
   *
   */
  copyTo(...args) {
    var dst;

    //(1) arguments
    for (let i = 0; i < args.length; ++i) args[i] = args[i].toString();
    dst = path.join(...args);
    if (/[\/\\]$/.test(dst)) dst = path.join(dst, this.name);

    //(2) copy
    fsx.copySync(this.path, dst);
  }

  /**
   * Moves the entry to another location.
   *
   * @param dst:string  The new location.
   */
  moveTo(...args) {
    var dst;

    //(1) arguments
    for (let i = 0; i < args.length; ++i) args[i] = args[i].toString();
    dst = path.join(...args);
    if (/[\/\\]$/.test(dst)) dst = path.join(dst, this.name);

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

  /**
   * Change owner and group.
   *
   * @param owner:number  The new owner.
   * @param group?:number The new group.
   */
  chown(owner, group) {
    fs.chownSync(this.path, owner, group);
  }

  /**
   * Change permissions.
   *
   * @param mode:number The new mode.
   */
  chmod(mode) {
    fs.chmodSync(this.path, mode);
  }

  /**
   * @override
   */
  toString() {
    return this.path;
  }
}
