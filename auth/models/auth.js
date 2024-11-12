const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true }
});

const Auth = mongoose.model('auth', authSchema);

module.exports = Auth;