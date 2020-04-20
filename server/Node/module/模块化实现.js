const path = require("path");
const fs = require("fs");
const vm = require("vm");

// 1、文件路径，由相对变绝对
// 2、查看文件是否存在，不存在在拼接路径 js 或者 json后缀 看是否存在，最终找到目标文件路径
// 3、读取文件内容
// 4、对于 js 文件包裹一层函数并执行，传入参数 export require module __filename __dirname。
// 5、函数返回值 module.exports 返回

const extraName = [".js", ".json"];

function getAbsPath(filename) {
  const absPath = path.resolve(__dirname, filename);
  const exists = fs.existsSync(absPath);
  if (exists) {
    return absPath;
  }
  for (var i = 0; i < extraName.length; i++) {
    const file = absPath + extraName[i];
    const ext = fs.existsSync(file);
    if (ext) {
      return file;
    }
  }
  throw new Error(`Could not find ${filename}`);
}

class Module {
  constructor(id) {
    this.id = id;
    this.extname = [".js", ".json"];
    this.exports = {};
  }
  load() {
    let extname = path.extname(this.id);
    this._handlerExtraName(extname);
  }
  _handlerExtraName(filename) {
    const handlerExtraNameMap = {
      ".js": (module) => {
        const content = this._readContent();
        const wrap = `(function(exports,require,module,__filename,__dirname){
          ${content}
        })`;
        const fn = vm.runInThisContext(wrap);
        const exports = module.exports; // {}
        const dirname = path.dirname(module.id);
        fn.call(exports, exports, myRequire, module, module.id, dirname);
      },
      ".json": () => {
        const content = this._readContent();
        this.exports = JSON.parse(content);
      },
    };
    handlerExtraNameMap[filename](this);
  }
  _readContent() {
    return fs.readFileSync(this.id, "utf8");
  }
}
let ModuleCache = new Map();
const myRequire = (filename) => {
  const absPath = getAbsPath(filename);
  if (ModuleCache.get(absPath)) {
    console.log("cache");
    return ModuleCache.get(absPath).exports;
  }
  const module = new Module(absPath);
  module.load();
  ModuleCache.set(absPath, module);
  return module.exports;
};
var myTest = myRequire("./test");
var myTestJSON = myRequire("./testJSON");
console.log(myTest);
console.log(myTestJSON);
