const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/visitantes/ativos', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        v.id,
        json_build_object(
          'id', vi.id,
          'nome', vi.nome,
          'documento', vi.documento
        ) AS visitante,
        v.morador_texto,
        v.placa,
        v.data_entrada,
        v.status
      FROM visitas v
      JOIN visitantes vi ON vi.id = v.visitante_id
      WHERE v.status = 'dentro' AND v.data_saida IS NULL
      ORDER BY v.data_entrada DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar visitantes ativos:', err);
    res.status(500).json({ error: 'Falha ao listar visitantes ativos' });
  }
});

module.exports = router;
