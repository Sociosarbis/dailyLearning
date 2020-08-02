#### 从docker镜像（image）分析出Dockerfile
```bash
# 初次运行时，先将添加以下命令的别名，然后把上面的语句添加到~/.bashrc中（持久储存）
alias dfimage="docker run -v /var/run/docker.sock:/var/run/docker.sock --rm alpine/dfimage"
# 运行命令则会打印分析结果
dfimage -sV=1.36 <image-name>[:tag-name]
```
