const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs").promises;
const crypto = require("crypto");
const ejs = require("ejs");
const { promisify } = require("util");
const mime = require("mime");
const zlib = require("zlib");
const renderHTMl = promisify(ejs.renderFile);
const { createReadStream } = require("fs");

let PORT = 3000;

class Server {
  constructor() {
    this.server = http.createServer(this.handlerRequest.bind(this));
  }
  async handlerRequest(req, res) {
    let { pathname = "/" } = url.parse(req.url);
    pathname = decodeURIComponent(pathname);
    const file = path.join(path.resolve(), "/", pathname);
    try {
      const stateObj = await fs.stat(file);
      if (stateObj.isFile()) {
        this.handlerFile(file, req, res, stateObj);
      } else {
        this.handlerDir(pathname, file, res);
      }
    } catch (error) {
      this.handleError(res);
    }
  }
  async cache(req, res, stateObj, filepath) {
    res.setHeader("Expires", new Date(Date.now() + 10 * 1000).toGMTString());
    const ctime = stateObj.ctime.toGMTString();
    res.setHeader("Last-Modified", ctime);
    res.setHeader("Cache-Control", "no-cache");
    let content = await fs.readFile(filepath);
    const ifModifiedSince = req.headers["if-modified-since"];
    const isNoneMatch = req.headers["if-none-match"];
    const etag = crypto.createHash("md5").update(content).digest("base64");
    res.setHeader("Etag", etag);
    if (isNoneMatch !== etag) {
      return false;
    }
    if (ifModifiedSince !== ctime) {
      return false;
    }
    return true;
  }
  async handlerFile(file, req, res, stateObj) {
    const cache = await this.cache(req, res, stateObj, file);
    if (cache) {
      res.statusCode = 304;
      res.end();
      return true;
    }
    res.setHeader(
      "Content-Type",
      (mime.getType(file) || "text/plain") + ";charset=utf-8"
    );
    const gzip = this.isAcceptGzip(req, res);
    if (gzip) {
      createReadStream(file).pipe(gzip).pipe(res);
    } else {
      createReadStream(file).pipe(res);
    }
  }
  isAcceptGzip(req, res) {
    const acceptEncoding = req.headers["accept-encoding"];
    if (acceptEncoding.includes("gzip")) {
      res.setHeader("Content-Encoding", "gzip");
      return zlib.createGzip();
    } else if (acceptEncoding.includes("deflate")) {
      res.setHeader("Content-Encoding", "deflate");
      return zlib.createDeflate();
    }
    return false;
  }
  async handlerDir(pathname, file, res) {
    const fileDirList = await fs.readdir(file);
    const templatePath = path.resolve(__dirname, "./public", "index.html");
    const fileList = fileDirList.map((item) => ({
      name: item,
      path: path.join(pathname, item),
    }));
    const r = await renderHTMl(templatePath, {
      fileList,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(r);
  }
  handleError(res) {
    res.statusCode = 404;
    res.end("404");
  }
  start() {
    this.server.listen(PORT, () => {
      console.log(`成功监听 ${PORT}`);
    });
    this.action();
  }
  action() {
    this.server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        this.server.listen(++PORT);
      }
    });
  }
}
new Server().start();

// http-server 服务器
// 读取当前目录，并支持跨域

// 获取当前 url 的 pathname
// 得到绝对路径，判断是文件还是目录
// 文件，则返回文件下所以目录，用ejs模版
// 目录直接， 返回内容
// 开启 gzip
// 开启 304
