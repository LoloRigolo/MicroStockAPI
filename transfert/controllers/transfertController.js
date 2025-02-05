const Transfert = require("../models/transfert");
require("dotenv").config();
const {
  verifierExistance,
  getVolume,
  getId,
  envoyerDonnees,
  mettreAJourDonnees,
} = require("../services/transfertService");

async function createTransfert(req, res) {
  const { id_magasin_source, id_magasin_dest, id_marchandise, volume } =
    req.body;

  if (!id_magasin_source || !id_magasin_dest || !id_marchandise || !volume) {
    return res
      .status(400)
      .json({ message: "Des informations sont manquantes" });
  }

  try {
    const magasinSourceExiste = await verifierExistance(
      `${process.env.MAGASIN_URL}/${id_magasin_source}`
    );
    const magasinDestExiste = await verifierExistance(
      `${process.env.MAGASIN_URL}/${id_magasin_dest}`
    );
    if (!magasinSourceExiste || !magasinDestExiste) {
      return res.status(404).json({ message: "un magasin n'existe pas" });
    }
    const marchandiseExiste = await verifierExistance(
      `${process.env.MARCHANDISE_URL}/${id_marchandise}`
    );
    if (!marchandiseExiste) {
      return res
        .status(404)
        .json({ message: "La marchandise avec cet ID n'existe pas" });
    }
    const stockageSourceExiste = await verifierExistance(
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_source}`
    );
    const stockageSourceSuffisant = await getVolume(
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_source}`
    );
    if (!stockageSourceExiste || volume > stockageSourceSuffisant) {
      return res
        .status(400)
        .json({ message: "Stockage insuffisant ou inexistant avec cet ID" });
    }
    const id_StockageSource = await getId(
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_source}`
    );
    const dataVolumeUpdate = {
      id_magasin: `${id_magasin_source}`,
      id_marchandise: `${id_marchandise}`,
      volume: stockageSourceSuffisant - volume,
    };
    console.log(dataVolumeUpdate);
    const volumeUpdate = await mettreAJourDonnees(
      `${process.env.STOCKAGE_URL}/${id_StockageSource}`,
      dataVolumeUpdate
    );
    try {
      const stockageDestExiste = await verifierExistance(
        `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_dest}`
      );
      console.log(volumeUpdate);
      if (!stockageDestExiste) {
        const dataStockageDest = {
          id_magasin: `${id_magasin_dest}`,
          id_marchandise: `${id_marchandise}`,
          volume: `${volume}`,
        };
        envoyerDonnees(`${process.env.STOCKAGE_URL}`, dataStockageDest)
          .then((reponse) => {
            console.log("Réponse du serveur :", reponse);
          })
          .catch((err) => {
            console.error("Erreur :", err.message);
          });
      } else {
        const StockageDest = await getVolume(
          `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_dest}`
        );
        const id_StockageDest = await getId(
          `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_dest}`
        );
        const dataStockageDest = {
          id_magasin: `${id_magasin_dest}`,
          id_marchandise: `${id_marchandise}`,
          volume: `${volume + StockageDest}`,
        };
        mettreAJourDonnees(
          `${process.env.STOCKAGE_URL}/${id_StockageDest}`,
          dataStockageDest
        )
          .then((reponse) => {
            console.log("Réponse du serveur :", reponse);
          })
          .catch((err) => {
            console.error("Erreur :", err.message);
          });
      }
    } catch (error) {
      const dataVolumeUpdate = {
        id_magasin: `${id_magasin_source}`,
        id_marchandise: `${id_marchandise}`,
        volume: `${stockageSourceSuffisant}`,
      };
      const volumeUpdate = mettreAJourDonnees(
        `${process.env.STOCKAGE_URL}/${id_StockageSource}`,
        dataVolumeUpdate
      );
    }
    const newTransfert = new Transfert({
      id_magasin_source,
      id_magasin_dest,
      id_marchandise,
      volume,
    });
    const savedTransfert = await newTransfert.save();
    res.status(201).json({
      message: "transfert ajoutée avec succès",
      transfert: savedTransfert,
    });
  } catch (error) {
    console.error("Erreur lors de la création du transfert:", error);
    res.status(400).json({ message: "Erreur de création du transfert" });
  }
}

async function getAllTransfert(req, res) {
  try {
    const transfert = await Transfert.find();
    res.json(transfert);
  } catch (error) {
    console.error("Erreur lors de la récupération des transfert:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { createTransfert, getAllTransfert };
