# Example: Echo Server

This example demonstrates a basic TCP echo server that binds to a local address and port, continuously accepts incoming connections, spawns a new Navi coroutine for each connection to handle reading and writing data.

Here is the overall example and we will break it down into pieces so that it is easy to understand.

```nv,no_run
use std.{io.{self, Bytes}, net.{Connection, TcpAddr, TcpConnection, TcpListener}};

fn handle_connection(conn: Connection) {
    let buf = Bytes.new(len: 1024);

    do {
        loop {
            let n = try conn.read(buf);
            if (n == 0) {
                break;
            }
            try conn.write_all(buf.slice(0, n));
        }
    } catch(e) {
        println(`error: ${e.error()}`);
    }
}

fn main() throws {
    let listener = try TcpListener.bind("127.0.0.1:3000");
    loop {
        let conn = try! listener.accept();
        spawn handle_connection(conn);
    }
}
```

## Binding to an Address

```nv,ignore
let listener = try TcpListener.bind("127.0.0.1:3000");
```

The [`TcpListener.bind`]() method binds the TCP listener to the specified address (`127.0.0.1`) and port (`3000`). The `try` keyword is used to propagate any errors that occur during the binding process.

## Accepting Connections

```nv,ignore
loop {
    let conn = try! listener.accept();
    spawn handle_connection(conn);
}
```

The server enters an infinite loop to continuously accept incoming connections. For each accepted connection, it spawns a new Navi coroutine to handle the connection.

## Handling the Connection

```nv,ignore
fn handle_connection(conn: Connection) {
    let buf = Bytes.new(len: 1024);

    do {
        loop {
            let n = try conn.read(buf);
            if (n == 0) {
                break;
            }
            try conn.write_all(buf.slice(0, n));
        }
    } catch(e) {
        println(`error: ${e.error()}`);
    }
}
```

The `handle_connection` function takes a `Connection` object as an argument, representing the accepted connection. It reads data from the connection into a buffer, then writes the data back to the connection. The loop continues until the connection is closed by the client.
