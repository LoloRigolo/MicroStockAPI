const crypto = require('crypto');
const Token = require('../models/token');

function hashPassword(password, salt) {
    return crypto
        .createHmac('sha256', salt)
        .update(password)
        .digest('hex');
}

function createToken(userId, role) {
    const issuedAt = Date.now();
    const expiresIn = issuedAt + 15 * 60 * 1000;
    let nonce = 0;
    let proofOfWork;

    do {
        proofOfWork = crypto.createHash('sha256')
            .update(userId + nonce + issuedAt.toString())
            .digest('hex');
        nonce++;
    } while (!proofOfWork.startsWith("000"));

    return new Token({
        userId,
        role,
        issuedAt,
        expiresIn,
        nonce: nonce - 1,
        proofOfWork
    });
}

module.exports = { hashPassword, createToken };
