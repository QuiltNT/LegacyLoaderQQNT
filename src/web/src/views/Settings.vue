<script setup lang="ts">
import { ref, onMounted } from 'vue';
import settings from '../utils/settings';

const config = {
	_not_chage: ref(true),
	enable_plugins : ref(false),
	check_update: ref(false)
}

const apply = () => {
	settings.set({enable_plugins: config.enable_plugins.value, check_update: config.check_update.value});
	config._not_chage.value = true;
}

onMounted(async() => {
	config.enable_plugins.value = (await settings.get()).enable_plugins;
	config.check_update.value = (await settings.get()).check_update;
});
</script>

<template>
	<div class="container">
		<h1>设置</h1>
		<div class="content">
			<div class="setting-item">
				<input type="checkbox" role="switch" id="enable-plugin" v-model="config.enable_plugins.value" @click="config._not_chage.value = false">
				<label for="enable-plugin">启用插件</label>
			</div>
			<div class="setting-item">
				<input type="checkbox" role="switch" id="check-update" v-model="config.check_update.value" @click="config._not_chage.value = false">
				<label for="check-update">检查更新</label>
			</div>

			<div class="setting-actions">
				<button type="button" @click="apply" :disabled="config._not_chage.value">应用</button>
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
