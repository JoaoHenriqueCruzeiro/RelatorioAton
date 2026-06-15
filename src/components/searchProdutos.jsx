import { useState, useMemo, useEffect } from "react";

export default function SearchProdutos({ onSelecionar }) {
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

    if (!termo) return [];

    return todosProdutos
      .filter((p) => p.nomeBusca.includes(termo))
      .slice(0, 15);
  }, [search, todosProdutos]);

  return (
    <div className="tree-search">
      <input
        type="text"
        placeholder="Buscar produto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {resultados.length > 0 && (
        <div className="search-results">
          {resultados.map((item) => (
            <div
              key={item.id}
              className="search-item"
              onClick={() => onSelecionar(item)}
            >
              {item.nome}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
