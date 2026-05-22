import React, { useMemo } from "react";
import { TreeView, TreeViewItem, TreeViewItemContent } from "@adobe/react-spectrum"; 
import "../styles/sidebarProdutos.css";

// Monta a estrutura de árvore (Pronto para API)
function formatarDadosParaArvore(lista) {
  const map = {};
  const raizes = [];

  lista.forEach((item) => {
    map[item.id] = { ...item, childItems: [] };
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

  return { raizes, mapaCompleto: map };
}

export default function SidebarProdutos({ produtos = [], onSelectionChange }) {
  
  const { produtosEmArvore, produtosMap, chavesExpandidasId } = useMemo(() => {
    const { raizes, mapaCompleto } = formatarDadosParaArvore(produtos);
    
    const idsExpandidos = Object.values(mapaCompleto)
      .filter(p => p.isPaiReal)
      .map(p => String(p.id));

    return {
      produtosEmArvore: raizes,
      produtosMap: mapaCompleto,
      chavesExpandidasId: idsExpandidos
    };
  }, [produtos]);

  function handleSelectionChange(keys) {
    if (keys === "all") {
      onSelectionChange?.(produtos.filter((p) => !produtosMap[p.id]?.isPaiReal));
      return;
    }

    const produtosSelecionados = [];

    keys.forEach((keyStr) => {
      const itemOriginal = produtosMap[keyStr];
      if (itemOriginal) {
        if (itemOriginal.isPaiReal) {
          const filhos = produtos.filter((p) => String(p.parentId) === keyStr);
          produtosSelecionados.push(...filhos);
        } else {
          produtosSelecionados.push(itemOriginal);
        }
      }
    });

    const produtosUnicos = [
      ...new Map(produtosSelecionados.map((p) => [p.id, p])).values(),
    ];

    onSelectionChange?.(produtosUnicos);
  }

  /* 
    FUNÇÃO RECURSIVA DE RENDERIZAÇÃO:
    Garante que o Spectrum monte os filhos de forma estrita e visível,
    não importa quantos níveis a API traga no futuro.
  */
  const renderizarNosDaArvore = (itens) => {
    return itens.map((item) => (
      <TreeViewItem 
        key={String(item.id)} 
        id={String(item.id)} 
        textValue={item.nome}
      >
        <TreeViewItemContent>
          {item.nome}
        </TreeViewItemContent>
        
        {/* Se o item atual contiver filhos, renderiza-os dentro dele seguindo a regra do Spectrum */}
        {item.childItems && item.childItems.length > 0 && renderizarNosDaArvore(item.childItems)}
      </TreeViewItem>
    ));
  };

  return (
    <aside className="sidebar-produtos">
      <div className="sidebar-header">
        <h2>Produtos</h2>
      </div>

      {/* 
        Passando a renderização estática/recursiva direta dentro do TreeView,
        o Spectrum não se perde com o mapeamento dinâmico implícito.
      */}
      <TreeView
        aria-label="Árvore de Produtos"
        selectionMode="multiple"
        onSelectionChange={handleSelectionChange}
        defaultExpandedKeys={chavesExpandidasId}
      >
        {renderizarNosDaArvore(produtosEmArvore)}
      </TreeView>
    </aside>
  );
}