### [CSS masonry with flexbox, :nth-child(), and order](https://tobiasahlin.com/blog/masonry-with-css/ "CSS masonry with flexbox, :nth-child(), and order")

### 垂直居中总结
1. 绝对定位加负`margin`
2. 绝对定位加`transform`
3. 上下相等的`padding`
4. `flex`
5. `line-height`与`height`相等，非文本添加`vertical-align`
6. `grid`

### BFC
1. 常用形成`BFC`的方式：
    1. `html`
    2. `float`
    3. `position:absolute`
    4. `display:inline-block`
    5. `display:table-cell`
    6. `overflow:auto`
    7. `display:flex`的直接子元素

2. 性质：
    1. 包含内部的`float`元素
    2. 不与外部的`float`元素重叠
    3. 消除`margin`重叠
