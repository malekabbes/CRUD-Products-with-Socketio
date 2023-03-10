const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema(
  {
    Libelle: { type: String, required: true },
    Prix: { type: Number, required: true },
    Quantite: { type: Number, required: true },
    Designation: { type: String },
  },
  { timestamps: true }
);

const Produit = mongoose.model("Produit", produitSchema);

module.exports = Produit;
