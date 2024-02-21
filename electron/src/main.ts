import { app, BrowserWindow, ipcMain } from 'electron';
import path                            from 'path';
import process                         from 'node:process';
import fs                              from 'fs';
import url                             from 'url';

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		center: true,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			devTools: serve
		}
	});

	ipcMain.on('ping', async (event: Electron.IpcMainEvent) => {
		event.returnValue = 'pong';
	});

	if (serve) {
		console.log('SERVING app');
		win.webContents.openDevTools();
		win.loadURL('http://localhost:4200').catch(console.error);
	}
	else {
		console.log('LOADING app');
		// Path when running electron in local folder
		const distPath = 'dist-angular/index.html';

		if (!fs.existsSync(path.join(__dirname, '../', distPath))) {
			// Path when running electron executable
			win.loadFile(distPath).catch(console.error);
			console.log('Executable mode');
		}
		else {
			const newPath = path.join(__dirname, '..', distPath);
			const newUrl = url.format({
				pathname: newPath,
				protocol: 'file:',
				slashes: true
			});
			win.loadURL(newUrl).catch(console.error);
			console.log('Standalone mode');
		}
	}
}

app.whenReady().then(() => {
	createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	app.quit();
});

app.on('quit', () => {
	app.exit(0);
	process.kill(process.pid, 'SIGKILL');
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});