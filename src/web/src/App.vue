<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue';
import { routes } from './router';

const version = {
	webui: __WEBUI_VERSION__,
	loader: __APP_VERSION__
}

const nav = useTemplateRef('nav');
onMounted(() => {
	if(matchMedia('(max-width: 768px)').matches)
		nav.value?.classList.add('collapsed');
});
</script>

<template>
	<header>
		<div class="header-content">
			<h1>LegacyLoader 管理面板</h1>
		</div>
	</header>
	<nav class="nav" ref="nav">
		<router-link class="nav-link" v-for="route in routes" :key="route.path" :to="route.path" :title="route.meta.title">
			<fa-icon :icon="route.meta.icon"></fa-icon> <span class="nav-detail">{{ route.meta.title }}</span>
		</router-link>
		<a class="nav-link nav-col" href="#" title="收起" @click.prevent="nav?.classList.toggle('collapsed')">
			<fa-icon icon="angle-left"></fa-icon> <span class="nav-detail">收起</span>
		</a>
	</nav>
	<main>
		<router-view></router-view>
	</main>
	<footer>
		<p style="position: absolute; right: 16px; bottom: 48px;">Theme by LateDream.</p>
		<p>webui v{{ version.webui }}, loader v{{ version.loader }}</p>
		<p>Copyright &copy; 2025 QuiltNT Team. All rights reserved.</p>
	</footer>
</template>

<style lang="scss" scoped>
header {
	background-color: var(--pico-primary-focus);
	color: white;
	padding: 1rem 2rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	user-select: none;
	-webkit-app-region: drag;
	
	.header-content h1 {
		margin: 0;
		font-size: 1.5rem;
	}
}

.nav {
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	background-color: var(--pico-secondary-background);
	min-height: 100%;
	justify-content: flex-start;
	width: auto;
	transition: width 0.2s ease-in-out;

	@media (prefers-color-scheme: light) {
		background-color: var(--pico-contrast-focus);
	}

	.nav-col {
		transition: transform 0.2s ease-in-out;
	}

	&.collapsed {
		width: 50px;

		.nav-link {
			width: 60px;
			background-color: var(--pico-contrast-focus);
		}

		.nav-detail {
			display: none;
		}

		.nav-col>svg {
			transform: rotate(180deg);
		}
	}

	.nav-link {
		padding: 0.75rem 1rem;
		text-decoration: none;
		border-radius: 6px;
		border: 2px solid transparent;
		transition: all 0.2s ease-in-out;
		background-color: var(--pico-secondary-background);
		color: var(--pico-color);
		display: flex;
		align-items: center;
		gap: 0.5rem;

		@media (prefers-color-scheme: light) {
			background-color: var(--pico-contrast-focus);
		}

		&.router-link-exact-active {
			border-color: var(--pico-primary-border);
			background-color: var(--pico-primary-background);
			color: white;
		}

		&:hover:not(.router-link-exact-active) {
			border-color: var(--pico-primary-hover-border);
			background-color: var(--pico-primary-hover-background);
		}
	}
}

main {
	position: relative;
	padding: 0.8rem;
	height: 100%;
	max-width: 100%;
	overflow: auto;

	&::after {
		position: fixed;
		display: block;
		content: '';
		bottom: 80px;
		right: 0;
		height: 100%;
		width: 100%;
		opacity: 0.2;
		background: url('./latedream.png') left bottom no-repeat;
		background-size: 20%;
		transform: rotateY(180deg);
		z-index: -1;
	}
}

footer {
	padding: 1rem 2rem;
	background-color: var(--pico-secondary-background);
	color: var(--pico-color);
	text-align: center;

	@media (prefers-color-scheme: light) {
		background-color: var(--pico-contrast-focus);
	}

	p {
		font-size: 0.75rem;
		margin: 0.25rem 0;
	}
}
</style>
