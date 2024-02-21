import { contextBridge, ipcRenderer } from 'electron';

console.log('User Preload!');

const publicApi = {
	ping: async () => {
		return await ipcRenderer.sendSync('ping');
	}
}

contextBridge.exposeInMainWorld('publicApi', publicApi);