# Ubunto docker 搭建 sentry 服务

## 系统环境
```
root@TYM:~# lsb_release -a

Distributor ID: Ubuntu
Description:    Ubuntu 16.04.4 LTS
Release:        16.04
Codename:       xenial

```
- 查看内存大小
dmidecode -t memory | grep Size: | grep -v "No Module Installed" 或者 free -m
需要大于2400，否则也运行不了，重点；


1. 选择国内的云服务商，这里选择阿里云为例
```
curl -sSL http://acs-public-mirror.oss-cn-hangzhou.aliyuncs.com/docker-engine/internet | sh -
```
2. 安装所需要的包
```
sudo apt-get install linux-image-extra-$(uname -r) linux-image-extra-virtual
```
3. 添加使用 HTTPS 传输的软件包以及 CA 证书
```
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates
```
4. 添加GPG密钥
```
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
```
5. 添加软件源
```
echo "deb https://apt.dockerproject.org/repo ubuntu-xenial main" | sudo tee /etc/apt/sources.list.d/docker.list
```
6. 添加成功后更新软件包缓存
```
sudo apt-get update
```
7. 安装docker
```
sudo apt-get install docker-engine
```
8. 启动 docker
```
sudo systemctl enable docker
sudo systemctl start docker
```
9. 测试 Docker 是否安装成功，输入以下指令，打印出以下信息则安装成功:

10. 参考[Ubuntu 16.04 安装 Docker](https://www.runoob.com/docker/ubuntu-docker-install.html)

11. 测试 hello-world
```sh
$ sudo docker run hello-world

Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete                                                                                                                                  Digest: sha256:c3b4ada4687bbaa170745b3e4dd8ac3f194ca95b2d0518b417fb47e5879d9b5f
Status: Downloaded newer image for hello-world:latest


Hello from Docker!
This message shows that your installation appears to be working correctly.


To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.


To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash


Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/


For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

12. 查看docker服务是否启动
```
systemctl status docker
```

## 升级 pythone

```sh
sudo add-apt-repository ppa:deadsnakes/ppa

sudo apt update

sudo apt install python3.6

ls -l /usr/bin/python*

rm /usr/bin/python 

ln -s /usr/bin/python3.6 /usr/bin/python

sudo apt-get install python-pip

sudo pip install docker-compose

```
- [参考](https://www.php.cn/python-tutorials-416841.html)
- 测试 
```
docker-compose --version 
```

##  sentry部署
```
sudo apt-get install git
git clone https://github.com/getsentry/onpremise.git
cd onpremise
```
- 执行
```
mkdir -p data/{sentry,postgres}
docker-compose build # 一定执行，不然报错，然后再生成key

docker-compose run --rm web config generate-secret-key 
// 如果报错，根据提示缺什么装什么 直到成功安装， 一个小时+的等待
docker volume create --name=sentry-data
docker volume create --name=sentry-postgres
...
```

- 复制获取到的 key 字符串
sudo vim docker-compose.yml  

- 或者
cd .env
SENTRY_SECRET_KEY=你生成的key***

- 创建项目的 superuser
docker-compose run --rm web upgrade

- 开启 sentry 服务
docker-compose up -d

- 查看开启服务
docker ps

## 问题

问题：
 运行 docker run --rm -it sentry-onpremise upgrade
!! Configuration error: Exception: Error: REDIS_PORT_6379_TCP_ADDR (or SENTRY_REDIS_HOST) is undefined, did you forget to `--link` a red

运行
./install.sh
发现：
FAIL: Expected minimum RAM available to Docker to be 2400 MB but found 2000 MB

## 参考
[https://blog.csdn.net/u014775723/article/details/85213793]
[https://blog.csdn.net/ros_donggua/article/details/81024658]
[https://www.cnblogs.com/Shadow3627/p/10767023.html]
[https://juejin.im/post/5b55c33ae51d45198f5c7a91]