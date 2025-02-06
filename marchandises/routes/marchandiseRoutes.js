import express from "express";
import {
  createMarchandise,
  getAllMarchandises,
  getMarchandiseById,
  updatedMarchandise,
  deletedMarchandise,
} from "../controllers/marchandiseController.js";

const router = express.Router();

router.post("/", createMarchandise);
router.get("/", getAllMarchandises);
router.get("/:id", getMarchandiseById);
router.put("/:id", updatedMarchandise);
router.delete("/:id", deletedMarchandise);

export { router };
