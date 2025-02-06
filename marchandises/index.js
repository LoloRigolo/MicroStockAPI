import express from "express";
import { connectDB } from "./shared/init_mongodb.js";
import { router } from "./routes/marchandiseRoutes.js";

const app = express();
const port = process.env.PORT || 3012;

app.use(express.json());

connectDB();

app.use("/marchandises", router);

app.listen(port, () => {
  console.log(
    `Service de marchandises est opérationnel sur http://localhost:${port}`
  );
});
