var express = require("express");
var app = express();
var server = require("http").createServer(app).listen(3000);
var io = require("socket.io")(server);
var db = require("./config/db/db");
const ProductAPI = require("./Produit");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SOCKET IO NOTIFICATIONS
io.on("connection", (socket) => {
  socket.on("notification", (msg) => {
    io.emit("notification", msg);
    console.log(msg);
  });
});
app.use("/api", ProductAPI);
