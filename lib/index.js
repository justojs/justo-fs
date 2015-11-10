//imports
import fs from "fs";
import * as fsx from "fs-extra";
import path from "path";

//API
export const Dir = require("./Dir");
export const File = require("./File");

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
 *
 * @overload
 * @param path:...string  The path.
 */
export function entry(...args) {
  var ent, stat;

  //(1) get entry info
  ent = path.join(...args);

  try {
    stat = fs.statSync(ent);
  } catch (e) {
    throw new Error(`The '${ent}' entry doesn't exist.`);
  }

  //(2) return
  if (stat.isFile()) return new File(ent);
  else if (stat.isDirectory()) return new Dir(ent);
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
