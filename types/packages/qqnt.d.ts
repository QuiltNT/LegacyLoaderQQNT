type QQNTPackage = {
	"name": "qq-chat",
	"version": string,
	"private": true,
	"description": "QQ",
	"productName": "QQ",
	"author": {
		"name": "Tencent",
		"email": "QQ-Team@tencent.com"
	},
	"homepage": "https://im.qq.com",
	"sideEffects": true,
	"bin": {
		"qd": "externals/devtools/cli/index.js"
	},
	"main": "./application.asar/app_launcher/index.js",
	"buildVersion": string,
	"isPureShell": true,
	"isByteCodeShell": true,
	"platform": "win32",
	"eleArch": "x64"
}

export default QQNTPackage;
