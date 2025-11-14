import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fazerLogin, buscarPerfil } from '../../api';
import logo from '../../assets/logo.png';
import './login.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    if (!aceitouTermos) {
      setErro('Você precisa aceitar os termos e condições');
      return;
    }

    try {
      setCarregando(true);
      const resposta = await fazerLogin(email, senha);
      localStorage.setItem('token', resposta.token);

      const perfilCompleto = await buscarPerfil(resposta.usuario.id);
      const usuarioAtualizado = { ...resposta.usuario, ...perfilCompleto };

      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
      navigate('/feed');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <img src={logo} alt="MindUp" className="logo-image" />
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={carregando}
            />
          </div>

          <div className="input-group password-group">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={carregando}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <a href="#" className="forgot-link">
            esqueceu a senha ou usário?
          </a>

          {erro && <div className="erro-mensagem">{erro}</div>}

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="termos"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
              disabled={carregando}
            />
            <label htmlFor="termos">
              Aceito os{' '}
              <button
                type="button"
                onClick={() => window.open('/terms', '_blank')}
                className="link-termos"
              >
                Termos e Condições
              </button>
            </label>
          </div>

          <button type="submit" className="btn-entrar" disabled={carregando}>
            {carregando ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <div className="cadastro-link">
          Não possui uma conta?{' '}
          <button onClick={() => navigate('/register')}>Cadastre-se</button>
        </div>
      </div>
    </div>
  );
}