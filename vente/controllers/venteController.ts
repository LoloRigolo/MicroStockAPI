import { Request, Response } from "express";
import Vente from "../models/venteModel";

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
    const newVente = new Vente({
      id_client,
      id_marchandise,
      id_magasin,
      quantite,
      price,
      tva,
    });
    await newVente.save();
    res.status(201).json(newVente);
  } catch (error) {
    res.status(500).json({ message: "Erreur Serveur" });
  }
}

export { getAllVente, createVente, getVenteByIdClient };
