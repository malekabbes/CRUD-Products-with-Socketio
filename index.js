var express = require("express");
var app = express();
var server = require("http").createServer(app).listen(3000);
var io = require("socket.io")(server);
var db = require("./config/db/db");
const mongoose = require("mongoose");
const Produit = require("./Produit/model");
const router = express.Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SOCKET IO NOTIFICATIONS
function sendNotification(msg) {
  io.emit("notification", msg);
  console.log(msg);
}
// CREATE
app.post("/produits", (req, res) => {
  const produit = new Produit({
    Libelle: req.body.libelle,
    Quantite: req.body.quantite,
    Prix: req.body.prix,
    Designation: req.body.prix,
  });

  produit
    .save()
    .then(() => {
      sendNotification("Produit ajouté");
      res.send("Produit ajouté.");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Erreur lors de l'ajout du produit.");
    });
});

// READ ALL + FILTRE
app.get("/produits", async (query, req, res) => {
  let dbQuery = Produit;
  if (query.libelle !== undefined && query.libelle !== "") {
    dbQuery = dbQuery
      .findOne({ Libelle: query.libelle })
      .orFail("Produit not Found");
  } else if (query.prix !== undefined && query.prix !== "") {
    dbQuery = dbQuery.findOne({ Prix: query.prix }).orFail("Produit not Found");
  } else if (query.quantite !== undefined && query.quantite !== "") {
    dbQuery = dbQuery
      .findOne({ Quantite: query.quantite })
      .orFail("Produit not Found");
  } else if (query.designation !== undefined && query.designation !== "") {
    dbQuery = dbQuery
      .findOne({ Designation: query.designation })
      .orFail("Produit not Found");
  } else {
    dbQuery = dbQuery.find();
  }
  return {
    data: await dbQuery
      .exec()
      .then((data) => res.json(data))
      .catch((err) => {
        console.log(err);
        res.status(500).send("Erreur lors de la récupération des produits.");
      }),
  };
});

// READ ONE
app.get("/produits/:id", (req, res) => {
  Produit.findById(req.params.id)
    .then((produit) => {
      if (!produit) {
        return res.status(404).send("Produit introuvable.");
      }

      res.json(produit);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Erreur lors de la récupération du produit.");
    });
});

// UPDATE
app.put("/produits/:id", (req, res) => {
  Produit.findByIdAndUpdate(req.params.id, {
    libelle: req.body.libelle,
    categorie: req.body.categorie,
    prix: req.body.prix,
  })
    .then((produit) => {
      if (!produit) {
        return res.status(404).send("Produit introuvable.");
      }

      sendNotification("Produit a été modifié.");
      res.send("Produit a été modifié.");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Erreur lors de la modification du produit.");
    });
});

// DELETE

app.delete("/produits/:id", (req, res) => {
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
});
// TRI
router.get("/trier", async (req, res) => {
  const { libelle, prix, quantite, designation } = req.query;

  const sortObj = {};
  if (libelle) {
    sortObj.Libelle = Number(libelle);
  }
  if (prix) {
    sortObj.Prix = Number(prix);
  }
  if (quantite) {
    sortObj.Quantite = Number(quantite);
  }
  if (designation) {
    sortObj.Designation = Number(designation);
  }

  try {
    const produitsTries = await Produit.find().sort(sortObj);
    sendNotification("Tri effectué");

    res.json(produitsTries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
