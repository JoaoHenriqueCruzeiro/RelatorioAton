const path = require("path");

const { app, BrowserWindow, ipcMain } = require("electron");

const {
  buscarProdutosPais,
  buscarFilhos,
  buscarFabricantes,
  buscarGrupos,
  buscarSubgrupos,
  buscarSubgruposPorGrupo,
  buscarIdsRelacionados,
  buscarTodosProdutosPesquisa,
  buscarProdutosPorFiltro,
} = require("./src/backend/queries/produtosQuery");

const { buscarGraficoVendas } = require("./src/backend/queries/graficoQuery");

const { buscarResumoVendas } = require("./src/backend/queries/resumoQuery");

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

    icon: path.join(__dirname, "assets/icons/icon.png"),
  });

  //  win.setMenu(null);

    if (!app.isPackaged) {
      win.loadURL("http://localhost:5173");
    } else {
      win.setMenu(null)
      win.loadFile(path.join(__dirname, "dist", "index.html"));
    }
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
  
ipcMain.handle("buscar-ids-relacionados", async (_, filtros) => {
  return await buscarIdsRelacionados(filtros);
});

ipcMain.handle("buscar-grafico-vendas", async (_, dados) => {
  console.log("DADOS RECEBIDOS:");
  console.log(dados);

  return await buscarGraficoVendas(dados);
});

ipcMain.handle("buscar-resumo-vendas", async (_, dados) => {
  return await buscarResumoVendas(dados);
});

ipcMain.handle("buscar-todos-produtos-pesquisa", async () => {
  return await buscarTodosProdutosPesquisa();
});

ipcMain.handle("buscar-produtos-por-filtro", async (_, filtros) => {
  return await buscarProdutosPorFiltro(filtros);
});

app.whenReady().then(createWindow);
