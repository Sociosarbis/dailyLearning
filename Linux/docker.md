#### 从docker镜像（image）分析出Dockerfile
```bash
# 初次运行时，先将添加以下命令的别名，然后把上面的语句添加到~/.bashrc中（持久储存）
alias dfimage="docker run -v /var/run/docker.sock:/var/run/docker.sock --rm alpine/dfimage"
# 运行命令则会打印分析结果
dfimage -sV=1.36 <image-name>[:tag-name]
```

#### 运行redis
```bash
# -d 表示以守护进程在后台运行
# --appendonly yes 启用记录写入操作功能，将会把记录（以只允许添加的方式）保存在/data/appendonly.aof中
# 另一种持久化方式为rdb快照，在指定的时间间隔内将内存中的数据集快照写入磁盘/data/dump.rdb
docker run --name redis-dev -d -v /home/sociosarbis/redis/data:/data -p 6379:6379 redis redis-server --appendonly yes
# --rm 表示当命令执行完成后，自动删除该container
# -h 由于redis在docker中运行，所以使用默认的localhost不能连通，需自行指定
docker run -it --rm redis redis-cli -h 172.18.0.2
# container的ip可通过以下命令获取
docker inspect -f '{{ .NetworkSettings.IPAddress }}' redis-dev
# 或者使用下面的go template获取所有networks的ip，range和end构成类似for-loop的block，中间的部分为每个item需要渲染的内容
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' redis-dev
```
