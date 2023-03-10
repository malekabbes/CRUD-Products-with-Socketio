const express = require("express");
const router = express.Router();
const ProduitController = require("./controller");

router
  .get("/products", ProduitController.read)
  .post("/create", ProduitController.create)
  .get("/filter", ProduitController.filter)
  .put("/update/:id", ProduitController.update);
//   .delete("/delete", ProduitController.delete);
module.exports = router;
