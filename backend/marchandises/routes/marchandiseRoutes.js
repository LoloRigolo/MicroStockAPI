const express = require('express');
const {
    createMarchandise, 
    getAllMarchandises, 
    getMarchandiseById, 
    updatedMarchandise, 
    deletedMarchandise
} = require('../controllers/marchandiseController')

const router = express.Router();

router.post('/', createMarchandise);
router.get('/', getAllMarchandises);
router.get('/:id', getMarchandiseById);
router.put('/:id', updatedMarchandise);
router.delete('/:id', deletedMarchandise);

module.exports = router;
