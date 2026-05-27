import React, {
  useMemo,
  useState,
} from "react";

import {
  SimpleTreeView,
  TreeItem,
} from "@mui/x-tree-view";

import {
  Box,
  Typography,
} from "@mui/material";

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

    if (
      item.parentId &&
      map[item.parentId]
    ) {

      map[item.parentId]
        .children
        .push(map[item.id]);

    } else {

      raizes.push(map[item.id]);
    }
  });

  return raizes;
}

export default function SidebarProdutos({

  produtos = [],

  setProdutos,

  onSelectionChange,

}) {

  const [expanded,
    setExpanded] =
    useState([]);

  const [selected,
    setSelected] =
    useState([]);

  const produtosEmArvore =
    useMemo(() => {

      return formatarDados(
        produtos
      );

    }, [produtos]);

  // ========================================
  // EXPANDIR
  // ========================================
  async function handleExpanded(
    event,
    itemIds
  ) {

    const novos =
      itemIds.filter(
        (id) =>
          !expanded.includes(id)
      );

    for (const paiId of novos) {

      const pai =
        produtos.find(
          (p) =>
            String(p.id) ===
            String(paiId)
        );

      const jaTemFilhos =
        produtos.some(
          (p) =>
            String(
              p.parentId
            ) ===
            String(paiId)
        );

      if (
        pai?.hasChildren &&
        !jaTemFilhos
      ) {

        const filhos =
          await window.api.buscarFilhos(
            Number(paiId)
          );

        setProdutos((prev) => {

          const ids =
            new Set(
              prev.map(
                (p) => p.id
              )
            );

          const novosFilhos =
            filhos.filter(
              (f) =>
                !ids.has(f.id)
            );

          return [

            ...prev,

            ...novosFilhos,

          ];
        });
      }
    }

    setExpanded(itemIds);
  }

  // ========================================
  // SELEÇÃO
  // ========================================
  function handleSelected(
    event,
    itemIds
  ) {

    const ids =
      Array.isArray(itemIds)
        ? itemIds
        : [itemIds];

    setSelected(ids);

    const selecionados =
      produtos.filter((p) =>
        ids.includes(
          String(p.id)
        )
      );

    onSelectionChange?.(
      selecionados
    );
  }

  // ========================================
  // RENDER ITEM
  // ========================================
  function renderTree(items = []) {

    return items.map((item) => {

      const possuiFilhos =
        item.hasChildren ||
        item.children?.length > 0;

      return (

        <TreeItem
          key={item.id}
          itemId={String(item.id)}

          label={

            <Box
              className="tree-item-content"
            >

              {

                possuiFilhos
                  ? expanded.includes(
                      String(item.id)
                    )

                    ? (
                      <FolderOpenIcon
                        fontSize="small"
                        className="tree-icon"
                      />
                    )

                    : (
                      <FolderIcon
                        fontSize="small"
                        className="tree-icon"
                      />
                    )

                  : (
                    <Inventory2Icon
                      fontSize="small"
                      className="tree-icon"
                    />
                  )
              }

              <Typography
                className="tree-label"
              >
                {item.nome}
              </Typography>

            </Box>
          }
        >

          {
            item.children?.length > 0 &&
            renderTree(item.children)
          }

        </TreeItem>
      );
    });
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

          onExpandedItemsChange={
            handleExpanded
          }

          onSelectedItemsChange={
            handleSelected
          }
        >

          {renderTree(
            produtosEmArvore
          )}

        </SimpleTreeView>

      </div>

    </aside>
  );
}