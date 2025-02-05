import express from "express";
import {
  createTransfert,
  getAllTransfert,
} from "../controllers/transfertController.js";

const router = express.Router();

router.post("/", createTransfert);
router.get("/", getAllTransfert);

export { router };
