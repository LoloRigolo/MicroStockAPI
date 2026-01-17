const express = require("express");
const router = express.Router();
const {
  createCommandeFromPanier,
  getCommandeById,
  getCommandesByUserId,
  updateCommandeStatus,
  getAllCommandes
} = require("../controllers/commandeController");

router.post("/from-panier/:id_panier", createCommandeFromPanier);
router.get("/", getAllCommandes);
router.get("/user/:user_id", getCommandesByUserId);
router.get("/:id", getCommandeById);
router.put("/:id/status", updateCommandeStatus);

module.exports = router;
