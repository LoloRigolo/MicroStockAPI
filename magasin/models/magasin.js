import mongoose from "mongoose";

const magasinSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  adresse: { type: String, required: true },
});

const Magasin = mongoose.model("magasin", magasinSchema);

export { Magasin };
