// src/backend/routes/checkin.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/checkin
router.post('/checkin', async (req, res) => {
  const { visitante_id, morador_texto, placa } = req.body;

  if (!visitante_id || !morador_texto) {
    return res.status(400).json({ error: 'visitante_id e morador_texto são obrigatórios' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verifica se visitante existe
    const visitante = await client.query('SELECT id FROM visitantes WHERE id=$1', [visitante_id]);
    if (visitante.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(422).json({ error: 'visitante_id não encontrado' });
    }

    // Verifica se já tem check-in ativo
    const ativo = await client.query(
      `SELECT 1 FROM visitas WHERE visitante_id=$1 AND status='dentro' AND data_saida IS NULL`,
      [visitante_id]
    );
    if (ativo.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Já existe check-in ativo para este visitante' });
    }

    // Insere visita
    const insert = await client.query(
      `INSERT INTO visitas (visitante_id, morador_texto, placa, status)
       VALUES ($1,$2,$3,'dentro')
       RETURNING id, visitante_id, morador_texto, placa, status, data_entrada`,
      [visitante_id, morador_texto, placa || null]
    );

    await client.query('COMMIT');
    return res.status(201).json(insert.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro /api/checkin:', err);
    return res.status(500).json({ error: 'Erro interno ao processar check-in' });
  } finally {
    client.release();
  }
});

module.exports = router;
