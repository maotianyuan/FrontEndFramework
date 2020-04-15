let { generateKeyPairSync, createSign, createVerify, createHash } = require('crypto');
let passphrase = 'serverPassphrase';
let rsa = generateKeyPairSync('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase
    }
});
const data = {
    domain: "http://127.0.0.1:8000",
    publicKey: rsa.publicKey
};
const hash = createHash('sha256').update(JSON.stringify(data)).digest('hex')
const sign = getSign(hash, rsa.privateKey, passphrase); // 私钥+数据 = 签名
let serverCertIsValid = verifySign(hash, sign, rsa.publicKey); // 公钥+数据+签名=原始文件 === data

console.log('验证签名', serverCertIsValid);
function getSign(data, privateKey, passphrase) {
    var sign = createSign('RSA-SHA256');
    sign.update(data);
    return sign.sign({ key: privateKey, format: 'pem', passphrase }, 'hex');
}
function verifySign(data, sign, publicKey) {
    var verify = createVerify('RSA-SHA256');
    verify.update(data);
    return verify.verify(publicKey, sign, 'hex');
}