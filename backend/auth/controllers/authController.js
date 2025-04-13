require('dotenv').config();
const { hashPassword } = require('../services/authService');
const crypto = require('crypto');
const User = require('../models/user')
const { createJWT } = require('../services/jwt');
const { generateNonce } = require('../services/generateNonce');
const Token = require('../models/token');


const SECRET_KEY = process.env.SECRET_KEY;


const loginController = async (req, res) => {
  console.log('Login BODY →', req.body);
  const { username, password } = req.body;

  try {
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Username ou mot de passe incorrect' });
    }

    const hashedPassword = hashPassword(password, user.salt);
    if (hashedPassword !== user.password) {
      return res.status(400).json({ message: 'Username ou mot de passe incorrect' });
    }

    let existingToken = await Token.findOne({ userId: user._id });
    const currentTime = Date.now();

    if (existingToken) {
      if (currentTime < existingToken.expiresIn) {
        return res.status(200).json({ token: existingToken.token });
      } else {
        await Token.deleteOne({ userId: user._id });
      }
    }
    const tokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      issuedAt: currentTime,
      expiresIn: currentTime + 900 * 1000, // 15 minutes
      nonce: 0,
      proofOfWork: '',
    };

    const { nonce, proofOfWork } = generateNonce(tokenPayload);
    tokenPayload.nonce = nonce;
    tokenPayload.proofOfWork = proofOfWork;

    const token = createJWT(tokenPayload, SECRET_KEY);

    const newtoken = new Token(tokenPayload);
    await newtoken.save();

    return res.status(200).json({ token });
  } catch (err) {

    return res.status(500).json({ error: err.message });
  }
};

const quickLoginController = async (req, res) => {
  const { username, password } = req.params;

  if (!username || !password) {
    return res.status(400).json({ error: 'Nom d’utilisateur et mot de passe requis' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Username ou mot de passe incorrect' });
    }

    const hashedPassword = hashPassword(password, user.salt);
    if (hashedPassword !== user.password) {
      return res.status(400).json({ message: 'Username ou mot de passe incorrect' });
    }

    const currentTime = Date.now();
    const tokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      issuedAt: currentTime,
      expiresIn: currentTime + 900 * 1000,
      nonce: 0,
      proofOfWork: ''
    };

    const { nonce, proofOfWork } = generateNonce(tokenPayload);
    tokenPayload.nonce = nonce;
    tokenPayload.proofOfWork = proofOfWork;

    const token = createJWT(tokenPayload, SECRET_KEY);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const registerController = async (req, res) => {
  console.log("BODY REÇU →", req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d’utilisateur et mot de passe requis' });
    }
    
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Nom d’utilisateur déjà utilisé' });
      }
      
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = hashPassword(password, salt);
      
      const newUser = new User({
        username,
        password: hashedPassword,
        salt
      });
      
      await newUser.save();
      res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

const quickRegisterController = async (req, res) => {
  const { username, password } = req.params;

  if (!username || !password) {
    return res.status(400).json({ error: 'Nom d’utilisateur et mot de passe requis' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Nom d’utilisateur déjà utilisé' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      salt
    });

    await newUser.save();
    res.status(201).json({ message: 'Utilisateur enregistré avec succès (via URL)' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
  
const protectedController = async( req, res ) => {
  res.status(200).json({message: 'Bienvenue sur le tableau de bord !'});
};

module.exports = { loginController, registerController, protectedController,  quickRegisterController, quickLoginController };
