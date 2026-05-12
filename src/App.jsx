import { useState, useEffect } from "react";
import DateComponent from "./components/databox";
import "./app.css";
import Modal from "./components/modalTemas.jsx";
import { trocaTema } from "./utils/trocatema";
import SidebarProdutos from "./components/sidebarProdutos.jsx";
import GraficoVendas from "./components/GraficoVendas";

const availableThemes = {
  light: "dx.light",
  dark: "dx.dark",
  darkViolet: "dx.darkviolet",
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState(availableThemes.light);
  const [brandColor, setBrandColor] = useState("#7c3aed");

  useEffect(() => {
    trocaTema(theme);
  }, [theme]);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const produtos = [
    {
      id: 1,
      nome: "Tênis",
      isCategory: true,
    },

    {
      id: 2,
      parentId: 1,
      nome: "Nike Air Max",
    },

    {
      id: 3,
      parentId: 1,
      nome: "Adidas Forum",
    },
  ];

  return (
    <>
      <section id="topo">
        <p>Selecione o Período:</p>
        <DateComponent />
        até
        <DateComponent />
        <button
          className="theme-button"
          style={{ backgroundColor: brandColor }}
          onClick={() => setIsModalOpen(true)}
        >
          Temas
        </button>
      </section>

      <section id = "meio">
        <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#030712",
      }}
    >
      <SidebarProdutos
        produtos={produtos}
        onSelectionChange={setSelectedProducts}
      />

      <main
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        <GraficoVendas
          produtosSelecionados={selectedProducts}
        />
      </main>
    </div>
      </section>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTheme={theme}
        selectedColor={brandColor}
        onChangeTheme={setTheme}
        onChangeColor={setBrandColor}
      />
    </>
  );
}
