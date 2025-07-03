const Panier = require("../models/panier");

const createPanier = async (req, res) => {
  try {
    const { user_id, articles } = req.body;

    if (!user_id || !Array.isArray(articles)) {
      return res.status(400).json({ message: "Données invalides" });
    }

    const newPanier = new Panier({ user_id, articles });
    await newPanier.save();

    res.status(201).json(newPanier);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getAllPaniers = async (req, res) => {
  try {
    const paniers = await Panier.find();
    res.status(200).json(paniers);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getPanierById = async (req, res) => {
  try {
    const { id } = req.params;
    const panier = await Panier.findById(id);

    if (!panier) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    res.status(200).json(panier);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const updatePanier = async (req, res) => {
  try {
    const { id } = req.params;
    const { articles } = req.body;

    const panier = await Panier.findByIdAndUpdate(
      id,
      { articles },
      { new: true, runValidators: true }
    );

    if (!panier) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    res.status(200).json(panier);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const deletePanier = async (req, res) => {
  try {
    const { id } = req.params;
    const panier = await Panier.findByIdAndDelete(id);

    if (!panier) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    res.status(200).json({ message: "Panier supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getPaniersByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const paniers = await Panier.find({ user_id });

    if (!paniers || paniers.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun panier trouvé pour cet utilisateur" });
    }

    res.status(200).json(paniers);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

module.exports = {
  createPanier,
  getAllPaniers,
  getPanierById,
  updatePanier,
  deletePanier,
  getPaniersByUserId,
};
