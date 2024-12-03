const express = require('express');
const {
    createMagasin,
    getAllMagasins,
    getMagasinById,
    updateMagasin,
    deleteMagasin,
} = require('../controllers/magasinController');

const router = express.Router();

router.post('/', createMagasin);
router.get('/', getAllMagasins);
router.get('/:id', getMagasinById);
router.put('/:id', updateMagasin);
router.delete('/:id', deleteMagasin);

module.exports = router;
