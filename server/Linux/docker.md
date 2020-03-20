- ``$ docker pull xxx`` 获取镜像
- ``$ docker images`` 查看镜像
- ``$ docker ps -a ``查看所有容器
- ``$ docker container ls --all``

- ``$ docker run -itd --name xxx centos`` 启动容器
    ``-i`` 选项告诉 Docker 容器保持标准输入流对容器开放，即使容器没有终端连接
    ``-t`` 选项告诉 Docker 为容器分配一个虚拟终端
    ``-d`` 选项告诉 Docker 在后台运行容器的守护进程
    ``-p`` 指定端口映射
    ``-P`` 随机分配一个端口映射
  + ``$ docker run -it --name xxx centos /bin/bash`` 在启动容器之后，出现bash命令行

- ``$ docker stop <容器 ID>`` 停止容器。通过输入容器的id或者在运行时指定的name字段来停止容器的运行
- ``$ docker restart <容器 ID>`` 重启容器
- ``$ docker rm -f <容器 ID>`` 删除容器
- ``$ docker rmi <容器 ID>`` 删除镜像
- ``$ docker exec -it <容器 ID> /bin/bash`` 进入容器
- ``$ docker exec -it ec66aa43edf6 /bin/bash`` 进入容器
- ``$ docker cp xxx <容器 ID>:<path>`` 复制xxx文件至容器内path路径下

```bash
image: node

stages:
  - install
  - build
  - zip
  - deploy

cache:
    paths:
        - node_modules/
        - dist/
        - front-end-caiwu.tar

before_script:
  - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y ) '
  - eval $(ssh-agent -s)
  - ssh-add <(echo "$SSH_PRIVATE_KEY_DEV")
  - mkdir -p ~/.ssh
  - '[[ -f /.dockerenv ]] && echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config'

install:
  stage: install
  script:
    - npm install -g cnpm --registry=https://registry.npm.taobao.org
    - cnpm install

build:
  stage: build
  script:
    - npm run build

zip:
  stage: zip
  script:
   - tar -czvf front-end-caiwu.tar ./dist

deploy:
  stage: deploy
  script:
   - scp ./front-end-caiwu.tar root@119.23.58.139:/data

```