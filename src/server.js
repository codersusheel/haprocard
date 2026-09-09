const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`🚀 Haprocard API running on port ${PORT}`);
});