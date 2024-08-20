# Upload a file

HTTP upload file usually use the `multipart/form-data` content type or send the file as a binary data.

- Send a file as a multipart form data
- Send a file as a binary data

## Send a file as multipart form data

```nv,no_run
use std.{fs, net.http.client.{HttpClient, Multipart, Request}};

fn main() throws {
    let f = try fs.open("main.nv");

    let client = HttpClient.new();
    let multipart = Multipart.new();
    multipart.append(f, name: "file");

    let req = try Request.post("https://httpbin.org/post").set_multipart(multipart);
    let res = try client.request(req);
    if (res.status() != 200) {
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
    "file": "use std.{fs, net.http.client.{HttpClient, Multipart, Request}};\r\n\r\nfn main() throws {\r\n    let f = try fs.open(\"main.nv\");\r\n\r\n    let client = HttpClient.new();\r\n    let multipart = Multipart.new();\r\n    multipart.append(f, name: \"file\");\r\n\r\n    let req = try Request.post(\"https://httpbin.org/post\").set_multipart(multipart);\r\n    let res = try client.request(req);\r\n    if (res.status() != 200) {\r\n        println(\"Failed to upload file\", try res.text());\r\n        return;\r\n    }\r\n\r\n    println(try res.text());\r\n}\r\n"
  },
  "headers": {
    "Content-Type": "multipart/form-data; boundary=56f47904263d9669-f80b1c43c72766b7-e225303f31424b3a-ebd39c633669cd1f",
    "Host": "httpbin.org",
    "Transfer-Encoding": "chunked",
    "X-Amzn-Trace-Id": "Root=1-66c4597c-39c3957f52807b1f3edc1270"
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
use std.{fs, net.http.client.{HttpClient, Request}};

fn main() throws {
    let f = try fs.open("main.nv");

    let client = HttpClient.new();
    let req = try Request.post("https://httpbin.org/post").set_body(f);
    let res = try client.request(req);
    if (res.status() != 200) {
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
  "data": "use std.{fs, net.http.client.{HttpClient, Request}};\r\n\r\nfn main() throws {\r\n    let f = try fs.open(\"main.nv\");\r\n\r\n    let client = HttpClient.new();\r\n    let req = try Request.post(\"https://httpbin.org/post\").set_body(f);\r\n    let res = try client.request(req);\r\n    if (res.status() != 200) {\r\n        println(\"Failed to upload file\", try res.text());\r\n        return;\r\n    }\r\n\r\n    println(try res.text());\r\n}\r\n",
  "files": {},
  "form": {},
  "headers": {
    "Host": "httpbin.org",
    "Transfer-Encoding": "chunked",
    "X-Amzn-Trace-Id": "Root=1-66c45a67-78f081c464f299102fdda445"
  },
  "json": null,
  "origin": "8.223.23.31",
  "url": "https://httpbin.org/post"
}
```

In this case, we open the file using the [`fs.open`](/stdlib/std.fs#method.open) function and pass the file object to the `Request.set_body` method to set the file as the request body.
