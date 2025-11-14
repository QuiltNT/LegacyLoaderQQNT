import { createRouter, createWebHashHistory } from 'vue-router';

export const routes = [
	{
		path: '/', component: () => import('./views/Home.vue'), meta: {
			title: '主页', icon: 'house'
		}
	},
	{
		path: '/plugins', component: () => import('./views/Plugins.vue'), meta: {
			title: '插件', icon: 'puzzle-piece'
		}
	},
	{
		path: '/settings', component: () => import('./views/Settings.vue'), meta: {
			title: '设置', icon: 'gear'
		}
	},
	{
		path: '/about', component: () => import('./views/About.vue'), meta: {
			title: '关于', icon: 'circle-info'
		}
	},
]

export default createRouter({
	history: createWebHashHistory(),
	routes
});
