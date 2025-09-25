
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");


router.post('/checkin', async (req, res) => {
  const { visitante_id, morador_texto, placa } = req.body;

  if (!visitante_id || !morador_texto) {
    throw new AppError("visitante_id e morador_texto são obrigatórios", {
      status: 400,
      code: "VALIDATION_ERROR",
      details: [
        ...(visitante_id ? [] : [{ path: ["visitante_id"], message: "Obrigatório" }]),
        ...(morador_texto ? [] : [{ path: ["morador_texto"], message: "Obrigatório" }]),
      ]
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    
    const visitante = await client.query('SELECT id FROM visitantes WHERE id=$1', [visitante_id]);
    if (visitante.rowCount === 0) {
      throw new AppError("visitante_id não encontrado", {
        status: 422,
        code: "FK_VIOLATION"
      });
    }
    
    const ativo = await client.query(
      `SELECT 1 FROM visitas WHERE visitante_id=$1 AND status='dentro' AND data_saida IS NULL`,
      [visitante_id]
    );
    if (ativo.rowCount > 0) {
      throw new AppError("Já existe check-in ativo para este visitante", {
        status: 409,
        code: "CONFLICT_ACTIVE_CHECKIN"
      });
    }
 
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
    throw err;
  } finally {
    client.release();
  }
});

module.exports = router;
