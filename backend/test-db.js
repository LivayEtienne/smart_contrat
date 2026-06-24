const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'phpmyadmin',
  password: 'Simplon2124@',
  database: 'bcx_finance'
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur :', err);
    return;
  }
  console.log('Connexion réussie');
  connection.end();
});