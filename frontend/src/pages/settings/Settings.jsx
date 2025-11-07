import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarPerfil, deletarUsuario } from '../../api';
import Sidebar from '../../components/Sidebar';
import './Settings.scss';

export default function Settings() {
  const [tema, setTema] = useState(localStorage.getItem('tema') || 'light');
  const [usuario, setUsuario] = useState(null);
  const [mostrarConfirmacaoDelete, setMostrarConfirmacaoDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
    aplicarTema(tema);
  }, [tema]);

  const aplicarTema = (novoTema) => {
    document.documentElement.setAttribute('data-theme', novoTema);
    localStorage.setItem('tema', novoTema);
  };

  const toggleTema = () => {
    const novoTema = tema === 'light' ? 'dark' : 'light';
    setTema(novoTema);
  };

  const handleEditarPerfil = () => {
    navigate(`/profile-edit/${usuario.id}`);
  };

  const handleTrocarConta = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const handleDeletarConta = async () => {
    if (!mostrarConfirmacaoDelete) {
      setMostrarConfirmacaoDelete(true);
      return;
    }

    try {
      await deletarUsuario(usuario.id);
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      navigate('/');
    } catch (error) {
      alert('Erro ao deletar conta: ' + (error.response?.data?.erro || 'Erro desconhecido'));
      setMostrarConfirmacaoDelete(false);
    }
  };

  const cancelarDelete = () => {
    setMostrarConfirmacaoDelete(false);
  };

  return (
    <div className="settings-page">
      <Sidebar />
      <main className="settings-content">
        <div className="settings-header">
          <h1>Configurações</h1>
        </div>

        <div className="settings-sections">
          <section className="settings-section">
            <h2>Aparência</h2>
            <div className="setting-item">
              <label htmlFor="theme-toggle">Tema</label>
              <div className="theme-toggle">
                <span className={tema === 'light' ? 'active' : ''}>Escuro</span>
                <button
                  id="theme-toggle"
                  className={`toggle-switch ${tema}`}
                  onClick={toggleTema}
                >
                  <div className="toggle-slider"></div>
                </button>
                <span className={tema === 'dark' ? 'active' : ''}>Claro</span>
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h2>Conta</h2>
            <div className="setting-item">
              <button className="btn-secondary" onClick={handleEditarPerfil}>
                Alterar dados de cadastro
              </button>
            </div>
            <div className="setting-item">
              <button className="btn-secondary" onClick={handleTrocarConta}>
                Trocar de Conta
              </button>
            </div>
            <div className="setting-item">
              {!mostrarConfirmacaoDelete ? (
                <button className="btn-danger" onClick={handleDeletarConta}>
                  Deletar Conta
                </button>
              ) : (
                <div className="confirmation-dialog">
                  <p>Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.</p>
                  <div className="confirmation-buttons">
                    <button className="btn-secondary" onClick={cancelarDelete}>
                      Cancelar
                    </button>
                    <button className="btn-danger" onClick={handleDeletarConta}>
                      Confirmar Exclusão
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="settings-section">
            <h2>Privacidade</h2>
            <div className="setting-item">
              <label>Perfil privado</label>
              <span className="coming-soon">Em breve</span>
            </div>
            <div className="setting-item">
              <label>Notificações por email</label>
              <span className="coming-soon">Em breve</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
