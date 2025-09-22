require('dotenv').config();
console.log("PORT:", process.env.PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
const express = require("express");
const { json } = express;
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());           
app.use(express.json());     

const checkinRouter = require('./routes/checkin');
app.use('/api', checkinRouter);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Olá do backend!" });
});

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Teste para a rota /api/echo direto no PowerShell:
// Invoke-RestMethod -Method POST `
//   -Uri 'http://localhost:5000/api/echo' `
//   -ContentType 'application/json' `
//   -Body '{"msg":"teste"}'

app.post("/api/echo", (req, res) => {
  res.json({ youSent: req.body });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
