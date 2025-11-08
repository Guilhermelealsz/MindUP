import React from "react";
import "./ExpoCieeAnuncio.scss";
import expoCiee from "../assets/image 31.png"; // ajuste o caminho se necessário

const ExpoCieeAnuncio = () => {
  return (
    <div className="expo-anuncio">
      <a
        href="https://www.expociee.com.br/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={expoCiee} alt="EXPO CIEE 2025" />
      </a>
    </div>
  );
};

export default ExpoCieeAnuncio;
