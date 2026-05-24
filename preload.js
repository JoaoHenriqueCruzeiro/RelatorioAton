const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  buscarProdutos: () => ipcRenderer.invoke("buscar-produtos"),
});
