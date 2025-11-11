const mysql = require('mysql2/promise');

async function checkDB() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'MindUP',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('=== CHATS ===');
    const [chats] = await pool.query('SELECT * FROM chats');
    console.log(chats);

    console.log('\n=== MENSAGENS ===');
    const [mensagens] = await pool.query('SELECT * FROM mensagens');
    console.log(mensagens);

    console.log('\n=== SEGUIDORES ===');
    const [seguidores] = await pool.query('SELECT * FROM seguidores');
    console.log(seguidores);

    console.log('\n=== USUARIOS ===');
    const [usuarios] = await pool.query('SELECT id, nome, email FROM usuarios');
    console.log(usuarios);

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    pool.end();
  }
}

checkDB();
