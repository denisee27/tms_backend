const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const db = require("./config/db.config.js");
const routes = require("./routes/main.routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync()
  .then(() => {
    console.log("Synced db");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}.`)
})

module.exports = app;
