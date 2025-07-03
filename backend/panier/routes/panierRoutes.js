const express = require("express");
const {
  createPanier,
  getAllPaniers,
  getPanierById,
  updatePanier,
  deletePanier,
  getPaniersByUserId,
} = require("../controllers/panierController");

const router = express.Router();

router.post("/", createPanier);
router.get("/", getAllPaniers);
router.get("/:id", getPanierById);
router.get("/user/:user_id", getPaniersByUserId);
router.put("/:id", updatePanier);
router.delete("/:id", deletePanier);

module.exports = router;
