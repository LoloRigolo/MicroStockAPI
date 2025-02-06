import mongoose from "mongoose";

const marchandiseSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  prix: { type: Number, required: true },
});

const Marchandise = mongoose.model("marchandise", marchandiseSchema);

export { Marchandise };
