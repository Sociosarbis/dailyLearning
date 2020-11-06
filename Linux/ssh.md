### 将本地的公钥复制到服务器，相当于ssh-copy-id
```sh
cat ~/.ssh/id_rsa.pub | ssh [user@]<remote> 'cat >> .ssh/authorized_keys'
```
