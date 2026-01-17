const mongoose = require("mongoose");

const articlePanierSchema = new mongoose.Schema({
  article_id: { type: String, required: true },
  quantite: { type: Number, required: true },
});

const panierSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  articles: [articlePanierSchema],
});

const Panier = mongoose.model("Panier", panierSchema);

module.exports = Panier;
