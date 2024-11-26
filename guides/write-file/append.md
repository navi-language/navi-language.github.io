# Append content to a file

The [fs.open](/stdlib/std.fs#open) or [File.open](/stdlib/std.fs#File.open) function is used to open a file and return a [std.fs.File](/stdlib/std.fs#std.fs.File) instance, with `flag` argument you can specify the file open mode.

- The `fs.APPEND` flag is used to open the file in append mode.
- The `fs.CREATE` flag is used to create a new file if the file does not exist.

Then use `write_string` method to write the string content to the file.

## Navi Code

```nv, no_run
use std.fs.{self, File};

fn main() throws {
    let f = try File.open("output.txt", flag: fs.APPEND | fs.CREATE);
    defer {
        try! f.close();
    }
    try f.write_string("Hello, world!\n");
    try f.write_string("This is next line!\n");
}
```

The above code will append the content to the file `output.txt`. If the file does not exist, it will create a new file.

After running the above code, the content of the file `output.txt` will be:

```txt
Hello, World!
This is next line!
```
