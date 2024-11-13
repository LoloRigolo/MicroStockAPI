const express = require('express');
const connectDB = require('./shared/init_mongodb.js');
const crypto = require('crypto');
const Auth = require('./models/user.js');
const Token = require('./models/token.js');
const app = express();
const port = process.env.PORT || 3010;

app.use(express.json());

connectDB();

function hashPassword(password, salt) {
    return crypto
        .createHmac('sha256', salt)
        .update(password)
        .digest('hex');
}

function createToken(userId, role) {
    const issuedAt = Date.now();
    const expiresIn = issuedAt + 15 * 60 * 1000;
    let nonce = 0;
    let proofOfWork;

    do {
        proofOfWork = crypto.createHash('sha256')
            .update(userId + nonce + issuedAt.toString())
            .digest('hex');
        nonce++;
    } while (!proofOfWork.startsWith("000"));

    return new Token({
        userId,
        role,
        issuedAt,
        expiresIn,
        nonce: nonce - 1,
        proofOfWork
    });
}

app.post("/auth/register", async (req, res) => {
    try {
        const { role, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis ' });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        
        const hashedPassword = hashPassword(password, salt);

        const newUser = new Auth({
            role,
            email,
            password: hashedPassword,
            salt: salt
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur de création de l\'utilisateur' });
    }
});

app.post("/auth/login", async (req, res) => {
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
                role : token.role,
                issuedAt: token.issuedAt,
                expiresIn: token.expiresIn,
                nonce: token.nonce,
                proofOfWork: token.proofOfWork
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur de connexion' });
    }
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});