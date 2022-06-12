1. `build.gradle`中的`dependencies`类型：
    `Java`中的`classpath`（实际是包名）分为`compile`和`runtime`两种，实际运行时使用的是`runtime classpath`
    1. `implementation`：依赖会提供`compile`和`runtime`的`classpath`，但不会暴露依赖的依赖的`classpath`
    2. `api`：与`implementation`类似，但会暴露依赖的依赖的`classpath`
    3. `compileonly`：只提供编译时的`classpath`，可类比为`devDependencies`（提供编译时生成代码的功能），或者`typescript`中的类型声明（实际实现由`包`的使用方提供）。
        
        PS：在`amap_flutter_map`插件中使用的就是`compileonly`的`amap java`包依赖，如果不在我们的`app`中添加`runtime classpath`，就算编译通过了，但会在运行时提示找不到依赖。
    4. `runtimeonly`：只提供运行时的`classpath`，常与`compileonly`搭配使用，提供`compileonly`中声明的实际实现