const electron = require('electron')
const path = require('path');
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const webtorrent = require('webtorrent')
const fs = require('fs');
const request = require('request');

global['wt'] = new webtorrent();
global['path'] = path;
global['app'] = app;
global['fs'] = fs;
global['shell'] = electron.shell;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true
let win
const args = process.argv.slice(1)
const serve = args.some(val => val === '--serve')

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

const installerPath = path.join(app.getPath('downloads'), 'Cereal.exe');

const {ipcMain} = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

function checkUpdates() {
  return new Promise((resolve, reject) => {
    try {
      request({url: 'https://raw.githubusercontent.com/samCrock/cereal-3/master/package.json'},
        function (err, data) {
          if (err) {
            resolve(1);
          }
          remoteVersion = JSON.parse(data.body).version;
          console.log('Remote version:', remoteVersion);
          console.log('Local version:', app.getVersion());
          global['update'] = remoteVersion !== app.getVersion();
          // global['update'] = true;
          resolve(1);
        });
    } catch (e) {
      console.log('Cannot perform request', e);
      resolve(0);
    }
  })
}

function createWindow() {
  debugger
  win = new BrowserWindow({
    width: 1800,
    height: 1200,
    center: true,
    // icon: path.join(__dirname, './resources/electron/icons/64x64.png'),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false,
      enableRemoteModule: true,
      contextIsolation: false,
      webSecurity: false
    }
  })

  win.setMenu(null)

  if (serve) {
    win.loadURL('http://localhost:4200')
  } else {
    win.loadURL(`file://${__dirname}/www/index.html`)
  }

  console.log(`Node Environment: ${process.env.NODE_ENV}`)

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

try {
  app.on('ready', () => {
      console.log('Checking updates..');
      checkUpdates().then(code => {
        console.log('Exit code:', code);
        createWindow();
      }, error => {
        console.log('Updater error:', error);
      });
    }
  );
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  throw e;
}
