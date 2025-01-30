const Transfert = require('../models/transfert');
const { verifierExistance, getVolume, getId, envoyerDonnees, mettreAJourDonnees } = require ('../services/transfertService');

const createTransfert = async (req, res) => {
    const {id_magasin_source, id_magasin_dest, id_marchandise, volume } = req.body;

    if (!id_magasin_source || !id_magasin_dest || !id_marchandise || !volume) {
        return res.status(400).json({ message: "Des informations sont manquantes" });
    }
    
    try {
        const magasinSourceExiste = await verifierExistance(`http://host.docker.internal:3007/magasins/${id_magasin_source}`);
        const magasinDestExiste = await verifierExistance(`http://host.docker.internal:3007/magasins/${id_magasin_dest}`);
        if (!magasinSourceExiste || !magasinDestExiste) {
            return res.status(404).json({ message: "un magasin n'existe pas" });
        }
        console.log("------magasins OK------");
        const marchandiseExiste = await verifierExistance(`http://host.docker.internal:3012/marchandises/${id_marchandise}`);
        if (!marchandiseExiste) {
            return res.status(404).json({ message: "La marchandise avec cet ID n'existe pas" });
        }
        const stockageSourceExiste = await verifierExistance(`http://host.docker.internal:3013/stockage/marchandise/${id_marchandise}/magasin/${id_magasin_source}`);
        const stockageSourceSuffisant = await getVolume(`http://host.docker.internal:3013/stockage/marchandise/${id_marchandise}/magasin/${id_magasin_source}`);
        if (!stockageSourceExiste || volume > stockageSourceSuffisant) {
            return res.status(400).json({ message: "Stockage insuffisant ou inexistant avec cet ID" });
        }
        console.log("------marchandises dispo------")
        const volumeUpdate = mettreAJourDonnees(``)
        const stockageDestExiste = await verifierExistance(`http://host.docker.internal:3013/stockage/marchandise/${id_marchandise}/magasin/${id_magasin_dest}`);
        if (!stockageDestExiste) {
            console.log("------Stockage dest indispo------")
            const dataStockageDest = {
                id_magasin : `${id_magasin_dest}`,
                id_marchandise : `${id_marchandise}`,
                volume : `${volume}`
            }
            envoyerDonnees(`http://host.docker.internal:3014/stockage`, dataStockageDest)
                .then((reponse) => {
                    console.log('Réponse du serveur :', reponse);
                })
                .catch((err) => {
                    console.error('Erreur :', err.message);
                }); 
        }
        else {
            const StockageDest = await getVolume(`http://host.docker.internal:3013/stockage/marchandise/${id_marchandise}/magasin/${id_magasin_dest}`);
            const id_StockageDest = await getId(`http://host.docker.internal:3013/stockage/marchandise/${id_marchandise}/magasin/${id_magasin_dest}`);
            const dataStockageDest = {
                id_magasin : `${id_magasin_dest}`,
                id_marchandise : `${id_marchandise}`,
                volume : `${volume + StockageDest}`
            }
            mettreAJourDonnees(`http://host.docker.internal:3013/stockage/${id_StockageDest}`, dataStockageDest)
                .then((reponse) => {
                    console.log('Réponse du serveur :', reponse);
                })
                .catch((err) => {
                    console.error('Erreur :', err.message);
                });
        }
        const newTransfert = new Transfert({ id_magasin_source, id_magasin_dest, id_marchandise, volume });
        const savedTransfert = await newTransfert.save();
        res.status(201).json({ message: "transfert ajoutée avec succès", transfert: savedTransfert });
    } catch (error) {
        console.error('Erreur lors de la création du transfert:', error);
        res.status(400).json({ message: 'Erreur de création du transfert' });
    }
};

const getAllTransfert = async (req, res) => {
    try {
        const transfert = await Transfert.find();
        res.json(transfert);
    } catch (error) {
        console.error('Erreur lors de la récupération des transfert:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { createTransfert, getAllTransfert };