module.exports = [
	{
		mode: 'development',
		entry: './src/index.ts',
		target: 'electron-main',
		// target: 'electron-renderer',
		devtool: false,
		module: {
			rules: [{
				test: /\.ts$/,
				include: /src/,
				use: [{loader: 'ts-loader'}]
			}]
		},
		externals: [],
		output: {
			path: __dirname + '/electron/dist-electron',
			filename: 'index.js'
		}
	}
];