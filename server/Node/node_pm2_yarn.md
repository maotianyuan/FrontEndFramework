## node pm2 yarn 安装配置 

### 目录
- 一、安装Node.js工具
- 二、安装Vue/Yarn/PM2
- 三、nginx端口代理与域名指向
- 四、配置git 
- 五、pm2 打包
- 六、本地登录服务器记住密码



### 一、安装Node.js工具
```js
1： sudo apt-get update                                                                     // 更新
2： sudo apt-get install git vim openssl build-essential lib ssh-dev wget curl              // 添加
3： curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash    // 添加nvm
    nvm ls                                                                                  // 安装nvm重新启动服务器使得生效
4： nvm install 11.0.0                                                                      // v8以后不带v 安装node
5:  nvm use 11.0.0                                                                          // 设置服务器使用这个版本
    nvm alias default 11.0.0                                                                // 切换node为默认版本  测试 node -v

6:  测试启动node服务器
    const http = require('http');
    const hostname = '127.0.0.1';const port = 3000;
    const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');});
    server.listen(port, hostname, () => {console.log(`Server running at http://${hostname}:${port}/`);});
   
7:  node server.js
8:  查看启动端口号
    netstat -tunlp
    netstat -tunlp |grep 端口号   // 用于查看指定的端口号的进程情况，如查看8000端口的情况，[netstat -tunlp |grep 800]

9:  curl http://127.0.0.1:3000  // 测试查看访问

```
// 方式二
```
1:  下载node包
    wget https://nodejs.org/dist/v8.11.4/node-v8.11.4-linux-x64.tar.xz     // 安装不同的版本  v8.11.4

2:  解压缩哦
    tar xvf node-v7.2.1-linux-x64.tar.xz  tar xvf node-v8.11.4-linux-x64.tar.xz    // 解压缩
    ls -ll node-v7.2.1-linux-x64                                                   // 查看

3:  移动
    mkdir -p /opt/node/                            // 创建目录           
    mv ~/node-v8.11.4-linux-x64/* /opt/node/       // 移动解压缩的node文件
    cd /opt/node/                                  // 查看
    ls -ll

4: 配置全局可以访问的软连接
    ln -s /opt/node/bin/node /usr/local/bin/node
    ln -s /opt/node/bin/npm /usr/local/bin/npm
    ln -s /opt/node/bin/cnpm /usr/local/bin/cnpm

5: 可在任何路径测试
    node -v
    npm -v

6: linux安装环境变量

export NODE_HOME=/opt/node
export PATH=$PATH:$NODE_HOME/bin
export NODE_PATH=$NODE_HOME/lib/node_modules

```
### 二、安装Vue/Yarn/PM2
- 安装Yarn [yarn网站](https://yarnpkg.com/en/docs/install#debian-stable)
```
1: 官网 yarnpkg.com 找到对应系统安装命令    例如下
    curl -sShttps://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -                                   // Ubuntu 
    curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo     // centOS

2: 安装
   sudo apt-get update && sudo apt-get install yarn      // [Ubuntu]
   sudo yum install yarn                                 // [centOS]

3: 设置淘宝  
   sudo apt remove cmdtest
   yarn config set registry https://registry.npm.taobao.org

4: npm install vue-cli pm2 -g    

```
- pm2简单语法
```
pm2 start server.js
pm2 list        列表
pm2 show server  细致详情
pm2 stop server 关闭
pm2 log    日志
pm2 restart server 重启
pm2 delete server
pm2 startup centos
```

### 三、nginx端口代理与域名指向
```
1: sudo service apache2 stop
2: sudo apt-get remove apache
3: sudo apt-get update
4: sudo apt=get install nginx
5: nginx -v
6: cd /etc/nginx/conf.d & ls
7  service nginx restart
8: cd /etc/nginx/nginx.conf
   server_tokens off        // vim 中修改:版本号不输出 nginx版本号
```

在cd /etc/nginx/conf.d中创建 .conf结尾的文件 
简易例子如下：
```
upstream myupstream {
  server 127.0.0.1:3000;       # 具体代理的端口3000，根据据自身本地服务监听的端口而定
}
server {
  listen 80;
  server_name testxx.xxx.com;   # 配置自己的域名，以testxx.xxx
  location /mystatus {
    stub_status;
  }
  location / {
    proxy_set_header X-Real-Ip $remote_addr;
    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Nginx-Proxy true;

    proxy_pass http://myupstream;                       # 假域名上的所有请求都反向代理到本地node服务上
    proxy_redirect off;                                         
  }
}
```

### 四、配置git 
```
1: ssh-keygen -t rsa -b 4096 -C 'your email'
2: cat ~/.ssh/id_rsa.pub
```

### 五、pm2 打包
- pm2 配置文件
```json
{
  "apps":[{
     "name":"nuxt",                         // pm2 list 名称
     "script":"server.js",                  // 启动服务的文件
     "env":{
       "COMMON_VERIABLE":"true"
     },
     "env_production":{
       "NODE_ENV":"production"
     }
    }
  ],
  "deploy":{
    "production":{
      "user":"root",
      "host":["xx.xx.xx.xx"],                     // 服务器 ip
      "port":"22",
      "ref":"origin/master",                      // 打包分支
      "repo":"git@test.git",                      // 输入自己的远程仓库地址
      "path":"/www/project/",                     // 远程服务器存放项目地址
      "ssh_options":"StrictHostKeyChecking=no",
      "pre-deploy-local":"echo 'Deploy Done'",
      "evn":{
        "NODE_ENV":"production"
      }
    }
  }
}
```

```
pm2 deploy ecosystem.json production setup
pm2 deploy ecosystem.json production
```
```
可能遇到的问题
- whereis pm2  // pm2安装所在路径   pm2: /root/.nvm/versions/node/v11.0.0/bin/pm2  
sudo ln -s /root/.nvm/versions/node/v11.0.0/bin/pm2 /usr/bin/pm2    // 路径以自己服务器为主

- whereis node
sudo ln -s /root/.nvm/versions/node/v11.0.0/bin/node /usr/bin/node  // [软连接] 路径记得改成自己服务器路径
ln -s ~/install/node-v10.9.0-linux-x64/bin/npm   /usr/bin/npm       // [软连接] 路径记得改成自己服务器路径

```

#### 六、本地登录服务器记住密码

找到本机ssh下面id_rsa.pub  于需要相链接的远程服务器 进行记住密码操作，按照提示输入服务器密码
```js
ssh-copy-id -i ~/.ssh/id_rsa.pub root@x.x.x.x                               //  mac通用 x.x.x.x 你的服务器ip
ssh-copy-id -i /c/Users/yourname/.ssh/id_rsa.pub root@x.x.x.x               //  window 通用 将本地
ssh-copy-id -i /c/Users/yourname/.ssh/id_rsa.pub -p 9777 root@x.x.x.x       //  x.x.x.x 你的服务器ip，服务器port 为9777情况 默认22 可省
```

