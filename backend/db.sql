CREATE DATABASE IF NOT EXISTS MindUP;

USE MindUP;

  CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar TEXT,
    celular VARCHAR(20),
    data_nascimento DATE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role ENUM('user', 'admin') DEFAULT 'user',
    banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT,
    ban_date TIMESTAMP NULL
  );

  CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    imagem TEXT,
    video TEXT,
    categoria_id INT,
    autor_id INT NOT NULL,
    data_postagem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texto TEXT NOT NULL,
    post_id INT NOT NULL,
    autor_id INT NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS curtidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    usuario_id INT NOT NULL,
    data_curtida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_curtida (post_id, usuario_id)
  );

  CREATE TABLE IF NOT EXISTS seguidores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seguidor_id INT NOT NULL,
    seguindo_id INT NOT NULL,
    data_seguimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seguidor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (seguindo_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_seguimento (seguidor_id, seguindo_id)
  );

  CREATE TABLE IF NOT EXISTS curtidas_comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comentario_id INT NOT NULL,
    usuario_id INT NOT NULL,
    data_curtida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comentario_id) REFERENCES comentarios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_curtida_comentario (comentario_id, usuario_id)
  );

  CREATE TABLE IF NOT EXISTS notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('curtida_post', 'curtida_comentario', 'comentario', 'seguidor', 'mensagem') NOT NULL,
    ator_id INT NOT NULL,
    post_id INT NULL,
    comentario_id INT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_notificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (ator_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comentario_id) REFERENCES comentarios(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario1_id INT NOT NULL,
    usuario2_id INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario1_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario2_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_chat (usuario1_id, usuario2_id)
  );

  CREATE TABLE IF NOT EXISTS mensagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    remetente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    texto TEXT,
    post_id INT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (remetente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (destinatario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_user_id INT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (target_user_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS banned_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    ban_reason TEXT,
    banned_by INT NOT NULL,
    ban_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (banned_by) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS banned_phones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    ban_reason TEXT,
    banned_by INT NOT NULL,
    ban_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (banned_by) REFERENCES usuarios(id) ON DELETE CASCADE
  );



INSERT IGNORE INTO categorias (nome, descricao) VALUES
  ('Tecnologia', 'Posts sobre tecnologia e inovação'),
  ('Educação', 'Conteúdo educacional e aprendizado'),
  ('Saúde', 'Dicas de saúde e bem-estar'),
  ('Entretenimento', 'Diversão e lazer'),
  ('Esportes', 'Notícias e discussões sobre esportes');

-- Insert admin user
INSERT IGNORE INTO usuarios (nome, username, email, senha, role) VALUES
  ('Administrador', 'admin', 'Adm4.4.codes22.0', 'Paritehaida!.12.23', 'admin');
  -- Password: Paritehaida!.12.23 (hashed with bcrypt)
