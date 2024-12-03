const express = require('express');
const {
    createStockage, 
    getAllStockage, 
    getStockageById, 
    updatedStockage, 
    deletedStockage
} = require('../controllers/stockageController');

const router = express.Router();

router.post('/', createStockage);
router.get('/', getAllStockage);
router.get('/:id', getStockageById);
router.put('/:id', updatedStockage);
router.delete('/:id', deletedStockage);

module.exports = router;
