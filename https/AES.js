// 对称加密
const crypto = require('crypto');

const data = 'thanks';
const key = '1234567890123456';
const salt = 'abcdefghijklmnop';

// 使用AES-128-CBC加密模式，key需要为16位,key和iv可以相同！
function encrypt (data, key, salt) {
  const decipher = crypto.createCipheriv('aes-128-cbc', key, salt)
  decipher.update(data)
  return decipher.final('hex')
}

function decrypt (data, key, salt) {
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, salt)
  decipher.update(data, 'hex')
  return decipher.final('utf8')
}

const encrypted = encrypt(data, key, salt)
const decrypted = decrypt(encrypted, key, salt)

console.log("加密", encrypted);
console.log("解密", decrypted);
