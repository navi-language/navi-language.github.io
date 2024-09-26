# Send a HTTP request

The [`HttpClient`](/stdlib/std.net.http.client.HttpClient) object provides a HTTP client to send a HTTP request to a server.

## Send a GET request

```nv,no_run
use std.net.http.Headers;
use std.net.http.client.{HttpClient, Request};
use std.net.http.OK;

struct Repo {
    id: int,
    name: string,
    full_name: string,
    // We can define the default value for the field.
    // here is means the private default value is false.
    private: bool = false,
    html_url: string,
    description: string,
}

const GITHUB_API = "https://api.github.com";

fn main() throws {
    let client = HttpClient.new(default_headers: Headers.from_map({
        "User-Agent": "Navi",
        "Accept": "application/vnd.github.v3+json",
    }));

    let req = try Request.get(`${GITHUB_API}/repos/navi-language/navi`).set_query({
        "t": "hello",
    });
    let res = try client.request(req);

    if (res.status() != OK) {
        println("Failed to fetch repo", try res.text());
        return;
    }

    let repo = try res.json::<Repo>();
    println(`${repo.name} - ${repo.description}`);
}
```

In the above example, we send a `GET` request to the GitHub API to fetch the `navi-language/navi` repository information.

- We create a [`HttpClient`](/stdlib/std.net.http.client.HttpClient) object with default headers. The `User-Agent` header is used to identify the client making the request. The `Accept` header is used to specify the media type of the response that the client can understand. The `Accept` header is set to `application/vnd.github.v3+json` to request the GitHub API to return the response in the `v3` version of the GitHub API.
- We create a [`Request`](/stdlib/std.net.http.client.Request) object using the [`Request.get`](/stdlib/std.net.http.client.Request#method.get) method and set the URL of the GitHub API. We also set the query parameters using the [Request.set_query](/stdlib/std.net.http.client.Request#method.set_query) method. The query parameters are used to send additional data with the request.
- If the request is successful, we parse the response JSON into a `Repo` struct and print the repository name and description. We use [`Response.json`](/stdlib/std.net.http.client.Response#method.json) method on the Response type to parse the JSON response.
  > This is same as [`json.parse`](/stdlib/std.json#parse) method, but it is more convenient to use.
  >
  > ```nv, ignore
  > use std.json;
  > let repo = try json.parse::<Resp>(res.text())
  > ```
- If the request fails, we print the error message.

After running the program, you should see the repository name and description printed on the console.

```txt
navi - https://github.com/navi-language/navi
```

::: warning NOTE

- The [`Response.json`](/stdlib/std.net.http.client.Response#method.json) method is a generic method, so you must specify the type by use `::<T>` syntax (This is the same as [`json.parse`](/stdlib/std.json#parse) method).
- The `res.text` and `res.json` methods can throw an error, so you should use the `try` keyword to handle the error.
- The response body is streamed, so you can't read it multiple times. The `text` and `json` methods are consuming the response body, so you can't call them multiple times.

:::

## Send a POST request

```nv,no_run
use std.net.http.client.{HttpClient, Request};
use std.net.http.Headers;
use std.json;

struct Repo {
    id: int,
    name: string,
    full_name: string,
    private: bool = false,
    html_url: string,
    description: string,
}

struct CreateRepo {
    org: string,
    repo: string,
    has_issues: bool,
}

fn main() throws {
    let client = HttpClient.new();

    let payload = CreateRepo {
        org: "navi-language",
        repo: "new-repo",
        has_issues: true,
    };

    let req = try Request.post("https://api.github.com/repos")
        .set_headers(Headers.from_map({
            "Authorization": "Bearer <your-github-token>",
        }))
        .set_json(payload);
    let res = try client.request(req);
    if (res.status() != 201) {
        println("Failed to create repo", try res.text());
        return;
    }

    let repo = try res.json::<Repo>();
    println(`Repo ${repo.name} created successfully`);
    println(repo.html_url);
}
```

As you see in the above example, we send a POST request to create a new repository on GitHub API.

- We create a [`HttpClient`](/stdlib/std.net.http.client.HttpClient) object.
- We create a `CreateRepo` struct to represent the request body. The struct contains the organization name, repository name, and whether the repository has issues enabled.
- We create a [`Request`](/stdlib/std.net.http.client.Request) object using the [`Request.post`](/stdlib/std.net.http.client.Request#method.post) method and set the URL of the GitHub API. We set the `Authorization` header to authenticate the request using a GitHub token. We set the request body using the [Request.set_json](/stdlib/std.net.http.client.Request#method.set_json) method. The `set_json` method serializes the struct to a JSON string and sets the `Content-Type` header to `application/json`.
- If the request is successful, we parse the response JSON into a `Repo` struct and print the repository name and URL. We use the [`Response.json`](/stdlib/std.net.http.client.Response#method.json) method on the Response type to parse the JSON response.
