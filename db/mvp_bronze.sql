-- ===============================
-- MVP Bronze - Sistema Portaria
-- VISITANTES e VISITAS
-- ===============================

-- --------- TABELA: visitantes ----------
CREATE TABLE IF NOT EXISTS visitantes (
  id         SERIAL PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  documento  VARCHAR(30),
  criado_em  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- --------- TABELA: visitas -------------
CREATE TABLE IF NOT EXISTS visitas (
  id            SERIAL PRIMARY KEY,
  visitante_id  INT NOT NULL REFERENCES visitantes(id) ON DELETE RESTRICT,
  morador_texto VARCHAR(100) NOT NULL,  -- "Bloco B, ap 12B"
  placa         VARCHAR(10),
  data_entrada  TIMESTAMP NOT NULL DEFAULT NOW(),
  data_saida    TIMESTAMP,
  status        VARCHAR(10) NOT NULL,   -- "dentro" | "fora"
  criado_em     TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_visitas_status CHECK (
    (status = 'dentro' AND data_saida IS NULL) OR
    (status = 'fora'   AND data_saida IS NOT NULL)
  )
);

-- --------- ÍNDICES ----------------------
CREATE INDEX IF NOT EXISTS ix_visitas_status        ON visitas(status);
CREATE INDEX IF NOT EXISTS ix_visitas_data_entrada  ON visitas(data_entrada);
CREATE INDEX IF NOT EXISTS ix_visitas_visit_morador ON visitas(visitante_id, morador_texto);
