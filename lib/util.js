//imports
import fs from "fs";
import * as fsx from "fs-extra";
import path from "path";
import Dir from "./Dir";
import File from "./File";

/**
 * Checks if a file system entry exists.
 *
 * @overload
 * @param path:...string  The path.
 */
export function exists(...args) {
  var entry, res;

  //(1) arguments
  if (args.length === 0) {
    throw new Error("Invalid number of arguments. At least, expected one.");
  }

  //(2) check
  entry = path.join(...args);

  try {
    fs.statSync(entry);
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
export function remove(...args) {
  fsx.removeSync(path.join(...args));
}

/**
 * Returns a file or directory.
 * If the entry doesn't exist, it returns undefined.
 *
 * @overload
 * @param path:...string  The path.
 * @return object
 */
export function entry(...args) {
  var ent, stat;

  //(1) get entry info
  ent = path.join(...args);

  try {
    stat = fs.statSync(ent);
  } catch (e) {
    // throw new Error(`The '${ent}' entry doesn't exist.`);
  }

  //(2) return
  if (stat) {
    if (stat.isFile()) return new File(ent);
    else if (stat.isDirectory()) return new Dir(ent);
  } else {
    return undefined;
  }
}

/**
 * Copies source to destination.
 *
 * @param src:string  The source path.
 * @param dst:string  The destination.
 * @param opts:object The copy options: force (boolean).
 */
export function copy(src, dst, opts = {}) {
  var e = entry(src);

  if (opts.force) {
    if (e) e.copyTo({path: dst, ignore: opts.ignore});
  } else {
    if (e) e.copyTo({path: dst, ignore: opts.ignore});
    else throw new Error(`${src} doesn't exist.`);
  }
}

/**
 * Renames an entry.
 *
 * @param from:string The current name.
 * @param to:string   The new name.
 * @return boolean
 */
export function rename(from, to) {
  var res, e = entry(from);

  //(1) rename
  if (e) {
    e.name = to;
    res = true;
  } else {
    res = false;
  }

  //(2) return
  return res;
}

/**
 * Change owner and group.
 *
 * @overload
 * @param path:string   The entry path.
 * @param user:number   The new owner.
 * @param group?:number The new group.
 * @param opts?:object  The options: recurse (boolean).
 *
 * @overload
 * @param path:string   The entry path.
 * @param user:number   The new owner.
 * @param opts:object   The options.
 *
 */
export function chown(path, user, ...rest) {
  var group, opts;

  //(1) arguments
  if (rest.length === 1) {
    if (typeof(rest[0]) == "number") group = rest[0];
    else opts = rest[0];
  } else if (rest.length >= 2) {
    [group, opts] = rest;
  }

  if (!opts) opts = {};

  //(2) change
  entry(path).chown(user, group, opts);
}


/**
 * Change permissions.
 *
 * @param path:string The entry path.
 * @param mode:number The new mode.
 */
export function chmod(path, mode, opts) {
  entry(path).chmod(mode, opts);
}
