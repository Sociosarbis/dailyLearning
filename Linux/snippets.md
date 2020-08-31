### 获取前一个月的日期
```bash
# -d 日期选项
# 输出格式前需要有一个+号
date -d '-1 month' +'%Y-%m-%d'
```
### 显示文件（夹）的大小
```bash
# du 是 disk usage 的缩写
# -h human readable，使用人类易读的格式，会加上KB，MB等单位
# -d，--max-depth 当需要显示的对象是文件夹时，表示要同时显示其下的多少层文件（夹）的大小
du -h --max-depth=0 [file...]
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
### 向远程机器发送本机的公钥
```bash
# -i 可以指定公钥文件，默认是~/.ssh/id_rsa.pub
ssh-copy-id [-i <public-key-path>] [username@]<remote_addr>
```
