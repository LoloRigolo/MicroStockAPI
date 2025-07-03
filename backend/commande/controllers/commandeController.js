const axios = require("axios");
const Commande = require("../models/commande");

const createCommandeFromPanier = async (req, res) => {
  const { id_panier } = req.params;

  try {
    const panierRes = await axios.get(
      `http://panier-service/api/paniers/${id_panier}`
    );
    const panier = panierRes.data;

    if (!panier || !panier.articles || panier.articles.length === 0) {
      return res.status(400).json({ message: "Panier vide ou inexistant" });
    }

    const commande = new Commande({
      user_id: panier.user_id,
      articles: panier.articles,
      status: "en_attente",
    });

    await commande.save();
    await axios.delete(`http://panier-service/api/paniers/${id_panier}`);

    res.status(201).json({ message: "Commande créée", commande });
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
  getCommandeById,
  getCommandesByUserId,
  updateCommandeStatus,
};
