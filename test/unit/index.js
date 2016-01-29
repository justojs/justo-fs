//imports
const assert = require("assert");
const fs = require("../../dist/es5/nodejs/justo-fs");
const File = fs.File;
const Dir = fs.Dir;

//suite
describe("fs", function() {
  const DATA_DIR = "test/unit/data";
  const TMP_DIR = new Dir(Dir.TMP_DIR, Date.now());

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
});
