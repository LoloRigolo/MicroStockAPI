const express = require('express');
const {
    createStockage, 
    getAllStockage, 
    getStockageById,
    getStockageByIdMagasin,
    getStockageByIdMarchandise,
    getStockageByIdMarchandiseAndIdMagasin,
    updatedStockage,
    deletedStockage,
    updateStockageVolume,
    deleteStockageByRef
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
router.delete('/magasin/:id_magasin/marchandise/:id_marchandise', deleteStockageByRef);

router.patch('/:id/volume', updateStockageVolume);


module.exports = router;
