```javascript
const pointToRevolve = {
  x,
  y
}
const pointRevolvedAround = {
  x,
  y
}
const rad
const relativePosition = {
  x: pointToRevolve.x - pointRevolvedAround.x,
  y: pointToRevolve.y - pointRevolvedAround.y
}
const pointAfterRevolved = {
  x: relativePosition.x * Math.cos(rad) - relativePosition.y * Math.sin(rad) + pointRevolvedAround.x
  y: relativePosition.x * Math.sin(rad) + relativePosition.y * Math.cos(rad) + pointRevolvedAround.y
}
/*
上面的方法可以推广到计算某个在嵌套的父对象里的点，经过父对象的多次旋转以后，这个点的世界坐标。
原理是从最外层开始，算出每一层父对象的旋转中心的世界坐标，然后就可以把这些父对象的旋转看作是里面的
这个点依次绕着这些世界坐标的点进行旋转，套用上面的公式求解。
*/
```
