import mongoose from 'mongoose';

const PointSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

export const Point = mongoose.model('Point', PointSchema);
