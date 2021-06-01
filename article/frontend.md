[写给初中级前端的高级进阶指南](https://segmentfault.com/a/1190000022157926)

[带你深度解锁Webpack系列(优化篇)](https://segmentfault.com/a/1190000022205477)


## Q&A

### 网络

1. [`HTTP2`比`HTTP1.x`慢的可能情况](https://serverfault.com/questions/910108/is-http-2-actually-faster-in-real-world)：
   
    1. 加载的是本地缓存的资源
    2. 网络环境延迟低，请求响应过程短
    3. 网络环境丢包严重，某个包的丢失使所有的`HTTP2`流延迟（各请求复用同一个`TCP`连接，即多路复用），而`HTTP1.x`则是各请求使用独立`TCP`连接
    4. 部分浏览器对`HTTP2`的支持不好
