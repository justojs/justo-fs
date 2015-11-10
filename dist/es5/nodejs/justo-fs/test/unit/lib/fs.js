//imports
const fs = require("../../../dist/es5/nodejs/justo-fs");
const File = fs.File;
const Dir = fs.Dir;

//suite
describe("fs", function() {
  const DATA_DIR = "test/unit/data";

  describe("#entry()", function() {
    it("entry(path) : File", function() {
      fs.entry(DATA_DIR + "/a.txt").must.be.instanceOf(File);
    });

    it("entry(path) : Dir", function() {
      fs.entry(DATA_DIR).must.be.instanceOf(Dir);
    });

    it("entry(path) => Error", function() {
      fs.entry.must.raise("The 'unknown' entry doesn't exist.", ["unknown"]);
    });

    it("entry(...path)  : File", function() {
      fs.entry(DATA_DIR, "a.txt").must.be.instanceOf(File);
    });

    it("entry(...path) : Dir", function() {
      fs.entry(DATA_DIR, ".").must.be.instanceOf(Dir);
    });

    it("entry(...path) => Error", function() {
      fs.entry.must.raise(/The 'test.unit.data.unknown' entry doesn't exist\./, [DATA_DIR, "unknown"]);
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
});
