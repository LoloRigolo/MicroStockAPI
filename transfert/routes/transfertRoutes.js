const express = require('express');
const { createTransfert, getAllTransfert } = require('../controllers/transfertController');

const router = express.Router();

router.post('/', createTransfert);
router.get('/', getAllTransfert);


module.exports = router;