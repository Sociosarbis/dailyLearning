1. **hover**时背景颜色rgb的值为原来的**0.7**倍
2. ripple的颜色与**字体颜色**一致且透明度为**0.3**
3. box-shadow
   1. **普通状态**为0 1px 5px 0 rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12)
   2. **active状态**为0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)
   3. 实则在元素正下方添加**一块同等大小的阴影**，offset表示这块阴影的偏移，spread是放缩整块阴影
