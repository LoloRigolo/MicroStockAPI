import express, { Application } from "express";
import { livraisonRoutes } from './backend/livraisonRoutes'
import { connectDB } from './backend/init_mongodb'

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3014", 10);

app.use(express.json());

connectDB();

app.use('/livraison', livraisonRoutes);

app.listen(PORT, () => {
    console.log(`Service is running on http://localhost:${PORT}`);
  });