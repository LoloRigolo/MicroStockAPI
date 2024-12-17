const express = require('express');
const connectDB = require('./shared/init_mongodb');
const marchandiseRoutes = require('./routes/marchandiseRoutes');

const app = express();
const port = process.env.PORT || 3012;

app.use(express.json());

connectDB();

app.use('/marchandises', marchandiseRoutes);

app.listen(port, () => {
    console.log(`Service de marchandises est opérationnel sur http://localhost:${port}`);
});
