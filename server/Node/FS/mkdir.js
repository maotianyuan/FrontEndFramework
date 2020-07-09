const fs = require("fs");
const path = require("path");

const filePath = "a/pdf1/adfb";

const mkdirFolderArr = (filePath) => {
  const arr = filePath.split("/");
  arr.map((item, index) => {
    const folder = __dirname + "/" + arr.slice(0, index).join("/");
    const state = fs.existsSync(folder);
    if (!state) {
      fs.mkdir(folder, (err) => {
        if (err) {
          throw new Error("创建失败");
        }
      });
    }
  });
};

const mkdirFolderNext = (filePath, callback) => {
  const arr = filePath.split("/");
  let index = 0;
  const next = () => {
    if (index === arr.length) {
      callback && callback();
      return;
    }
    const folder = arr.slice(0, index + 1).join("/");
    fs.access(folder, (err) => {
      index++;
      if (err) {
        fs.mkdir(folder, next);
      } else {
        next();
      }
    });
  };
  next();
};

mkdirFolderNext(filePath, () => {
  console.log("success");
});

console.log(fs.readdirSync(__dirname));

// 创建文件思路
// 给出一个路径 /a/b/c/d，递归从a创建到b
// 对 a/b/c/d 进行字符串分割成数组
// 对数组每一项进行遍历，存在的忽略，不存在的创建

// 创建文件思路 co
// 给出一个路径 /a/b/c/d，递归从a创建到b
// 对 a/b/c/d 进行字符串分割成数组
// index 从 0 开始
// 函数内实现 next 方法，从 index = 0 开始，index = 数组长度停止，等于长度的时候执行回调
// 当前文件已经存在，则执行 next
// 不存在的执行，创建，并回调
// index++ next()
