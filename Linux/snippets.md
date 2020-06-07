### 获取前一个月的日期
```bash
# -d 日期选项
# 输出格式前需要有一个+号
date -d '-1 month' +'%Y-%m-%d'
```
### 显示修改时间早于一个月的文件夹
```bash
# -type d 只列出文件夹
# 选项前的!号表示只列出不满足该过滤条件的项
# -newermt中的mt是modified time的缩写
find [path...] -maxdepth 1 -mindepth 1 -type d ! -newermt "$(date -d '-1 month' +'%Y-%m-%d')"
```
### 以简明的方式显示本地ipv4地址
```bash
# -br 
ip -f inet -br addr
```
### 显示端口的使用情况
```bash
# lsof 是list open files的缩写
#　-i 显示所有互联网文件
#  -P 不将IP地址转换成主机名，如 127.0.0.1 = localhost
#  -n 不将端口号转换成协议名，如 80 = http，443 = https，22 = ssh
lsof -i -P -n
```
