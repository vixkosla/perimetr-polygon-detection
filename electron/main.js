"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
let mainWindow = null;
const createWindow = async () => {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
        },
    });
    const url = electron_is_dev_1.default ? 'http://localhost:5173' :
        `file://${path_1.default.join(__dirname, '../dist/index.html')}`;
    await mainWindow.loadURL(url);
    if (electron_is_dev_1.default)
        mainWindow.webContents.openDevTools();
};
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
