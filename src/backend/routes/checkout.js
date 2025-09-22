const express = require('express');
const router = express.Router();
const pool = require('../config/db');


router.post('/checkout/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE visitas
          SET status = 'fora',
              data_saida = NOW()
        WHERE id = $1 AND status = 'dentro'
        RETURNING id, visitante_id, status, data_entrada, data_saida`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'nenhuma visita ativa encontrada para este id' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro interno ao processar checkout' });
  }
});

module.exports = router;
