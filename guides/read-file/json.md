# Read a JSON file

The `fs.open` function is used to open a file and return a `std.fs.File` instance, in

The `json.from_reader` function is used to parse a JSON string from a reader and return a `T` instance base on the `T` type parameter.

::: info
The `std.fs.File` is has implemented the `std.io.Read` interface,
so you can use it for `json.from_reader` function.
:::

## Navi Code

```nv, no_run
use std.json;
use std.fs.File;

struct User {
    name: string,
    id: int,
    profile: Profile?
}

struct Profile {
    city: string?
}

fn main() throws {
    let file = try File.open("path/to/user.json");
    let user = try json.parse::<User>(file);
}
```

If we have a `user.json`:

```json
{
  "name": "Alice",
  "id": 42,
  "profile": { "city": "New York" }
}
```
