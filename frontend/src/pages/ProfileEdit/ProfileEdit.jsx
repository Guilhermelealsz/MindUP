// src/components/ProfileEdit/ProfileEdit.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProfileEdit.scss';
import { atualizarPerfil, uploadAvatar, buscarPerfil, alterarSenha } from '../../api.js';

const ProfileEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    nome: '',
    bio: '',
    avatar: null,
    email: '',
    celular: '',
    data_nascimento: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    carregarPerfil();
  }, [id]);

  const carregarPerfil = async () => {
    try {
      setCarregandoPerfil(true);
      const perfil = await buscarPerfil(id);
      setFormData({
        username: perfil.username || '',
        nome: perfil.nome || '',
        bio: perfil.bio || '',
        avatar: perfil.avatar || null,
        email: perfil.email || '',
        celular: perfil.celular || '',
        data_nascimento: perfil.data_nascimento ? perfil.data_nascimento.split('T')[0] : '',
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
      });
      setPreviewUrl(perfil.avatar);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError('Erro ao carregar dados do perfil');
    } finally {
      setCarregandoPerfil(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Arquivo deve ser uma imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Imagem deve ter no máximo 5MB');
      return;
    }

    // Criar preview local imediatamente
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);

    setError('');
    setSuccess('');
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { avatarUrl } = await uploadAvatar(id, selectedFile);
      setPreviewUrl(avatarUrl);
      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      setSelectedFile(null);
      setSuccess('Foto enviada com sucesso!');
    } catch (err) {
      setError(err.message || 'Erro ao fazer upload da imagem');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validar senha se preenchida
      if (formData.novaSenha && formData.novaSenha !== formData.confirmarSenha) {
        setError('As senhas não coincidem');
        setLoading(false);
        return;
      }

      // Verificar se senha atual foi fornecida
      if (!formData.senhaAtual) {
        setError('Digite sua senha atual para confirmar as alterações');
        setLoading(false);
        return;
      }

      const dadosParaAtualizar = {
        nome: formData.nome,
        username: formData.username,
        bio: formData.bio,
        avatar: previewUrl || formData.avatar,
        email: formData.email,
        celular: formData.celular,
        data_nascimento: formData.data_nascimento,
        senhaAtual: formData.senhaAtual, // Enviar senha atual para validação no backend
      };

      const updatedUser = await atualizarPerfil(id, dadosParaAtualizar);

      // Se senha foi fornecida, alterar senha
      if (formData.novaSenha) {
        await alterarSenha(id, formData.senhaAtual, formData.novaSenha);
      }

      // Atualizar localStorage com os dados atualizados
      const currentUser = JSON.parse(localStorage.getItem('usuario') || '{}');
      const newUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem('usuario', JSON.stringify(newUserData));
      setSuccess('Perfil atualizado com sucesso!');
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate(`/perfil/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit">
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate(`/perfil/${id}`)}>← Voltar</button>
        <h2>Editar Perfil</h2>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Avatar */}
        <div className="avatar-section">
          <div
            className="avatar-wrapper"
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={previewUrl || formData.avatar || '/default-avatar.png'}
              alt="Avatar"
              className="avatar"
            />
            <div className="avatar-overlay">
              <span>✏️</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <p className="avatar-hint">Clique para alterar a foto</p>
          {selectedFile && (
            <div className="avatar-actions">
              <button
                type="button"
                className="btn-upload-avatar"
                onClick={handleUploadAvatar}
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Confirmar foto'}
              </button>
              <button
                type="button"
                className="btn-cancel-avatar"
                onClick={() => {
                  setPreviewUrl(formData.avatar);
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Campos */}
        <div className="form-group">
          <label>Nome de usuário</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="@username"
            required
            minLength="3"
          />
        </div>

        <div className="form-group">
          <label>Nome exibido</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Seu nome"
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Fale sobre você..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="seu@email.com"
          />
        </div>

        <div className="form-group">
          <label>Celular</label>
          <input
            type="tel"
            name="celular"
            value={formData.celular}
            onChange={handleInputChange}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="form-group">
          <label>Data de nascimento</label>
          <input
            type="date"
            name="data_nascimento"
            value={formData.data_nascimento}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Senha atual *</label>
          <input
            type="password"
            name="senhaAtual"
            value={formData.senhaAtual}
            onChange={handleInputChange}
            placeholder="Digite sua senha atual"
            required
          />
        </div>

        <div className="form-group">
          <label>Nova senha</label>
          <input
            type="password"
            name="novaSenha"
            value={formData.novaSenha}
            onChange={handleInputChange}
            placeholder="Digite a nova senha"
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>Confirmar nova senha</label>
          <input
            type="password"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleInputChange}
            placeholder="Confirme a nova senha"
            minLength="6"
          />
        </div>

        {/* Feedback */}
        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}

        {/* Botão */}
        <button
          type="submit"
          className={`save-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner">⏳</span>
          ) : (
            'Salvar Alterações'
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;