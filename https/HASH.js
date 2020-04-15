var crypto = require('crypto');
var content = 'thanks';
var result = crypto.createHash('md5').update(content).digest("hex")
console.log(result);


const salt = 'thanks';
const sha256 = str => crypto.createHmac('sha256', salt)
    .update(str, 'utf8')
    .digest('hex')

let ret = sha256(content);
console.log(ret);//64位十六进制 = 256位二进制