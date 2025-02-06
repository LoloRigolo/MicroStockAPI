import express from "express";
import {
  createMagasin,
  getAllMagasins,
  getMagasinById,
  updateMagasin,
  deleteMagasin,
} from "../controllers/magasinController.js";

const router = express.Router();

router.post("/", createMagasin);
router.get("/", getAllMagasins);
router.get("/:id", getMagasinById);
router.put("/:id", updateMagasin);
router.delete("/:id", deleteMagasin);

export { router };
