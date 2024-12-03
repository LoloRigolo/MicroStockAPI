const express = require('express');
const connectDB = require('./shared/init_mongodb');
const stockageRoutes = require('./routes/stockageRoutes')

const app = express();
const port = process.env.PORT || 3013;


app.use(express.json());

connectDB();

app.use('/stockage', stockageRoutes);

app.listen(port, () => {
    console.log(`Service de Stockage est opérationnel sur http://localhost:${port}`);
});
