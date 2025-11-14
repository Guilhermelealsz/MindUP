import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarPerfil } from '../../api';
import Sidebar from '../../components/Sidebar';
import './Settings.scss';

export default function Settings() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
  }, []);

  const handleAlterarDadosCadastro = () => {
    navigate('/account-settings');
  };

  const handleTrocarConta = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
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
            <h2>Conta</h2>
            <div className="setting-item">
              <button className="btn-secondary" onClick={handleAlterarDadosCadastro}>
                Alterar Dados de Cadastro
              </button>
            </div>
            <div className="setting-item">
              <button className="btn-secondary" onClick={handleTrocarConta}>
                Trocar de Conta
              </button>
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
