const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("path");

// ======================================
// QUERY
// ======================================
const { buscarProdutos } = require("./src/backend/queries/produtosQuery");

// ======================================
// DEV OU BUILD
// ======================================
const isDev = !app.isPackaged;

// ======================================
// JANELA
// ======================================
function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),

      contextIsolation: true,

      nodeIntegration: false,
    },
  });

  // ====================================
  // DEV
  // ====================================
  if (isDev) {
    win.loadURL("http://localhost:5173");
  }

  // ====================================
  // BUILD
  // ====================================
  else {
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }

}

// ======================================
// IPC
// ======================================
ipcMain.handle("buscar-produtos", async () => {
  return await buscarProdutos();
});

// ======================================
// READY
// ======================================
app.whenReady().then(() => {
  createWindow();
});
