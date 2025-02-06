import { Magasin } from "../models/magasin.js";

async function createMagasin(req, res) {
  try {
    const newMagasin = new Magasin({
      nom: req.body.nom,
      adresse: req.body.adresse,
    });

    const savedMagasin = await newMagasin.save();
    res.status(201).json(savedMagasin);
  } catch (error) {
    console.error("Erreur lors de la création du magasin:", error);
    res.status(400).json({ message: "Erreur de création du magasin" });
  }
}

async function getAllMagasins(res) {
  try {
    const magasins = await Magasin.find();
    res.json(magasins);
  } catch (error) {
    console.error("Erreur lors de la récupération des magasins:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getMagasinById(req, res) {
  try {
    const magasin = await Magasin.findById(req.params.id);
    if (!magasin) {
      return res.status(404).json({ message: "Magasin non trouvé" });
    }
    res.json(magasin);
  } catch (error) {
    console.error("Erreur lors de la récupération du magasin:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function updateMagasin(req, res) {
  try {
    const updatedMagasin = await Magasin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMagasin) {
      return res.status(404).json({ message: "Magasin non trouvé" });
    }
    res.json(updatedMagasin);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du magasin:", error);
    res.status(400).json({ message: "Erreur de mise à jour du magasin" });
  }
}

async function deleteMagasin(req, res) {
  try {
    const deletedMagasin = await Magasin.findByIdAndDelete(req.params.id);
    if (!deletedMagasin) {
      return res.status(404).json({ message: "Magasin non trouvé" });
    }
    res.json({ message: "Magasin supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du magasin:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export {
  createMagasin,
  getAllMagasins,
  getMagasinById,
  updateMagasin,
  deleteMagasin,
};
