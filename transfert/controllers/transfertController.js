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
    const magasins_marchandises = await verifierExistence([
      `${process.env.MAGASIN_URL}/${id_magasin_source}`,
      `${process.env.MAGASIN_URL}/${id_magasin_dest}`,
      `${process.env.MARCHANDISE_URL}/${id_marchandise}`,
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_source}`,
    ]);
    if (!magasins_marchandises.success) {
      return res.status(404).json({ errors: magasins_marchandises.errors });
    }
    const stockage_source_suffisant = await getVolume(
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_source}`
    );
    if (volume > stockage_source_suffisant) {
      return res.status(400).json({
        message: "Stockage insuffisant ou inexistant avec cette marchandise",
      });
    }
    const id_StockageSource = await getId(
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_source}`
    );
    const data_volume_update = {
      id_magasin: `${id_magasin_source}`,
      id_marchandise: `${id_marchandise}`,
      volume: stockage_source_suffisant - volume,
    };
    console.log("volume :" + data_volume_update.volume);
    await mettreAJourDonnees(
      `${process.env.STOCKAGE_URL}/${id_StockageSource}`,
      data_volume_update
    );

    const stockage_dest_existe = await verifierExistence([
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_dest}`,
    ]);
    if (!stockage_dest_existe) {
      const data_stockage_dest = {
        id_magasin: `${id_magasin_dest}`,
        id_marchandise: `${id_marchandise}`,
        volume: volume,
      };
      await envoyerDonnees(`${process.env.STOCKAGE_URL}`, data_stockage_dest);
    } else {
      const stockage_dest = await getVolume(
        `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_dest}`
      );
      const id_stockage_dest = await getId(
        `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin_dest}`
      );
      const data_stockage_dest = {
        id_magasin: `${id_magasin_dest}`,
        id_marchandise: `${id_marchandise}`,
        volume: volume + stockage_dest,
      };
      await mettreAJourDonnees(
        `${process.env.STOCKAGE_URL}/${id_stockage_dest}`,
        data_stockage_dest
      );
    }
    const new_transfert = new Transfert({
      id_magasin_source,
      id_magasin_dest,
      id_marchandise,
      volume,
    });
    const saved_transfert = await new_transfert.save();
    res.status(201).json({
      message: "Transfert ajouté avec succès",
      transfert: saved_transfert,
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
