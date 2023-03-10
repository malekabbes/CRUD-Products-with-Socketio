const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema({
  Libelle: { type: String, required: true },
  Prix: { type: String, required: true },
  Quantite: { type: Number, required: true },
  Designation: { type: Date, default: Date.now },
});

const Produit = mongoose.model("Produit", produitSchema);

module.exports = Produit;
