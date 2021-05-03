## 清除损坏的包（package）
```bash
# debian的包放置，在/var/lib/dpkg/info
sudo dpkg --remove --force-remove-reinstreq <package>
```

## Ubuntu sources.list格式
```bash
# deb表示二进制包仓库，deb-src表示源码包仓库
# codename表示Ubuntu的版本代号，例如 bionic(18.04)，Xenial(16.04)
# components表示软件的性质，其中：
# main: 完全的自由软件。
# restricted: 不完全的自由软件。
# universe: Ubuntu官方不提供支持与补丁，全靠社区支持。
# multiverse：非自由软件，完全不提供支持和补丁。
[deb|deb-src] <URI> <codename> <...components>
```

## wsl2设置全局代理
1. [脚本 **（注意：代理软件需设置允许来自局域网的连接）**](https://zinglix.xyz/2020/04/18/wsl2-proxy/)
```sh
#!/bin/sh
hostip=$(cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }')
wslip=$(hostname -I | awk '{print $1}')
port=10809

PROXY_HTTP="http://${hostip}:${port}"

set_proxy(){
    export http_proxy="${PROXY_HTTP}"
    export HTTP_PROXY="${PROXY_HTTP}"

    export https_proxy="${PROXY_HTTP}"
    export HTTPS_proxy="${PROXY_HTTP}"
    # apt的代理需要额外配置
    echo -e "Acquire {\n  HTTP::proxy \"${PROXY_HTTP}\";\n  HTTPS::proxy \"${PROXY_HTTP}\";\n}" | sudo tee /etc/apt/apt.conf.d/proxy.conf > /dev/null
}

unset_proxy(){
    unset http_proxy
    unset HTTP_PROXY
    unset https_proxy
    unset HTTPS_PROXY
    rm /etc/apt/apt.conf.d/proxy.conf
}

test_setting(){
    echo "Host ip:" ${hostip}
    echo "WSL ip:" ${wslip}
    echo "Current proxy:" $https_proxy
}

if [ "$1" = "set" ]
then
    set_proxy

elif [ "$1" = "unset" ]
then
    unset_proxy

elif [ "$1" = "test" ]
then
    test_setting
else
    echo "Unsupported arguments."
```
2. 在`~/.bash_aliases`中引用脚本
```bash
alias proxy=alias proxy='source /home/sociosarbis/scripts/proxy.sh'
```

## 当在wsl2中启动docker，[提示找不到`cgroup`的`mount location`时，需要为`mount`一个类型为`cgroup`的文件系统](https://github.com/microsoft/WSL/issues/4189)
```bash
sudo mkdir /sys/fs/cgroup/systemd
sudo mount -t cgroup -o none,name=systemd cgroup /sys/fs/cgroup/systemd
```

## minikube以`docker`为`driver`启动，但提示不能以`root`用户，需要切换为其他用户并将用户加入到`dokcer`分组当中
```bash
useradd sociosarbis #添加用户
su sociosarbis #切换用户
# 将用户添加到docker组并改变当前登录的group
sudo usermod -aG docker sociosarbis && newgrp docker
```
