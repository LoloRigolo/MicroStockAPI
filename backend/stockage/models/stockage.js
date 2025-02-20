const mongoose = require('mongoose');

const stockageSchema = new mongoose.Schema({
    id_magasin: { type: String, required: true },
    id_marchandise: { type: String, required: true },
    volume: { type: Number, required: true }
});

const stockage = mongoose.model('stockage', stockageSchema);

module.exports = stockage;
