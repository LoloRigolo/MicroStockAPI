const axios = require("axios");
const Commande = require("../models/commande");

const createCommandeFromPanier = async (req, res) => {
  const { id_panier } = req.params;

  try {
    const panierRes = await axios.get(`${process.env.PANIER_URL}/${id_panier}`);
    const panier = panierRes.data;

    if (
      !panier ||
      !Array.isArray(panier.articles) ||
      panier.articles.length === 0
    ) {
      return res.status(400).json({ message: "Panier vide ou invalide" });
    }

    const articlesEnrichis = [];
    let totalHT = 0;

    for (const article of panier.articles) {
      const marchandRes = await axios.get(
        `${process.env.MARCHANDISE_URL}/${article.article_id}`
      );
      const marchandise = marchandRes.data;

      if (!marchandise || !marchandise.prix) {
        return res
          .status(400)
          .json({ message: `Article introuvable : ${article.article_id}` });
      }

      const prix_unitaire = marchandise.prix;
      const total_ligne = +(prix_unitaire * article.quantite).toFixed(2);

      totalHT += total_ligne;

      articlesEnrichis.push({
  article_id:     article.article_id,
  nom:            marchandise.nom,   
  prix:           prix_unitaire,     
  quantite:       article.quantite,
  prix_unitaire,                       
  total_ht:       total_ligne,
});
    }

    const tva = +(totalHT * 0.2).toFixed(2);
    const totalTTC = +(totalHT + tva).toFixed(2);

    const commande = new Commande({
      user_id: panier.user_id,
      articles: articlesEnrichis,
      total_ht: +totalHT.toFixed(2),
      tva,
      total_ttc: totalTTC,
      status: "en_attente",
    });

    await commande.save();
    await axios.delete(`${process.env.PANIER_URL}/${id_panier}`);

    res.status(201).json({ message: "Commande créée", commande });
  } catch (err) {
    console.error("Erreur création commande:", err.message);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


const getAllCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find();
    res.status(200).json(commandes);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande)
      return res.status(404).json({ message: "Commande non trouvée" });
    res.status(200).json(commande);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getCommandesByUserId = async (req, res) => {
  try {
    const commandes = await Commande.find({ user_id: req.params.user_id });
    res.status(200).json(commandes);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const updateCommandeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["en_attente", "valide", "en_livraison"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  try {
    const commande = await Commande.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(200).json({ message: "Statut mis à jour", commande });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

module.exports = {
  createCommandeFromPanier,
  getAllCommandes,
  getCommandeById,
  getCommandesByUserId,
  updateCommandeStatus
};
