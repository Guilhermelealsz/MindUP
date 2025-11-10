import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { atualizarPerfil, buscarPerfil } from "../../api.js";
import "./AccountSettings.scss";

export default function AccountSettings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    celular: "",
    senha: "",
    senhaAtual: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLocal) return navigate("/login");
    setUsuario(usuarioLocal);
    carregarPerfil(usuarioLocal.id);
  }, []);

  async function carregarPerfil(id) {
    try {
      const perfil = await buscarPerfil(id);
      const dados = {
        email: perfil.email || "",
        celular: perfil.celular || "",
        senha: "",
        senhaAtual: "",
      };
      setFormData(dados);
      setOriginalData({ email: dados.email, celular: dados.celular });
    } catch {
      setFeedback({ type: "error", message: "Erro ao carregar perfil." });
    } finally {
      setCarregando(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFeedback({ type: "", message: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    const alterados = ["email", "celular", "senha"].some(
      (campo) => formData[campo] && formData[campo] !== originalData[campo]
    );

    if (!alterados) {
      setFeedback({ type: "error", message: "Nenhum campo foi alterado." });
      return setLoading(false);
    }

    const precisaSenhaAtual =
      formData.email !== originalData.email ||
      formData.celular !== originalData.celular ||
      formData.senha;

    if (precisaSenhaAtual && !formData.senhaAtual) {
      setFeedback({
        type: "error",
        message: "Informe a senha atual para confirmar alterações.",
      });
      return setLoading(false);
    }

    if (formData.senha && formData.senha.length < 6) {
      setFeedback({
        type: "error",
        message: "A nova senha deve ter pelo menos 6 caracteres.",
      });
      return setLoading(false);
    }

    try {
      const atualizacao = {};
      ["email", "celular", "senha"].forEach((campo) => {
        if (formData[campo] && formData[campo] !== originalData[campo])
          atualizacao[campo] = formData[campo];
      });
      if (precisaSenhaAtual) atualizacao.senhaAtual = formData.senhaAtual;

      const atualizado = await atualizarPerfil(usuario.id, atualizacao);
      const novoUsuario = { ...usuario, ...atualizado };
      localStorage.setItem("usuario", JSON.stringify(novoUsuario));
      setOriginalData({
        email: atualizado.email,
        celular: atualizado.celular,
      });

      setFeedback({
        type: "success",
        message: "Dados atualizados com sucesso!",
      });
      setFormData((prev) => ({ ...prev, senha: "", senhaAtual: "" }));

      setTimeout(() => navigate("/settings"), 2000);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.erro || "Erro ao atualizar perfil.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (carregando)
    return (
      <div className="account-settings">
        <p className="loading">Carregando...</p>
      </div>
    );

  return (
    <div className="account-settings">
      <header className="account-header">
        <button onClick={() => navigate("/settings")} className="back">
          ←
        </button>
        <h2>Alterar Dados de Cadastro</h2>
      </header>

      <form onSubmit={handleSubmit}>
        <section>
          <h3>Dados Pessoais</h3>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
            />
          </label>
          <label>
            Telefone
            <input
              type="tel"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
            />
          </label>
        </section>

        <section>
          <h3>Alterar Senha</h3>
          <label>
            Nova Senha
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Nova senha (mín. 6 caracteres)"
            />
          </label>
        </section>

        <section>
          <h3>Confirmação</h3>
          <label>
            Senha Atual
            <input
              type="password"
              name="senhaAtual"
              value={formData.senhaAtual}
              onChange={handleChange}
              placeholder="Digite sua senha atual"
            />
          </label>
        </section>

        {feedback.message && (
          <p className={`message ${feedback.type}`}>{feedback.message}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
