const { contextBridge, ipcRenderer } = require("electron");

console.log("PRELOAD FUNCIONANDO");

contextBridge.exposeInMainWorld("api", {
  buscarProdutosPais: (filtros) =>
    ipcRenderer.invoke("buscar-produtos-pais", filtros),

  buscarFilhos: (parentId) => ipcRenderer.invoke("buscar-filhos", parentId),

  buscarGraficoVendas: (dados) =>
    ipcRenderer.invoke("buscar-grafico-vendas", dados),

  buscarFabricantes: () => ipcRenderer.invoke("buscar-fabricantes"),

  buscarGrupos: () => ipcRenderer.invoke("buscar-grupos"),

  buscarSubgrupos: () => ipcRenderer.invoke("buscar-subgrupos"),

  buscarSubgruposPorGrupo: (grupos) =>
    ipcRenderer.invoke("buscar-subgrupos-por-grupo", grupos),

  buscarResumoVendas: (dados) =>
    ipcRenderer.invoke("buscar-resumo-vendas", dados),
});
