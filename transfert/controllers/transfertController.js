import { transfert as Transfert } from "../models/transfert.js";
import "dotenv/config";
import {
  verifierExistence,
  getVolume,
  getId,
  envoyerDonnees,
  mettreAJourDonnees,
} from "../services/transfertService.js";

async function createTransfert(req, res) {
  const { id_magasin_source, id_magasin_dest, id_marchandise, volume } =
    req.body;

  if (!id_magasin_source || !id_magasin_dest || !id_marchandise || !volume) {
    return res
      .status(400)
      .json({ message: "Des informations sont manquantes" });
  }
  try {
    const magasinsAndMarchandises = await verifierExistence([
      `${process.env.MAGASIN_URL}/${id_magasin_source}`,
      `${process.env.MAGASIN_URL}/${id_magasin_dest}`,
      `${process.env.MARCHANDISE_URL}/${id_marchandise}`,
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_source}`,
    ]);
    if (magasinsAndMarchandises !== true) {
      return res.status(404).json({ message: magasinsAndMarchandises });
    }
    const stockageSourceSuffisant = await getVolume(
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_source}`
    );
    if (volume > stockageSourceSuffisant) {
      return res.status(400).json({
        message: "Stockage insuffisant ou inexistant avec cette marchandise",
      });
    }
    const id_StockageSource = await getId(
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_source}`
    );
    const dataVolumeUpdate = {
      id_magasin: `${id_magasin_source}`,
      id_marchandise: `${id_marchandise}`,
      volume: stockageSourceSuffisant - volume,
    };
    console.log("volume :" + dataVolumeUpdate.volume);
    await mettreAJourDonnees(
      `${process.env.STOCKAGE_URL}/${id_StockageSource}`,
      dataVolumeUpdate
    );

    const stockageDestExiste = await verifierExistence([
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_dest}`,
    ]);
    if (!stockageDestExiste) {
      const dataStockageDest = {
        id_magasin: `${id_magasin_dest}`,
        id_marchandise: `${id_marchandise}`,
        volume: volume,
      };
      await envoyerDonnees(`${process.env.STOCKAGE_URL}`, dataStockageDest);
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
        volume: volume + StockageDest,
      };
      await mettreAJourDonnees(
        `${process.env.STOCKAGE_URL}/${id_StockageDest}`,
        dataStockageDest
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
      message: "Transfert ajouté avec succès",
      transfert: savedTransfert,
    });
  } catch (error) {
    console.error("Erreur lors de la création du transfert:", error);
    res
      .status(500)
      .json({ message: "Erreur interne lors de la création du transfert" });
  }
}

async function getAllTransfert(res) {
  try {
    const transfert = await Transfert.find();
    res.json(transfert);
  } catch (error) {
    console.error("Erreur lors de la récupération des transfert:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export { createTransfert, getAllTransfert };
