require('dotenv').config();

const app = require("./app");

const PORT = 5000;

app.listen(PORT, () => {
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_NAME:", process.env.DB_NAME);
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
