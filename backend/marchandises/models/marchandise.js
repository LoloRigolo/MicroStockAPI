const mongoose = require('mongoose');

const marchandiseSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prix: { type: Number, required: true },
  imageUrl: { type: String }
});

module.exports = mongoose.model('Marchandise', marchandiseSchema);