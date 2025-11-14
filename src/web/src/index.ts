import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

import './base.scss';

function initApp() {
	createApp(App)
		.use(router)
		.component('fa-icon', FontAwesomeIcon)
		.mount('#app');
}

console.log('%cLegacyLoaderWebUI %c%s', 'color: #007bff; font-size: 24px; font-weight: bold;', 'color: #28a745; font-size: 18px; font-weight: bold;', __WEBUI_VERSION__);

if(import.meta.env.DEV) {
	console.log('dev mode');
	// @ts-ignore
	import('./test').then(initApp);
} else {
	initApp();
}
