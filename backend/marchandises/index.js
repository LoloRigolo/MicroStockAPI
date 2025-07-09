const express = require('express');
const connectDB = require('./shared/init_mongodb');
const marchandiseRoutes = require('./routes/marchandiseRoutes');
const path = require('path');

const app = express();

app.use(express.json());

// servir les images statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

connectDB();

app.use('/marchandises', marchandiseRoutes);

app.listen(3012, () => {
  console.log('Marchandise service running on port 3012');
});
