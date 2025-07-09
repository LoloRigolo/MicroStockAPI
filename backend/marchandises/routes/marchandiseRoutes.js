const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createMarchandise,
  getAllMarchandises,
  getMarchandiseById,
  updatedMarchandise,
  deletedMarchandise 
} = require('../controllers/marchandiseController');

const router = express.Router();

// Configuration Multer


// ta route POST doit utiliser upload.single
router.post('/', createMarchandise);
router.get('/', getAllMarchandises);
router.get('/:id', getMarchandiseById);
router.put('/:id', updatedMarchandise);
router.delete('/:id', deletedMarchandise);

module.exports = router;
