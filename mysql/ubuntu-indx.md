(ubuntu安装mysql)[https://jingyan.baidu.com/article/ed2a5d1f87687b09f6be1780.html]

chown -R mysql:mysql /var/lib/mysql 
chown -R mysql:mysql /var/log/mysql/

```shell
cd /etc/mysql/mysql.conf.d
cat mysqld.cnf
vi mysqld.cnf
```

2013 - Lost connection to MySQL server at 'waiting for initial communication packet', system error: 60 "Operation timed out"
[native配置](https://blog.csdn.net/benben1580/article/details/79334523)

1130 - Host '127.0.0.1' is not allowed to connect to this MySQL serve
# skip-name-resolve
[1130](https://blog.csdn.net/tongle_deng/article/details/7469573)

FLUSH RIVILEGES



```
show variables like '%timeout%';
SET GLOBAL connect_timeout=1000;
# 查看端口号
show global variables like 'port';
```

- 配置服务器安全组规则
- 数据库链接超时 nodejs.ETIMEDOUTError: connect ETIMEDOUT
- netstat -anpt

- 修改数据库密码
```md
方法一：
在mysql系统外，使用mysqladmin
# mysqladmin -u root -p password "test123"
Enter password: 【输入原来的密码】
```

https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm


yum install mysql-server