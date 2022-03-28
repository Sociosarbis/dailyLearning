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
### 启用双星号的glob写法
```bash
# **的写法不是默认都支持的
shopt -s globstar
```
### WSL shell初始化配置
```bash
# 宿主机的IP动态设置在/etc/resolv.conf，v2Ray需启用允许局域网连接，windows防火墙需允许Privoxy
HOST_IP=$(grep nameserver /etc/resolv.conf | awk '{ print $2 }')
HTTP_PROXY="http://$HOST_IP:10809"
HTTPS_PROXY="http://$HOST_IP:10809"
http_proxy=$HTTP_PROXY
https_proxy=$HTTPS_PROXY

# 启动带有代理的docker
RUNNING=$(ps aux | grep dockerd | grep -v grep)
if [ -z "$RUNNING" ];then
  HTTPS_PROXY=$HTTPS_PROXY dockerd > /dev/null 2>&1 &
  disown
fi

cat >  /etc/apt/apt.conf.d/proxy.conf <<EOF
Acquire {
  HTTP::proxy "$HTTP_PROXY";
  HTTPS::proxy "$HTTPS_PROXY";
}
EOF

# 将登录用户添加到root用户组
# -a, append
# -G, group
sudo usermod -a -G root <username>

# 安装zsh
sudo apt install --upgrade zsh
# 查看所有的shell
cat /etc/shells
# 将zsh设为默认shell
chsh -s /bin/zsh
```

### 安装前端开发环境
```bash
# nodejs
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
# yarn
sudo npm install --global yarn
# nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
# docker
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
# docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
