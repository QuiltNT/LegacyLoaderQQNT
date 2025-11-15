<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { getSettings } from '../utils/settings';
import checkUpdate from '../utils/check_update';
import { DialogAlert, DialogAlertConfirm } from 'v-dialogs';

const username = '';
const date = ref(new Date());

setInterval(() => {
	date.value = new Date();
}, 1000);

const versions = LegacyLoader.versions;
enum names {
	legacyloader = 'LegacyLoader',
	liteloader = 'LiteLoaderQQNT',
	qqnt = 'QQNT',
	chrome = 'Chrome',
	electron = 'Electron',
	node = 'Node.js'
}

const debug_info = {
	versions: {
		legacyloader_webui: __WEBUI_VERSION__,
		...versions
	},
	plugins: Object.entries(LegacyLoader.plugins).map(([slug, plugin]) => slug),
}

const outputDebugInfo = () => {
	// @ts-ignore
	DialogAlert(h('pre', { style: { width: '100%', height: '100%' } }, JSON.stringify(debug_info, null, 2)), {
		title: '调试信息',
		messageType: 'info',
		icon: false,
		colorfulShadow: true,
		shake: true
	});
}

const checkUpdateHandler = (check_update_button: HTMLButtonElement | EventTarget) => {
	let click_count = 0;
	checkUpdate();
	check_update_button.addEventListener('click', () => {
		click_count++;
		if (click_count === 20) {
			click_count = 0;
			new Notification(
				"LegacyLoaderQQNT",
				{
					body: "你咋这么急着更新？\n你就不能再等等？\n或者去催一下晚梦（",
					requireInteraction: true
				}
			);
		}
	});
}

onMounted(async () => {
	((await getSettings()).check_update) && checkUpdate();
});
</script>

<template>
	<div class="home">
		<hgroup>
			<h1>欢迎回来! {{ username }}</h1>
			<span>{{ date.toLocaleTimeString() }}</span>
		</hgroup>
		<div class="container">
			<table class="versions">
				<thead>
					<tr>
						<th></th>
						<th>版本</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(version, name) in versions" :key="name">
						<td class="name">{{ names[name] }}</td>
						<td class="version">{{ version }}</td>
					</tr>
				</tbody>
			</table>

			<div class="actions">
				<button type="button" data-tooltip="急急急" @click="checkUpdateHandler($event.target!)">检查更新</button>
				<button type="button" data-tooltip="can can need" @click="outputDebugInfo">输出调试信息</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@keyframes glow {
	from {
		outline: 2px solid var(--pico-primary);
	}
	to {
		outline: 2px solid transparent;
	}
}

.versions {
	width: 50%;
	border: 2px solid var(--pico-table-border-color);

	.name {
		color: var(--pico-primary);
		font-weight: bold;
	}

	.version {
		color: var(--pico-secondary);
	}
}

.actions {
	position: absolute;
	bottom: 0;
	right: 32px;
	>button {
		margin-inline: 0.2rem;
	}
}

.glow {
	transition: outline-color 0.2s ease-in-out;
	animation: glow 2s infinite alternate;
	&:hover, &:focus, &:checked {
		animation: none;
		outline: 2px solid var(--pico-primary);
	}
}
</style>