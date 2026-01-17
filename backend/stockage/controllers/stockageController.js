
const Stockage = require('../models/stockage');
const axios = require('axios');

const createStockage = async (req, res) => {
  try {
    let { id_magasin, id_marchandise, nom_magasin, nom_marchandise, volume } = req.body;

    if (!id_magasin && nom_magasin) {
      const responseMagasin = await axios.get(`http://localhost:3007/magasins`);
      const magasin = responseMagasin.data.find(m => m.nom === nom_magasin);
      if (!magasin) {
        return res.status(404).json({ message: `Magasin '${nom_magasin}' introuvable.` });
      }
      id_magasin = magasin._id;
    }

    if (!id_marchandise && nom_marchandise) {
      const responseMarchandise = await axios.get(`http://localhost:3012/marchandises`);
      const marchandise = responseMarchandise.data.find(m => m.nom === nom_marchandise);
      if (!marchandise) {
        return res.status(404).json({ message: `Marchandise '${nom_marchandise}' introuvable.` });
      }
      id_marchandise = marchandise._id;
    }

    if (!id_magasin || !id_marchandise || volume == null) {
      return res.status(400).json({ message: "Des informations sont manquantes." });
    }

    let stockage = await Stockage.findOne({
      id_magasin,
      id_marchandise
    });

    if (stockage) {
      stockage.volume += volume;
      const updated = await stockage.save();
      return res.status(200).json({
        message: "Stockage existant mis à jour.",
        stockage: updated
      });
    } else {
      const newStockage = new Stockage({
        id_magasin,
        id_marchandise,
        volume
      });

      const saved = await newStockage.save();
      return res.status(201).json({
        message: "Nouveau stockage créé avec succès.",
        stockage: saved
      });
    }

  } catch (error) {
    console.error("Erreur lors de la création du stockage :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getAllStockage = async (req, res) => {
  try {
    const stockages = await Stockage.find();

    const result = await Promise.all(
      stockages.map(async (stock) => {
        let nom_magasin = null;
        let nom_marchandise = null;

        try {
          const { data } = await axios.get(
            `http://magasin-micro-services:3007/magasins/${stock.id_magasin}`
          );
          nom_magasin = data?.nom || null;
        } catch (e) {
          console.error(`Magasin ${stock.id_magasin} introuvable.`);
        }

        try {
          const { data } = await axios.get(
            `http://marchandise-micro-services:3012/marchandises/${stock.id_marchandise}`
          );
          nom_marchandise = data?.nom || null;
        } catch (e) {
          console.error(`Marchandise ${stock.id_marchandise} introuvable.`);
        }

        return {
          _id: stock._id,
          id_magasin: stock.id_magasin,
          nom_magasin,
          id_marchandise: stock.id_marchandise,
          nom_marchandise,
          volume: stock.volume,
        };
      })
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateStockageVolume = async (req, res) => {
  const { id } = req.params;
  const { delta } = req.body;

  if (delta == null) {
    return res.status(400).json({ message: "Delta manquant" });
  }

  try {
    const stockage = await Stockage.findById(id);
    if (!stockage) {
      return res.status(404).json({ message: "Stockage non trouvé" });
    }

    stockage.volume += delta;

    if (stockage.volume < 0) {
      stockage.volume = 0;
    }

    const updated = await stockage.save();
    res.json({ message: "Volume mis à jour", stockage: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


const getStockageById = async (req, res) => {
  try {
    const stockage = await Stockage.findById(req.params.id);
    if (!stockage) {
      return res.status(404).json({ message: 'Stockage non trouvé' });
    }
    res.json(stockage);
  } catch (error) {
    console.error('Erreur lors de la récupération du stockage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


const getStockageByIdMagasin = async (req, res) => {
  const { id_magasin } = req.params;
  try {
    const stockages = await Stockage.find({ id_magasin });

    if (!stockages || stockages.length === 0) {
      return res.status(404).json({ message: 'Aucun stockage trouvé pour ce magasin' });
    }

    res.json(stockages);
  } catch (error) {
    console.error('Erreur lors de la récupération des stockages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getStockageByIdMarchandise = async (req, res) => {
  const { id_marchandise } = req.params;

  try {
    const stockages = await Stockage.find({ id_marchandise });

    if (!stockages || stockages.length === 0) {
      return res.status(404).json({ message: 'Aucun stockage trouvé pour cette marchandise' });
    }

    res.json(stockages);
  } catch (error) {
    console.error('Erreur lors de la récupération des stockages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getStockageByIdMarchandiseAndIdMagasin = async (req, res) => {
  const { id_marchandise, id_magasin } = req.params;

  try {
    const stockages = await Stockage.find({ id_marchandise, id_magasin });

    if (!stockages || stockages.length === 0) {
      return res.status(404).json({ message: 'Aucun stockage trouvé pour cette marchandise et ce magasin' });
    }

    res.json(stockages);
  } catch (error) {
    console.error('Erreur lors de la récupération des stockages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updatedStockage = async (req, res) => {
  const { id_magasin, id_marchandise, volume } = req.body;

  try {
    const updatedStockage = await Stockage.findByIdAndUpdate(
      req.params.id,
      { id_magasin, id_marchandise, volume },
      { new: true }
    );

    if (!updatedStockage) {
      return res.status(404).json({ message: "Stockage non trouvé" });
    }
    res.json({ message: "Stockage mis à jour avec succès", stockage: updatedStockage });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stockage:', error);
    res.status(400).json({ message: 'Erreur de mise à jour du stockage' });
  }
};

const deletedStockage = async (req, res) => {
  try {
    const deletedStockage = await Stockage.findByIdAndDelete(req.params.id);
    if (!deletedStockage) {
      return res.status(404).json({ message: "Stockage non trouvé" });
    }
    res.json({ message: "Stockage supprimé avec succès", stockage: deletedStockage });
  } catch (error) {
    console.error('Erreur lors de la suppression du stockage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
const deleteStockageByRef = async (req, res) => {
  try {
    const { id_magasin, id_marchandise } = req.params;

    const deleted = await Stockage.findOneAndDelete({
      id_magasin,
      id_marchandise
    });

    if (!deleted) {
      return res.status(404).json({ message: "Stockage introuvable pour cette référence." });
    }

    res.json({
      message: "Stockage supprimé avec succès.",
      stockage: deleted
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du stockage :", error);
    res.status(500).json({ message: "Erreur serveur." });
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
  updateStockageVolume,
  deleteStockageByRef
};
