const express = require("express");
const {
  createCommandeFromPanier,
  getCommandeById,
  getCommandesByUserId,
  updateCommandeStatus,
} = require("../controllers/commandeController");

const router = express.Router();

router.post("/from-panier/:id_panier", createCommandeFromPanier);
router.get("/:id", getCommandeById);
router.get("/user/:user_id", getCommandesByUserId);
router.put("/:id/status", updateCommandeStatus);

module.exports = router;
