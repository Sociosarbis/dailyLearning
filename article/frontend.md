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

2. 
* 基础数据类型`boolean`, `null`, `undefined`, `number`, `bigInt`, `string`, `symbol`和`引用`存在`stack`上，`对象`和`函数`的值则存在`heap`上。
* 在`heap`中的分配的内存，会使用`引用计数`(**references count**)和`mark & sweep`(检测是否存在路径从根对象到达该对象，解决循环引用，不能释放内存的问题)

3. 原型链
* 继承方式
1. `new`（实例的__proto__属性指向构造函数的`prototype`）
2. `Object.create`
3. `Object.setPrototypeOf`
4. 设置`__proto__`属性

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
