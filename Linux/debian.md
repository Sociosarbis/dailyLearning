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
