require("dotenv").config();
const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyze");
const translateRoute = require("./routes/translate");
const shopsRoute = require("./routes/shops");



const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api", shopsRoute);
// Routes
app.use("/analyze", analyzeRoute);
app.use("/translate", translateRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
