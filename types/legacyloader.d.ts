/// <reference path="electron.d.ts" />

import type legacyloader_package from '../package.json';
import LiteLoaderPackage from './packages/liteloader_compat';
import QQNTPackage from './packages/qqnt';

import PluginManifest from './plugin_manifest';

interface LegacyLoader {
	path: {
		root: string;
		profile: string;
		data: string;
		plugins: string;
	},
	versions: {
		qqnt: string;
		legacyloader: string;
		/** @prop {string} liteloader 'x.x.x-legacyloader_compat' */
		liteloader: string;
		node: string;
		chrome: string;
		electron: string;
	},
	os: {
		platform: string;
	},
	package: {
		legacyloader: legacyloader_package;
		liteloader: LiteLoaderPackage;
		qqnt: QQNTPackage;
	},
	plugins: {
		[slug: string]: {
			manifest: PluginManifest;
			incompatible: boolean;
			disabled: boolean;
			path: {
				plugin: string;
				data: string;
				injects: {
					renderer: string | null;
					main: string | null;
					preload: string | null;
				}
			}
		}
	},
	api: {
		/**
		 * Open the given external protocol URL in the desktop's default manner. (For
		 * example, mailto: URLs in the user's default mail agent).
		 */
		openExternal(url: string, options?: Electron.OpenExternalOptions): Promise<void>;
		/**
		 * Resolves with a string containing the error message corresponding to the failure
		 * if a failure occurred, otherwise "".
		 *
		 * Open the given file in the desktop's default manner.
		 */
		openPath(path: string): Promise<string>;
	}
}

interface LegacyLoaderMain extends LegacyLoader {
	api: {
		config: {
			get: (slug: string, default_config: any) => any;
			set: (slug: string, new_config: any) => void;
		},
		plugin: {
			install: (plugin_path: string, undone?: boolean) => boolean;
			delete: (slug: string, delete_data?: boolean, undone?: boolean) => boolean;
			disable: (slug: string, undone?: boolean) => void;
		},
	}
}

interface LegacyLoaderRenderer extends LegacyLoader {
	api: {
		config: {
			get: (slug: string, default_config: any) => Promise<any>;
			set: (slug: string, new_config: any) => Promise<void>;
		},
		plugin: {
			install: (plugin_path: string, undone?: boolean) => Promise<boolean>;
			delete: (slug: string, delete_data?: boolean, undone?: boolean) => Promise<boolean>;
			disable: (slug: string, undone?: boolean) => Promise<void>;
		},
	}
}

// just for loader dev
// plugin dev need split main and renderer process
declare global {
	const LegacyLoader: LegacyLoaderMain;
	const LiteLoader: LegacyLoaderMain;
	interface Window {
		LegacyLoader: LegacyLoaderRenderer;
		LiteLoader: LegacyLoaderRenderer;
	}
}

export { LegacyLoaderMain, LegacyLoaderRenderer };
