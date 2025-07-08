const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3015;

app.use(cors());
app.use('/uploads', express.static('uploads'));


if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier envoyé.' });
  }

  res.json({
    message: 'Image uploadée avec succès !',
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

app.listen(port, () => {
  console.log(`✅ Microservice stockage-images running on http://localhost:${port}`);
});
