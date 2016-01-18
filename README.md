[![Build Status](https://travis-ci.org/justojs/justo-fs.svg)](https://travis-ci.org/justojs/justo-fs)

Simple object-oriented file system API.

*Proudly made with ♥ in Valencia, Spain, EU.*

## Table of contents

1. [Files](#files)
2. [Directories](#directories)
3. [Entries](#entries)

## Files

The `File` class represents a file.

### Constructors

To create a `File` instance, we can use the following constructors:

```
File(...path)
```

Example:

```
f = new File("/my/dir/file.txt");
f = new File("/my/dir", "file.txt");
```

### Attributes

To get file info, we can use the following attributes:

```
path : string         //the file path
name : string         //the file name
ext : string          //the file extension
parent : Dir          //the parent directory
parentPath : string   //the parent directory path
size : number         //the file size in bytes
times : object        //the times: modified, change, access, creation
```

#### Renaming

To rename a file, we have to use the `name` property.
If the new name contains a path, the method raises an error

Examples:

```
var f = new File("/my/dir", "file.txt");
f.name = "file.old";      //ok
f.name = "dir/file.old";  //error
```

When the file is renamed, the instance references to the new path:

```
f = new File("/my/dir", "file.txt");
console.log(f.name);  //file.txt
f.name = "file.old";
console.log(f.name);  //now: file.old
```

### Content

To get the content, we can use the properties: `text`, `json` or `yaml`.

#### text

To read/set the contents as a string:

```
get text() : string
set text(text : string)
```

Example:

```
var f = new File("/my/dir", "file.txt");
console.log(f.text);
f.text = "the new content";
```

#### json

To read/set the content as a JSON object:

```
get json() : object
set json(obj : object)
```

Example:

```
var f = new File("/my/dir", "file.json");
console.log(f.json.x);
f.json = {x: 1, y: 2};
```

#### yaml

To read/set the content as a YAML object:

```
get yaml() : object
set yaml(obj : object)
```

### exists()

Checks whether the entry exists and it is a file:

```
exists() : boolean
```

If the entry exists but it is not a file, it returns false.

### create()

Creates the file:

```
create() : boolean
create(opts) : boolean
```

The method returns if the file has been created.

The `opts` parameter can have the following properties:

- `overwrite` (boolean). Must the file be overwritten whether it exists? `true`, yep; `false`, nope. Default: `true`.
- `content` (string or object). The file content. If an object is passed, this is transformed to JSON.

Examples:

```
f = new File("/my/dir", "file.txt");

f.create();
f.create({overwrite: false});
f.create({overwrite: false, content: "The content."});
f.create({overwrite: false, content: {x: 1, y: 2}});
```

### createFrom()

Creates the file using as content the concatenated content of the specified files:

```
createFrom(files : string[], opts : object = {header: "", separator: "", footer: ""})
```

The options can be:

- `header` (string). Text at the beginning of the file.
- `separator` (string). Text between files.
- `footer` (string). Text at the end of the file.

Example:

```
f = new File("/my/dir", "file.txt");
f.createFrom(["/my/dir/a.txt", "/my/dir/b.txt"], {separator: "\n\n"});
```

### appendText()

Appends a text at the end of the file:

```
f.appendText(text : string)
```

### remove()

Removes the file:

```
remove()
```

### truncate()

Truncates the file:

```
truncate()
```

### copyTo()

Copies the file:

```
copyTo(...path)
```

If the `path` parameter ends with `/`, the method copies the file to the specified
directory using as name the file name; otherwise, the file is copied to the specified
path. For example:

```
var f = new File("/my/dir", "file.txt");

f.copyTo("/my/new/dir/");         //copy to /my/new/dir/file.txt
f.copyTo("/my/dir/file.old");     //copy to /my/dir/file.old
f.copyTo("/my/dir", "file.old");  //copy to /my/dir/file.old
```

### moveTo()

Moves the file to another location:

```
moveTo(...path)
```

If the `path` parameter ends with `/`, the file is moved to the specified directory.
Example:

```
var f = new File("/my/dir/file.txt");

f.moveTo("/my/other/dir/");             //move to /my/other/dir/file.txt
f.moveTo("/my/other/dir/file.old");     //move to /my/other/dir/file.old
f.moveTo("/my/other/dir", "file.old");  //move to /my/other/dir/file.old
```

After the operation, the file will reference to the new path.

## Directories

The `Dir` class represents a directory.

### Constructors

To create a `Dir` instance, we can use the following constructors:

```
Dir(...path)
```

Example:

```
d = new Dir("/my/dir");
d = new Dir("/my/dir", "subdir");
```

### Attributes

To get directory info, we can use the following attributes:

```
path : string         //the directory path
name : string         //the directory name
parent : Dir          //the parent directory
parentPath : string   //the parent directory path
times : object        //the times: modified, change, access, creation
entries : Entry[]     //the directory entries
```

### Renaming

Similar to files, using the `name` property.

### Temporary directory

To know the temporary directory, we can use the static attribute:

```
TMP_DIR : string
```

Example:

```
dir = new Dir(Dir.TMP_DIR, "mydir");
```

### create()

Creates the directory:

```
create() : boolean
```

The method returns if the directory has been created.

Example:

```
dir = new Dir(Dir.TMP_DIR, "mydir");
dir.create();
```

### remove()

Removes the directory:

```
remove()
```

### exists()

Checks whether the entry exists and it is a directory:

```
exists() : boolean
```

If the entry exists but it is not a directory, it returns false.

### copyTo()

Similar to files.

### moveTo()

Similar to files.

## Entries

The `justo-fs` package contains several functions for several tasks, independently
of the entry type:

```
exists(...path) : boolean
entry(...path) : File|Dir
remove(...path)
copy(src, dst)
```

The `exists()` function returns whether an entry (file or directory) exists.

The `entry()` function returns an entry as `File` or `Dir`.

The `remove()` function removes an entry.

The `copy()` function copies a source to destination. Its behavior is as following:

```
entry(src).copyTo(dst);
```
