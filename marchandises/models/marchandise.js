const mongoose = require('mongoose');

const marchandiseSchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true },
    prix: { type: Number, required: true }
});

const marchandise = mongoose.model('marchandise', marchandiseSchema);

module.exports = marchandise;
