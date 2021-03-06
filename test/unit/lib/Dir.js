//imports
const fs = require("fs");
const fsx = require("fs-extra");
const path = require("path");
const os = require("os");
const dir = require("justo-assert-fs").dir;
const file = require("justo-assert-fs").file;
const File = require("../../../dist/es5/nodejs/justo-fs").File;
const Dir = require("../../../dist/es5/nodejs/justo-fs").Dir;

//suite
describe("Dir", function() {
  const SRC_DIR = "test/unit/data/";
  const DST_DIR = path.join(os.tmpdir(), Date.now().toString());

  before(function() {
    fs.mkdirSync(DST_DIR);
  });

  after(function() {
    fsx.removeSync(DST_DIR);
  });

  describe("#constructor()", function() {
    it("constructor(path)", function() {
      var d = new Dir("test/unit/data");

      d.path.must.match(/^test.unit.data$/);
      d.parentPath.must.match(/^test.unit$/);
    });

    it("constructor(parent : string, name : string)", function() {
      var d = new Dir("test/unit", "data");

      d.path.must.match(/^test.unit.data$/);
      d.parentPath.must.match(/^test.unit$/);
    });
  });

  describe("#times", function() {
    it("times", function() {
      var d = new Dir(SRC_DIR);
      d.times.modified.must.be.instanceOf(Date);
      d.times.change.must.be.instanceOf(Date);
      d.times.access.must.be.instanceOf(Date);
      d.times.creation.must.be.instanceOf(Date);
    });
  });

  describe("#name", function() {
    var src, dst;

    before(function() {
      src = new Dir(SRC_DIR);
      src.copyTo(DST_DIR, "subdir");

      d = new Dir(DST_DIR, "subdir");
    });

    after(function() {
      d.remove();
    });

    describe("get name", function() {
      it("name : string", function() {
        d.name.must.be.eq("subdir");
      });
    });

    describe("rename", function() {
      it("name = string", function() {
        var prnt = d.parentPath;

        d.name = "oldie";
        d.parentPath.must.be.eq(prnt);
        d.name.must.be.eq("oldie");
      });

      it("name = string - with /", function() {
        (function() {
          d.name = "dir/a.old";
        }).must.raise();
      });
    });
  });

  describe("#hasEntries()", function() {
    it("hasEntries() : true", function() {
      new Dir(SRC_DIR).hasEntries().must.be.eq(true);
    });

    it("hasEntries() : false", function() {
      var dir = Dir.createTmpDir();
      dir.hasEntries().must.be.eq(false);
      dir.remove();
    });
  });

  describe("#entries", function() {
    var src, dst;

    beforeEach(function() {
      src = new Dir(SRC_DIR);
      src.copyTo(DST_DIR);
      new Dir(DST_DIR, "data/subdir").create();

      dst = new Dir(DST_DIR);
    });

    afterEach(function() {
      dst.remove();
    });

    it("entries : Entry[]", function() {
      var ee = dst.entries;

      ee.length.must.be.eq(8);

      for (var i = 0; i < ee.length; ++i) {
        var entry = ee[i];
        if (["a.txt", "append.txt", "b.txt", "file.json", "file.yml"].indexOf(entry.name) >= 0) {
          entry.must.be.instanceOf(File);
        } else {
          entry.must.be.instanceOf(Dir);
        }
      }
    });
  });

  describe("#getEntryNames()", function() {
    var dir;

    beforeEach(function() {
      dir = new Dir(SRC_DIR);
    });

    it("getEntryNames()", function() {
      dir.getEntryNames().sort().must.be.eq(["a.txt", "append.txt", "b.txt", "dir", "file.json", "file.yml", "ignore"]);
    });
  });

  describe("#files", function() {
    var dir;

    beforeEach(function() {
      dir = new Dir(SRC_DIR);
    });

    it("files : File[]", function() {
      dir.files.length.must.be.eq(5);
    });
  });

  describe("#getFileNames()", function() {
    var dir;

    beforeEach(function() {
      dir = new Dir(SRC_DIR);
    });

    it("getFilenames()", function() {
      dir.getFileNames().sort().must.be.eq(["a.txt", "append.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("getFilenames({ext: true})", function() {
      dir.getFileNames().sort().must.be.eq(["a.txt", "append.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("getFileNames({ext: false})", function() {
      dir.getFileNames({ext: false}).sort().must.be.eq(["a", "append", "b", "file", "file"]);
    });

    it("getFileNames({ignore: string})", function() {
      dir.getFileNames({ignore: "append.txt"}).sort().must.be.eq(["a.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("getFileNames({ignore: string, ext: true})", function() {
      dir.getFileNames({ignore: "append.txt", ext: true}).sort().must.be.eq(["a.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("getFileNames({ignore: string, ext: false})", function() {
      dir.getFileNames({ignore: "append.txt", ext: false}).sort().must.be.eq(["a", "b", "file", "file"]);
    });

    it("getFileNames({ignore: string[]})", function() {
      dir.getFileNames({ignore: ["append.txt"]}).sort().must.be.eq(["a.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("getFileNames({ignore: string[], ext: true})", function() {
      dir.getFileNames({ignore: ["append.txt"], ext: true}).sort().must.be.eq(["a.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("getFileNames({ignore: string[], ext: false})", function() {
      dir.getFileNames({ignore: ["append.txt"], ext: false}).sort().must.be.eq(["a", "b", "file", "file"]);
    });
  });

  describe("#getDirNames()", function() {
    var dir;

    beforeEach(function() {
      dir = new Dir(SRC_DIR, "dir");
    });

    it("getDirNames()", function() {
      dir.getDirNames().sort().must.be.eq(["d1", "d2", "d3"]);
    });

    it("getDirNames({ignore: string})", function() {
      dir.getDirNames({ignore: "d2"}).sort().must.be.eq(["d1", "d3"]);
    });

    it("getDirNames({ignore: string[]})", function() {
      dir.getDirNames({ignore: ["d2"]}).sort().must.be.eq(["d1", "d3"]);
    });
  });

  describe("#file()", function() {
    it("file(subpath)", function() {
      var dir = new Dir(SRC_DIR);
      var file = dir.file("file.txt");
      file.must.be.instanceOf("File");
    });
  });

  describe("#dir()", function() {
    it("dir(subpath)", function() {
      var dir = new Dir(SRC_DIR);
      var subdir = dir.dir("subdir");
      subdir.must.be.instanceOf("Dir");
    });
  });

  describe("#exists()", function() {
    it("exists() : true", function() {
      var d = new Dir(SRC_DIR);
      d.exists().must.be.eq(true);
    });

    it("exists() : false", function() {
      var d = new Dir(SRC_DIR, "unknown");
      d.exists().must.be.eq(false);
    });

    it("exists() : false - checking existing file", function() {
      var d = new Dir(SRC_DIR, "a.txt");
      d.exists().must.be.eq(false);
    });
  });

  describe("#copyTo()", function() {
    var src, dst;

    beforeEach(function() {
      src = new Dir(SRC_DIR);
      dst = new Dir(DST_DIR, "data");
    });

    afterEach(function() {
      dst.remove();
    });

    it("copyTo(filePath)", function() {
      src.copyTo(dst.path);
      dst.exists().must.be.eq(true);
      dir(dst.path).must.have(["a.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("copyTo(dir)", function() {
      src.copyTo(DST_DIR + path.sep);
      dst.exists().must.be.eq(true);
      dir(dst.path).must.have(["a.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("copyTo(parent : string, name : string)", function() {
      dst.exists().must.be.eq(false);
      src.copyTo(DST_DIR, "data");
      dst.exists().must.be.eq(true);
      dir(dst.path).must.have(["a.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("copyTo(parent : Dir, name : string)", function() {
      dst.exists().must.be.eq(false);
      src.copyTo(new Dir(DST_DIR), "data");
      dst.exists().must.be.eq(true);
      dir(dst.path).must.have(["a.txt", "b.txt", "file.json", "file.yml", "ignore"]);
      dir(dst.path, "ignore").must.have(["c.txt"]);
    });

    describe("ignore", function() {
      it("copyTo({path, ignore : string}) - dir to ignore", function() {
        src.copyTo({path: dst.path, ignore: path.join(SRC_DIR, "ignore")});
        dst.exists().must.be.eq(true);
        dir(dst.path).must.have(["a.txt", "b.txt", "file.json", "file.yml"]);
        dir(dst.path, "ignore").must.not.exist();
      });

      it("copyTo({path, ignore : string}) - file to ignore", function() {
        src.copyTo({path: dst.path, ignore: "a.txt"});
        dir(dst.path).must.exist();
        dir(dst.path).must.have(["b.txt", "file.json", "file.yml", "ignore"]);
        file(dst.path, "a.txt").must.not.exist();
        file(dst.path, "ignore", "c.txt").must.exist();
      });
    });
  });

  describe("#moveTo()", function() {
    var src, d;

    beforeEach(function() {
      src = new Dir(SRC_DIR);
      src.copyTo(DST_DIR, "data");

      d = new Dir(DST_DIR, "data");
    });

    afterEach(function() {
      new Dir(DST_DIR, "src").remove();
    });

    it("moveTo(dirPath)", function() {
      d.moveTo(path.join(DST_DIR, "src"));
      d.parentPath.must.be.eq(DST_DIR);
      d.name.must.be.eq("src");
      dir(DST_DIR, "data").must.not.exist();
      d.exists().must.be.eq(true);
      dir(DST_DIR, "src").must.have(["a.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("moveTo(dir)", function() {
      fs.mkdirSync(path.join(DST_DIR, "src"));
      d.moveTo(path.join(DST_DIR, "src", path.sep));
      d.parentPath.must.be.eq(path.join(DST_DIR, "src"));
      d.name.must.be.eq("data");
      dir(DST_DIR, "data").must.not.exist();
      d.exists().must.be.eq(true);
      dir(DST_DIR, "src/data").must.have(["a.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("moveTo(parent : string, name : string)", function() {
      dir(DST_DIR, "src").must.not.exist();
      d.moveTo(DST_DIR, "src");
      d.parentPath.must.be.eq(DST_DIR);
      d.name.must.be.eq("src");
      dir(DST_DIR, "data").must.not.exist();
      d.exists().must.be.eq(true);
      dir(DST_DIR, "src").must.have(["a.txt", "b.txt", "file.json", "file.yml"]);
    });

    it("moveTo(parent : Dir, name : string)", function() {
      dir(DST_DIR, "src").must.not.exist();
      d.moveTo(new Dir(DST_DIR), "src");
      d.parentPath.must.be.eq(DST_DIR);
      d.name.must.be.eq("src");
      dir(DST_DIR, "data").must.not.exist();
      d.exists().must.be.eq(true);
      dir(DST_DIR, "src").must.have(["a.txt", "b.txt", "file.json", "file.yml"]);
    });
  });

  describe("#remove()", function() {
    var src, dst;

    beforeEach(function() {
      src = new Dir(SRC_DIR);
      src.copyTo(DST_DIR, "data");

      dst = new Dir(DST_DIR, "data");
    });

    it("remove() - existing file", function() {
      dst.exists().must.be.eq(true);
      dst.remove();
      dst.exists().must.be.eq(false);
    });

    it("remove() - nonexisting file", function() {
      var d = new Dir(DST_DIR, "unknowndir");
      d.exists().must.be.eq(false);
      d.remove();
    });
  });

  describe("#create()", function() {
    var d;

    beforeEach(function() {
      d = new Dir(DST_DIR, "dir.to.create");
    });

    afterEach(function() {
      d.remove();
    });

    it("create() - not existing", function() {
      d.exists().must.be.eq(false);
      d.create().must.be.eq(true);
      d.exists().must.be.eq(true);
    });

    it("create() - existing", function() {
      d.create();
      d.exists().must.be.eq(true);
      d.create().must.be.eq(false);
      d.exists().must.be.eq(true);
    });
  });

  describe("#TMP_DIR", function() {
    it("TMP_DIR : string", function() {
      Dir.TMP_DIR.must.be.instanceOf(String);
    });
  });

  describe("#createTmpDir()", function() {
    it("createTmpDir()", function() {
      var dir = Dir.createTmpDir();

      dir.must.be.instanceOf(Dir);
      dir.exists().must.be.eq(true);
      dir.name.must.match(/[0-9]+/);

      dir.remove();
    });

    it("createTmpDir(subdir)", function() {
      var name = Date.now().toString();
      var dir = Dir.createTmpDir(name);

      dir.must.be.instanceOf(Dir);
      dir.exists().must.be.eq(true);
      dir.name.must.be.eq(name);

      dir.remove();
    });
  });
});
