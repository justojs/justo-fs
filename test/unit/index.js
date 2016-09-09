//imports
const pkg = require("../../dist/es5/nodejs/justo-fs");

//suite
describe("API", function() {
  it("File", function() {
    pkg.File.must.be.instanceOf(Function);
  });

  it("Dir", function() {
    pkg.Dir.must.be.instanceOf(Function);
  });

  it("chmod", function() {
    pkg.chmod.must.be.instanceOf(Function);
  });

  it("chown", function() {
    pkg.chown.must.be.instanceOf(Function);
  });

  it("copy", function() {
    pkg.copy.must.be.instanceOf(Function);
  });

  it("entry", function() {
    pkg.entry.must.be.instanceOf(Function);
  });

  it("exists", function() {
    pkg.exists.must.be.instanceOf(Function);
  });

  it("remove", function() {
    pkg.remove.must.be.instanceOf(Function);
  });

  it("rename", function() {
    pkg.rename.must.be.instanceOf(Function);
  });
});
