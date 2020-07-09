const fs = require("fs");
const path = require("path");

const filePath = __dirname + "/ab";

// 深度遍历
const rmDirArr = (filePath) => {
  const filepath = filePath;
  const state = fs.statSync(filepath);
  if (state.isDirectory()) {
    const arrs = fs.readdirSync(filepath);
    arrs.map((item) => {
      let current = path.join(filepath, item);
      rmDirArr(current); // 递归删除目录
    });
    fs.rmdirSync(filepath);
  } else {
    fs.unlinkSync(filepath);
  }
};

rmDirArr(filePath);

// 删除文件
// 给路径 /abc/c
// 判断该路径是否问目录，是目录则 unlink 删除
// 否则，readdir 得到当前文件下目录
// 依次循环目录删除
// 最后删除文件本身。
