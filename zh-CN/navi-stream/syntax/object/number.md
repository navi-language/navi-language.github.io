---
order: -99
---

# 数字

在 Navi Stream 中，`number` 类型用于定义整数或浮点数。

::: info
在内部，`number` 实际上并不是一个对象，它是一个原始类型。但我们计划在未来将其更改为一个对象。
:::

```nvs
let a = 1;
let b = 2;

let c = a + b + 3;
// 6

c.to_string();
// "6"
```

## 方法

### to_string

将数字转换为字符串。

```nvs
let a = 1;
a.to_string();
// "1"
```
