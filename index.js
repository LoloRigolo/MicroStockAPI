const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
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


app.get("/marchandises", (req, res) => {
  res.json(marchandises);
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


app.post('/marchandises/add', (req, res) => {
  const { id, nom, prix, volume } = req.body;

  if (!id || !nom || !prix || !volume) {
    return res.status(400).json({ message: "Des informations sont manquantes" });
  }

  const existingMarchandise = marchandises.find(u => u.id === id);

  if (existingMarchandise) {
    return res.status(400).json({ message: "Une marchandise avec cet ID existe déjà" });
  }

  const newMarchandise = new Marchandise(id, nom, prix, volume);
  marchandises.push(newMarchandise);

  res.status(201).json({ message: "Marchandise ajoutée avec succès", marchandise: newMarchandise });
});


app.put('/marchandises/:id', (req, res) => {
  const { id }  = req.params;
  const { nom, prix, volume } = req.body;

  if (!nom || !prix || !volume) {
    return res.status(400).json({ message: "Des informations sont manquantes" });
  }

  const existingMarchandise = marchandises.find(u => u.id === parseInt(id));

  if (existingMarchandise) {
    existingMarchandise.nom = nom;
    existingMarchandise.prix = prix;
    existingMarchandise.volume = volume;
    return res.status(200).json({ message: "Marchandise mise à jour avec succès", marchandise: existingMarchandise });

  } else {
    return res.status(404).json({ message: "Marchandise non trouvée" });
  }

});

app.delete('/marchandises/:id', (req, res) => {
  const { id } = req.params;
  const index = marchandises.findIndex(u => u.id === parseInt(id));
  
  if (index !== -1) {
    const deletedMarchandise = marchandises.splice(index, 1);
    return res.status(200).json({ message: "Marchandise supprimée avec succès", marchandise: deletedMarchandise[0] });

  } else {
    return res.status(404).json({ message: "Marchandise non trouvée" });
  }
});
    

app.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`);
});