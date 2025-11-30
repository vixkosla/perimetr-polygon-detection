"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow = null;
// Check if running in development mode
const isDev = !electron_1.app.isPackaged;
const createWindow = async () => {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    if (isDev) {
        await mainWindow.loadURL('http://localhost:5173');
    }
    else {
        const indexHtml = path_1.default.join(__dirname, '../../../dist/index.html');
        await mainWindow.loadFile(indexHtml);
    }
    if (isDev)
        mainWindow.webContents.openDevTools();
};
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
