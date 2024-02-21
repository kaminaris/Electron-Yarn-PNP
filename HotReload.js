const spawn = require('cross-spawn').spawn;
const path = require('node:path');
const {exec} = require('node:child_process');
const process = require('node:process');

class ProcessManager {

	constructor(options) {
		this.electronProc = null;

		let electron;
		if (options && options.useGlobalElectron) {
			electron = 'electron';
		}
		else {
			try {
				electron = require('electron');
			}
			catch (e) {
				if (e.code === 'MODULE_NOT_FOUND') {
					electron = 'electron';
				}
			}
		}

		this.opt = {
			...{
				electron,
				path: process.cwd(),
				spawnOpt: {stdio: 'inherit'},
				args: []
			},
			...(options || {}),
		};
	}

	killAll(pid, signal = 'SIGTERM') {
		if (process.platform === "win32") {
			exec(`taskkill /PID ${pid} /T /F`, (error, stdout, stderr) => {
				console.log("taskkill stdout: " + stdout)
				console.log("taskkill stderr: " + stderr)
				if (error) {
					console.log("error: " + error.message)
				}
			})
		}
		else {
			// see https://nodejs.org/api/child_process.html#child_process_options_detached
			// If pid is less than -1, then sig is sent to every process in the process group whose ID is -pid.
			process.kill(-pid, signal)
		}
	}

	spawn(spawnOpt) {
		const args = ['-r process', this.opt.path];
		args.push(...this.opt.args);
		this.info(`starting electron with args: ${this.opt.electron} ${args.join(' ')}`);
		spawnOpt.cwd = path.join(process.cwd(), 'electron');
		this.electronProc = spawn('yarn', ['run', 'electron', '.', '--serve'], spawnOpt);
		this.info(`started electron process: ${this.electronProc.pid}`);

	}

	info(msg) {
		console.log(`[${new Date().toISOString()}] [webpack-electron-reload] [server] ${msg}`);
	}

	verbose(msg) {
		console.log(`[${new Date().toISOString()}] [webpack-electron-reload] [server] ${msg}`);
	}

	start() {
		this.spawn(this.opt.spawnOpt);
	}

	restart() {
		if (this.electronProc) {
			this.info(`killing electron process: ${this.electronProc.pid}`);
			try {
				this.killAll(this.electronProc.pid);
			}
			catch (error) {
				console.error(error);
			}
			this.info('respawning electron process..');
			this.spawn(this.opt.spawnOpt);
		}
	}
}

function createWebpackElectronReloadPlugin(options) {
	let server;

	return function () {
		return {
			apply: function apply(compiler) {
				compiler.hooks.done.tap('WebpackElectronReload', () => {
					if (!server) {
						server = new ProcessManager(options || {});
						server.start();
					}
					else {
						server.restart();
					}
				});
			},
		};
	};
}

module.exports = createWebpackElectronReloadPlugin;