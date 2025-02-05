import mongoose from "mongoose";

const transfertSchema = new mongoose.Schema(
  {
    id_magasin_source: { type: String, required: true },
    id_magasin_dest: { type: String, required: true },
    id_marchandise: { type: String, required: true },
    volume: { type: Number, required: true },
  },
  { timestamps: true }
);

export const transfert = mongoose.model("transfert", transfertSchema);
