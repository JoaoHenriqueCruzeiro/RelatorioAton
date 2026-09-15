import { useState, useMemo, useEffect } from "react";

export default function SearchProdutos({
  onSelecionar,
  selected = [],
}) {
  const [search, setSearch] = useState("");
  const [todosProdutos, setTodosProdutos] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const lista = await window.api.buscarTodosProdutosPesquisa();

        setTodosProdutos(
          lista.map((p) => ({
            ...p,
            nomeBusca: p.nome.toLowerCase(),
          })),
        );
      } catch (err) {
        console.error(err);
      }
    }

    carregar();
  }, []);

  const resultados = useMemo(() => {
    const termo = search.trim().toLowerCase();

    // Sem caracteres → não mostra resultados
    if (!termo) return [];

    return todosProdutos
      .filter((p) => p.nomeBusca.includes(termo))
      .slice(0, 15);
  }, [search, todosProdutos]);

  function limparBusca() {
    setSearch("");
  }

  function selecionar(item) {
    onSelecionar(item);
  }

  return (
    <div className="tree-search">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search.length > 0 && (
          <button
            type="button"
            className="search-clear"
            onClick={limparBusca}
            aria-label="Limpar busca"
          >
            ×
          </button>
        )}
      </div>

      {resultados.length > 0 && (
        <div className="search-results">
          {resultados.map((item) => {
            const selecionado = selected.includes(String(item.id));

            return (
              <div
                key={item.id}
                className={`search-item ${
                  selecionado ? "search-item-selected" : ""
                }`}
                onClick={() => selecionar(item)}
              >
                <span>{item.nome}</span>

                {selecionado && (
                  <span className="search-selected-icon">
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}