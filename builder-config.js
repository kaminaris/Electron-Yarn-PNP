const path = require('node:path');
const {execSync} = require('node:child_process');
const process = require('node:process');

let buildType = process.env.ELECTRON_BUILD_TYPE ?? 'main';

console.log('BUILDING APP AS ' + buildType);

const licence = 'dist-angular/browser/assets/licence/licence.txt';
const installerIcon = 'dist-angular/browser/assets/icons/setup.ico';

let guid;
let appId;
let appUrl;
let publisher;
let brand;
let productName;

guid = '9356E57B-ED75-4134-9417-63FB55BFD95C'; // CHANGE IT TO SOMETHING UNIQUE
appId = 'com.your.app';
appUrl = 'https://example.com/';
publisher = 'Your publisher';
brand = 'Elec'
productName = 'ElectronBoilerplate';


let copyright = 'Copyright © 2024 ' + publisher;
let portableName = productName + '_v${version}.${ext}';
let artifactName = productName + '_v${version}.Setup.${ext}';

module.exports = {
	asar: true,
	appId: appId,
	productName: productName,
	copyright: copyright,
	electronVersion: '29.0.0',
	extraMetadata: {
		main: 'dist-electron/main.js',
	},
	directories: {
		app: '.',
		buildResources: 'build',
		output: `electron/release-${buildType}/`
	},
	files: [
		'!**/*',
		// Copy main application
		{
			from: './electron/dist-electron',
			to: 'dist-electron',
			filter: ['**/*']
		},
		// Copy angular
		{
			from: './dist-angular/browser',
			to: 'dist-angular',
			filter: ['**/*']
		},
		{
			from: './electron',
			to: './',
			filter: ['package.json']
		},
		'./electron/package.json'
	],
	extraResources: [],
	nsis: {
		guid: guid,
		oneClick: false,
		allowToChangeInstallationDirectory: true,
		installerIcon: installerIcon,
		license: licence,
		artifactName: artifactName,
		deleteAppDataOnUninstall: true,
		createDesktopShortcut: false,
		createStartMenuShortcut: false,
		// include: buildScript
	},

	afterAllArtifactBuild: async (buildResult) => {

	},
	win: {
		icon: './dist-angular/browser/assets/icons/favicon.ico',
		artifactName: artifactName,
		target: [
			'portable', 'appx'
		]
	},
	appx: {
		applicationId: appId,
	},
	portable: {
		splashImage: './dist-angular/browser/assets/icons/electron.png',
		artifactName: portableName
	},
	mas: {
		hardenedRuntime: false, //IMPORTANT!!!!
		type: "distribution",
		category: "public.app-category.utilities",
	},
	mac: {
		appId: appId,
		icon: './dist-angular/browser/assets/icons/ios/icon_512x512@2x.icns',
		hardenedRuntime: true,
		gatekeeperAssess: false,
		asar: true,
		asarUnpack: '**/*.node',
		target: [

			{target: 'mas', arch: 'x64'},
			{target: 'mas', arch: 'arm64'},
//			{ target: 'pkg', arch: 'x64' },
//            'zip'
//			{ target: 'dmg', arch: 'x64' },
//			{ target: 'pkg', arch: 'arm64' },
// 			{ target: 'dmg', arch: 'arm64' },
		]
	},
	linux: {
		icon: './dist-angular/browser/assets/icons/favicon.ico',
		target: [
			'AppImage'
		]
	}
};
