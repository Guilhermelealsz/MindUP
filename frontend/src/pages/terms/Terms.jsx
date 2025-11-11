import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Terms.scss';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      <div className="terms-card">
        <h1>Termos e Condições</h1>
        <div className="terms-content">
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar o MindUp, você concorda em cumprir estes Termos e Condições. Se você não concordar com estes termos, por favor, não use nossa plataforma.
          </p>

          <h2>2. Uso da Plataforma</h2>
          <p>
            O MindUp é uma plataforma para compartilhamento de pensamentos, livros e interações sociais. Você concorda em usar a plataforma de maneira responsável e ética.
          </p>

          <h2>3. Proibições</h2>
          <p>
            É estritamente proibido:
          </p>
          <ul>
            <li>Publicar conteúdo ilegal, ofensivo ou prejudicial.</li>
            <li>Violar direitos de propriedade intelectual.</li>
            <li>Compartilhar informações falsas ou enganosas.</li>
            <li>Usar a plataforma para atividades criminosas ou fraudulentas.</li>
          </ul>

          <h2>4. Leis Aplicáveis</h2>
          <p>
            O uso desta plataforma está sujeito às leis brasileiras, incluindo:
          </p>
          <ul>
            <li><strong>Lei de Crimes Cibernéticos (Lei nº 12.737/2012):</strong> Proíbe invasões de sistemas, fraudes e disseminação de códigos maliciosos.</li>
            <li><strong>Lei de Proteção de Dados (LGPD - Lei nº 13.709/2018):</strong> Regula o tratamento de dados pessoais, garantindo privacidade e segurança.</li>
            <li><strong>Código Penal Brasileiro:</strong> Proíbe crimes como calúnia, difamação, injúria, estelionato e outros delitos.</li>
            <li><strong>Lei de Direitos Autorais (Lei nº 9.610/1998):</strong> Protege direitos de propriedade intelectual.</li>
          </ul>
          <p>
            Qualquer violação dessas leis pode resultar em ações legais, incluindo processos criminais e civis.
          </p>

          <h2>5. Responsabilidades</h2>
          <p>
            Você é responsável por suas ações na plataforma. O MindUp não se responsabiliza por danos indiretos ou consequenciais decorrentes do uso da plataforma.
          </p>

          <h2>6. Modificações</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.
          </p>

          <h2>7. Contato</h2>
          <p>
            Para dúvidas sobre estes termos, entre em contato conosco através do suporte da plataforma.
          </p>
        </div>
        <button onClick={() => navigate(-1)} className="btn-voltar">
          Voltar
        </button>
      </div>
    </div>
  );
}
