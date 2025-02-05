const Stockage = require("../models/stockage");
const { verifierExistance } = require("../services/stockageService");

const createStockage = async (req, res) => {
  const { id_magasin, id_marchandise, volume } = req.body;

  if (!id_magasin || !id_marchandise || !volume) {
    return res
      .status(400)
      .json({ message: "Des informations sont manquantes" });
  }
  try {
    const magasinExiste = await verifierExistance(
      `http://host.docker.internal:3007/magasins/${id_magasin}`
    );
    if (!magasinExiste) {
      return res
        .status(404)
        .json({ message: "Le magasin avec cet ID n'existe pas" });
    }

    const marchandiseExiste = await verifierExistance(
      `http://host.docker.internal:3012/marchandises/${id_marchandise}`
    );
    if (!marchandiseExiste) {
      return res
        .status(404)
        .json({ message: "La marchandise avec cet ID n'existe pas" });
    }

    const newStockage = new Stockage({ id_magasin, id_marchandise, volume });
    const savedStockage = await newStockage.save();
    res.status(201).json({
      message: "stockage ajoutée avec succès",
      stockage: savedStockage,
    });
  } catch (error) {
    console.error("Erreur lors de la création du stockage:", error);
    res.status(400).json({ message: "Erreur de création du stockage" });
  }
};

const getAllStockage = async (req, res) => {
  try {
    const stockage = await Stockage.find();
    res.json(stockage);
  } catch (error) {
    console.error("Erreur lors de la récupération des stockage:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getStockageById = async (req, res) => {
  try {
    const stockage = await Stockage.findById(req.params.id);
    if (!stockage) {
      return res.status(404).json({ message: "Stockage non trouvée" });
    }
    res.json(stockage);
  } catch (error) {
    console.error("Erreur lors de la récupération du stockage:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getStockageByIdMagasin = async (req, res) => {
  const { id_magasin } = req.params;
  try {
    const stockage = await Stockage.find({ id_magasin });

    if (!stockage || stockage.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun stockage trouvé pour ce magasin" });
    }

    res.json(stockage);
  } catch (error) {
    console.error("Erreur lors de la récupération des stockages:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getStockageByIdMarchandise = async (req, res) => {
  const { id_marchandise } = req.params;

  try {
    const stockage = await Stockage.find({ id_marchandise });

    if (!stockage || stockage.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun stockage trouvé pour cette marchandise" });
    }

    res.json(stockage);
  } catch (error) {
    console.error("Erreur lors de la récupération des stockages:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getStockageByIdMarchandiseAndIdMagasin = async (req, res) => {
  const { id_marchandise, id_magasin } = req.params;

  try {
    const stockage = await Stockage.find({ id_marchandise, id_magasin });

    if (!stockage || stockage.length === 0) {
      return res.status(404).json({
        message: "Aucun stockage trouvé pour cette marchandise et ce magasin",
      });
    }

    res.json(stockage);
  } catch (error) {
    console.error("Erreur lors de la récupération des stockages:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updatedStockage = async (req, res) => {
  const { id_magasin, id_marchandise, volume } = req.body;

  if (!id_magasin || !id_marchandise) {
    return res
      .status(400)
      .json({ message: "Des informations sont manquantes" });
  }
  try {
    const updatedStockage = await Stockage.findByIdAndUpdate(
      req.params.id,
      { id_magasin, id_marchandise, volume },
      { new: true }
    );
    if (!updatedStockage) {
      return res.status(404).json({ message: "Stockage non trouvée" });
    }
    res.json({
      message: "Stockage mise à jour avec succès",
      stockage: updatedStockage,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du Stockage:", error);
    res.status(400).json({ message: "Erreur de mise à jour du Stockage" });
  }
};

const deletedStockage = async (req, res) => {
  try {
    const deletedStockage = await Stockage.findByIdAndDelete(req.params.id);
    if (!deletedStockage) {
      return res.status(404).json({ message: "Stockage non trouvée" });
    }
    res.json({
      message: "Stockage supprimée avec succès",
      stockage: deletedStockage,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du stockage:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createStockage,
  getAllStockage,
  getStockageById,
  getStockageByIdMagasin,
  getStockageByIdMarchandise,
  getStockageByIdMarchandiseAndIdMagasin,
  updatedStockage,
  deletedStockage,
};
