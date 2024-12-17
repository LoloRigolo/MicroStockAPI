import { Point } from './livraisonModel';
import { Request, Response } from 'express';

export const createRelay = async (req: Request, res: Response) => {
    try {
        const newPoint = new Point({
           nom: req.body.nom,
           lat: req.body.lat,
           lng: req.body.lng
        });

        const savedPoint = await newPoint.save();
        res.status(201).json(savedPoint);
    } catch (error) {
        console.error('Erreur lors de la création du Point relay:', error);
        res.status(400).json({ message: 'Erreur de création du Point relay' });
    }
};

export const getAllRelay = async (req: Request, res: Response) => {
    try {
        const points = await Point.find();
        res.json(points);
    } catch (error) {
        console.error('Erreur lors de la récupération des Points relay:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const getRelayById = async (req: Request, res: Response) :Promise<void> => {
    try {
        const point = await Point.findById(req.params.id);
        res.json(point);
    } catch (error) {
        console.error('Erreur lors de la récupération du Point relay:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const updateRelay = async (req: Request, res: Response) :Promise<void> => {
    try {
        const updatedMagasin = await Point.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(updatedMagasin);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du point relay:', error);
        res.status(400).json({ message: 'Erreur de mise à jour du point relay' });
    }
};

export const deleteRelay = async (req: Request, res: Response) :Promise<void> => {
    try {
        const deletedMagasin = await Point.findByIdAndDelete(req.params.id);
        res.json({ message: 'Point relay supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du point relay:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

