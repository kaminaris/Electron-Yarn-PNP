const path = require('path');

const HotReloadPlugin = require('./HotReload.js')({
	path: path.join(__dirname), //'./dist-electron/main.js'
	logLevel: 0,
	args: ['--serve']
});

module.exports = (env) => {
	console.log(env);

	const plugins = [];
	if (env.serve) {
		plugins.push(HotReloadPlugin());
	}

	return {
		entry: {
			main: './electron/src/main.ts',
			preload: './electron/src/preload.ts',
		},
		target: 'electron29-main',
		mode: env.prod ? 'production' : 'development',
		devtool: false,
		node: {
			__dirname: false
		},
		output: {
			path: path.resolve(__dirname, 'electron', 'dist-electron'),
			filename: '[name].js'
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js', '.cjs']
		},
		plugins: plugins,
		externals: [],
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: [{
						loader: 'ts-loader',
						options: {
							configFile: "tsconfig.electron.json"
						}
					}],
					exclude: [
						/node_modules/,
					]
				},
				{
					test: /\.node$/,
					loader: 'node-loader',
					options: {
						name: '[name].node'
					}
				},
			],
		},
	};
};
