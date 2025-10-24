import pool from './src/config/db.js';
import bcrypt from 'bcrypt';

async function insertSampleData() {
  try {
    console.log('Inserindo dados de exemplo...');

    // Inserir usuário de exemplo
    const hashedPassword = await bcrypt.hash('123456', 10);
    const [userResult] = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha, bio, data_cadastro) VALUES (?, ?, ?, ?, NOW())',
      ['João Silva', 'joao@example.com', hashedPassword, 'Estudante de programação']
    );
    const userId = userResult.insertId;
    console.log('Usuário inserido com ID:', userId);

    // Inserir posts de exemplo
    const posts = [
      {
        titulo: 'Primeiro Post',
        conteudo: 'Este é meu primeiro post no Xestudos! Estou aprendendo muito sobre desenvolvimento web.',
        categoria_id: 1,
        autor_id: userId
      },
      {
        titulo: 'Aprendendo React',
        conteudo: 'Hoje aprendi sobre hooks no React. É incrível como eles facilitam o gerenciamento de estado!',
        categoria_id: 1,
        autor_id: userId
      },
      {
        titulo: 'Banco de Dados',
        conteudo: 'Estudando MySQL e como otimizar queries. É fundamental para aplicações escaláveis.',
        categoria_id: 4,
        autor_id: userId
      }
    ];

    for (const post of posts) {
      const [postResult] = await pool.execute(
        'INSERT INTO posts (titulo, conteudo, categoria_id, autor_id, data_postagem) VALUES (?, ?, ?, ?, NOW())',
        [post.titulo, post.conteudo, post.categoria_id, post.autor_id]
      );
      console.log('Post inserido com ID:', postResult.insertId);
    }

    console.log('Dados de exemplo inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
  } finally {
    process.exit();
  }
}

insertSampleData();
