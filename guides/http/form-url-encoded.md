# Send a URL-encoded form

The `www-form-urlencoded` is a common format for sending data to the server. You can use the [`Request.set_form`](/stdlib/std.net.http.client.Request#method.set_form) method to create a `URL-encoded` form request.

```nv,no_run
use std.net.http.client.{HttpClient, Request};

fn main() throws {
    let client = HttpClient.new();
    let form = {
        "name": "Navi",
        "website": "https://navi-lang.org",
        "profile[bio]": "Navi is a programming language",
    };

    let req = try Request.post("https://httpbin.org/post").set_form(form);
    let res = try client.request(req);
    if (res.status() != 200) {
        println("Failed to send form", try res.text());
        return;
    }

    println(try res.text());
}
```

Run the above code with `navi run main.nv`, will output:

```json
{
  "form": {
    "email": "huacnlee@gmail.com",
    "name": "Jason Lee"
  },
  "headers": {
    "Accept": "*/*",
    "Content-Length": "41",
    "Content-Type": "application/x-www-form-urlencoded",
    "Host": "httpbin.org"
  },
  "url": "https://httpbin.org/post"
}
```

In this case, we using the [`Request.set_form`](/stdlib/std.net.http.client.Request#method.set_form) method to set the form data to the request, and the `Content-Type` will be set to `application/x-www-form-urlencoded` automatically.

- The [`Request.set_form`](/stdlib/std.net.http.client.Request#method.set_form) method accepts a `map` or `struct` type that will be serialized to the `www-form-urlencoded` format.
  - Please note that the `FormUrlEncoded` just accept 1 level key-value pair, if you want to send a nested form, if you prefer to send a nested form, the request will throw an error. If you want to send a nested form, you special the key with `[]` to make it as an array, like `profile[bio]` in the example above.
