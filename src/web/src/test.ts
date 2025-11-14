
	// @ts-ignore
	window.LegacyLoader = window.LiteLoader = <LegacyLoaderRenderer>{
		versions: {
			legacyloader: '1.0.0',
			liteloader: '1.3.0-legacyloader_compact',
			qqnt: '9.9.15-1145',
			chrome: '142.0.0',
			electron: '34.0.0',
			node: '22.15.0'
		},
		plugins: {
			test: {
				manifest: {
					name: 'Test Plugin',
					slug: 'test',
					version: '1.0.0',
					authors: [{name: 'QuiltNT'}],
					description: 'A test plugin for LegacyLoader'
				},
				incompatible: false,
				disabled: false,
				path: {
					plugin: null,
					data: null,
					injects: {
						renderer: null,
						preload: null,
						main: null
					}
				}
			},
			'test-error': {
				manifest: {
					name: 'Test Error Plugin',
					slug: 'test-error',
					version: '1.0.0',
					authors: [{name: 'QuiltNT'}],
					description: 'A test error plugin for LegacyLoader'
				},
				incompatible: false,
				disabled: false,
				path: {
					plugin: null,
					data: null,
					injects: {
						renderer: null,
						preload: null,
						main: null
					}
				},
				error: new Error('Test Error'),
			},
			mspring_theme: {
				manifest: JSON.parse(`{
    "manifest_version": 4,
    "type": "theme",
    "name": "MSpring Theme",
    "slug": "mspring_theme",
    "description": "LiteLoaderQQNT 主题，优雅 · 粉粉 · 细致",
    "version": "1.5.3",
    "icon": "./res/icon.png",
    "thumb": "./res/brush_FILL0_wght300_GRAD0_opsz24.svg",
    "authors": [
        {
            "name": "MUKAPP",
            "link": "https://github.com/MUKAPP"
        }
    ],
    "platform": [
        "win32",
        "linux",
        "darwin"
    ],
    "injects": {
        "renderer": "./renderer/liteloader.js",
        "main": "./main/liteloader.js",
        "preload": "./preload/index.js"
    },
    "repository": {
        "repo": "MUKAPP/LiteLoaderQQNT-MSpring-Theme",
        "branch": "v4",
        "release": {
            "tag": "latest",
            "file": "LiteLoaderQQNT-MSpring-Theme.zip"
        }
    }
}`), incompatible: false, disabled: false, path: {
	plugin: 'D:\\data\\llqqnt\\plugins\\mspring_theme',
	data: 'D:\\data\\llqqnt\\data\\mspring_theme',
		injects: {
			renderer: 'D:\\data\\llqqnt\\plugins\\mspring_theme\\renderer\\liteloader.js',
			main: 'D:\\data\\llqqnt\\plugins\\mspring_theme\\main\\liteloader.js',
			preload: 'D:\\data\\llqqnt\\plugins\\mspring_theme\\preload\\index.js'
		}
}
			}
		},
		api: {
			config: {
				get: (section: string, default_config: any) => {
					return Promise.resolve(default_config);
				},
				set: (section: string, config: any) => {
					return Promise.resolve();
				}
			},
			openExternal: (url: string) => {
				open(url, '_blank');
			}
		}
	}
