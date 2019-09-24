# 链接数据库
- mysql -u root -p
- exit

mysql.server start
mysql.server restart
mysql.server stop

# 创建数据库
mysqladmin -u root -p create alerm

# 查看数据库
SHOW DATABASES;

# 使用数据库
use alerm;

# 查看数据库下的表
SHOW TABLES;

# 删除数据库
mysqladmin -u root -p drop RUNOOB
drop database alerm;

# 删除表
DROP TABLE table_name;


1、首先在设置中关闭mysql服务；
2、然后打开终端，输入：sudo mysqld_safe --user=mysql --skip-grant-tables --skip-networking &
再输入：sudo mysql -u root mysql
进入mysql>
执行以下命令：update user set password_expired = "Y" where user="root";

再输入：flush privileges;这一步很重要
然后：quit
3、进行登陆
输入：mysql -uroot -p

[新版本](https://blog.csdn.net/qq_32180569/article/details/83417656)
ALTER user 'root'@'localhost' IDENTIFIED BY 'password@#!';
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password@#!'; 解决 node mysql 报错问题 [node-mysql](https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server#)


