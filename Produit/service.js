const Produit = require("./model");

module.exports = {
  // CREATE

  create: async (createProduct) => {
    const produit = new Produit(createProduct);
    try {
      await produit.save();
      return produit;
    } catch (e) {
      throw Error("Error while Creating Produit");
    }
  },

  // READ ALL + FILTRE
  read: (query) => {
    try {
      let dbQuery = Produit;
      if (query.id !== undefined && query.id !== "") {
        dbQuery = dbQuery.findById(query.id).orFail("Product not found");
      } else if (query.libelle !== undefined && query.libelle !== "") {
        dbQuery = dbQuery.findOne({ Libelle: query.libelle });
      } else if (query.prix !== undefined && query.prix !== "") {
        dbQuery = dbQuery.findOne({ Prix: query.prix });
      } else if (query.quantite !== undefined && query.quantite !== "") {
        dbQuery = dbQuery.findOne({ Quantite: query.quantite });
      } else if (query.designation !== undefined && query.designation !== "") {
        dbQuery = dbQuery.findOne({ Designation: query.designation });
      } else {
        console.log("test");
        dbQuery = dbQuery.find();
      }
      return dbQuery.exec();
    } catch (e) {
      if (e.name === "Product not found") {
        throw notFoundError;
      }
      throw e;
    }
  },
  // UPDATE
  update: async (id, ProductBody) => {
    try {
      const produit = Produit.findByIdAndUpdate(id, ProductBody, { new: true });
      return produit;
    } catch (error) {
      console.error(error);
    }
  },

  // DELETE

  delete: async (req, res) => {
    Produit.findByIdAndDelete(req.params.id)
      .then((produit) => {
        if (!produit) {
          return res.status(404).send("Produit introuvable.");
        }

        sendNotification("Le Produit a été supprimé ");
        res.send("Produit supprimé.");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Erreur lors de la suppression du produit.");
      });
  },
};
