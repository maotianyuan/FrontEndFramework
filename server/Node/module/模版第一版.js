const path = require("path");
const fs = require("fs");

// 1、相对变绝对
// 2、拼接路径后缀
// 3、找到文件，读取文件内容
// 4、包裹一层函数执行。
// 5、函数返回值返回给主模块

const FileExtMap = [".js", ".json"];
const handlerFileExt = (filePath) => {
  const ext = path.extname(filePath);
  if (ext) return;
  let absolutePath = "";
  FileExtMap.map(async (item) => {
    const file = filePath + item;
    const exists = fs.existsSync(file);
    console.log(exists, file);
    if (exists) {
      absolutePath = file;
    }
  });
  return absolutePath;
};
const handlerContent = (filePath) => {
  return fs.readFileSync(filePath, (err) => {
    if (err) {
      throw new Error(err);
    }
  });
};
const handlerWrapFunction = (content) => {
  let module = {
    exports: {},
  };
  const fn = new Function("module", `${content} return module.exports`);
  return fn(module);
};
const myRequire = (file) => {
  const fileAbsolutePath = path.resolve(__dirname, file);
  const absolutePath = handlerFileExt(fileAbsolutePath);
  const content = handlerContent(absolutePath);
  const warapFunction = handlerWrapFunction(content);
  // console.log("warapFunction", warapFunction);
  return warapFunction;
};
var myTest = myRequire("./test");
console.log(myTest);
