const { resolve } = require('path');
const vue = require('@vitejs/plugin-vue');

/** @type {import('vite').UserConfig} */
export default {
	root: resolve(__dirname, 'src/web/'),
	base: './',
	envDir: resolve(__dirname),
	plugins: [vue()],
	define: {
		__APP_VERSION__: JSON.stringify(require('./package.json').version),
		__WEBUI_VERSION__: JSON.stringify(require('./package.json').webui_version),
	},
	build: {
		outDir: resolve(__dirname, 'dist/web/'),
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'src/web/index.html')
			},
			output: {
				manualChunks: {
					'vue': ['vue'],
					'fa-icon': ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/vue-fontawesome'],
				}
			}
		}
	}
};
