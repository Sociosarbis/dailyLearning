前提：当函数返回小于等于0的数时，像素为黑色，否则为白色
1. 三角形

![](https://github.com/Sociosarbis/dailyLearning/blob/master/Math_and_Geometry/assets/distance_fields_triangle.png?raw=true)
```c++
float triangle(vec2 p, float size) {
    vec2 q = abs(p);
    return max(q.x * 0.866025 + p.y * 0.5, -p.y * 0.5) - size * 0.5;
}
```
解释：
* 因为有max函数所以这个函数可以看作`q.x * 0.866025 + p.y * 0.5 - size * 0.5`(1)和`-p.y * 0.5 - size * 0.5`(2)的交集
* 有趣的是(1)式，按我的理解可以看作是旋转60°后的y坐标，由于q是左右对称的，所以可以只看AB边，AB边旋转60°以后与x轴平行，y值恰好是size * 0.5，所以可得只要在AB边的左边和AC边的右边（因为对称），
就为黑色(q.x * 0.866025 + p.y * 0.5 < size * 0.5)，
* 而-p.y * 0.5 - size * 0.5是一个y<=-size以上都是黑色的图形，这两个图形的交集恰好形成一个正三角形。
2. 矩形
```c++
float rect(vec2 p, vec2 size) {  
  vec2 d = abs(p) - size;
  return length(max(d,0.0));
}
```
解释：
* 上式的逻辑就是只要宽和高小于参数的宽高，就判断是在矩形内。
3. 圆角矩形
```c++
float roundRect(vec2 p, vec2 size, float radius) {
  vec2 d = abs(p) - size;
  return length(max(d,0.0))- radius;
}
```
解释：
* 假设某一点A在矩形内或矩形的边上，`length(max(d,0.0))`为0，与A的距离小于radius的点都会认为是黑色，而这个描述恰好符合圆的定义。所以圆角矩形可以看作是
以每个在矩形内或着矩形的边上的点为圆心，作半径为radius的圆的图形。
