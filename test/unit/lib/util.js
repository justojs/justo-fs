//imports
const assert = require("assert");
const file = require("justo-assert-fs").file;
const dir = require("justo-assert-fs").dir;
const path = require("path");
const fs = require("../../../dist/es5/nodejs/justo-fs");
const File = fs.File;
const Dir = fs.Dir;

//suite
describe("fs", function() {
  const DATA_DIR = "test/unit/data";
  const SRC = DATA_DIR;
  const TMP_DIR = new Dir(Dir.TMP_DIR, Date.now());
  const DST = TMP_DIR.path;

  describe("#entry()", function() {
    it("entry(path) : File", function() {
      fs.entry(DATA_DIR + "/a.txt").must.be.instanceOf(File);
    });

    it("entry(path) : Dir", function() {
      fs.entry(DATA_DIR).must.be.instanceOf(Dir);
    });

    it("entry(path) : undefined", function() {
      assert(fs.entry("unknown") === undefined);
    });

    it("entry(...path)  : File", function() {
      fs.entry(DATA_DIR, "a.txt").must.be.instanceOf(File);
    });

    it("entry(...path) : Dir", function() {
      fs.entry(DATA_DIR, ".").must.be.instanceOf(Dir);
    });

    it("entry(...path) : undefined", function() {
      assert(fs.entry(DATA_DIR, "unknown") === undefined);
    });
  });

  describe("#exists()", function() {
    it("exists(file) : true", function() {
      fs.exists(DATA_DIR + "/a.txt").must.be.eq(true);
    });

    it("exists(dir) : true", function() {
      fs.exists(DATA_DIR).must.be.eq(true);
    });

    it("exists(file) : false", function() {
      fs.exists("unknown").must.be.eq(false);
    });

    it("exists(...path) : true", function() {
      fs.exists(DATA_DIR, "a.txt").must.be.eq(true);
    });

    it("exists(...path) : false", function() {
      fs.exists(DATA_DIR, "unknown").must.be.eq(false);
    });
  });

  describe("#rename()", function() {
    beforeEach(function() {
      TMP_DIR.create();
      new Dir(DATA_DIR).copyTo(TMP_DIR);
    });

    afterEach(function() {
      TMP_DIR.remove();
    });

    it("rename(from, to) : true", function() {
      const from = TMP_DIR.path + "/a.txt";
      const to = TMP_DIR.path + "/aaa.txt";

      fs.rename(from, "aaa.txt");
      fs.exists(from).must.be.eq(false);
      fs.exists(to).must.be.eq(true);
    });

    it("rename(from, to) : false", function() {
      fs.rename(TMP_DIR.path + "/unknown.txt", "known.txt").must.be.eq(false);
    });
  });

  describe("#chown()", function() {
    beforeEach(function() {
      TMP_DIR.create();
      new Dir(DATA_DIR).copyTo(TMP_DIR);
    });

    afterEach(function() {
      TMP_DIR.remove();
    });

    describe("File", function() {
      it.skip("chown(owner)", function() {
        fs.chown(path.join(TMP_DIR.path, "a.txt"), 1);
      });

      it.skip("chown(owner, opts)", function() {
        fs.chown(path.join(TMP_DIR.path, "a.txt"), 1, {});
      });

      it.skip("chown(owner, group)", function() {
        fs.chown(path.join(TMP_DIR.path, "a.txt"), 1, 1);
      });

      it.skip("chown(owner, group, opts)", function() {
        fs.chown(path.join(TMP_DIR.path, "a.txt"), 1, 1, {});
      });

      it.skip("chown(undefined, group)", function() {
        fs.chown(path.join(TMP_DIR.path, "a.txt"), undefined, 1);
      });

      it.skip("chown(undefined, group, opts)", function() {
        fs.chown(path.join(TMP_DIR.path, "a.txt"), undefined, 1, {});
      });

      it("chown(undefined, undefined)", function() {
        fs.chown(path.join(TMP_DIR.path, "a.txt"));
      });

      it("chown(undefined, undefined, opts)", function() {
        fs.chown(path.join(TMP_DIR.path, "a.txt"), undefined, undefined, {});
      });
    });

    describe("Dir", function() {
      it.skip("chown(user)", function() {
        fs.chown(TMP_DIR.path, 1);
      });

      it.skip("chown(user, {recurse})", function() {
        fs.chown(TMP_DIR.path, 1, {recurse: true});
      });

      it.skip("chown(user, group)", function() {
        fs.chown(TMP_DIR.path, 1, 1);
      });

      it.skip("chown(user, group, {recurse})", function() {
        fs.chown(TMP_DIR.path, 1, 1, {recurse: true});
      });

      it.skip("chown(undefined, group)", function() {
        fs.chown(TMP_DIR.path, undefined, 1);
      });

      it.skip("chown(undefined, group, {recurse})", function() {
        fs.chown(TMP_DIR.path, undefined, 1, {recurse: true});
      });

      it("chown(undefined, undefined)", function() {
        fs.chown(TMP_DIR.path);
      });

      it("chown(undefined, undefined, {recurse})", function() {
        fs.chown(TMP_DIR.path, undefined, undefined, {recurse: true});
      });
    });
  });

  describe("#chmod()", function() {
    beforeEach(function() {
      TMP_DIR.create();
      new Dir(DATA_DIR).copyTo(TMP_DIR);
    });

    afterEach(function() {
      TMP_DIR.remove();
    });

    describe("File", function() {
      it("chmod(mode)", function() {
        fs.chmod(path.join(TMP_DIR.path, "a.txt"), "777");
      });

      it("chmod(mode, opts)", function() {
        fs.chmod(path.join(TMP_DIR.path, "a.txt"), "777", {});
      });
    });

    describe("Dir", function() {
      it("chmod(mode)", function() {
        fs.chmod(TMP_DIR.path, "777");
      });

      it("chmod(mode, {recurse})", function() {
        fs.chmod(TMP_DIR.path, "777", {recurse: true});
      });
    });
  });

  describe.only("#copy()", function() {
    beforeEach(function() {
      TMP_DIR.create();
    });

    afterEach(function() {
      TMP_DIR.remove();
    });

    describe("File", function() {
      it("copy(src, dst)", function() {
        fs.copy(path.join(SRC, "a.txt"), path.join(DST, "a.txt"));
        file(DST, "a.txt").must.exist();
      });

      it("copy(src, dst, {force: true}) - nonexistent", function() {
        fs.copy(path.join(SRC, "nonexistent.txt"), path.join(DST, "file.txt"), {force: true});
        file(DST, "file.txt").must.not.exist();
      });

      it("copy(src, dst, {force: false}) - nonexistent", function() {
        fs.copy.must.raise(Error, [path.join(SRC, "nonexistent.txt"), path.join(DST, "file.txt"), {force: false}]);
        file(DST, "file.txt").must.not.exist();
      });
    });

    describe("Dir", function() {
      it("copy(src, dst)", function() {
        fs.copy(path.join(SRC, "dir"), path.join(DST));
        file(DST, "d1/a.txt").must.exist();
        file(DST, "d2/b.txt").must.exist();
        file(DST, "d3/c.txt").must.exist();
        file(DST, "f1.txt").must.exist();
        file(DST, "f2.json").must.exist();
      });

      it("copy(src, dst, {force: true}) - nonexistent", function() {
        fs.copy(path.join(SRC, "unknown"), path.join(DST), {force: true});
      });

      it("copy(src, dst, {force: false}) - nonexistent", function() {
        fs.copy.must.raise(Error, [path.join(SRC, "unknown"), path.join(DST), {force: false}]);
        new Dir(DST).entries.length.must.be.eq(0);
      });
    });
  });
});
