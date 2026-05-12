import { useState } from "react";

import TreeView from "devextreme-react/tree-view";

import "../styles/sidebarProdutos.css";

export default function SidebarProdutos({
  produtos = [],
  onSelectionChange,
}) {
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleSelectionChanged = (e) => {
    const keys = e.component.getSelectedNodeKeys();

    setSelectedKeys(keys);

    const selectedItems = [];

    e.component.getSelectedNodes().forEach((node) => {
      // evita categorias
      if (!node.itemData.isCategory) {
        selectedItems.push(node.itemData);
      }
    });

    onSelectionChange?.(selectedItems);
  };

  return (
    <aside className="sidebar-produtos">
      <div className="sidebar-header">
        <h2>Produtos</h2>
      </div>

      <TreeView
        items={produtos}
        dataStructure="tree"
        keyExpr="id"
        parentIdExpr="parentId"
        displayExpr="nome"
        searchEnabled={true}
        searchMode="contains"
        searchEditorOptions={{
          placeholder: "Buscar produto...",
        }}
        selectionMode="multiple"
        showCheckBoxesMode="normal"
        selectNodesRecursive={false}
        expandNodesRecursive={true}
        onSelectionChanged={handleSelectionChanged}
      />
    </aside>
  );
}