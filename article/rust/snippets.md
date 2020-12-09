## `Vec<char>` 转 String
```rust
chars.iter().collect();
```

## String 转 数字
```rust
let parse_result = "12456".parse::<i32>();
// 当解析正确时
if !(parse_result.is_err()) {
  let num = parse_result.unwrap();
}
```

## `Vec<T>`根据多个字段排序
```rust
use std::cmp::Ordering;
let groups: Vec<(i32, i32)>;
// rust的比较函数是返回任意的Ordering
groups.sort_by(|a, b| {
  if a.0 > b.0 || (a.0 == b.0 && a.1 > b.1) {
    Ordering::Greater
  } else if a.0 < b.0 || (a.0 == b.0 && a.1 < b.1)  {
    Ordering::Less
  } else {
    Ordering::Equal
  }
});
```

## `Ordering`的反转
```rust
a.cmp(b).reverse();
```