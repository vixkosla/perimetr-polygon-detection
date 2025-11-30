import { app, BrowserWindow } from 'electron'
import path from 'path'

let mainWindow: BrowserWindow | null = null;

// Check if running in development mode
const isDev = !app.isPackaged;

const createWindow = async() => {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
		},
	})

	if (isDev) {
		await mainWindow.loadURL('http://localhost:5173')
	} else {
		const indexHtml = path.join(__dirname, '../../../dist/index.html')
		await mainWindow.loadFile(indexHtml)
	}

	if (isDev) mainWindow.webContents.openDevTools()
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
		app.quit();
})
