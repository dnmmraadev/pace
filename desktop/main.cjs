const { app, BrowserWindow, Menu, protocol, net, shell, session } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

// A stable local origin keeps progress independent of install/extraction paths.
protocol.registerSchemesAsPrivileged([
  { scheme: 'pace', privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);
app.setName('PACE');
app.setAppUserModelId('local.pace.analyst');
// QA uses a separate profile; ordinary launches keep the standard PACE profile.
if (process.env.PACE_TEST_PROFILE) app.setPath('userData', process.env.PACE_TEST_PROFILE);

let window;
const root = path.resolve(__dirname, '../dist');
const openReference = (url) => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') void shell.openExternal(parsed.href);
  } catch {
    /* Ignore malformed destinations. */
  }
};

async function createWindow() {
  window = new BrowserWindow({
    title: 'PACE',
    width: 1440,
    height: 1000,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#FFFFFF',
    show: false,
    icon: path.join(__dirname, '../dist/brand/pace-logo.png'),
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true },
  });
  window.once('ready-to-show', () => window.show());
  window.webContents.setWindowOpenHandler(({ url }) => {
    openReference(url);
    return { action: 'deny' };
  });
  window.webContents.on('will-navigate', (event, url) => {
    if (url !== 'pace://app/index.html') {
      event.preventDefault();
      openReference(url);
    }
  });
  await window.loadURL('pace://app/index.html');
}

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => {
    if (window) {
      if (window.isMinimized()) window.restore();
      window.show();
      window.focus();
    }
  });
  app.whenReady().then(async () => {
    protocol.handle('pace', async (request) => {
      try {
        const url = new URL(request.url);
        if (url.hostname !== 'app' || request.method !== 'GET')
          return new Response('Not found', { status: 404 });
        const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
        if (!file.startsWith(root + path.sep)) return new Response('Forbidden', { status: 403 });
        return await net.fetch(pathToFileURL(file).href);
      } catch {
        return new Response('Not found', { status: 404 });
      }
    });
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) =>
      callback(false),
    );
    session.defaultSession.setPermissionCheckHandler(() => false);
    session.defaultSession.webRequest.onHeadersReceived((details, callback) =>
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-src 'none'",
          ],
        },
      }),
    );
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([
        { label: 'Archivo', submenu: [{ role: 'quit', label: 'Salir de PACE' }] },
        {
          label: 'Editar',
          submenu: [
            { role: 'undo', label: 'Deshacer' },
            { role: 'redo', label: 'Rehacer' },
            { type: 'separator' },
            { role: 'cut', label: 'Cortar' },
            { role: 'copy', label: 'Copiar' },
            { role: 'paste', label: 'Pegar' },
            { role: 'selectAll', label: 'Seleccionar todo' },
          ],
        },
        {
          label: 'Ver',
          submenu: [
            { role: 'reload', label: 'Recargar' },
            { role: 'resetZoom', label: 'Restablecer zoom' },
            { role: 'zoomIn', label: 'Acercar' },
            { role: 'zoomOut', label: 'Alejar' },
            { role: 'togglefullscreen', label: 'Alternar pantalla completa' },
          ],
        },
        {
          label: 'Ventana',
          submenu: [
            { role: 'minimize', label: 'Minimizar' },
            { role: 'close', label: 'Cerrar' },
          ],
        },
      ]),
    );
    await createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) void createWindow();
    });
  });
  app.on('window-all-closed', () => app.quit());
}
