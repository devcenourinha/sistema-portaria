const express = require("express");
const cors = require("cors");

const checkinRoutes = require("./routes/checkin");
const checkoutRoutes = require("./routes/checkout");
const visitasRoutes = require("./routes/visitasRoutes");
const relatoriosRoutes = require("./routes/relatoriosRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());
app.use(cors());

app.use(checkinRoutes);
app.use(checkoutRoutes);
app.use(visitasRoutes);
app.use(relatoriosRoutes);

app.use(errorHandler);

module.exports = app;
