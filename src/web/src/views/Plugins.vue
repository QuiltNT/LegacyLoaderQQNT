<script setup lang="ts">
import { computed, defineComponent, h } from 'vue';
import { DialogModal } from 'v-dialogs';
import Plugin from '../components/Plugin.vue';
import default_icon from '../default.png';
import { FontAwesomeIcon as faIcon } from '@fortawesome/vue-fontawesome';

const plugins = computed(() => {
	if (!LegacyLoader || !LegacyLoader.plugins) {
		return {};
	}
	return LegacyLoader.plugins;
});

const counts = computed(() => {
	const result = {
		extension: [0, 0],
		theme: [0, 0],
		framework: [0, 0],
		total: [0, 0]
	};

	Object.values(plugins.value).forEach(plugin => {
		const type = plugin.manifest.type || 'extension';
		result.total[1]++;
		result[type][1]++;

		if (!plugin.disabled && !plugin.incompatible && !plugin.error) {
			result.total[0]++;
			result[type][0]++;
		}
	});

	return result;
});

const getPluginsByType = (type: string) => {
	return Object.values(plugins.value).filter(
		plugin => (plugin.manifest.type || 'extension') === type
	);
};

const PluginCard = defineComponent({
	props: {
		plugin: {
			type: Object as () => typeof plugins.value[0],
			required: true
		},
		defaultIcon: {
			type: String,
			required: true
		},
		openPlugin: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		return () => h('div', { class: 'plugin-item', style: { position: 'relative' } }, [
			h(faIcon, { icon: 'gear', style: { title: '插件设置', position: 'absolute', top: '0.5rem', right: '0.5rem' }, onClick: () => props.openPlugin(props.plugin) }),
			h('img', {
				class: 'plugin-icon',
				src: props.plugin.manifest.icon? `local:///${props.plugin.path.plugin}${props.plugin.manifest.icon?.replace('./', '/')}`: props.defaultIcon,
				alt: props.plugin.manifest.name + '图标'
			}),
			h('div', { class: 'plugin-info' }, [
				h('h4', { class: `plugin-name ${props.plugin.disabled ? 'disabled' : ''} ${props.plugin.error ? 'error' : ''} ${props.plugin.incompatible ? 'incompatible' : ''}`, title: props.plugin.manifest.name }, [
					props.plugin.manifest.name,
					h('code', { class: 'plugin-slug' }, props.plugin.manifest.slug)
				]),
					props.plugin.disabled ? h('span', { class: 'plugin-badge disabled' }, '已禁用') : null,
					!props.plugin.disabled && props.plugin.incompatible ? h('span', { class: 'plugin-badge incompatible' }, '不兼容') : null,
					!props.plugin.disabled && !props.plugin.incompatible && props.plugin.error ? h('span', { class: 'plugin-badge error' }, '错误') : null,
				h('p', { class: 'plugin-description', title: props.plugin.error ? '加载插件时出现错误 请打开插件设置页查看错误信息' : props.plugin.manifest.description || '未提供插件描述' },
					props.plugin.error ? '加载插件时出现错误 请打开插件设置页查看错误信息' : props.plugin.manifest.description || '未提供插件描述'
				),
				h('div', { class: 'plugin-meta' }, [
					h('span', { class: 'plugin-version' }, `版本：${props.plugin.manifest.version}`),
					props.plugin.manifest.repository ? h('span', { class: 'repo-badge', title: props.plugin.manifest.repository?.repo, alt: '插件仓库' }) : null,
					props.plugin.manifest.authors?.length ? h('span', { class: 'plugin-author' }, [
						'作者：',
						props.plugin.manifest.authors?.map((author, index) => [
							h('a', {
								href: author.link,
								onClick: (e: MouseEvent) => {
									e.preventDefault();
									LegacyLoader.api.openExternal(author.link);
								}
							}, author.name),
							index < (props.plugin.manifest.authors?.length || 0) - 1 ?
								h('span', { class: 'author-separator' }, ', ') : null
						]).flat()
					]) : h('span', { class: 'plugin-author' }, '作者：未知')
				]),
			])
		]);
	}
});

const NoMore = defineComponent({
	setup() {
		return () => h('div', { class: 'empty-state' }, [
			h('span', {}, '- 没有更多啦 -')
		]);
	}
});

const openPlugin = (plugin: typeof plugins.value[0]) => {
	DialogModal(h(Plugin, { plugin }), {
		width: 800,
		height: 600,
		title: `${plugin.manifest.name} 设置`
	});
}
</script>

<template>
	<div class="container">
		<hgroup>
			<h1>插件</h1>
			<p>已加载 {{ counts.total.join('/') }} 个插件</p>
		</hgroup>

		<div class="content">
			<div class="plugins">
				<details class="plugin-section">
					<summary>扩展 ({{ counts.extension.join('/') }})</summary>
					<div class="plugin-list">
						<PluginCard v-for="plugin in getPluginsByType('extension')" :key="plugin.manifest.slug"
							:plugin="plugin" :default-icon="default_icon" :openPlugin="openPlugin" />
						<NoMore v-if="getPluginsByType('extension').length === 0" />
					</div>
				</details>

				<details class="plugin-section">
					<summary>主题 ({{ counts.theme.join('/') }})</summary>
					<div class="plugin-list">
						<PluginCard v-for="plugin in getPluginsByType('theme')" :key="plugin.manifest.slug"
							:plugin="plugin" :default-icon="default_icon" :openPlugin="openPlugin" />
						<NoMore v-if="getPluginsByType('theme').length === 0" />
					</div>
				</details>

				<details class="plugin-section">
					<summary>依赖 ({{ counts.framework.join('/') }})</summary>
					<div class="plugin-list">
						<PluginCard v-for="plugin in getPluginsByType('framework')" :key="plugin.manifest.slug"
							:plugin="plugin" :default-icon="default_icon" :openPlugin="openPlugin" />
						<NoMore v-if="getPluginsByType('framework').length === 0" />
					</div>
				</details>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.plugin-item {
	min-height: 140px;
	min-width: 300px;
	flex: 1 1 300px;
	max-width: calc(50% - 8px);
	padding: 16px;
	display: flex;
	gap: 16px;
	color: var(--pico-color);
	background-color: var(--pico-secondary-background);
	border-radius: 12px;
	transition: all 0.3s ease;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
		border-color: var(--pico-primary-hover-border);
	}

	@media (prefers-color-scheme: light) {
		background-color: var(--pico-contrast-focus);
	}

	.plugin-icon {
		width: 64px;
		height: 64px;
		flex-shrink: 0;
		border-radius: 8px;
		object-fit: cover;
		border: 1px solid var(--pico-border);
	}

	.plugin-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
		overflow: hidden;
	}

	.plugin-name {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;

		&.disabled, &.error, &.incompatible {
			text-decoration: line-through;
		}

	.plugin-slug {
			font-size: 0.8rem;
			font-weight: 400;
			color: var(--pico-clor);
			background-color: var(--pico-muted-color);
			padding: 2px 8px;
			border-radius: 4px;

			@media (prefers-color-scheme: light) {
				background-color: #fff;
			}
		}
	}

	.plugin-description {
		font-size: 0.9rem;
		margin: 0;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.plugin-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		font-size: 0.8rem;
		margin-top: auto;
	}

	.plugin-version {
		background-color: var(--pico-muted-color);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.75rem;

		@media (prefers-color-scheme: light) {
			background-color: #fff;
		}
	}

	.plugin-author {
		display: flex;
		align-items: center;
		gap: 4px;

		a {
			color: var(--pico-primary, #2d7ff9);
			text-decoration: none;
			transition: text-decoration 0.2s ease;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.author-separator {
		display: inline;
	}

	.plugin-badge {
		width: fit-content;
		font-size: 0.75rem;
		font-weight: 500;
		padding: 2px 6px;
		border-radius: 4px;

		&.error {
			background-color: var(--pico-form-element-invalid-active-border-color);
			color: white;
		}

		&.disabled {
			background-color: var(--pico-muted-color);
			color: #fff;
		}
	}

	.repo-badge {
		display: block;
		height: fit-content;
		font-size: 0.75rem;
		&::before {
			content: 'github';
			display: inline-block;
			width: fit-content;
			height: fit-content;
			padding: 2px 6px;
			border-radius: 4px 0 0 4px;
			background-color: #233;
			color: #fff;
		}
		&::after {
			content: '访问仓库';
			display: inline-block;
			width: fit-content;
			height: fit-content;
			padding: 2px 6px;
			border-radius: 0 4px 4px 0;
			background-color: deepskyblue;
			color: #000;
		}
	}
}</style>

<style scoped lang="scss">

hgroup {
	margin-bottom: 24px;
}

h1 {
	margin-bottom: 8px;
	font-size: 1.8rem;
}

.plugin-section {
	margin-bottom: 16px;
	padding: 12px;
	background-color: rgba(46, 128, 252, 0.2);
	backdrop-filter: blur(8px);
	border: 1px solid var(--pico-secondary-border, #e0e0e0);
	border-radius: 8px;
	transition: all 0.3s ease;

	&:open {
		background-color: rgba(46, 128, 252, 0.25);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	summary {
		cursor: pointer;
		font-weight: 600;
		font-size: 1.1rem;
		padding: 8px 0;
		list-style: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: color 0.2s ease;

		&:hover {
			color: var(--pico-primary, #2d7ff9);
		}

	}
}

.plugin-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-top: 16px;
	padding: 8px 0;
}



.empty-state {
	width: 100%;
	text-align: center;
	padding: 40px 20px;
	color: var(--pico-muted-foreground, #6c757d);
	font-style: italic;
}
</style>
