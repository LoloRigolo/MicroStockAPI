const express = require('express');
const connectDB = require('./shared/init_mongodb');
const Marchandise = require('./models/marchandise');
const app = express();
const port = process.env.PORT || 3012;

app.use(express.json());

connectDB();

// Route GET pour récupérer toutes les marchandises
app.get("/marchandises", async (req, res) => {
    try {
        const marchandises = await Marchandise.find();
        res.json(marchandises);
    } catch (error) {
        console.error('Erreur lors de la récupération des marchandises:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route GET pour récupérer une marchandise par ID
app.get('/marchandises/:id', async (req, res) => {
    try {
        const marchandise = await Marchandise.findById(req.params.id);
        if (!marchandise) {
            return res.status(404).json({ message: 'Marchandise non trouvée' });
        }
        res.json(marchandise);
    } catch (error) {
        console.error('Erreur lors de la récupération de la marchandise:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route POST pour ajouter une nouvelle marchandise
app.post('/marchandises', async (req, res) => {
    const { nom, prix} = req.body;

    if (!nom || !prix) {
        return res.status(400).json({ message: "Des informations sont manquantes" });
    }

    try {
        const newMarchandise = new Marchandise({ nom, prix});
        const savedMarchandise = await newMarchandise.save();
        res.status(201).json({ message: "Marchandise ajoutée avec succès", marchandise: savedMarchandise });
    } catch (error) {
        console.error('Erreur lors de la création de la marchandise:', error);
        res.status(400).json({ message: 'Erreur de création de la marchandise' });
    }
});

// Route PUT pour mettre à jour une marchandise par ID
app.put('/marchandises/:id', async (req, res) => {
    const { nom, prix} = req.body;

    if (!nom || !prix) {
        return res.status(400).json({ message: "Des informations sont manquantes" });
    }

    try {
        const updatedMarchandise = await Marchandise.findByIdAndUpdate(req.params.id, { nom, prix}, { new: true });
        if (!updatedMarchandise) {
            return res.status(404).json({ message: "Marchandise non trouvée" });
        }
        res.json({ message: "Marchandise mise à jour avec succès", marchandise: updatedMarchandise });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la marchandise:', error);
        res.status(400).json({ message: 'Erreur de mise à jour de la marchandise' });
    }
});

// Route DELETE pour supprimer une marchandise par ID
app.delete('/marchandises/:id', async (req, res) => {
    try {
        const deletedMarchandise = await Marchandise.findByIdAndDelete(req.params.id);
        if (!deletedMarchandise) {
            return res.status(404).json({ message: "Marchandise non trouvée" });
        }
        res.json({ message: "Marchandise supprimée avec succès", marchandise: deletedMarchandise });
    } catch (error) {
        console.error('Erreur lors de la suppression de la marchandise:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.listen(port, () => {
    console.log(`Service de marchandises est opérationnel sur http://localhost:${port}`);
});
