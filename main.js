const path = require("path");

const { app, BrowserWindow, ipcMain } = require("electron");

const {
  buscarProdutosPais,
  buscarFilhos,
  buscarFabricantes,
  buscarGrupos,
  buscarSubgrupos,
  buscarSubgruposPorGrupo,
} = require("./src/backend/queries/produtosQuery");

const {
  buscarGraficoVendas,
} = require("./src/backend/queries/graficoQuery");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),

      contextIsolation: true,

      nodeIntegration: false,

      sandbox: false,
    },
  });

  // ✅ CORRETO
  win.loadURL("http://localhost:5173");
}

// =====================================
// IPC
// =====================================

ipcMain.handle("buscar-produtos-pais", async (_, filtros) => {
  console.log(filtros);
  return await buscarProdutosPais(filtros);
});

ipcMain.handle(
  "buscar-filhos",

  async (_, paiId) => {
    return await buscarFilhos(paiId);
  },
);

ipcMain.handle("buscar-fabricantes", async () => {
  return await buscarFabricantes();
});

ipcMain.handle("buscar-grupos", async () => {
  return await buscarGrupos();
});

ipcMain.handle("buscar-subgrupos", async () => {
  return await buscarSubgrupos();
});

ipcMain.handle("buscar-subgrupos-por-grupo", async (_, grupos) => {
  return await buscarSubgruposPorGrupo(grupos);
});

ipcMain.handle(
  "buscar-grafico-vendas",
  async (_, dados) => {
    return await buscarGraficoVendas(dados);
  },
);

app.whenReady().then(createWindow);
