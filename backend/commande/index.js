const express = require("express");
const connectDB = require("./shared/init_mongodb");
const commandeRoutes = require("./routes/commandeRoutes");

const app = express();
const port = process.env.PORT || 3021;

app.use(express.json());

connectDB();

app.use("/commandes", commandeRoutes);

app.listen(port, () => {
  console.log(`commande micro-service is running on http://localhost:${port}`);
});
