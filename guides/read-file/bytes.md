# Read a file to bytes

The `fs.read` function is used to read a file and return a `std.io.Bytes`. The first argument is the file path.

To read the `std.io.Bytes` to a UTF-8 string, you can use the `to_string` method.

::: warning
The valid UTF-8 bytes will be converted to string, and invalid UTF-8 bytes, it will be replaced with U+FFFD, e.g. �
:::

Or use [encode_to_string](/stdlib/std.io#Bytes#encode_to_string) method to convert to a string with a specific encoding.

## Navi Code

```nv,no_run
use std.fs;

fn main() throws {
    let buf = try fs.read("path/to/file.txt");
    // buf is a std.io.Bytes

    // Convert buf to UTF-8 string
    let content = buf.to_string();
}
```
