const express = require("express");
const { json } = express;
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());           
app.use(express.json());     

app.use(json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Olá do backend!" });
});

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post("/api/echo", (req, res) => {
  res.json({ youSent: req.body });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
