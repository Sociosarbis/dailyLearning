[写给初中级前端的高级进阶指南](https://segmentfault.com/a/1190000022157926)

[带你深度解锁Webpack系列(优化篇)](https://segmentfault.com/a/1190000022205477)


## Q&A

### 网络

1. [`HTTP2`比`HTTP1.x`慢的可能情况](https://serverfault.com/questions/910108/is-http-2-actually-faster-in-real-world)：
   
    1. 加载的是本地缓存的资源
    2. 网络环境延迟低，请求响应过程短
    3. 网络环境丢包严重，某个包的丢失使其余的`HTTP2`数据流延迟（各请求复用同一个`TCP`连接，即多路复用），而`HTTP1.x`则是各请求使用独立`TCP`连接
    4. 部分浏览器对`HTTP2`的支持不好

### Javascript

1. 使用严格模式会有哪些变化：

   1. 不允许通过赋值变量来创建全局变量
   2. 对不可修改的变量如`NaN`，只读属性赋值和对不可扩展的对象增加属性都会报错
   3. 删除不可删除的属性时会报错
   4. 不允许函数的参数名重复
   5. 不允许单以0开头的八进制字面量(如`03`，但可以用`0o3`)和八进制转义序列(如`\251`，以前`\`就表示八进制转义，现在可改用`\x`的16进制来表示)
   6. 不允许对基本类型设置属性
   7. 不允许使用`with`语句（`with`语句会模糊变量名到变量定义的映射）
   8. `eval`内创建的变量只存在于自己的`scope`中
   9.  `delete`不允许删除变量
   10.  `eval`和`arguments`会成为关键字
   11.  严格模式中函数的参数变量不再是`arguments`成员的引用，如：
   ```js
   function f(a) {
     'use strict';
     // 赋值a不会改变arguments[0]的值
     a = 42;
     return [a, arguments[0]];
   }
   ```
   12. 不再支持`arugments.callee`
   13. 函数的`this`不再默认指向全局
   14. 不允许获取函数的`arguments`属性
   15. `implements`, `interface`, `let`, `package`, `private`, `protected`, `public`, `static`, 和 `yield`会作为保留关键字
