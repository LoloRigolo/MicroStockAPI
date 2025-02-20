const crypto = require('crypto');

//fonction d'encodage
const base64UrlEncode = (str) => {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
};

//signature
const sign = (key, input) => {
    return crypto.createHmac('sha256', key).update(input).digest('base64url');
};

//create le JWT
const createJWT = ( payload, secret) => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerBase64 = base64UrlEncode(JSON.stringify(header));
    const payloadBase64 = base64UrlEncode(JSON.stringify(payload));
    const signature = sign(secret, `${headerBase64}.${payloadBase64}`);
    return `${headerBase64}.${payloadBase64}.${signature}`;
};

//verification du JWT
const verifyJWT = (token, secret) => {
    const [headerBase64, payloadBase64, signature] = token.split('.');
    const validSignature = sign(secret, `${headerBase64}.${payloadBase64}`);
    return signature === validSignature;
};

module.exports = { createJWT, verifyJWT };