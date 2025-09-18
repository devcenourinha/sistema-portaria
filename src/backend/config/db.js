const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema_portaria',
  password: 'admin1234',  
  port: 5432,
});

module.exports = pool;
