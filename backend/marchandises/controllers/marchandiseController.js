const Marchandise = require('../models/Marchandise');

const getAllMarchandises = async (req, res) => {
    try {
        const marchandises = await Marchandise.find();
        res.json(marchandises);
    } catch (error) {
        console.error('Erreur lors de la récupération des marchandises:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getMarchandiseById = async (req, res) => {
    try {
        const marchandise = await Marchandise.findById(req.params.id);
        if (!marchandise) {
            return res.status(404).json({ message: 'Marchandise non trouvée' });
        }
        res.json(marchandise);
    } catch (error) {
        console.error('Erreur lors de la récupération de la marchandise:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const createMarchandise = async (req, res) => {
    const { nom, prix } = req.body;

    if (!nom || !prix) {
        return res.status(400).json({ message: "Des informations sont manquantes" });
    }

    try {
        const newMarchandise = new Marchandise({ nom, prix });
        const savedMarchandise = await newMarchandise.save();
        res.status(201).json({ message: "Marchandise ajoutée avec succès", marchandise: savedMarchandise });
    } catch (error) {
        console.error('Erreur lors de la création de la marchandise:', error);
        res.status(400).json({ message: 'Erreur de création de la marchandise' });
    }  
};

const updatedMarchandise = async (req, res) => {
    const { nom, prix } = req.body;

    if (!nom || !prix) {
        return res.status(400).json({ message: "Des informations sont manquantes" });
    }

    try {
        const updatedMarchandise = await Marchandise.findByIdAndUpdate(req.params.id, { nom, prix }, { new: true });
        if (!updatedMarchandise) {
            return res.status(404).json({ message: "Marchandise non trouvée" });
        }
        res.json({ message: "Marchandise mise à jour avec succès", marchandise: updatedMarchandise });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la marchandise:', error);
        res.status(400).json({ message: 'Erreur de mise à jour de la marchandise' });
    }
}

const deletedMarchandise = async (req, res) => {
    try {
        const deletedMarchandise = await Marchandise.findByIdAndDelete(req.params.id);
        if (!deletedMarchandise) {
            return res.status(404).json({ message: "Marchandise non trouvée" });
        }
        res.json({ message: "Marchandise supprimée avec succès", marchandise: deletedMarchandise });
    } catch (error) {
        console.error('Erreur lors de la suppression de la marchandise:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { createMarchandise, getAllMarchandises, getMarchandiseById, updatedMarchandise, deletedMarchandise };
