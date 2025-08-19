const express = require("express");
const { json } = express;

const app = express();
const PORT = 5000;

app.use(json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Olá do backend!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
