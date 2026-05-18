import { useState, useEffect } from "react";
import DateComponent from "./components/dateComponent.jsx";
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

const produtos = [

    {
      id: 1,
      nome: "Tênis Nike Delta",
      isPai: true,
    },

    {
      id: 2,
      parentId: 1,
      nome: "Nike Delta Azul",
    },

    {
      id: 3,
      parentId: 1,
      nome: "Nike Delta Preto",
    },

    {
      id: 4,
      nome: "Tênis Adidas Forum",
      isPai: true,
    },

    {
      id: 5,
      parentId: 4,
      nome: "Adidas Forum Branco",
    },

  ];

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState(availableThemes.light);
  const [brandColor, setBrandColor] = useState("#7c3aed");

  useEffect(() => {
    trocaTema(theme);
  }, [theme]);

  const [selectedProducts, setSelectedProducts] = useState([]);

  

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
        <div className="layout">

      <SidebarProdutos
        produtos={produtos}
        onSelectionChange={
          setSelectedProducts
        }
      />

      <main className="content">

        <GraficoVendas
          produtosSelecionados={
            selectedProducts
          }
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
