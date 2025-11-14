<script setup lang="ts">
import { ref } from 'vue';
import settings from '../utils/settings';

const enable_plugins = ref(settings.get().enable_plugins);
const check_update = ref(settings.get().check_update);

const apply = () => {
	settings.set({enable_plugins: enable_plugins.value, check_update: check_update.value});
}
</script>

<template>
	<div class="container">
		<h1>设置</h1>
		<div class="content">
			<div class="setting-item">
				<input type="checkbox" role="switch" id="enable-plugin" v-model="enable_plugins">
				<label for="enable-plugin">启用插件</label>
			</div>
			<div class="setting-item">
				<input type="checkbox" role="switch" id="check-update" v-model="check_update">
				<label for="check-update">检查更新</label>
			</div>

			<div class="setting-actions">
				<button type="button" @click="apply" title="部分操作重启后生效">应用</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.setting-actions {
	position: absolute;
	right: 32px;
	bottom: 0;
}
</style>
