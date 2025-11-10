import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './AdminDashboard.scss';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [usuarios, setUsuarios] = useState([]);
  const [logs, setLogs] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [usuario, setUsuario] = useState(null);
  const [modalBan, setModalBan] = useState({ show: false, usuario: null });
  const [motivoBan, setMotivoBan] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    verificarAdmin();
    carregarDados();
  }, []);

  const verificarAdmin = () => {
    const usuarioData = localStorage.getItem('usuario');
    if (!usuarioData) {
      navigate('/login');
      return;
    }

    const usuarioParsed = JSON.parse(usuarioData);
    if (usuarioParsed.role !== 'admin') {
      navigate('/feed');
      return;
    }

    setUsuario(usuarioParsed);
  };

  const carregarDados = async () => {
    try {
      setCarregando(true);

      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, usuariosRes, logsRes] = await Promise.all([
        fetch('http://localhost:3000/admin/estatisticas', { headers }),
        fetch('http://localhost:3000/admin/usuarios', { headers }),
        fetch('http://localhost:3000/admin/logs', { headers })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (usuariosRes.ok) {
        const usuariosData = await usuariosRes.json();
        setUsuarios(usuariosData);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleBanirUsuario = async () => {
    if (!motivoBan.trim()) {
      alert('Por favor, informe o motivo do banimento');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/admin/banir/${modalBan.usuario.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ motivo: motivoBan })
      });

      if (response.ok) {
        alert('Usuário banido com sucesso');
        setModalBan({ show: false, usuario: null });
        setMotivoBan('');
        carregarDados();
      } else {
        const error = await response.json();
        alert(error.erro || 'Erro ao banir usuário');
      }
    } catch (error) {
      console.error('Erro ao banir usuário:', error);
      alert('Erro ao banir usuário');
    }
  };

  const handleDesbanirUsuario = async (usuarioId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/admin/desbanir/${usuarioId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Usuário desbanido com sucesso');
        carregarDados();
      } else {
        const error = await response.json();
        alert(error.erro || 'Erro ao desbanir usuário');
      }
    } catch (error) {
      console.error('Erro ao desbanir usuário:', error);
      alert('Erro ao desbanir usuário');
    }
  };

  if (carregando) {
    return (
      <div className="admin-dashboard">
        <Sidebar />
        <main className="admin-main">
          <div className="loading">Carregando...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <main className="admin-main">
        <header className="admin-header">
          <h1>Painel Administrativo</h1>
          <div className="admin-tabs">
            <button
              className={abaAtiva === 'dashboard' ? 'active' : ''}
              onClick={() => setAbaAtiva('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={abaAtiva === 'usuarios' ? 'active' : ''}
              onClick={() => setAbaAtiva('usuarios')}
            >
              Usuários
            </button>
            <button
              className={abaAtiva === 'logs' ? 'active' : ''}
              onClick={() => setAbaAtiva('logs')}
            >
              Logs
            </button>
          </div>
        </header>

        {abaAtiva === 'dashboard' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total de Usuários</h3>
                <span className="stat-number">{stats.total_usuarios || 0}</span>
              </div>
              <div className="stat-card">
                <h3>Usuários Banidos</h3>
                <span className="stat-number">{stats.usuarios_banidos || 0}</span>
              </div>
              <div className="stat-card">
                <h3>Administradores</h3>
                <span className="stat-number">{stats.administradores || 0}</span>
              </div>
              <div className="stat-card">
                <h3>Total de Posts</h3>
                <span className="stat-number">{stats.total_posts || 0}</span>
              </div>
              <div className="stat-card">
                <h3>Total de Comentários</h3>
                <span className="stat-number">{stats.total_comentarios || 0}</span>
              </div>
              <div className="stat-card">
                <h3>Total de Curtidas</h3>
                <span className="stat-number">{stats.total_curtidas || 0}</span>
              </div>
              <div className="stat-card">
                <h3>Total de Chats</h3>
                <span className="stat-number">{stats.total_chats || 0}</span>
              </div>
              <div className="stat-card">
                <h3>Total de Mensagens</h3>
                <span className="stat-number">{stats.total_mensagens || 0}</span>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'usuarios' && (
          <div className="usuarios-content">
            <div className="usuarios-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Celular</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Data Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nome}</td>
                      <td>{user.email}</td>
                      <td>{user.username || '-'}</td>
                      <td>{user.celular || '-'}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'admin' ? 'Admin' : 'Usuário'}
                        </span>
                      </td>
                      <td>
                        {user.banned ? (
                          <span className="status-banned">
                            Banido: {user.ban_reason}
                          </span>
                        ) : (
                          <span className="status-active">Ativo</span>
                        )}
                      </td>
                      <td>{new Date(user.data_cadastro).toLocaleDateString('pt-BR')}</td>
                      <td>
                        {user.role !== 'admin' && (
                          <div className="action-buttons">
                            {user.banned ? (
                              <button
                                className="btn-unban"
                                onClick={() => handleDesbanirUsuario(user.id)}
                              >
                                Desbanir
                              </button>
                            ) : (
                              <button
                                className="btn-ban"
                                onClick={() => setModalBan({ show: true, usuario: user })}
                              >
                                Banir
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaAtiva === 'logs' && (
          <div className="logs-content">
            <div className="logs-table">
              <table>
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Administrador</th>
                    <th>Ação</th>
                    <th>Usuário Alvo</th>
                    <th>Detalhes</th>
                    <th>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td>{new Date(log.data_log).toLocaleString('pt-BR')}</td>
                      <td>{log.admin_nome}</td>
                      <td>{log.action}</td>
                      <td>{log.target_nome || '-'}</td>
                      <td>{log.details}</td>
                      <td>{log.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {modalBan.show && (
        <div className="modal-overlay" onClick={() => setModalBan({ show: false, usuario: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Banir Usuário</h2>
            <p>Usuário: {modalBan.usuario?.nome}</p>
            <p>Email: {modalBan.usuario?.email}</p>
            <div className="form-group">
              <label>Motivo do banimento:</label>
              <textarea
                value={motivoBan}
                onChange={(e) => setMotivoBan(e.target.value)}
                placeholder="Digite o motivo do banimento..."
                rows="4"
              />
            </div>
            <div className="modal-buttons">
              <button
                className="btn-cancel"
                onClick={() => setModalBan({ show: false, usuario: null })}
              >
                Cancelar
              </button>
              <button
                className="btn-ban"
                onClick={handleBanirUsuario}
              >
                Banir Usuário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
