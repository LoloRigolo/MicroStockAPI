const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`);
});

app.get('/marchandises/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const marchandise = marchandises.find(u => u.id === id);
    if (marchandise) {
      res.json(marchandise);
    } else {
      res.status(404).json({ message: 'Marchandises non trouvé' });
    }
  });

  class Marchandise {
    constructor(id,nom, prix, volume) {
    this.id = id;
        this.nom = nom;
        this.prix = prix;
        this.volume = volume;
    }
}

let marchandises = [
    new Marchandise(0, "pomme", 1, 1),
    new Marchandise(1, "peche", 2, 1)
];