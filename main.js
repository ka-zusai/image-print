const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("save-image", async (event, imageData) => {
  try {
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    const filePath = path.join(app.getPath("pictures"), "saved_image.png");
    fs.writeFileSync(filePath, base64Data, "base64");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
