const ProductService = require("./service");
const io = require("socket.io-client");

// Connect to the socket.io server
const socket = io("http://127.0.0.1:3000");
function sendNotification(msg) {
  socket.emit("notification", msg);
}
module.exports = {
  read: async (req, res) => {
    try {
      const result = await ProductService.read(req.query);
      res.status(200).send(result);
    } catch (e) {
      res.status(400).json(e);
    }
  },
  // TRI
  filter: async (req, res) => {
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
  },
  // CREATE
  create: async (req, res) => {
    try {
      console.log(req.body);

      const result = await ProductService.create(req.body);
      res.status(200).send(result);
      sendNotification("Produit ajouté");
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },
  // UPDATE
  update: async (req, res) => {
    try {
      const result = await ProductService.update(req.params.id, req.body);
      res.status(200).send(result);
      sendNotification("Produit modifié");
    } catch (e) {
      res.status(400).json(e);
    }
  },
};
