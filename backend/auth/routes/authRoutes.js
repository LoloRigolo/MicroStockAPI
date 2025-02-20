const express = require('express');
const { registerController, loginController, protectedController } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware')

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/dashboard', authMiddleware, protectedController );

module.exports = router;
