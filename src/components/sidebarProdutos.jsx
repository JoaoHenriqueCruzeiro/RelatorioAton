import React, { useMemo, useState } from "react";
import {
  TreeView,
  TreeViewItem,
  TreeViewItemContent,
} from "@adobe/react-spectrum";

import "../styles/sidebarProdutos.css";

// ========================================
// MONTA ÁRVORE
// ========================================
function formatarDadosParaArvore(lista) {
  const map = {};
  const raizes = [];

  lista.forEach((item) => {
    map[item.id] = {
      ...item,
      childItems: [],
    };
  });

  lista.forEach((item) => {
    if (item.parentId) {
      if (map[item.parentId]) {
        map[item.parentId].childItems.push(map[item.id]);
        map[item.parentId].isPaiReal = true;
      }
    } else {
      raizes.push(map[item.id]);
    }
  });

  return {
    raizes,
    mapaCompleto: map,
  };
}

// ========================================
// PEGA TODOS FILHOS RECURSIVOS
// ========================================
function pegarTodosFilhos(item) {
  let filhos = [];

  if (item.childItems?.length) {
    item.childItems.forEach((filho) => {
      filhos.push(filho);
      filhos.push(...pegarTodosFilhos(filho));
    });
  }

  return filhos;
}

export default function SidebarProdutos({ produtos = [], onSelectionChange }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  const { produtosEmArvore, produtosMap, chavesExpandidasId } = useMemo(() => {
    const { raizes, mapaCompleto } = formatarDadosParaArvore(produtos);

    const idsExpandidos = Object.values(mapaCompleto)
      .filter((p) => p.isPaiReal)
      .map((p) => String(p.id));

    return {
      produtosEmArvore: raizes,
      produtosMap: mapaCompleto,
      chavesExpandidasId: idsExpandidos,
    };
  }, [produtos]);

  // ========================================
  // CONTROLE DE SELEÇÃO
  // ========================================
  function handleSelectionChange(keys) {
    if (keys === "all") return;

    const novoSet = new Set([...keys].map(String));
    const atualSet = new Set([...selectedKeys]);

    // ====================================
    // DESCOBRE O ITEM ALTERADO
    // ====================================
    let itemAlterado = null;
    let foiSelecionado = false;

    // item adicionado
    for (const key of novoSet) {
      if (!atualSet.has(key)) {
        itemAlterado = key;
        foiSelecionado = true;
        break;
      }
    }

    // item removido
    if (!itemAlterado) {
      for (const key of atualSet) {
        if (!novoSet.has(key)) {
          itemAlterado = key;
          foiSelecionado = false;
          break;
        }
      }
    }

    const resultado = new Set(novoSet);

    // ====================================
    // ITEM SELECIONADO
    // ====================================
    if (itemAlterado && foiSelecionado) {
      const item = produtosMap[itemAlterado];

      // seleciona todos filhos
      if (item?.childItems?.length) {
        const filhos = pegarTodosFilhos(item);

        filhos.forEach((filho) => {
          resultado.add(String(filho.id));
        });
      }
    }

    // ====================================
    // ITEM REMOVIDO
    // ====================================
    if (itemAlterado && !foiSelecionado) {
      const item = produtosMap[itemAlterado];

      // remove todos filhos
      if (item?.childItems?.length) {
        const filhos = pegarTodosFilhos(item);

        filhos.forEach((filho) => {
          resultado.delete(String(filho.id));
        });
      }

      // remove pais acima
      Object.values(produtosMap).forEach((pai) => {
        if (!pai.isPaiReal) return;

        const filhos = pegarTodosFilhos(pai);

        const todosSelecionados = filhos.every((filho) =>
          resultado.has(String(filho.id)),
        );

        if (!todosSelecionados) {
          resultado.delete(String(pai.id));
        }
      });
    }

    // ====================================
    // AUTO-SELECIONA PAIS
    // ====================================
    Object.values(produtosMap).forEach((pai) => {
      if (!pai.isPaiReal) return;

      const filhos = pegarTodosFilhos(pai);

      const todosSelecionados = filhos.every((filho) =>
        resultado.has(String(filho.id)),
      );

      if (todosSelecionados) {
        resultado.add(String(pai.id));
      }
    });

    setSelectedKeys(resultado);

    // ====================================
    // RETORNA APENAS FOLHAS
    // ====================================
    const produtosSelecionados = [];

    resultado.forEach((key) => {
      const item = produtosMap[key];

      if (item && !item.isPaiReal) {
        produtosSelecionados.push(item);
      }
    });

    onSelectionChange?.(produtosSelecionados);
  }

  // ========================================
  // RENDER RECURSIVO
  // ========================================
  const renderizarNosDaArvore = (itens) => {
    return itens.map((item) => (
      <TreeViewItem
        key={String(item.id)}
        id={String(item.id)}
        textValue={item.nome}
      >
        <TreeViewItemContent>{item.nome}</TreeViewItemContent>

        {item.childItems?.length > 0 && renderizarNosDaArvore(item.childItems)}
      </TreeViewItem>
    ));
  };

  return (
    <aside className="sidebar-produtos">
      <div className="sidebar-header">
        <h2>Produtos</h2>
      </div>

      <TreeView
        aria-label="Árvore de Produtos"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        defaultExpandedKeys={chavesExpandidasId}
      >
        {renderizarNosDaArvore(produtosEmArvore)}
      </TreeView>
    </aside>
  );
}
