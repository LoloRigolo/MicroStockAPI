const express = require('express');
const connectDB = require('./shared/init_mongodb');
const magasinRoutes = require('./routes/magasinRoutes');

const app = express();
const port = process.env.PORT || 3007;

app.use(express.json());

connectDB();

app.use('/magasins', magasinRoutes);

app.listen(port, () => {
    console.log(`Magasin micro-service is running on http://localhost:${port}`);
});
