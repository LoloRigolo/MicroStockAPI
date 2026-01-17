const mongoose = require('mongoose');
require('dotenv').config();

const URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_BDD}`;
console.log('Connecting to:', URI);

const connectDB = async () => {
    try {
        console.log('Connecting to:', URI);
        await mongoose.connect(URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
