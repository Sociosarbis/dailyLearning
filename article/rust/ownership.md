## 栈和堆的区分
* 存储在栈中的数据一定是有在编译时可知的和固定的大小，而堆则存放未知大小的和大小可变的数据。

## 所有权转移（`move`）
* 所有权让出发生在：
  1. 指向堆中数据的指针变量（指针存储在栈中）：
      1. 赋给另外一个变量
      2. 作为参数传给函数
  ```rust
  // 在rust中，形如s1，s2的变量实为指针
  let s1 = String::from("hello");
  let s2 = s1;
  ```
* 所有权返回发生在：
  1. 函数返回的指针值赋給一个变量
  
* 所有权让出以后，原变量将失效

## Copy和Clone trait的区别
1. 拥有`Copy trait`的数据类型在赋值和传参时，会将数据复制到新的变量当中，原始类型（如**数值，布尔, 字符和只包含原始类型的元组**）都已实现`Copy trait`，一般用于成本较低的复制上。假如任意的`struct`需要`derive Copy`，那么前提式它的所有`field`都需要先实现`Copy`。 
2. 拥有`Clone trait`的类型的复制，需要显式调用`clone`方法，与`Copy`的隐式复制相比，增加了一点开发者的调用成本，也正因如此，`Clone`也一般用在与之相称的成本较高的复制上，`Clone`可以被任意类型实现。

## 浅复制和深复制
在`rust`中，浅复制（`只复制指针，指向的数据一样`）的同时会伴随上述的所有权转移，而深复制则是指`Copy`和`Clone`的情况。

## 不允许引用的数据产生`move`，这个规则适用于类型下的各个`field`，如：
```rust
let a: Vec<i32> = Vec::new();
let b = &a;
let c = *b; // error
let e = JsMd5::new();
let d = &e;
let f = d.core; // error
let g = e.core // ok
// 如果实现了Copy trait，不产生move，则是有效的
```

## Clone与ToOwned
>If your type is Clone, you get the blanket implementation of ToOwned and can't implement the trait yourself. If you type isn't Clone and you need ToOwned, you have to implement it yourself.– [Sven Marnach](https://stackoverflow.com/questions/63553892/when-does-to-owned-not-clone)

如果类型实现了`Clone Trait`，则会获得一个公共的`ToOwned`实现（**blanket implementation**），将不能自行实现`ToOwned Trait`

### [blanket implementation for ToOwned](https://doc.rust-lang.org/src/alloc/borrow.rs.html#80-92)
```rust
#[stable(feature = "rust1", since = "1.0.0")]
impl<T> ToOwned for T
where
    T: Clone,
{
    type Owned = T;
    fn to_owned(&self) -> T {
        self.clone()
    }

    fn clone_into(&self, target: &mut T) {
        target.clone_from(self);
    }
}
```
正因如此大部分的`ToOwned`实现实际上是`Clone`，而&str和&[T]等类型的`ToOwned`与`Clone`不同，例子：
```rust
let s: &str = "a";
let ss: String = s.to_owned();

let v: &[i32] = &[1, 2];
let vv: Vec<i32> = v.to_owned();
```
