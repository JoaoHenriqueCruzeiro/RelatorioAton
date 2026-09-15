import { useEffect } from "react";
import "../styles/modalTemasStyle.css";

const lightColors = [
  { name: "Azul Claro", theme: "dx.light", color: "#60a5fa" },
  { name: "Verde Claro", theme: "dx.light", color: "#34d399" },
  { name: "Lilás Claro", theme: "dx.light", color: "#a78bfa" },
];

const darkColors = [
  { name: "Cinza Escuro", theme: "dx.dark", color: "#374151" },
  { name: "Violeta Escuro", theme: "dx.darkviolet", color: "#7c3aed" },
  { name: "Laranja Escuro", theme: "dx.dark", color: "#f97316" },
];

export default function Modal({
  isOpen,
  onClose,
  selectedTheme,
  selectedColor,
  onChangeTheme,
  onChangeColor,
}) {
  const selectedMode = selectedTheme === "dx.light" ? "light" : "dark";
  const colorOptions = selectedMode === "light" ? lightColors : darkColors;

  const handleSelectColor = ({ theme, color }) => {
    onChangeColor(color);
    onChangeTheme(theme);
  };

  const handleModeSelect = (theme) => {
    onChangeTheme(theme);
    if (theme === "dx.light") onChangeColor("#60a5fa");
    else onChangeColor("#374151");
  };
  // FECHAR COM ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);

      // BLOQUEIA SCROLL DA PÁGINA
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h1 className="modal-title">Appearance</h1>

            <p className="modal-subtitle">
              Change how your dashboard looks and feels.
            </p>
          </div>

          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="divider"></div>

        {/* CONTENT */}
        <div className="modal-content">
          <h3 className="section-title">Brand color</h3>

          <p className="section-subtitle">
            Update your dashboard to your brand color.
          </p>

          <div className="colors">
            {colorOptions.map(({ name, theme, color }) => (
              <Color
                key={name}
                color={color}
                active={selectedColor === color}
                title={name}
                onClick={() => handleSelectColor({ theme, color })}
              />
            ))}
          </div>

          <h3 className="section-title">Display preference</h3>

          <p className="section-subtitle">
            Toggle between light and dark themes below.
          </p>

          <div className="modes">
            <ModeCard
              title="Light"
              active={selectedMode === "light"}
              onClick={() => handleModeSelect("dx.light")}
            />

            <ModeCard
              title="Dark"
              active={selectedMode === "dark"}
              dark
              onClick={() => handleModeSelect("dx.dark")}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <label className="checkbox">
            <input type="checkbox" />
            Apply to all teams
          </label>

          <div className="footer-buttons">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* COLOR */
function Color({ color, active, onClick, title }) {
  return (
    <div
      className={`color ${active ? "active" : ""}`}
      style={{ background: color }}
      title={title}
      onClick={onClick}
    />
  );
}

/* MODE CARD */
function ModeCard({ title, dark, active, onClick }) {
  return (
    <div className={`mode-card ${active ? "active" : ""}`} onClick={onClick}>
      <div className={`mode-preview ${dark ? "dark" : ""}`}>
        <div className="sidebar"></div>

        <div className="content">
          <div className="graph"></div>
        </div>
      </div>

      <div className="mode-label">{title}</div>
    </div>
  );
}
