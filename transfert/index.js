const express = require('express');
const connectDB = require('./shared/init_mongodb');
const transfertRoutes = require('./routes/transfertRoutes')

const app = express();
const port = process.env.PORT || 3004;


app.use(express.json());

connectDB();

app.use('/transfert', transfertRoutes);

app.listen(port, () => {
    console.log(`Service de Transfert est opérationnel sur http://localhost:${port}`);
});
