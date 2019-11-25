# Nginx 加权轮询

```shell
#配置负载均衡
upstream load_rule {
  server 127.0.0.1:3001 weight=1;
  server 127.0.0.1:3002 weight=2;
  server 127.0.0.1:3003 weight=3;
  server 127.0.0.1:3004 weight=4;
}
...
server {
  listen       80;
  server_name  load_balance.com www.load_balance.com;
  location / {
    proxy_pass http://load_rule;
  }
}
```