# Write a string to a file

The [fs.write](/stdlib/std.fs#write) function is used to write a string to a file. The first argument is a string of the file path, and the second argument is a `string` or [std.io.Bytes](/stdlib/std.io#std.io.Bytes) of the content.

If the file does not exist, it will create a new file. If the file exists, it will **overwrite** the file content.

```nv, no_run
use std.fs;

fn main() throws {
    try fs.write_string("output.txt", "Hello, world!\n");
}
```

Then the `output.txt` file will contain the following content:

```txt
Hello, world!
```

## Alternative

You can use [fs.open](/stdlib/std.fs#open) or [File.open](/stdlib/std.fs#File.open) method to open a file in write mode and get a [std.fs.File](/stdlib/std.fs#std.fs.File) instance, and use the `write` method to write a bytes to the file, use `write_string` method to write a string to the file.

In this case, you must special the `flag` argument to open the file in write mode (the default flag is `fs.READ`, that means read-only mode). So you must use `fs.WRITE` flag to open the file in write mode. And with `fs.CREATE` flag, it will create a new file if the file does not exist.

```nv, no_run
use std.fs.{self, File};

fn main() throws {
    let f = try File.open("output.txt", flag: fs.WRITE | fs.CREATE);
    defer {
        try! f.close();
    }
    try f.write_string("Hello, world!\n");
}
```
