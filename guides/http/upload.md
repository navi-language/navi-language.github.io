# Upload a file

HTTP upload file usually use the `multipart/form-data` content type or send the file as a binary data.

- Send a file as a multipart form data
- Send a file as a binary data

## Send a file as multipart form data

```nv,no_run
use std.{fs.File, net.http.client.{HttpClient, Multipart, Request}};
use std.net.http.OK;

fn main() throws {
    let f = try File.open("main.nv");

    let client = HttpClient.new();
    let multipart = Multipart.new();
    multipart.append(f, name: "file");

    let req = try Request.post("https://httpbin.org/post").set_multipart(multipart);
    let res = try client.request(req);
    if (res.status() != OK) {
        println("Failed to upload file", try res.text());
        return;
    }

    println(try res.text());
}
```

After run `navi run main.nv` will output:

```json
{
  "args": {},
  "data": "",
  "files": {},
  "form": {
    "file": "use std.{fs, net.http.{client.{HttpClient, Multipart, Request}, OK}};\n\nfn main() throws {\n    let f = try fs.open(\"main.nv\");\n\n    let client = HttpClient.new();\n    let multipart = Multipart.new();\n    multipart.append(f, name: \"file\");\n\n    let req = try Request.post(\"https://httpbin.org/post\").set_multipart(multipart);\n    let res = try client.request(req);\n    if (res.status() != OK) {\n        println(\"Failed to upload file\", try res.text());\n        return;\n    }\n\n    println(try res.text());\n}\n"
  },
  "headers": {
    "Content-Type": "multipart/form-data; boundary=12e2cc00691db990-e67f0a357c8ef09c-b5c1423f5cda1185-5de81a96447ef53b",
    "Host": "httpbin.org",
    "Transfer-Encoding": "chunked",
    "X-Amzn-Trace-Id": "Root=1-66f4b2c6-3f33559f6312c84e0e7d350a"
  },
  "json": null,
  "origin": "8.223.23.31",
  "url": "https://httpbin.org/post"
}
```

In this case, we open the file using the [`fs.open`](/stdlib/std.fs#method.open) function and pass the file object to the `Multipart.append` method to append the file to the multipart form data. Then we set the multipart form data to the request using the `Request.set_multipart` method.

## Send a file as a binary data

Sometimes, the HTTP server may only accept the file as a binary data, you can use the `File` type to read the file and send it as a binary data.

```nv,no_run
use std.{fs.File, net.http.client.{HttpClient, Request}};
use std.net.http.OK;

fn main() throws {
    let f = try File.open("main.nv");

    let client = HttpClient.new();
    let req = try Request.post("https://httpbin.org/post").set_body(f);
    let res = try client.request(req);
    if (res.status() != OK) {
        println("Failed to upload file", try res.text());
        return;
    }

    println(try res.text());
}
```

After `navi run` above code, the output will be:

```json
{
  "args": {},
  "data": "use std.{fs, net.http.{client.{HttpClient, Request}, OK}};\n\nfn main() throws {\n    let f = try fs.open(\"main.nv\");\n\n    let client = HttpClient.new();\n    let req = try Request.post(\"https://httpbin.org/post\").set_body(f);\n    let res = try client.request(req);\n    if (res.status() != OK) {\n        println(\"Failed to upload file\", try res.text());\n        return;\n    }\n\n    println(try res.text());\n}\n",
  "files": {},
  "form": {},
  "headers": {
    "Host": "httpbin.org",
    "Transfer-Encoding": "chunked",
    "X-Amzn-Trace-Id": "Root=1-66f4b331-00ee4e0327d0088e3ac596a2"
  },
  "json": null,
  "origin": "8.223.23.31",
  "url": "https://httpbin.org/post"
}
```

In this case, we open the file using the [`fs.open`](/stdlib/std.fs#method.open) function and pass the file object to the `Request.set_body` method to set the file as the request body.
