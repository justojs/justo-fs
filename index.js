//imports
import fs from "fs";
import * as fsx from "fs-extra";
import path from "path";
import Dir from "./lib/Dir";
import File from "./lib/File";

//API
export {File, Dir};

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
 */
export function copy(src, dst) {
  entry(src).copyTo(dst);
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
 * @param path:string
 * @param owner:number
 * @param group?:number
 */
export function chown(path, owner, group) {
  //(1) arguments
  if (owner === undefined || owner === null) {
    owner = fs.statSync(path).uid;
  }

  if (group === undefined || group === null) {
    group = fs.statSync(path).gid;
  }

  //(2) change
  fs.chownSync(path, owner, group);
}


/**
 * Change permissions.
 *
 * @param path:string The entry path.
 * @param mode:number The new mode.
 */
export function chmod(path, mode) {
  fs.chmodSync(path, mode);
}
