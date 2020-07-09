const fs = require("fs");
const path = require("path");

// fs.readFile(path.resolve(__dirname, "a.js"), "utf8", (err, data) => {
//   if (err) {
//     throw new Error("异常");
//   }
//   fs.appendFile(path.resolve(__dirname, "b.js"), data, () => {
//     if (err) {
//       throw new Error("异常");
//     }
//   });
//   console.log(data);
// });

// 创建文件目录

const filePath = "a/pdf1/adfb";

const mkdirFolder = (filePath) => {
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

mkdirFolder(filePath);
