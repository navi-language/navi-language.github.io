# Make a HTTP Client

In some cases, you may need to make multiple requests to the same server. In such cases, it is more efficient to create an HTTP client and reuse it for multiple requests. The [`HttpClient`](/stdlib/std.net.http.client.HttpClient) struct provides a way to create an HTTP client that can be reused for multiple requests.

The HTTP Client holds a connection pool to reuse the connections, so it is more efficient than creating a new connection for each request.

And the client also provides a way to set more complex options like `enable_redirect`, `user_agent` for us to control the behavior of the client. See: [`HttpClient.new`](/stdlib/std.net.http.client.HttpClient#method.new) for more details.

## Create a HTTP client

```nv,no_run
use std.net.http.client.{HttpClient, Request};
use std.net.http.OK;

fn main() throws {
    let client = HttpClient.new(
        max_redirect_count: 5, 
        user_agent: "navi-client",
    );
    let req = try Request.get("https://httpbin.org/get");
    let res = try client.request(req);

    if (res.status() != OK) {
        try println("Failed to fetch repo", res.text());
        return;
    }

    try println(res.text());
}
```

In the above example:

1. We create an HTTP client using the [`HttpClient.new`](/stdlib/std.net.http.client.HttpClient#method.new) function.
2. We set the `max_redirect_count` to `5`, and `user_agent` to `navi-client`.
   - The `max_redirect_count` is the maximum number of redirects to follow.
   - The `user_agent` is the `User-Agent` header to send with the request.
3. We create a [`Request`](stdlib/std.net.http.client.Request) object using the [`Request.get`](/stdlib/std.net.http.client.Request#method.get) method and set the URL of the GitHub API.
4. Then we send the request using the [`HttpClient.request`](/stdlib/std.net.http.client.HttpClient#method.request) method.
