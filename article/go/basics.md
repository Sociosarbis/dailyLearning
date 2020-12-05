1.  `range`形式的`for`循环，返回两个值，第一个是`index`或`key`，第二个是值的**复制**
2. 删除索引`i`的值并插入到索引`j`处（设`i < j`）
```go
temp := elements[i]
copy(elements[i:j], elements[i+1:j+1])
elements[j] = temp
```
