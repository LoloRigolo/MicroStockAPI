import { Request, Response } from "express";
import Vente from "../models/venteModel";
import {
  verifIfExist,
  checkQuantite,
  updateData,
} from "../services/venteServices";
import {
  IVerifResponse,
  IUpdateResponse,
} from "../models/serviceResponseInterface";

async function getAllVente(req: Request, res: Response) {
  try {
    const ventes: Array<typeof Vente> = await Vente.find();
    res.json(ventes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getVenteByIdClient(req: Request, res: Response) {
  const { id_client } = req.params;
  try {
    const ventes: Array<typeof Vente> = await Vente.find({ id_client });
    if (!ventes || ventes.length == 0) {
      return res
        .status(404)
        .json({ message: "Aucune vente n'a été réalisé pour ce client" });
    }
    res.json(ventes);
  } catch (error) {
    res.status(500).json("Erreur Serveur");
  }
}

async function createVente(req: Request, res: Response) {
  const { id_client, id_marchandise, id_magasin, quantite, price, tva } =
    req.body;
  if (
    !id_client ||
    !id_marchandise ||
    !id_magasin ||
    !quantite ||
    !price ||
    !tva
  ) {
    return res.status(400).json({ message: "Informations manquantes" });
  }
  try {
    const checkId: IVerifResponse = await verifIfExist([
      `${process.env.MAGASIN_URL}/${id_magasin}`,
      `${process.env.MARCHANDISE_URL}/${id_marchandise}`,
      `${process.env.USER_URL}/${id_client}`,
    ]);
    if (!checkId.success) {
      return res.status(404).json({ errors: checkId.errors });
    }
    const checkVolume: boolean = await checkQuantite(
      `${process.env.STOCKAGE_URL}//marchandise/${id_marchandise}/magasin/${id_magasin}`,
      quantite
    );
    if (!checkVolume) {
      return res
        .status(401)
        .json({ message: "Quantité insufisante dans le stockage" });
    }
    const updateStockage: IUpdateResponse = await updateData(
      `${process.env.STOCKAGE_URL}/marchandise/${id_marchandise}/magasin/${id_magasin}`,
      `${process.env.STOCKAGE_URL}`,
      quantite
    );
    console.log(updateStockage);
    if (!updateStockage.success) {
      res.status(401).json({ message: updateStockage.message });
    }
    const newVente = new Vente({
      id_client,
      id_marchandise,
      id_magasin,
      quantite,
      price,
      tva,
    });
    await newVente.save();
    res.status(201).json({ vente: newVente, storage: updateStockage.data });
  } catch (error) {
    res.status(500).json({ message: "Erreur Serveur" });
  }
}

export { getAllVente, createVente, getVenteByIdClient };
