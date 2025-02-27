import express from "express";
import "dotenv/config";
import { connectDB } from "./services/init_mongodb";
import venteRoutes from "./routes/venteRoutes";

const app = express();
const port = process.env.PORT || 3015;

app.use(express.json());

connectDB();

app.use("/vente", venteRoutes);

app.listen(port, () => {
  console.log(`Service de Vente est opérationnel sur http://localhost:${port}`);
});
