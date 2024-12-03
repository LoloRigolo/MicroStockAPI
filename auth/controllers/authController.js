const Auth = require('../models/user');
const Token = require('../models/token');
const crypto = require('crypto');
const { hashPassword, createToken } = require('../services/authService');

const register = async (req, res) => {
    try {
        const { role, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = hashPassword(password, salt);

        const newUser = new Auth({ role, email, password: hashedPassword, salt });
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur de création de l\'utilisateur' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const hashedPassword = hashPassword(password, user.salt);
        if (hashedPassword !== user.password) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = createToken(user._id, user.role);
        await token.save();

        res.status(200).json({
            message: 'Connexion réussie',
            token: {
                userId: token.userId,
                role: token.role,
                issuedAt: token.issuedAt,
                expiresIn: token.expiresIn,
                nonce: token.nonce,
                proofOfWork: token.proofOfWork,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur de connexion' });
    }
};

module.exports = { register, login };
