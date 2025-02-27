import mongoose, { Schema, Document, Types } from "mongoose";

interface IVente extends Document {
  id_client: Types.ObjectId;
  id_marchandise: Types.ObjectId;
  id_magasin: Types.ObjectId;
  quantite: number;
  price: number;
  tva: number;
  date: Date;
}

const VenteSchema: Schema = new Schema({
  id_client: { type: Types.ObjectId, required: true },
  id_marchandise: { type: Types.ObjectId, required: true },
  id_magasin: { type: Types.ObjectId, required: true },
  quantite: { type: Number, require: true, min: 0 },
  price: { type: Number, require: true, min: 0 },
  tva: { type: Number, require: true, min: 0 },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IVente>("Vente", VenteSchema);
