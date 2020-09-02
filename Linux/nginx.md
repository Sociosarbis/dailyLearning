## 当https服务器接收到http请求时，反向代理到对应的http服务器
```bash
location @proxy_to_http {
  proxy_pass http://localhost$request_uri;
  # 客户端的IP，进行反向代理的服务器对于目标代理服务器也是一个客户端
  proxy_set_header X-Real-IP $remote_addr;
  # $http_host：客户端请求头部的Host值，而$host表示的是客户端请求地址的hostname || 客户端请求头部的Host值 || nginx匹配到的server的name
  proxy_set_header Host $http_host;
  # 当只经过一次代理时，$proxy_add_x_forwarded_for的值与$remote_addr相等，每经过一次代理该变量都会在末尾拼接上" $remote_addr"
  proxy_set_header X-Forwarded-for $proxy_add_x_forwarded_for;
  proxy_set_header X-Nginx-Proxy true;
  proxy_set_header   Connection "";
  proxy_http_version 1.1;
  add_header Access-Control-Allow-Origin *;
}
# 497表示https服务器接受了常规的请求
error_page 497 =200 @proxy_to_http;
```
