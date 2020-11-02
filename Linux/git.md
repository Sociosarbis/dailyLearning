## 只检出仓库的部分文件（夹）
```bash
# 1
git config core.sparseCheckout true
# 2 配置需要检出的文件（夹）路径，/根路径对应仓库的根目录，路径支持glob语法，例子:
echo -e "/3.7\n/lib" >> .git/info/sparse-checkout
# 注可以使用!进行反选，但引号要变为单引号，因为!会被解释为History（命令历史） Expansion的语法，history 会列出所有命令历史，而!1则表示执行过的第一条命令
echo -e '!/3.7\n/*' >> .git/info/sparse-checkout
# 3 拉取更新
git pull
# 或当更改了.git/info/sparse-checkout后重置本地仓库
git reset --hard
# 如果从本地初始化仓库开始
git init <project-name>
cd <project-name>
git remote add origin <remote-repo-url>
# 执行上面的#1，#2，#3步
git checkout <branch>
```
