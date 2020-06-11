### 获取符号链接的目标路径
#### powershell
```powershell
# powershell的数组以如@('vue', 'react')的形式表示，
(get-item <path[]|path>).target
```
#### cmd
```cmd
:: cmd 不能直接获取特定符号链接的目标路径
:: dir: /a 为文件属性过滤选项 /l 表示保留符号链接
:: findstr: /c: 指定搜索的字符串
dir /al [path] | findstr /c:" [filename] "
```
