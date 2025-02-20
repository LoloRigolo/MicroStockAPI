const mongoose = require('mongoose');

const magasinSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    adresse: { type: String, required: true }
});

const magasin = mongoose.model('magasin', magasinSchema);

module.exports = magasin;
