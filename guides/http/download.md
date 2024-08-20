# Download a file

You can download a file from the server using the [`HttpClient.get`](/stdlib/std.net.http.client.HttpClient#method.get) method.

```nv,no_run
use std.net.http.client.HttpClient;
use std.io;
use std.fs;

fn main() throws {
    let f = try fs.create("image.png");
    defer try f.close();

    let client = HttpClient.new();
    let res = try client.get("https://httpbin.org/image/png");
    if (res.status() != 200) {
        println("Failed to download file", try res.text());
        return;
    }

    let content_length = res.headers().get("Content-Length");
    println("Downloaded file size:", content_length);

    if (let body = res.body()) {
        try io.copy(body, f);
    }
}
```

After run `navi run main.nv`, we will download and save `image.png` file.

In this case:

- We use the [fs.create] to open a file with **WRITE** mode, if the file is not exists, it will create a new file.
- The `defer` statement is used to close the file after the function returns (Like defer in Go).
- We create an HTTP client using the [HttpClient.new](/stdlib/std.net.http.client.HttpClient#method.new) function.
- The [`HttpClient.get`](/stdlib/std.net.http.client.HttpClient#method.get) method is used to send a `GET` request to the server and get the response.
- Copy the response body to the file using the [io.copy](/stdlib/std.io#method.copy) function.
