[写给初中级前端的高级进阶指南](https://segmentfault.com/a/1190000022157926)

[带你深度解锁Webpack系列(优化篇)](https://segmentfault.com/a/1190000022205477)


## Q&A

### 系统
1. 进程和线程的区别：进程是程序的实例，系统资源调度和分配的基本单位，进程内可并发多个线程执行不同的任务，是`cpu`运算调度的基本单位。线程间可共享`heap`的内存，而进程间是相互独立的。线程间的切换的开销也比进程小，虽然两者都有`cpu`执行上下文的开销，如寄存器，程序计数器，栈指针的重设，但进程的切换会改变虚拟内存空间，导致虚拟内存至物理内存的映射缓存失效。

### 网络

1. [`HTTP2`比`HTTP1.x`慢的可能情况](https://serverfault.com/questions/910108/is-http-2-actually-faster-in-real-world)：
   
    1. 加载的是本地缓存的资源
    2. 网络环境延迟低，请求响应过程短
    3. 网络环境丢包严重，某个包的丢失使其余的`HTTP2`数据流延迟（在`TCP`传输层上的队头堵塞问题，各请求复用同一个`TCP`连接，即多路复用），而`HTTP1.x`则是各请求使用独立`TCP`连接
    4. 部分浏览器对`HTTP2`的支持不好

2. `HTTP1.1`的`pipelining`：浏览器可以一次发出多个请求（同一个域名，同一条 TCP 链接）。但要求响应是按序返回的，前面的某个请求耗时长，会需要后面请求的响应较长的等待时间。

3. [`dns`解析过程](https://jvns.ca/blog/2022/02/01/a-dns-resolver-in-80-lines-of-go/)，以`jvns.ca`为例：
    1. 本地的`host`记录
    2. 根域名服务器
    3. `.ca`域名服务器
    4. `jvns.ca`域名服务器

    ***从根域名服务器开始，如果该级的域名服务器没有目标域名的记录，则会给出下一级的域名服务器的域名或者域名及其ip（如果只给出域名，则需要先去解析域名服务器的域名后，再向该域名服务器发出解析目标域名的请求）。以.号分隔的片段作为域名服务器的级数***

4. `HTTP2`的新特性：
    
    1. 数据为二进制，`HTTP1.x`为文本，同时会分解成多个帧
    2. 多路复用
    3. 服务器推送，通过在响应添加`Header`，如`Link: </style.css>; rel=preload; as=stylesheet`
    4. `header`使用`HPACK`压缩，支持哈夫曼编码压缩首次出现的值，同时客户端和服务端通过索引表来在`header`中引用之前传输过的字段
        
        p.s: 请求行在`HTTP2`拆分成各个 `:method`、`:scheme`、`:authority` 和 `:path` 伪`header`字段。

### 浏览器
1. `requestAnimationFrame`和`setInterval`的区别：
`requestAnimationFrame`会在浏览器界面每次重绘前调用，通常为频率为每秒60次，有一定的波动，通常在浏览器进入后台后会停止调用，由于该`api`与浏览器重绘紧密相连，所以使用它来实现动画会比较流畅和高效；`setInterval`则是相对固定的时间间隔调用，间隔小，对动画来说会产生不必要的计算次数，间隔大则会不流畅。

2. 发出跨域请求前会发出`options`的预检请求来检验请求使用的`method`和`header`是否准许。但简单请求不需发出预检请求。简单请求需满足以下所有条件：
    1. `method`为`GET`, `HEAD`，`POST`的其中之一
    2. 除自动设置的`header`外，只能添加`Accept`，`Accept-Language`，`Content-Language`，`Content-Type`这几个`header`
    3. `Content-Type`只可设为`application/x-www-form-urlencoded`，`multipart/form-data`或`text/plain`
    **p.s**: `form`元素可以发出跨域请求

3. 性能术语：
  `FCP(First Contentful Paint)`：网页首次绘制完（文本，图片，`svg`，非白色`canvas`）这些素材的时间点
  `long task`: 阻塞浏览器主线程的超过`50ms`的任务
  `TTI(Time To Interactive)`： 从`FCP`开始计的某个`long task`的结束时间，该`long task`满足结束5秒都没有下一个`long task`
  `FP`: 显示出第一个可见像素的时间点
  `FID(First Input Delay)`：第一个用户交互的响应延迟
  `LCP(Largest Contentful Paint)`：面积最大的素材绘制时间点，会根据页面显示阶段的不同而变化，例如如果一开始只有文字，那时间点就在渲染文字上，如果后面有图片等面积更大的元素，则会改为渲染该元素的时间点

4. 跨域通信方案：
    1. `jsonp`
    2. `location.hash + iframe（a(domain1)->b(domain2)->c(domain1)）`：利用同源页面间可以互相访问
    3. `window.domain + iframe`：根域名相同的两个页面同时设为相同的上级域名
    4. 反向代理
    5. `websocket`：页面可以创建任意域名的`websocket`连接，可通过请求`Origin`头验证是否同源和其他防范`csrf`的方式解决

5. `http`缓存:

    `Expires`：过期时间点
    
    `Cache-Control`:
        
      * `no-cache`：使用缓存但使用前需跟服务器验证
      * `no-store`: 不适用缓存
      * `max-age`: 响应的有效时间，如果存在，`Expires`会被忽略
    
    `If-Not-Modified-Since`: 从某个时间点开始资源未被更改
    
    `E-Tag`**(response)**: 资源内容的签名，用来判断资源的内容是否有被更改

    `If-None-Match`: 字段值为`E-Tag`，用来给服务器判断客户端的资源是否与最新的一致

6. `TCP`连接建立和终止

    #### 建立
    1. 服务器等待请求（`LISTEN`）
    2. 客户端发送`SYN`到服务端（`SYN-SENT`），服务端返回`SYN-ACK`（`SYN-RECEIVED`）
    3. 客户端收到后发送`ACK`（`ESTABLISHED`）, 服务端收到后（`ESTABLISHED`）

    #### 终止 （客户端发起为例）
    1. 初始客户端为`FIN_WAIT_1`，服务端为`CLOSE_WAIT`
    2. 客户端发送`FIN`（`FIN_WAIT_2`），服务端收到后发送`ACK`，然后发送`FIN`（`LAST_ACK`）
    3. 客户端收到`ACK`后（`TIME_WAIT`），收到`FIN`后发送`ACK`（`CLOSED`），服务端收到`ACK`后（`CLOSED`）

7. `TCP`和`UDP`的区别

    1. `TCP`可靠，有数据丢失重发和超时机制
    2. `TCP`的消息是有序的
    3. `UDP`轻量，无需建立连接，没有拥塞控制，`TCP`包头需使用字节数更多，同时需要额外3个包来建立连接
    4. `TCP`是以字节流来进行传输，`TCP`可能会合并多个`send`操作为一个`segment`再发送，也可能会把数据拆分成多个`segment`，而`UDP`发送的消息是完整的，每次`send`都会发送一次数据报
    5. `UDP`无需建立点对点的连接，所以支持消息广播（`broadcast`，如发送至本地广播地址`255.255.255.255`，子网的所有`client`都能收到）和多播（`multicast`，如发送至多播地址段`224.0.0.0 -> 239.255.255.255`，所有加入该组的`client`都能收到）。


### Javascript

1. 使用严格模式会有哪些变化：

   1. 不允许通过赋值变量来创建全局变量，如`a = 2`不会创建全局变量`a`
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
   12. 不再支持从**函数**或`arugments`上读取`callee`，`caller`，`arguments`属性
   13. 函数的`this`不再默认指向全局
   14. `implements`, `interface`, `let`, `package`, `private`, `protected`, `public`, `static`, 和 `yield`会作为保留关键字

2. 
* 基础数据类型`boolean`, `null`, `undefined`, `number`, `bigInt`, `string`, `symbol`和`引用`存在`stack`上，`对象`和`函数`的值则存在`heap`上。
* 在`heap`中的分配的内存，会使用`引用计数`(**references count**)和`mark & sweep`(检测是否存在路径从根对象到达该对象，解决循环引用，不能释放内存的问题)
* `heap`在分配空间时需在内存找到足够大的块，另由于`heap`支持释放任一位置的内存，不像`stack`只能按顺序释放，所以存在内存碎片化的问题，也因此在分配空间的复杂度远大于线性分配的`stack`。`stack`的默认大小由程序配置决定；`stack`和`heap`都处于内存当中。

3. 原型链
* 继承方式
  1. `new`（实例的__proto__属性指向构造函数的`prototype`）
  2. `Object.create`
  3. `Object.setPrototypeOf`
  4. 设置`__proto__`属性


4. 设计模式
    1. `策略模式`： 类似`array.sort`可以更换不同的方式给数组排序
    2. `发布-订阅模式`： 不需要发布端执行接收端提供的`API`，发送事件消息让接收端根据自己的需要进行处理
    3. `装饰器模式`：在原有的功能的基础上额外增加新功能
    4. `适配器模式`：将源数据改造成分别兼容各个`API`的结构
    5. `代理模式`：在代理对象上加一层访问控制
    6. `责任链模式`：将逻辑独立拆分开来，并让它们可自由组合成一个链条，可理解为调用函数的链表

5. 宏任务和微任务：
* **macroTasks**: `setTimeout`, `setInterval`, `setImmediate`, `requestAnimationFrame`, `I/O`, `UI rendering`
* **microTasks**: `process.nextTick`, `Promises`, `queueMicrotask`, `MutationObserver`
    
    微任务利用在同步代码后才执行的特性，可以`batch`数据更新的操作，并且由于它能先于`UI`重新`render`执行，所以又能让`UI`实时显示最新的改动。


6. `==`逻辑
```javascript
function notStrictlyEqual(a, b) {
  let typeA = typeof a
  let typeB = typeof b
  if (typeA !== typeB) {
    if (typeA === 'boolean') {
      a = Number(a)
      typeA = 'number'
    } else if (typeB === 'boolean') {
      b = Number(b)
      typeB = 'number'
    }

    if (a && typeA === 'object') {
      if (['string', 'number'].includes(typeB)) {
        a = a.valueOf()
        if (typeof a === 'object') {
          a = a.toString()
        }
      }
    }

    if (b && typeB === 'object') {
      if (['string', 'number'].includes(typeA)) {
        b = b.valueOf()
        if (typeof b === 'object') {
          b = b.toString()
        }
      }
    }

    typeA = typeof a
    typeB = typeof b

    if (typeA === 'string' && typeB === 'number') {
      a = Number(a)
    } else if (typeA === 'number' && typeB === 'string') {
      b = Number(b)
    }
  }
  return a === b
}
```


### Framework
1. `Vue`不需要`time slicing（时间切片）`的原因：
  1. 只有当框架更新调度的`CPU`用时经常超过`100ms`才能发挥用处。
  2. 更新调度较`React`简单，由于没引入`time slicing`，也因此也没多引入`fiber`做额外的逻辑处理。
  3. 使用`template`可以方便在编译时做静态的分析并做预处理，减少运行时的工作，如将`slot`转为`function`，缓存`inline`的事件`handler`，将不变的内容转为静态代码。
  4. 提供`reactivity tracking`功能，一般情况下无需开发者去做额外优化，即可做到只更新所需的组件。
  5. 加入`time slicing`会使代码体积变大。

2. `Vue` 和 `React` `children`的`diff`算法（根据2021/10/19时的源码总结）
  1. `Vue`（当前索引记为`i`，右端旧索引记为`e1`,新索引记为`e2`）
    1. 从左端逐个对比，直到新`child`无法由旧`child`更新而来
    2. 从右端逐个对比，直到新`child`无法由旧`child`更新而来
    3. 如果`i`大于`e1`但小于`e2`，表示旧`child`已用完，只需`mount`余下新`child`即可
    4. 如果`i`大于`e2`但小于`e1`，表示存在旧`child`未出现在新的集合中，只需`unmount`余下旧`child`即可
    5. 最后通过`vnode`的`key`（或者`type`，无`key`时）作与顺序无关的匹配更新（通过`map`）。余下旧`child`则`unmount`；余下新`child`则`mount`。这一步中会判定是否需要对复用旧`child`的新`child`标记位置有变动，该判定会使用`Longest_increasing_subsequence`算法来最小化标记移动的数量。
  2. `React`
    1. 从新`children`数组的左端开始循环，逐个与旧`fiber`进行比对，直到旧`fiber`的`key`与新`fiber`的不一致时中断。
    2. 如果新`fiber`都已使用，则移除余下的旧`fiber`；如果旧`fiber`都被复用，则将创建余下的新`fiber`
    3. 最后只能通过`key`或者`index`作为依据匹配旧`fiber`，未被匹配的旧`fiber`将被移除，未被匹配的新`fiber`将创建。
    4. 新`fiber`创建或复用时，都有一个`place`的步骤，只有当新`fiber`可复用旧`fiber`且旧`fiber`的`index`不小于之前复用过的旧`fiber`的`index`时才会认为是保持在原位置。是否标记为移动的判断与`Vue`是类似的，但`Vue`取的是最长(**longest**)的子序列。


3. `React`的`setState`是否能立刻更改`state`的值（v17）
  * `setState`如果在`React`的合成事件或者生命周期的回调中使用时，`setState`不会在执行后立刻更改`state`的值，因为`React`在上述情况中，会给`executionContext`增加对应标记使更改不会立刻执行
  * 而其余情况例如`setTimeout`，原生`DOM`的`event`回调并不会给`executionContext`添加标记，所以`setState`会立刻更改`state`
  * 但`setState`的调用过程是以同步方式进行的，它会在`finally block`中执行`flush`。
  ### Design Pattern
  1. `MVC`、`MVP`、`MVVM`的区分
    1. `MVC`
      * `View`接收到用户的交互后调用`Controller`的方法更新`Model`，`Model`改变后通知`View`更新。
      * `View`有`Controller`的引用，`Controller`有`Model`的引用，`Model`有`View`的引用。
    2. `MVP`
      * `Presenter`监听`View`发出的事件，执行自身对应的方法更新`Model`，`Model`改变后通知`Presenter`，`Presenter`负责调用`View`的方法进行更新。
      * `Presenter`有`View`和`Model`的引用
    3. `MVVM`
      * `ViewModel`负责从`Model`中获取`View`所需的数据，根据情况拉取和更新`Model`数据并对`View`提供自身的数据和改变自身数据的方法。`View`通过数据和事件绑定，监听`ViewModel`的数据变化并在用户的交互中调用`ViewModel`提供的方法更改它的数据；当`ViewModel`数据变化时，框架自动去更新`View`（不需要开发者显式调用`View`的方法）。
      * `ViewModel`有`Model`的引用，`View`有`ViewModel`的引用

4. [`Vue2.x`为什么非函数组件不支持多个根节点](https://github.com/vuejs/vue/issues/7088)
   * 子组件在父组件中都被表示为单个`vnode`，而`vnode`在`2.x`的`diff`算法中都有一个实际的`dom`与其对应。
   * 如此当`diff`完一个子组件后，只需将下一个子组件与下一个`dom`进行`diff`即可。
   * 但如果一个子组件对应多个`dom`，那么`diff`时则需要一种机制来保存子组件下`dom`的数量，以便跳过该子组件所属的`dom`，来做下一个子组件的`diff`。
   * 这个改动牵涉到代码的根本逻辑，所以并未去实现，而`Fragment`这个特性也是`React`在重写了渲染层后才有的。
   * 所以才在`Vue3.x`的大改动中，在`fragment`类型的`vnode`中除了`el`表示起始外还加入了`anchor`来表示结束标志，而这两者都是一个空的`TextNode`来表示，放在它们之间的才是真正需要渲染的`dom`

5. `React Fiber`基础
  1. `Fiber`结构
    * `stateNode`: 其对应的`React Element`实例
    * `type`: `stateNode`的类型，例如用户定义的`Class`或`function`
    * `tag`: 在`reconciliation`中使用的`React Element`分类
    * `updateQueue`: 在`function component`中时为各类`Effect`的`callback`链表
    * `memoizedState`: 输出当前渲染状态对应的`state`，如果是`function component`则为`state`钩子的链表
    * `memoizedProps`: 输出当前渲染状态对应的`props`
    * `pendingProps`: 用于输出下次渲染状态的`props`
    * `key`: 与`React Element`的`key`相同
    * `child`: 首个子`Fiber`
    * `return`: 父`Fiber`
    * `sibliing`: 下一个兄弟`Fiber`

  2. `Fiber`的`reconciliation`分为两个阶段，`render`和`commit`。
    1. `render`阶段在`concurrent`模式中是可中断的，在此阶段只去更新`Fiber`的状态。再次执行时可从中断的`Fiber`开始或从`root`重头再来。遍历`Fiber`是一个深度遍历，按此顺序`child -> sibling -> return`进行。
    2. `commit`阶段则是不可中断的，因为这个阶段是把`Fiber`状态同步到界面上，若能中断，则会展示一个中间状态。
    3. `render`阶段的生命周期：
      1. `getDerivedStateFromProps`
      2. `shouldComponentUpdate`
      3. `render`
    4. `commit`阶段的生命周期:
      1. `getSnapshotBeforeUpdate`
      2. `componentDidMount`
      3. `componentDidUpdate`
      4. `componentWillUnmount`
    5. `reconciliation`的步骤
      1. `render`阶段
        1. `performUnitOfWork`
        2. `beginWork`
        3. `completeUnitOfWork`
        4. `completeWork`
      2. `commit`阶段
        1. `flushPassiveEffects`
        2. `commitBeforeMutationEffects`（`getSnapshotBeforeUpdate`在此调用）
        3. `commitMutationEffects`（如果是销毁组件的操作，则触发`componentWillUnmount`和执行`Effect`的销毁回调）
        4. `commitLayoutEffects`（因为`useLayoutEffect`在`DOM`完成更新后执行，所以可以用于读取最新的`DOM`,与`componentDidUpdate`或`componentDidMount`对应）

6. `Vue`的`nextTick`的原理是给一个已`resolved`或者即将把更新`flush`到界面的`Promise`添加`callback`来创建一个微任务。

7. `Vue`父子组件的挂载/卸载周期顺序：
    1. parent beforeCreate 
    2. parent created 
    3. parent beforeMount 
    4. child beforeCreate 
    5. child created 
    6. child beforeMount 
    7. child mounted 
    8. parent mounted
    9. parent beforeUnmount 
    10. child beforeUnmount 
    11. child unmounted 
    12. parent unmounted 

8. `Vue`的`beforeUpdate`是在数据同步到`DOM`前调起，可以获取`DOM`在下一次更新前的状态，可用于移除之前手动在`DOM`上添加的事件监听

9. `Vue 3`新特性：
    1. `composition api`
    2. `teleport`
    3. `Fragments`
    4. `style`支持`v-bind`
    5. `proxy`
    6. 模板静态分析:
        1. 静态`vnode`的提升，将静态的`vnode`缓存到`render`函数之外的变量，使每次`render`都能复用
        2. 为`vnode`添加`patchFlag`，标记它是否需要的`patch`类型
        3. 将`children`分为`static`和`dynaimic`，只对`dynamic`的进行比对更新

### node
1. 事件循环

    1. **Timers**: 执行`setTimeout`和`setInterval`的回调
    2. **Pending**：执行系统相关的回调
    3. **Idle/Prepare**：空闲及预备阶段
    4. **Poll**：异步`I/O`的回调
    5. **Check**: 执行`setImmediate`的回调
    6. **Close**：执行关闭事件的回调，如`socket`和`process`

        伪代码：
        ```javascript
        const timersCallbackQueue = []
        const checkCallbackQueue = []
        const pollCallbackQueue = []
        const closeCallbackQueue = []
        const microTaskQueue = []
        const consumeQueue = (queue) => {
            if (queue.length) {
                queue.forEach((fn) => fn())
                queue.length = 0
            }
            runMicroTaskQueue()
        }
        const runMicroTasks = () => {
            if (microTaskQueue.length) {
                microTaskQueue.forEach((fn) => fn())
                microTaskQueue.length = 0
            }
        }
        const runPoll = () => {
            while ((checkCallbackQueue.length == 0 && timersCallbackQueue.length == 0)  || pollCallbackQueue.length) {
                consumeQueue(pollCallbackQueue)
            }
        }
        const eventLoop = () => {
            while (true) {
                consumeQueue(timersCallbackQueue)
                runPoll()
                consumeQueue(checkCallbackQueue)
                consumeQueue(closeCallbackQueue)
            }
        }
        ```