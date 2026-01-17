const Panier = require("../models/panier");

const createPanier = async (req, res) => {
  try {
    const { user_id, articles } = req.body;

    if (!user_id || !Array.isArray(articles)) {
      return res.status(400).json({ message: "Données invalides" });
    }

    const article = articles[0];

    if (!article.article_id || !article.nom || article.prix == null || article.quantite == null) {
      return res.status(400).json({ message: "Article incomplet" });
    }

    let panier = await Panier.findOne({ user_id });

    if (!panier) {
      panier = new Panier({
        user_id,
        articles: [article],
      });
      await panier.save();
      return res.status(201).json(panier);
    }

    const existingArticle = panier.articles.find(
      (a) => a.article_id === article.article_id
    );

    if (existingArticle) {
      existingArticle.quantite += article.quantite;
    } else {
      panier.articles.push(article);
    }

    await panier.save();

    return res.status(200).json(panier);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getAllPaniers = async (req, res) => {
  try {
    const paniers = await Panier.find();
    res.status(200).json(paniers);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getPanierById = async (req, res) => {
  try {
    const { id } = req.params;
    const panier = await Panier.findById(id);

    if (!panier) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    res.status(200).json(panier);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const updatePanier = async (req, res) => {
  try {
    const { id } = req.params;
    const { articles } = req.body;

    const panier = await Panier.findByIdAndUpdate(
      id,
      { articles },
      { new: true, runValidators: true }
    );

    if (!panier) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    res.status(200).json(panier);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const deletePanier = async (req, res) => {
  try {
    const { id } = req.params;
    const panier = await Panier.findByIdAndDelete(id);

    if (!panier) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    res.status(200).json({ message: "Panier supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getPaniersByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    let paniers = await Panier.find({ user_id });

    if (!paniers || paniers.length === 0) {
      const newPanier = new Panier({
        user_id,
        articles: [],
      });
      await newPanier.save();

      return res.status(200).json([newPanier]);
    }

    res.status(200).json(paniers);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


module.exports = {
  createPanier,
  getAllPaniers,
  getPanierById,
  updatePanier,
  deletePanier,
  getPaniersByUserId,
};
