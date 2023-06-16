const { BrowserWindow, webContents, app } = require("electron");
const electron = require("electron");

app.disableHardwareAcceleration();

const basepath = process.cwd();

require("child_process").exec(
  `cd ${basepath}\\resources\\app & node server.js`
);

const createWindow = () => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 1400,
    minHeight: 900,
    resizable: false,
    title: "فروشگاه مردانی",
    icon: `${basepath}\\icon.png`,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.removeMenu();
  win.loadURL("http://localhost:8080");

  win.on("ready-to-show", async () => {
    win.show();
    win.maximize();
  });
};

app.commandLine.appendSwitch("enable-experimental-web-platform-features");

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
