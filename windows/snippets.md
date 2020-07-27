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

### 手动编译java为class文件
```cmd
:: classpath: 表示文件中引用的packages的根路径，
:: 1. 可以为源码所在目录，如类名com.macro.mall.tiny.mbg.Generator，
:: 那么源码的根路径可以是src\main\java\com\macro\mall\tiny\mbg\Generator.java的src\main\java
:: 2. 可以为jar包的路径，原因是jar包可看成是类似上述有合法的层级结构的目录的源码文件的集合
javac -encoding utf-8 -classpath "[path1];[path2];[pathN]" <entry-java-file> -d [ouput-package-base-dir]
```

### 执行java的class文件
```cmd
:: classpath: 与编译类似，执行class文件需要在classpath加入引用的jar包路径，
:: 不同的是编译时需要加入的是源码所声明的包的目录根路径，执行时加入的是编译的目标路径，对应上面的ouput-package-base-dir
:: full-class-name是完整的类名，如类路径是target\classes\com\macro\mall\tiny\mbg\Generator.class，
:: 那么完整类名则是com.macro.mall.tiny.mbg.Generator
java -classpath "[path1];[path2];[pathN]" <full-class-name>
```
