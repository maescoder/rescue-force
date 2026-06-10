import mysql from 'mysql2/promise';
import fs from 'fs';

async function init() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'mysql-126b7440-hpspap00-6229.i.aivencloud.com',
    port: 20159,
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'defaultdb',
    multipleStatements: true
  });

  console.log("Connected to Aiven DB!");
  
  const sql = fs.readFileSync('../api/sql/production_master.sql', 'utf8');
  
  try {
    await connection.query(sql);
    console.log("All tables created successfully!");
  } catch (err) {
    console.error("SQL Error:", err);
  }
  
  await connection.end();
}

init();
