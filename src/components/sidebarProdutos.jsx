import TreeView from "devextreme-react/tree-view";

import "../styles/sidebarProdutos.css";

export default function SidebarProdutos({
  produtos = [],
  onSelectionChange,
}) {

  function handleSelectionChanged(e) {

    const selectedNodes =
      e.component.getSelectedNodes();

    const produtosSelecionados = [];

    selectedNodes.forEach((node) => {

      // PAI
      if (node.itemData.isPai) {

        node.children.forEach((child) => {

          produtosSelecionados.push(
            child.itemData
          );

        });

      }

      // FILHO
      else {

        produtosSelecionados.push(
          node.itemData
        );

      }

    });

    // REMOVE DUPLICADOS
    const produtosUnicos = [
      ...new Map(
        produtosSelecionados.map((p) => [
          p.id,
          p,
        ])
      ).values(),
    ];

    onSelectionChange?.(produtosUnicos);
  }

  return (

    <aside className="sidebar-produtos">

      <div className="sidebar-header">
        <h2>Produtos</h2>
      </div>

      <TreeView
        items={produtos}

        dataStructure="plain"

        keyExpr="id"

        parentIdExpr="parentId"

        displayExpr="nome"

        searchEnabled={true}

        searchMode="contains"

        selectionMode="multiple"

        showCheckBoxesMode="normal"

        selectByClick={true}

        expandNodesRecursive={false}

        onSelectionChanged={
          handleSelectionChanged
        }
      />

    </aside>
  );
}