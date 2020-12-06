## 包（crate）入口
1. 生成的包分两种类型
  1. 二进制执行包（binary crate）
    1. 根入口为`src/main.rs`
  2. 库包（library crate）
    1. 根入口为`src/lib.rs`
## 模块声明和定义
**假设模块名为abc**
```rust
// 只进行声明。
mod abc;
// 声明并定义，函数声明前加`pub`，才能让模块外部可以访问
mod abc {
  pub fn hello() {
    println!("hello");
  }
}

// 模块嵌套，要让嵌套的模块外部可访问，同样需要添加`pub`关键字
mod abc {
  pub fn hello() {
    println!("hello");
  }
  
  pub mod def {
    pub fn cool() {
    
    }
  }
}

// 分开文件声明，模块的搜索，默认是`src/<module_name>.rs`和`src/<module_name>/mod.rs`中找，当模块有子模块且也需要新建文件进行声明，
// 则也同样按照同样的规则在父模块的文件夹下添加`src/<parent_module_name>/<child_module_name>.rs`或`/src/<parent_module_name>/<child_module_name>/mod.rs`
// src/abc/mod.rs
pub fn hello() {
  println!("hello");
}
pub mod def;
// src/abc/def.rs
pub fn cool() {

}
// src/lib.rs
mod abc;
fn foo() {
  abc::hello();
  abc::def::cool();
}
```
