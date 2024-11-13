const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    role: { type: String, required: true },
    issuedAt: { type: Number, required: true },
    expiresIn: {type: Number, required: true},
    nonce: {type: Number, required: true},
    proofOfWork: {type: String, required: true}
});

const Token = mongoose.model('token', tokenSchema);

module.exports = Token;
