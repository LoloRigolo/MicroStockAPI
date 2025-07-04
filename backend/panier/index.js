const express = require("express");
const connectDB = require("./shared/init_mongodb");
const panierRoutes = require("./routes/panierRoutes");

const app = express();
const port = process.env.PORT || 3020;

app.use(express.json());

connectDB();

app.use("/panier", panierRoutes);

app.listen(port, () => {
  console.log(`Panier micro-service is running on http://localhost:${port}`);
});
