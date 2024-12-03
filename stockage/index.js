const express = require('express');
const http = require('http');
const https = require('https');
const connectDB = require('./shared/init_mongodb');
const Stockage = require('./models/stockage');
const stockage = require('./models/stockage');
const app = express();
const port = process.env.PORT || 3013;

app.use(express.json());

connectDB();

const verifierExistance = (url) => {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;

        const req = lib.get(url, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else if (res.statusCode === 404) {
                resolve(false);
            } else {
                reject(new Error(`Erreur HTTP: ${res.statusCode}`));
            }
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
};

app.get("/stockage", async (req, res) => {
    try {
        const stockage = await Stockage.find();
        res.json(stockage);
    } catch (error) {
        console.error('Erreur lors de la récupération des stockage:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.get('/stockage/:id', async (req, res) => {
    try {
        const stockage = await Stockage.findById(req.params.id);
        if (!stockage) {
            return res.status(404).json({ message: 'Stockage non trouvée' });
        }
        res.json(stockage);
    } catch (error) {
        console.error('Erreur lors de la récupération du stockage:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/stockage', async (req, res) => {
    const { id_magasin, id_marchandise, volume } = req.body;

    if (!id_magasin || !id_marchandise || !volume) {
        return res.status(400).json({ message: "Des informations sont manquantes" });
    }

    try {
        const magasinExiste = await verifierExistance(`http://localhost:3007/magasins/${id_magasin}`);
        if (!magasinExiste) {
            return res.status(404).json({ message: "Le magasin avec cet ID n'existe pas" });
        }

        const marchandiseExiste = await verifierExistance(`http://localhost:3012/marchandises/${id_marchandise}`);
        if (!marchandiseExiste) {
            return res.status(404).json({ message: "La marchandise avec cet ID n'existe pas" });
        }

        const newStockage = new Stockage({ id_magasin, id_marchandise, volume });
        const savedStockage = await newStockage.save();
        res.status(201).json({ message: "stockage ajoutée avec succès", stockage: savedStockage });
    } catch (error) {
        console.error('Erreur lors de la création du stockage:', error);
        res.status(400).json({ message: 'Erreur de création du stockage' });
    }
});

app.put('/stockage/:id', async (req, res) => {
    const { id_magasin, id_marchandise, volume } = req.body;

    if (!id_magasin || !id_marchandise || !volume) {
        return res.status(400).json({ message: "Des informations sont manquantes" });
    }

    try {
        const updatedStockage = await Stockage.findByIdAndUpdate(req.params.id, { id_magasin, id_marchandise, volume }, { new: true });
        if (!updatedStockage) {
            return res.status(404).json({ message: "Stockage non trouvée" });
        }
        res.json({ message: "Stockage mise à jour avec succès", stockage: updatedStockage });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du stockage:', error);
        res.status(400).json({ message: 'Erreur de mise à jour du stockage' });
    }
});

app.delete('/stockage/:id', async (req, res) => {
    try {
        const deletedStockage = await Stockage.findByIdAndDelete(req.params.id);
        if (!deletedStockage) {
            return res.status(404).json({ message: "Stockage non trouvée" });
        }
        res.json({ message: "Stockage supprimée avec succès", stockage: deletedStockage });
    } catch (error) {
        console.error('Erreur lors de la suppression du stockage:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


app.listen(port, () => {
    console.log(`Service de Stockage est opérationnel sur http://localhost:${port}`);
});
