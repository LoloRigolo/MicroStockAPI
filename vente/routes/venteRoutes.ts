import express from "express";
import {
  getAllVente,
  createVente,
  getVenteByIdClient,
} from "../controllers/venteController";

const venteRoutes = express.Router();

venteRoutes.get("/", getAllVente);
venteRoutes.post("/", createVente);
venteRoutes.get("/client/:id_client", getVenteByIdClient);

export default venteRoutes;
