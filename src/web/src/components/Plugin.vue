<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted, useTemplateRef } from 'vue';
import settings from '../utils/settings';

const props = defineProps({
	plugin: {
		type: Object as () => typeof LegacyLoader.plugins[0],
		required: true
	}
});

const enable = ref(!settings.get().disabled_plugins.includes(props.plugin.manifest.slug));
const uninstall = ref(!!settings.get().deleting_plugins?.[props.plugin.manifest.slug]);
const keep_data = ref(!!settings.get().deleting_plugins?.[props.plugin.manifest.slug]?.data_path);

function apply() {
	LegacyLoader.api.plugin.disable(props.plugin.manifest.slug, !enable.value);
	LegacyLoader.api.plugin.delete(props.plugin.manifest.slug, !keep_data.value, !uninstall.value);
}

const view = useTemplateRef('view');
onMounted(async() => {
	await import('./renderer.js');
	if(props.plugin.error) {
		const error = props.plugin.error;
        view.value!.innerHTML =
            `<style>textarea{font-size: 16px;padding: 0.4rem;}p,h4,textarea:not(.last){margin: 0;}</style>
			<h4>🙀 插件加载出错！</h4>
            <p>可能是版本不兼容、Bug、冲突或文件损坏等导致的</p>
            🐞 错误信息
            <textarea readonly rows="4">${error.message}\n${error.stack}</textarea>
            🧩 插件信息
            <textarea readonly rows="4">${JSON.stringify(props.plugin)}</textarea>
            <textarea readonly rows="2" style="margin-top: 0.2rem;">${JSON.stringify(Object.keys(LegacyLoader.plugins))}</textarea>
            🖥️ 环境信息
            <textarea class="last" readonly rows="2">${JSON.stringify({ ...LegacyLoader.versions, ...LegacyLoader.os })}</textarea>
            <small>* 此页面仅在插件加载出现问题出现，不代表插件本身有设置页</small>`; // 没必要格式化json，方便截图
		return;
	}
	if(props.plugin.path?.injects?.renderer)
		if(enable.value) (await import(`local:///${props.plugin.path.injects.renderer}`)).onSettingWindowCreated?.(view.value);
		else view.value!.innerHTML = '<i style="color: grey;">- 该插件已被禁用 -</i>';
	else view.value!.innerHTML = '<i style="color: grey;">- 该插件未提供设置页 -</i>';
})
</script>

<template>
<div class="view" style="padding: 0.8rem;">
	<div class="manage-panel">
		<div class="setting-item">
			<input type="checkbox" role="switch" id="enable" v-model="enable" />
			<label for="enable">启用该插件</label>
		</div>
		<div class="setting-item">
			<input type="checkbox" role="switch" id="uninstall" v-model="uninstall" />
			<label for="uninstall">下次启动时卸载</label>
		</div>
		<div class="setting-item">
			<input type="checkbox" role="switch" id="keep-data" v-model="keep_data" />
			<label for="keep-data">卸载时保留数据</label>
		</div>
		<div class="setting-item">
			<button type="button" @click="apply">应用</button>
		</div>
	</div>

	<hr />
	<div class="setting-panel">
		<div class="setting-content" ref="view"></div>
	</div>

</div>
</template>

<style lang="scss">
.setting-content > setting-item {
    & {
        & {
            gap: 8px;
        }

        &.disabled, &.deleted {
            & .info-area > div > div {
                opacity: 0.5;
                font-weight: bold;
                font-style: italic;
            }

            &.deleted {
                & .info-area > div > div {
                    text-decoration: line-through;
                    color: var(--text-error);
                }
            }
        }


        & .info-area {
            & {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            & > div {
                & {
                    height: 48px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                & .icon :is(img, svg) {
                    width: 48px;
                    height: 48px;
                    border-radius: 8px;
                }
            }

            & > setting-text {
                & {
                    display: flex;
                    gap: 8px;
                }

                & :nth-child(-n+3) {
                    min-width: 120px;
                }

                & :nth-child(3) {
                    max-width: 240px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
</style>

<style lang="scss" scoped>
.manage-panel {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
}
hr {
	margin: 0.5rem 0;
}
</style>