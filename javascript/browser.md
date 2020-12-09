1. **document.documentElement**:
  returns the root element of the document
2. **window.devicePixelRatio**:
  returns the ratio of the resolution in physical pixels to the resolution in css pixels

3. **radial-gradient**:
```typescript
// size
// 渐变边缘至离中心最近的边
'closest-side'
// 渐变边缘至离中心最近的角
'closest-corner'
// 渐变边缘至离中心最远的边
'farthest-side'
// 渐变边缘至离中心最远的角
'farthest-corner'
// circle 半径
(radius: string) => `circle ${radius}`
// ellipse 水平半径 垂直半径
(hozRadius, verRadius) => `ellipse ${hozRadius}% ${verRadius}%`

// position x y
(x: string, y: string) => `at ${x} ${y}`

// colorStop
(stops: (string | [string, number])[]) => stops.map((s) => typeof s === 'string' ? s : `${s[0]} ${s[1]}%`).join(', ')
  
```