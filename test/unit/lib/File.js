//imports
const fs = require("fs");
const fsx = require("fs-extra");
const path = require("path");
const os = require("os");
const file = require("justo-assert-fs").file;
const jfs = require("../../../dist/es5/nodejs/justo-fs");
const File = jfs.File;
const Dir = jfs.Dir;

//suite
describe("File", function() {
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
      var f = new File("test/unit/data/a.txt");

      f.path.must.match(/^test.unit.data.a\.txt$/);
      f.parentPath.must.match(/^test.unit.data$/);
    });

    it("constructor(dir : string, name : string)", function() {
      var f = new File("test/unit/data", "a.txt");

      f.path.must.match(/^test.unit.data.a\.txt$/);
      f.parentPath.must.match(/^test.unit.data$/);
    });
  });

  describe("Attributes", function() {
    var f;

    before(function() {
      f = new File(SRC_DIR, "a.txt");
    });

    it("#ext", function() {
      f.ext.must.be.eq(".txt");
    });

    it("#size", function() {
      f.size.must.be.instanceOf(Number);
      f.size.must.be.gt(0);
    });
  });

  describe("#name", function() {
    var src, f;

    before(function() {
      src = new File(SRC_DIR, "a.txt");
      src.copyTo(DST_DIR, "a.txt");

      f = new File(DST_DIR, "a.txt");
    });

    after(function() {
      f.remove();
    });

    describe("get name", function() {
      it("name : string", function() {
        f.name.must.be.eq("a.txt");
      });
    });

    describe("rename", function() {
      it("name = string", function() {
        var dir = f.parentPath;

        f.name = "a.old";
        f.parentPath.must.be.eq(dir);
        f.name.must.be.eq("a.old");
      });

      it("name = string - with /", function() {
        (function() {
          f.name = "dir/a.old";
        }).must.raise();
      });
    });
  });

  describe("#times", function() {
    it("times", function() {
      var f = new File(SRC_DIR, "a.txt");
      f.times.modified.must.be.instanceOf(Date);
      f.times.change.must.be.instanceOf(Date);
      f.times.access.must.be.instanceOf(Date);
      f.times.creation.must.be.instanceOf(Date);
    });
  });

  describe("#text", function() {
    var src, f;

    beforeEach(function() {
      src = new File(SRC_DIR, "a.txt");
      src.copyTo(DST_DIR, "a.txt");

      f = new File(DST_DIR, "a.txt");
    });

    afterEach(function() {
      f.remove();
    });

    it("text : string", function() {
      f.text.must.be.eq("The a.txt file.\n");
    });

    it("text = string", function() {
      f.text = "New content";
      f.text.must.be.eq("New content");
    });
  });

  describe("#json", function() {
    var src, f;

    beforeEach(function() {
      src = new File(SRC_DIR, "file.json");
      src.copyTo(DST_DIR, "file.json");

      f = new File(DST_DIR, "file.json");
    });

    afterEach(function() {
      f.remove();
    });

    it("json : object", function() {
      f.json.must.be.eq({x: 1, y: 1});
    });

    it("json = object", function() {
      f.json = {x: 2, y: 2};
      f.json.must.be.eq({x: 2, y: 2});
    });

    it("json = !object", function() {
      (function() {
        f.json = "text";
      }).must.raise();
    });
  });

  describe("#yaml", function() {
    var src, f;

    beforeEach(function() {
      src = new File(SRC_DIR, "file.yml");
      src.copyTo(DST_DIR, "file.yml");

      f = new File(DST_DIR, "file.yml");
    });

    afterEach(function() {
      f.remove();
    });

    it("yaml : object", function() {
      f.yaml.must.be.eq({
        language: "node_js",
        node_js: ["0.11", "0.12"],
        sudo: false,
        before_install: "npm install -g grunt-cli",
        install: "npm install"
      });
    });

    it("yaml = object", function() {
      f.yaml = {
        language: "node_js",
        node_js: "0.11"
      };
      f.yaml.must.be.eq({
        language: "node_js",
        node_js: "0.11"
      });
    });

    it("yaml = !object", function() {
      (function() {
        f.yaml = "txt";
      }).must.raise();
    });
  });

  describe("#exists()", function() {
    it("exists() : true", function() {
      var f = new File(SRC_DIR, "a.txt");
      f.exists().must.be.eq(true);
    });

    it("exists() : false", function() {
      var f = new File(SRC_DIR, "unknown.txt");
      f.exists().must.be.eq(false);
    });

    it("exists() : false - checking existing directory", function() {
      var f = new File(SRC_DIR);
      f.exists().must.be.eq(false);
    });
  });

  describe("#copyTo()", function() {
    var src, dst;

    beforeEach(function() {
      src = new File(SRC_DIR, "a.txt");
      dst = new File(DST_DIR, "a.txt");
    });

    afterEach(function() {
      dst.remove();
    });

    describe("copyTo(path)", function() {
      it("copyTo(filePath)", function() {
        src.copyTo(dst.path);
        dst.exists().must.be.eq(true);
        dst.text.must.be.eq(src.text);
      });

      it("copyTo(dir)", function() {
        src.copyTo(DST_DIR + path.sep);
        dst.exists().must.be.eq(true);
        dst.text.must.be.eq(src.text);
      });
    });

    describe("copyTo(parent, name)", function() {
      it("copyTo(parent : string, name : string)", function() {
        dst.exists().must.be.eq(false);
        src.copyTo(DST_DIR, "a.txt");
        dst.exists().must.be.eq(true);
        dst.text.must.be.eq(src.text);
      });

      it("copyTo(parent : Dir, name : string)", function() {
        dst.exists().must.be.eq(false);
        src.copyTo(new Dir(DST_DIR), "a.txt");
        dst.exists().must.be.eq(true);
        dst.text.must.be.eq(src.text);
      });
    });
  });

  describe("#moveTo()", function() {
    var src, f;

    beforeEach(function() {
      src = new File(SRC_DIR, "a.txt");
      src.copyTo(DST_DIR, "a.txt");
      f = new File(DST_DIR, "a.txt");
    });

    afterEach(function() {
      f.remove();
    });

    describe("moveTo(path)", function() {
      it("moveTo(filePath)", function() {
        f.moveTo(path.join(f.parentPath, "txt.a"));
        f.parentPath.must.be.eq(DST_DIR);
        f.name.must.be.eq("txt.a");
        file(DST_DIR, "a.txt").must.not.exist();
        f.exists().must.be.eq(true);
        f.text.must.be.eq(src.text);
      });

      it("moveTo(dir)", function() {
        fs.mkdirSync(path.join(DST_DIR, "subdir"));
        f.moveTo(path.join(DST_DIR, "subdir", path.sep));
        f.parentPath.must.be.eq(path.join(DST_DIR, "subdir"));
        f.name.must.be.eq("a.txt");
        file(DST_DIR, "a.txt").must.not.exist();
        f.exists().must.be.eq(true);
        f.text.must.be.eq(src.text);
      });
    });

    describe("moveTo(parent, name)", function() {
      it("moveTo(parent : string, name : string)", function() {
        f.moveTo(DST_DIR, "b.txt");
        f.parentPath.must.be.eq(DST_DIR);
        f.name.must.be.eq("b.txt");
        file(DST_DIR, "a.txt").must.not.exist();
        f.exists().must.be.eq(true);
        f.text.must.be.eq(src.text);
      });

      it("moveTo(parent : Dir, name : string)", function() {
        f.moveTo(new Dir(DST_DIR), "b.txt");
        f.parentPath.must.be.eq(DST_DIR);
        f.name.must.be.eq("b.txt");
        file(DST_DIR, "a.txt").must.not.exist();
        f.exists().must.be.eq(true);
        f.text.must.be.eq(src.text);
      });
    });
  });

  describe("#truncate()", function() {
    var src, f;

    beforeEach(function() {
      src = new File(SRC_DIR, "a.txt");
      src.copyTo(DST_DIR, "a.txt");

      f = new File(DST_DIR, "a.txt");
      f.exists().must.be.eq(true);
    });

    afterEach(function() {
      f.remove();
    });

    it("truncate()", function() {
      f.truncate();
      f.size.must.be.eq(0);
    });
  });

  describe("#remove()", function() {
    var src, f;

    beforeEach(function() {
      src = new File(SRC_DIR, "a.txt");
      src.copyTo(DST_DIR, "a.txt");

      f = new File(DST_DIR, "a.txt");
    });

    it("remove() - existing file", function() {
      f.exists().must.be.eq(true);
      f.remove();
      f.exists().must.be.eq(false);
    });

    it("remove() - nonexisting file", function() {
      var f = new File(DST_DIR, "unknown.txt");
      f.exists().must.be.eq(false);
      f.remove();
    });
  });

  describe("#create()", function() {
    var f;

    beforeEach(function() {
      f = new File(DST_DIR, "file.to.create");
    });

    afterEach(function() {
      f.remove();
    });

    it("create()", function() {
      f.exists().must.be.eq(false);
      f.create();
      f.exists().must.be.eq(true);
      f.size.must.be.eq(0);
    });
  });

  describe("#createFrom()", function() {
    var src1, src2, dst;

    beforeEach(function() {
      src1 = new File(SRC_DIR, "a.txt");
      src2 = new File(SRC_DIR, "b.txt");
      dst = new File(DST_DIR, "concat.txt");
    });

    afterEach(function() {
      dst.remove();
    });

    describe("createFrom(files)", function() {
      it("createFrom(files) - all existing files", function() {
        dst.createFrom([src1.path, src2.path]);
        dst.text.must.be.eq("The a.txt file.\nThe b.txt file.\n");
      });

      it("createFrom(files) - some non-existing file", function() {
        dst.createFrom([src1.path, "test/unit/data/unknown.txt", src2.path]);
        dst.text.must.be.eq("The a.txt file.\nThe b.txt file.\n");
      });
    });

    describe("createFrom(files, opts)", function() {
      it("createFrom(files, opts) - all existing files", function() {
        dst.createFrom([src1.path, src2.path], {header: "header\n", separator: "---\n", footer: "footer"});
        dst.text.must.be.eq("header\nThe a.txt file.\n---\nThe b.txt file.\nfooter");
      });

      it("createFrom(files, opts) - some non-existing file", function() {
        dst.createFrom([src1.path, "test/unit/data/unknown.txt", src2.path], {header: "header\n", separator: "---\n", footer: "footer"});
        dst.text.must.be.eq("header\nThe a.txt file.\n---\nThe b.txt file.\nfooter");
      });
    });
  });

  describe("#appendText()", function() {
    var src, f;

    beforeEach(function() {
      src = new File(SRC_DIR, "a.txt");
      src.copyTo(DST_DIR, "a.txt");

      f = new File(DST_DIR, "a.txt");
    });

    afterEach(function() {
      f.remove();
    });

    it("appendText(text)", function() {
      f.appendText("Appended text.");
      f.text.must.be.eq("The a.txt file.\nAppended text.");
    });
  });
});
