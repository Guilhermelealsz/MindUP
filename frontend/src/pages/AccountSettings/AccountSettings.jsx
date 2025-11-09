import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarPerfil, buscarPerfil } from '../../api.js';
import Sidebar from '../../components/Sidebar';
import './AccountSettings.scss';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);

  const [formData, setFormData] = useState({
    email: '',
    celular: '',
    senha: '',
    senhaAtual: '',
  });

  const [originalData, setOriginalData] = useState({
    email: '',
    celular: '',
  });

  const [usuario, setUsuario] = useState(null);
  const [camposSensíveisAlterados, setCamposSensíveisAlterados] = useState(false);

  useEffect(() => {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      const parsedUser = JSON.parse(usuarioData);
      setUsuario(parsedUser);
      carregarPerfil(parsedUser.id);
    }
  }, []);

  const carregarPerfil = async (id) => {
    try {
      setCarregandoPerfil(true);
      const perfil = await buscarPerfil(id);
      const initialData = {
        email: perfil.email || '',
        celular: perfil.celular || '',
        senha: '',
        senhaAtual: '',
      };
      setFormData(initialData);
      setOriginalData({
        email: perfil.email || '',
        celular: perfil.celular || '',
      });
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

    // Atualizar camposSensíveisAlterados quando campos sensíveis mudam
    if (name === 'email' || name === 'celular' || name === 'senha') {
      const alterados = (
        (name === 'email' ? value : formData.email) !== originalData.email ||
        (name === 'celular' ? value : formData.celular) !== originalData.celular ||
        (name === 'senha' ? value : formData.senha) !== ''
      );
      setCamposSensíveisAlterados(alterados);
    }

    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Verificar se pelo menos um campo foi alterado comparando com os valores originais
    const camposAlterados = (
      formData.email !== originalData.email ||
      formData.celular !== originalData.celular ||
      formData.senha !== ''
    );

    if (!camposAlterados) {
      setError('Pelo menos um campo deve ser alterado');
      setLoading(false);
      return;
    }

    // Verificar se campos sensíveis foram alterados (email, celular, senha)
    const camposSensíveisAlterados = (
      formData.email !== originalData.email ||
      formData.celular !== originalData.celular ||
      formData.senha !== ''
    );

    if (camposSensíveisAlterados && !formData.senhaAtual) {
      setError('Senha atual é obrigatória para confirmar alterações de dados sensíveis');
      setLoading(false);
      return;
    }

    if (formData.senha && formData.senha.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const dadosParaAtualizar = {};
      if (formData.email !== originalData.email) dadosParaAtualizar.email = formData.email;
      if (formData.celular !== originalData.celular) dadosParaAtualizar.celular = formData.celular;
      if (formData.senha) dadosParaAtualizar.senha = formData.senha;
      if (camposSensíveisAlterados) dadosParaAtualizar.senhaAtual = formData.senhaAtual;

      const updatedUser = await atualizarPerfil(usuario.id, dadosParaAtualizar);

      // Atualizar localStorage com os dados atualizados
      const currentUser = JSON.parse(localStorage.getItem('usuario') || '{}');
      const newUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem('usuario', JSON.stringify(newUserData));

      // Atualizar originalData com os novos valores
      setOriginalData({
        email: updatedUser.email || '',
        celular: updatedUser.celular || '',
      });

      setSuccess('Dados de cadastro atualizados com sucesso!');
      setFormData(prev => ({
        ...prev,
        senha: '',
        senhaAtual: '',
      }));

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/settings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao atualizar dados de cadastro');
    } finally {
      setLoading(false);
    }
  };

  if (carregandoPerfil) {
    return (
      <div className="account-settings">
        <Sidebar />
        <main className="account-settings-content">
          <div className="loading">Carregando...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="account-settings">
      <div className="account-settings-header">
        <button className="back-button" onClick={() => navigate('/settings')}>←</button>
        <h2>Alterar Dados de Cadastro</h2>
      </div>

      <form onSubmit={handleSubmit} className="account-form">
        <div className="form-section">
          <h3>Dados Pessoais</h3>

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
            <label>Telefone</label>
            <input
              type="tel"
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Alterar Senha</h3>

          <div className="form-group">
            <label>Nova Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              placeholder="Digite a nova senha (mín. 6 caracteres)"
              minLength="6"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Confirmação</h3>

          <div className="form-group">
            <label>Senha Atual {camposSensíveisAlterados ? '*' : '(opcional)'}</label>
            <input
              type="password"
              name="senhaAtual"
              value={formData.senhaAtual}
              onChange={handleInputChange}
              placeholder="Digite sua senha atual"
              required={camposSensíveisAlterados}
            />
            <small className="help-text">
              {camposSensíveisAlterados
                ? 'Obrigatória para confirmar alterações de dados sensíveis'
                : 'Opcional quando apenas campos não sensíveis são alterados'
              }
            </small>
          </div>
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
            <span className="spinner"></span>
          ) : (
            'Salvar Alterações'
          )}
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
