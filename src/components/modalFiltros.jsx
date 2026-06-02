import { useEffect, useState } from "react";

import "../styles/modalFiltros.css";

export default function ModalFiltros({ isOpen, onClose, onSalvar, filtros }) {
  const [loading, setLoading] = useState(true);

  const [fabricantes, setFabricantes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [subgrupos, setSubgrupos] = useState([]);

  const [fabricantesSelecionados, setFabricantesSelecionados] = useState([]);
  const [gruposSelecionados, setGruposSelecionados] = useState([]);
  const [subgruposSelecionados, setSubgruposSelecionados] = useState([]);

  // ========================================
  // CARREGA DADOS DO MODAL
  // ========================================
  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);

        const [fab, grp] = await Promise.all([
          window.api.buscarFabricantes(),
          window.api.buscarGrupos(),
        ]);

        setFabricantes(fab);
        setGrupos(grp);

        // restaura filtros salvos
        setFabricantesSelecionados(filtros?.fabricantes || []);

        setGruposSelecionados(filtros?.grupos || []);

        setSubgruposSelecionados(filtros?.subgrupos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      carregar();

      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ========================================
  // CARREGA SUBGRUPOS POR GRUPO
  // ========================================
  useEffect(() => {
    let ativo = true;

    async function carregarSubgrupos() {
      try {
        if (gruposSelecionados.length === 0) {
          setSubgrupos([]);
          setSubgruposSelecionados([]);

          return;
        }

        const resultado =
          await window.api.buscarSubgruposPorGrupo(gruposSelecionados);

        if (!ativo) return;

        setSubgrupos(resultado);

        const idsValidos = resultado.map((x) => String(x.id));

        setSubgruposSelecionados((prev) =>
          prev.filter((id) => idsValidos.includes(id)),
        );
      } catch (error) {
        console.error(error);
      }
    }

    if (isOpen) {
      carregarSubgrupos();
    }

    return () => {
      ativo = false;
    };
  }, [gruposSelecionados, isOpen]);

  // ========================================
  // TOGGLE CHECKBOX
  // ========================================
  function toggleValue(valor, lista, setLista) {
    if (lista.includes(valor)) {
      setLista(lista.filter((x) => x !== valor));
    } else {
      setLista([...lista, valor]);
    }
  }

  // ========================================
  // SALVAR
  // ========================================
  function salvar() {
    onSalvar({
      fabricantes: fabricantesSelecionados,
      grupos: gruposSelecionados,
      subgrupos: subgruposSelecionados,
    });

    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-filtros" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <h2>Filtros de Produtos</h2>

          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="divider" />

        {/* CONTEÚDO */}
        {loading ? (
          <div className="loading-container">Carregando filtros...</div>
        ) : (
          <div className="filtros-grid">
            {/* FABRICANTES */}
            <div className="filtro-card">
              <h3>Fabricantes</h3>

              {fabricantes.map((item) => (
                <label key={item.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={fabricantesSelecionados.includes(String(item.id))}
                    onChange={() =>
                      toggleValue(
                        String(item.id),
                        fabricantesSelecionados,
                        setFabricantesSelecionados,
                      )
                    }
                  />

                  {item.nome}
                </label>
              ))}
            </div>

            {/* GRUPOS */}
            <div className="filtro-card">
              <h3>Grupos</h3>

              {grupos.map((item) => (
                <label key={item.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={gruposSelecionados.includes(String(item.id))}
                    onChange={() =>
                      toggleValue(
                        String(item.id),
                        gruposSelecionados,
                        setGruposSelecionados,
                      )
                    }
                  />

                  {item.nome}
                </label>
              ))}
            </div>

            {/* SUBGRUPOS */}
            <div className="filtro-card">
              <h3>Subgrupos</h3>

              {gruposSelecionados.length === 0 ? (
                <div className="empty-subgrupos">
                  Selecione um grupo para visualizar os subgrupos
                </div>
              ) : (
                subgrupos.map((item) => (
                  <label key={item.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={subgruposSelecionados.includes(String(item.id))}
                      onChange={() =>
                        toggleValue(
                          String(item.id),
                          subgruposSelecionados,
                          setSubgruposSelecionados,
                        )
                      }
                    />

                    {item.nome}
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn btn-primary" onClick={salvar}>
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
