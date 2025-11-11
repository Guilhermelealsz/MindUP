import { useState } from "react";
import { useNavigate } from "react-router-dom";
import guilherme from "../../assets/guilherme.jpeg";
import enzo from "../../assets/enzo.jpeg";
import davi from "../../assets/davi.jpeg";
import emilly from "../../assets/emilly.png";
import "./LandingPage.scss";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Café na xícara, foco na mente e caneta na mão. Hoje é dia de construir o futuro! ☕
          </h1>
          <p className="hero-subtitle">
            Não espere por inspiração. Seja a inspiração que te move. Coloque e fone, pegue o café e o foco aqui está no máximo! Qual a sua meta de estudos para hoje? 🎯
          </p>
          <div className="hero-buttons">
            <button className="hero-cta" onClick={() => navigate('/register')}>REGISTRE-SE</button>
            <button className="hero-login" onClick={() => navigate('/login')}>ENTRAR</button>
          </div>
        </div>
        <div className="hero-logo">
          <div className="logo-wrapper">
            <svg viewBox="0 0 200 200" className="logo-svg">
              <circle cx="100" cy="100" r="95" fill="none" stroke="#0066ff" strokeWidth="2" opacity="0.3" />
              <circle cx="100" cy="100" r="85" fill="none" stroke="#0066ff" strokeWidth="1.5" opacity="0.2" />
              <path d="M 70 100 Q 100 60 130 100" fill="none" stroke="#0066ff" strokeWidth="4" />
              <text x="100" y="135" fontSize="36" fontWeight="bold" fill="#0066ff" textAnchor="middle">
                MINDUP
              </text>
            </svg>
          </div>
          <div className="logo-icons">
            <div className="icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <div className="icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </div>
            <div className="icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [openId, setOpenId] = useState(1);

  const faqItems = [
    {
      id: 1,
      question: "Como funciona o MindUP?",
      answer: "MindUP é uma plataforma de desenvolvimento pessoal que combina técnicas de produtividade, foco e bem-estar mental para ajudar você a alcançar seus objetivos.",
    },
    {
      id: 2,
      question: "Qual é o custo?",
      answer: "Oferecemos planos gratuitos e premium. O plano gratuito inclui acesso básico a todas as funcionalidades, enquanto o premium oferece recursos avançados.",
    },
    {
      id: 3,
      question: "Como posso começar?",
      answer: "Basta se registrar em nossa plataforma e começar a usar. Você terá acesso imediato a todas as ferramentas básicas.",
    },
    {
      id: 4,
      question: "Posso cancelar minha inscrição?",
      answer: "Sim, você pode cancelar sua inscrição a qualquer momento sem penalidades. Seus dados serão preservados por 30 dias.",
    },
    {
      id: 5,
      question: "Como funciona o suporte?",
      answer: "Oferecemos suporte via email e chat ao vivo. Nosso time está disponível para ajudar você 24/7.",
    },
    {
      id: 6,
      question: "Meus dados estão seguros?",
      answer: "Sim, utilizamos criptografia de ponta a ponta e conformidade com LGPD para proteger seus dados.",
    },
  ];

  return (
    <section className="faq">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">
            <span className="faq-badge">PERGUNTAS</span>
            <span className="faq-subtitle">FREQUENTES</span>
          </h2>
        </div>

        <div className="faq-list">
          {faqItems.map((item) => (
            <div key={item.id} className={`faq-item ${openId === item.id ? "open" : ""}`}>
              <button
                className="faq-trigger"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
              >
                <span className="faq-number">{String(item.id).padStart(2, "0")}</span>
                <span className="faq-question">{item.question}</span>
                <span className="faq-icon">{openId === item.id ? "−" : "+"}</span>
              </button>
              {openId === item.id && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  const teamMembers = [
    {
      id: 1,
      name: "Guilherme Leal",
      role: "CEO & CTO",
      bio: "Especialista em desenvolvimento de produtos digitais com mais de 10 anos de experiência.",
      image: guilherme,
    },
    {
      id: 2,
      name: "Enzo Gaeta",
      role: "COO & CIO",
      bio: "Líder em operações e inovação tecnológica com foco em escalabilidade.",
      image: enzo,
    },
    {
      id: 3,
      name: "Davi Amorim",
      role: "Chefe de Marketing",
      bio: "Mais de 5 anos de experiência em SEO e criação de conteúdo. Proficiência em pesquisa de palavras-chave e otimização on-page.",
      image: davi,
    },
    {
      id: 4,
      name: "Emily Uliach",
      role: "Líder de Design",
      bio: "Designer de experiência com paixão por criar interfaces intuitivas e acessíveis.",
      image: emilly,
    },
  ];

  return (
    <section className="team">
      <div className="team-container">
        <div className="team-header">
          <h2 className="team-title">Nosso time</h2>
          <p className="team-description">
            Nossa Equipe de Desenvolvimento é o coração tecnológico da MindUP, responsável por transformar ideias em soluções digitais robustas e inovadoras. Somos um time multifuncional, auto-organizado e movido pela paixão por construir e entregar valor contínuo.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-card-image">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-card-content">
                <h3 className="team-card-name">{member.name}</h3>
                <p className="team-card-role">{member.role}</p>
                <div className="team-card-divider"></div>
                <p className="team-card-bio">{member.bio}</p>
              </div>
              <a href="#" className="team-card-linkedin">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.39v-1.2h-2.84v8.37h2.84v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.84M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Formulário enviado:", formData);
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
      alert("Mensagem enviada com sucesso!");
    }, 1000);
  };

  return (
    <section className="contact">
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-form-wrapper">
            <h2 className="contact-title">Contate - nos</h2>
            <p className="contact-subtitle">Tem sugestões e dúvidas?</p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nome"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Mensagem*</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Mensagem"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="form-textarea"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="contact-submit"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
            </form>
          </div>

          <div className="contact-decoration">
            <svg viewBox="0 0 200 200" className="decoration-star">
              <polygon points="100,10 40,190 190,70 10,70 160,190" fill="#1a1a1a" />
            </svg>
            <div className="decoration-wave"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-socials">
            <a href="#" className="social-link" title="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.39v-1.2h-2.84v8.37h2.84v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.84M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/minduppublic/" className="social-link" title="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          <div className="footer-info">
            <h3 className="footer-section-title">Formas de contato</h3>
            <ul className="footer-contact-list">
              <li>Email: minduppublic@gmail.com</li>
              <li>Phone: -------</li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 MindUP. All Rights Reserved  .</p>
          <a href="#" className="footer-link">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      <main>
        <Hero />
        <FAQ />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
