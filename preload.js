const { contextBridge, ipcRenderer } = require("electron");

console.log("PRELOAD FUNCIONANDO");

contextBridge.exposeInMainWorld("api", {
  buscarProdutosPais: () => ipcRenderer.invoke("buscar-produtos-pais"),

  buscarFilhos: (parentId) => ipcRenderer.invoke("buscar-filhos", parentId),

  buscarVendas: (dados) => ipcRenderer.invoke("buscar-vendas", dados),

  buscarGraficoVendas: (dados) =>
    ipcRenderer.invoke("buscar-grafico-vendas", dados),

  buscarFabricantes: () => ipcRenderer.invoke("buscar-fabricantes"),

  buscarGrupos: () => ipcRenderer.invoke("buscar-grupos"),

  buscarSubgrupos: () => ipcRenderer.invoke("buscar-subgrupos"),
});
