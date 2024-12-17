const express = require('express');
const connectDB = require('./shared/init_mongodb');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3010;

app.use(express.json());
connectDB();

// Routes
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});