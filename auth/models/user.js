const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role : {type: String, required: true, default: "User"},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;