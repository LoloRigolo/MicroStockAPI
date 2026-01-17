const express = require('express');
const { registerController, loginController, protectedController ,  quickRegisterController,  quickLoginController } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware')

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/dashboard', authMiddleware, protectedController );
router.get('/register/:username/:password', quickRegisterController);
router.get('/login/:username/:password', quickLoginController);

module.exports = router;
