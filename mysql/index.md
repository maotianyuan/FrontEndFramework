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