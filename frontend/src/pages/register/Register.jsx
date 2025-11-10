import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrarUsuario } from '../../api';
import logo from '../../assets/logo.png';
import './register.scss';

export default function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    celular: '',
    data_nascimento: '',
    senha: '',
    confirmarSenha: ''
  });
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (!formData.nome || !formData.email || !formData.senha) {
      setErro('Preencha todos os campos obrigatórios');
      return false;
    }
    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem');
      return false;
    }
    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (!aceitouTermos) {
      setErro('Você precisa aceitar os termos e condições');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!validarFormulario()) return;

    try {
      setCarregando(true);
      await cadastrarUsuario({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        celular: formData.celular,
        data_nascimento: formData.data_nascimento
      });
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao cadastrar usuário');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="logo">
          <img src={logo} alt="MindUp" className="logo-image" />
        </div>
        <button className="btn-cadastrar" onClick={() => navigate('/login')} disabled={carregando}>
          Cadastrar-se
        </button>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="termos"
            checked={aceitouTermos}
            onChange={(e) => setAceitouTermos(e.target.checked)}
            disabled={carregando}
          />
          <label htmlFor="termos">Aceito os Termos e Condições</label>
        </div>
      </div>

      <div className="register-right">
        <h2>Cadastre-se</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nome" placeholder="Nome Completo" value={formData.nome} onChange={handleChange} disabled={carregando} required />
          <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} disabled={carregando} required />
          <input type="tel" name="celular" placeholder="Celular" value={formData.celular} onChange={handleChange} disabled={carregando} />
          <input type="date" name="data_nascimento" placeholder="Data de Nascimento" value={formData.data_nascimento} onChange={handleChange} disabled={carregando} />
          <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} disabled={carregando} required />
          <input type="password" name="confirmarSenha" placeholder="Confirmar Senha" value={formData.confirmarSenha} onChange={handleChange} disabled={carregando} required />
          {erro && <div className="erro-mensagem">{erro}</div>}
          <button type="submit" className="btn-submit" disabled={carregando}>
            {carregando ? 'CADASTRANDO...' : 'CRIAR CONTA'}
          </button>
        </form>
        <div className="login-link">
          Já possui uma conta? <button onClick={() => navigate('/login')}>Faça login</button>
        </div>
      </div>
    </div>
  );
}