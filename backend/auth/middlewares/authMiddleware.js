const { verifyJWT } = require('../services/jwt');
require('dotenv');
const Token = require('../models/token');
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyJWT(token, SECRET_KEY);
    if (!payload) {
      return res.status(401).json({ error: 'Token invalide' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

module.exports = { authMiddleware }
