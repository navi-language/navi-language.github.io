# Using TcpConnection

Each accepted connection gives a [`std.net.TcpConnection`](/stdlib/std.net.TcpConnection) instance, and you can then spawn a new Navi coroutine to handle the connection.

This guide provides an overview of the [`std.net.TcpConnection`](/stdlib/std.net.TcpConnection) type, focusing on creating a connection, reading from it, writing to it, and shutting it down. By following this guide, you will be able to understand and implement TCP communication in their applications.

## What is TcpConnection?

A [`std.net.TcpConnection`](/stdlib/std.net.TcpConnection) represents a TCP connection between a local and a remote socket.

Reading and writing to a [`std.net.TcpConnection`](/stdlib/std.net.TcpConnection) is typically done using the convenience methods found on the `Read` and `Write` traits. The `write_all()` method is defined on the `Write` trait.

## Creating a TcpConnection

A [`std.net.TcpConnection`](/stdlib/std.net.TcpConnection) can be created by accepting a connection from a listener. An example is shown below.

```nv,no_run
use std.net.TcpListener;

fn main() throws {
    let listener = try TcpListener.bind("127.0.0.1:3000");
    loop {
        let conn = try listener.accept();
        spawn {
            // Handling the connection
        }
    }
}
```

## Read

The `read()` method pulls some bytes from the [`std.net.TcpConnection`](/stdlib/std.net.TcpConnection) into the specified buffer, returning the number of bytes read. An example is shown below.

```nv,ignore
let buf = Bytes.new(len: 1024);
let n = try! conn.read(buf);
io.println(`read ${n} bytes`);
```

In the above example, a buffer of `1024` bytes is created to hold the data read from the connection. The `read()` method reads data from the connection into the buffer. The number of bytes read is returned. The number of bytes read is printed.

## Write

The `write()` method writes a buffer into the [`std.net.TcpConnection`](/stdlib/std.net.TcpConnection), returning the number of bytes written. The `flush()` method ensures that all intermediately buffered contents reach their destination. An example is shown below.

```nv,ignore
let data = "hello world".bytes();
let n = try! conn.write(data);
try! conn.flush();
io.println(`wrote ${n} bytes`);
```

In the above example, a buffer containing the string `"Hello, world!"` is created. The [`write`](/stdlib/std.io.Write#method.write) method writes the data to the connection. The number of bytes written is returned. The [`flush`](/stdlib/std.io.Write#method.flush) method ensures that all buffered data is sent. The number of bytes written is printed.

## The Remote Address

For each accepted connection, you can obtain the remote address of the client using the connection's [`remote_addr`](/stdlib/std.net.Connection#method.remote_addr) method.

## Close The Connection

To close the connection in the write direction, you can call the [`close`](/stdlib/std.io.Close#method.close) method. This will cause the other peer to receive a read of length `0`, indicating that no more data will be sent. This only closes the connection in one direction. An example is shown below.

```nv,ignore
try conn.close();
```
