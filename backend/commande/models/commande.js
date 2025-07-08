const mongoose = require("mongoose");

const articleCommandeSchema = new mongoose.Schema({
  article_id: { type: String, required: true },
  nom: { type: String, required: true },
  prix: { type: Number, required: true },
  quantite: { type: Number, required: true },
});

const commandeSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  articles: [articleCommandeSchema],
  status: {
    type: String,
    enum: ["en_attente", "valide", "en_livraison"],
    default: "en_attente",
  },
  created_at: { type: Date, default: Date.now },
});

const Commande = mongoose.model("Commande", commandeSchema);
module.exports = Commande;
