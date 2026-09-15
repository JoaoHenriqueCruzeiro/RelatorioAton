import React, { useMemo, useState, useEffect, useDeferredValue } from "react";
import SearchProdutos from "./SearchProdutos";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";

import { Box, Typography } from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import "../styles/sidebarProdutos.css";

// ========================================
// MONTA ÁRVORE
// ========================================
function formatarDados(lista) {
  const map = {};
  const raizes = [];

  lista.forEach((item) => {
    map[item.id] = {
      ...item,
      children: [],
    };
  });

  lista.forEach((item) => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      raizes.push(map[item.id]);
    }
  });

  return raizes;
}

const ProdutoItem = React.memo(function ProdutoItem({
  item,
  expanded,
  renderTree,
}) {
  const possuiFilhos = item.childrenCount > 0;

  return (
    <TreeItem
      itemId={String(item.id)}
      label={
        <Box className="tree-item-content">
          {possuiFilhos ? (
            expanded.includes(String(item.id)) ? (
              <FolderOpenIcon fontSize="small" className="tree-icon" />
            ) : (
              <FolderIcon fontSize="small" className="tree-icon" />
            )
          ) : (
            <Inventory2Icon fontSize="small" className="tree-icon" />
          )}

          <Typography className="tree-label">{item.nome}</Typography>
        </Box>
      }
    >
      {item.children?.length > 0 && renderTree(item.children)}

      {possuiFilhos && item.children?.length === 0 && (
        <TreeItem itemId={`placeholder-${item.id}`} label="" />
      )}
    </TreeItem>
  );
});

export default function SidebarProdutos({
  produtos = [],
  setProdutos,
  onSelectionChange,
  selected,
  setSelected,
}) {
  console.time("render sidebar");

  const [expanded, setExpanded] = useState([]);

  const produtosEmArvore = useMemo(() => {
    console.time("formatarDados");

    const resultado = formatarDados(produtos);

    console.timeEnd("formatarDados");

    return resultado;
  }, [produtos]);

  // ========================================
  // EXPANDIR
  // ========================================
  async function handleExpanded(event, itemIds) {
    const novos = itemIds.filter((id) => !expanded.includes(id));

    const promessas = novos.map(async (paiId) => {
      const pai = produtos.find((p) => String(p.id) === String(paiId));

      const jaTemFilhos = produtos.some(
        (p) => String(p.parentId) === String(paiId),
      );

      if (pai?.childrenCount > 0 && !jaTemFilhos) {
        return await window.api.buscarFilhos(Number(paiId));
      }

      return [];
    });

    const resultados = await Promise.all(promessas);

    const filhos = resultados.flat();

    setProdutos((prev) => {
      const ids = new Set(prev.map((x) => x.id));

      const novosFilhos = filhos.filter((x) => !ids.has(x.id));

      return [...prev, ...novosFilhos];
    });

    setExpanded(itemIds);
  }

  function selecionarItemBusca(item) {
  const id = String(item.id);

  let novosSelecionados;

  // Se já está selecionado → remove
  if (selected.includes(id)) {
    novosSelecionados = selected.filter((itemId) => itemId !== id);
  } else {
    // Se não está selecionado → adiciona
    novosSelecionados = [...selected, id];
  }

  setSelected(novosSelecionados);

  const selecionados = produtos.filter((p) =>
    novosSelecionados.includes(String(p.id)),
  );

  onSelectionChange?.(selecionados);
}

  // ========================================
  // SELEÇÃO
  // ========================================
  function handleSelected(event, itemIds) {
    if (!event) return;

    const ids = Array.isArray(itemIds) ? itemIds : [itemIds];

    const shift = event.shiftKey;
    const ctrl = event.ctrlKey || event.metaKey;

    if (shift || ctrl) {
      setSelected(ids);

      const selecionados = produtos.filter((p) => ids.includes(String(p.id)));

      onSelectionChange?.(selecionados);

      return;
    }

    const clicado = ids[ids.length - 1];

    const novosSelecionados = selected.includes(clicado)
      ? selected.filter((id) => id !== clicado)
      : [...selected, clicado];

    setSelected(novosSelecionados);

    const selecionados = produtos.filter((p) =>
      novosSelecionados.includes(String(p.id)),
    );

    onSelectionChange?.(selecionados);
  }

  // ========================================
  // RENDER
  // ========================================
  function renderTree(items = []) {
    return items.map((item) => (
      <ProdutoItem
        key={item.id}
        item={item}
        expanded={expanded}
        renderTree={renderTree}
      />
    ));
  }

  console.timeEnd("render sidebar");

  return (
    <aside className="sidebar-produtos">
      <div className="sidebar-header">
        <h2>Produtos</h2>
      </div>

      <div className="tree-search">
        <SearchProdutos
          onSelecionar={selecionarItemBusca}
          selected={selected}
        />
      </div>

      <div className="tree-container">
        <SimpleTreeView
          multiSelect
          expansionTrigger="iconContainer"
          expandedItems={expanded}
          selectedItems={selected}
          onExpandedItemsChange={handleExpanded}
          onSelectedItemsChange={handleSelected}
        >
          {renderTree(produtosEmArvore)}
        </SimpleTreeView>
      </div>
    </aside>
  );
}
