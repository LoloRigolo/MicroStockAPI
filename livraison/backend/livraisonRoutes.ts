import express, { Router } from "express";

import {
    createRelay,
    getAllRelay,
    getRelayById,
    updateRelay,
    deleteRelay,
} from './livraisonController';

export const livraisonRoutes = express.Router();

livraisonRoutes.post('/', createRelay);
livraisonRoutes.get('/', getAllRelay);
livraisonRoutes.get('/:id', getRelayById);
livraisonRoutes.put('/:id', updateRelay);
livraisonRoutes.delete('/delete/:id', deleteRelay);