import { useState, useEffect } from "react";
import DateComponent from "./components/databox";
import "./app.css";
import Modal from "./components/modalTemas.jsx";
import { trocaTema } from "./utils/trocatema";

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
