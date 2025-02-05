import express from "express";
import { connectDB } from "./shared/init_mongodb.js";
import { router } from "./routes/transfertRoutes.js";

const app = express();
const port = process.env.PORT || 3004;

app.use(express.json());

connectDB();

app.use("/transfert", router);

app.listen(port, () => {
  console.log(
    `Service de Transfert est opérationnel sur http://localhost:${port}`
  );
});
