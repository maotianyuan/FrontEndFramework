### Lighttpd手动上线步骤

```shell
# 1.从git上拉去代码
git clone git@x.x.x.x:qicheplatform/project.git [你git地址]
# 2.添加data-stone到zip,上传到服务器 [rz  选择文件上传到服务器] [sz 选择文件下载到本地]

# 3.连接服务器执行以下命令
	cd /var/lib/mysql-files
	./test.sh
# 或者
sh /var/lib/mysql-files/test.sh

# 4.两台服务器相互传输资源，在正式环境中执行
scp -r root@x.x.x.x:/data/www/lighttpd/project.zip ./
# 执行完命令需要输入密码 Password

```
test.sh 示例
```shell
#!/bin/bash

#原来项目备份
now=`date +%Y%m%d`
cd /data/www/lighttpd && mv project project-${now}-bak

#解压zip文件
cd /data/www/lighttpd && unzip project.zip

#新建laravel.log
log_name="/data/www/lighttpd/project/storage/logs/laravel.log"
if [ ! -f ${log_name} ]
then
  touch ${log_name}
fi


#给项目设置lighttpd 
cd /data/www/lighttpd && chown -R lighttpd:lighttpd project

#修改.env
#sed -i 's/IS_ONLINE=false/IS_ONLINE=true/' /data/www/lighttpd/project/.env
#sed -i 's/REDIS_HOST=x.x.x.x/REDIS_HOST=x.x.x.x/' /data/www/lighttpd/project/.env
#sed -i 's/SESSION_COOKIE=testcookie/SESSION_COOKIE=onlinecookie/' /data/www/lighttpd/project/.env
#sed -i 's/API_URL=https:\/\/testwww.stone.com/API_URL=https:\/\/www.stone.com/' /data/www/lighttpd/project/.env
#sed -i 's/APP_URL=https:\/\/testproject.stone.com/APP_URL=https:\/\/project.stone.com/' /data/www/lighttpd/project/.env

#shell执行权限和dos2unix
#cd /data/www/lighttpd/project/app/Shell && chmod +x *.sh && dos2unix *.sh

#重启supervisorctl
sudo supervisorctl reload

#设置软连接
#ln -s /disk1/voiceFiles_defined/ /data/www/lighttpd/project/public/storage_defind


```
