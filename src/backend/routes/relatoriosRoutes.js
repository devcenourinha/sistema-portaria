const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/relatorios', async (req, res) => {
  try {
    const { data } = req.query;
    if (!data) {
      return res.status(400).json({ error: "Parâmetro 'data' é obrigatório (YYYY-MM-DD)" });
    }

    
    const { rows: entradasRows } = await db.query(
      `SELECT COUNT(*)::int AS entradas
         FROM visitas
        WHERE DATE(data_entrada) = $1`,
      [data]
    );
    const entradas = entradasRows[0].entradas;

    
    const { rows: saidasRows } = await db.query(
      `SELECT COUNT(*)::int AS saidas
         FROM visitas
        WHERE DATE(data_saida) = $1`,
      [data]
    );
    const saidas = saidasRows[0].saidas;

    
    const { rows: registros } = await db.query(
      `SELECT
          vi.nome AS visitante,
          v.morador_texto,
          to_char(v.data_entrada, 'HH24:MI') AS entrada,
          to_char(v.data_saida, 'HH24:MI') AS saida
       FROM visitas v
       JOIN visitantes vi ON vi.id = v.visitante_id
       WHERE DATE(v.data_entrada) = $1
          OR DATE(v.data_saida) = $1
       ORDER BY v.data_entrada`,
      [data]
    );

    res.json({
      data,
      entradas,
      saidas,
      registros
    });
  } catch (err) {
    console.error('Erro ao gerar relatório:', err);
    res.status(500).json({ error: 'Falha ao gerar relatório' });
  }
});

module.exports = router;
