const { generateKeyPairSync, privateEncrypt, publicDecrypt } = require('crypto');
const passphrase = 'serverPassphrase'
const rsa = generateKeyPairSync('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase,
    }
});

const data = 'thanks';
// 需要 私钥 + 数据 生成 加密签名，通过互联网传输
const encrypted = privateEncrypt({
    key: rsa.privateKey, passphrase
}, Buffer.from(data, 'utf8'));
console.log('私钥加密后: ' + encrypted.toString('hex'));

// 公钥 + 文件 + 签名 生成原始数据
const decrypted = publicDecrypt(rsa.publicKey, encrypted);
console.log('公钥解密后: ' + decrypted.toString('utf8'));