const express = require('express');
const {
    createStockage, 
    getAllStockage, 
    getStockageById,
    getStockageByIdMagasin,
    getStockageByIdMarchandise,
    getStockageByIdMarchandiseAndIdMagasin,
    updatedStockage,
    deletedStockage
} = require('../controllers/stockageController');

const router = express.Router();

router.post('/', createStockage);
router.get('/', getAllStockage);
router.get('/:id', getStockageById);
router.get('/magasin/:id_magasin', getStockageByIdMagasin)
router.get('/marchandise/:id_marchandise', getStockageByIdMarchandise)
router.get('/marchandise/:id_marchandise/magasin/:id_magasin', getStockageByIdMarchandiseAndIdMagasin)
router.put('/:id', updatedStockage);
router.delete('/:id', deletedStockage);


module.exports = router;
