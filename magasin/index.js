import express from "express";
import { connectDB } from "./shared/init_mongodb.js";
import { router } from "./routes/magasinRoutes.js";

const app = express();
const port = process.env.PORT || 3007;

app.use(express.json());

connectDB();

app.use("/magasins", router);

app.listen(port, () => {
  console.log(`Magasin micro-service is running on http://localhost:${port}`);
});
