import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_BDD}`;

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(URI);
        console.log('MongoDB connected successfully');
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Erreur de connexion MongoDB:', error.message);
        } else {
            console.error('Erreur inconnue lors de la connexion MongoDB');
        }
        process.exit(1);
    }
};

