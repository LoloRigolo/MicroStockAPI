const express = require('express');
const connectDB = require('./shared/init_monogdb');

const Magasin = require('./models/magasin');
const app = express();
const port = process.env.PORT || 3007;

app.use(express.json());

connectDB();

app.post("/magasins", async (req, res) => {
    try {
        const newMagasin = new Magasin({
            nom: req.body.nom,
            adresse: req.body.adresse
        });

        const savedMagasin = await newMagasin.save();
        res.status(201).json(savedMagasin);
    } catch (error) {
        console.error('Erreur lors de la création du magasin:', error);
        res.status(400).json({ message: 'Erreur de création du magasin' });
    }
});

app.get("/magasins", async (req, res) => {
    try {
        const magasins = await Magasin.find();
        res.json(magasins);
    } catch (error) {
        console.error('Erreur lors de la récupération des magasins:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.listen(port, () => {
    console.log(`Magasin micro-service is running on http://localhost:${port}`);
});
