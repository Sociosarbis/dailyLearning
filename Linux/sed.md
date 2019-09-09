1. sed命令是stream editor的缩写
2. '**s\/pattern\/replacement**'相当于javascript的`String.prototype.replace(pattern, replacement)`, **s**表示substitute
3. javascript的正则表达式的replacement是用**$n**来表示，而在shell则用**\n**表示
4. **-i,--in-place** option，原地进行更改
5. **-e, --expression *script*** option，当script也就是类似于**2**中的语句，只有一条时此option可省略，
当使用多条时需要`-e *script1* -e *script2*...`进行指定
