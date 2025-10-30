import { useState } from 'react';
import { Eye, EyeOff, Brain } from 'lucide-react';
import './Login.scss';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt');
  };

  return (
    <section className="login-container">
      <div className="login-box">
        <div className="logo-section">
          <Brain className="logo-icon" size={48} strokeWidth={1.5} />
          <h1 className="logo-text">MINDUP</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Usuário, email ou telefone"
              className="login-input"
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              className="login-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          <a href="#" className="forgot-link">
            esqueceu a senha ou usuário?
          </a>

          <label className="checkbox-group">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span className="checkbox-label">Aceito os Termos e Condições</span>
          </label>

          <button type="submit" className="login-button">
            ENTRAR
          </button>
        </form>

        <p className="footer-text">
          NÃO POSSUI UMA CONTA? <a href="#" className="signup-link">CADASTRE-SE</a>
        </p>
      </div>
    </section>
  );
}

export default Login;
