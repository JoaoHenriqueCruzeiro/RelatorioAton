import React, { useMemo, useState } from "react";

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
}) {
  const [expanded, setExpanded] = useState([]);

  const [selected, setSelected] = useState([]);

  const produtosEmArvore = useMemo(() => {
    return formatarDados(produtos);
  }, [produtos]);

  // ========================================
  // EXPANDIR
  // ========================================
  async function handleExpanded(event, itemIds) {
  const novos = itemIds.filter(
    (id) => !expanded.includes(id),
  );

  const promessas = novos.map(async (paiId) => {
    const pai = produtos.find(
      (p) => String(p.id) === String(paiId),
    );

    const jaTemFilhos = produtos.some(
      (p) => String(p.parentId) === String(paiId),
    );

    if (pai?.childrenCount > 0 && !jaTemFilhos) {
      return await window.api.buscarFilhos(
        Number(paiId),
      );
    }

    return [];
  });

  const resultados = await Promise.all(promessas);

  const filhos = resultados.flat();

  setProdutos((prev) => {
    const ids = new Set(prev.map((x) => x.id));

    const novosFilhos = filhos.filter(
      (x) => !ids.has(x.id),
    );

    return [...prev, ...novosFilhos];
  });

  setExpanded(itemIds);
}

  // ========================================
  // SELEÇÃO
  // ========================================
  function handleSelected(event, itemIds) {
    const ids = Array.isArray(itemIds) ? itemIds : [itemIds];

    setSelected(ids);

    const selecionados = produtos.filter((p) => ids.includes(String(p.id)));

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

  return (
    <aside className="sidebar-produtos">
      <div className="sidebar-header">
        <h2>Produtos</h2>
      </div>

      <div className="tree-container">
        <SimpleTreeView
          multiSelect
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
