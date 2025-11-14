<script setup lang="ts"></script>

<template>
	<div class="about">
		<hgroup>
			<h1>关于</h1>
		</hgroup>
		<div class="content">
			<p>
				你说得对，但是《LegacyLoaderQQNT》是由 QuiltNT 二次开发的一款插件加载器。
				插件注入在一个被称作「QQNT」的幻想世界，在这里被晚梦选中的人将被授予「插件加载器」，引导注入之力。
				你将扮演一位名为「用户」的神秘角色，在自由的注入中邂逅特性各异、能力独特的插件们，
				和它们一起被 teng'xun 击败，找回账号的同时，逐步发掘《社交功能限制提醒》的真相 。
			</p>
			<p>
				感谢你选择了 LegacyLoaderQQNT!
			</p>
			<h2>贡献者</h2>
			<p>
				LegacyLoaderQQNT 是一个开源项目，欢迎贡献代码！
				<img draggable="false" src="https://contrib.rocks/image?repo=QuiltNT/LegacyLoaderQQNT" alt="Contributors" title="Contributors" />
				<sup>图片由 <a href="https://contrib.rocks">contrib.rocks</a> 生成</sup>
			</p>
			<h2>开放源代码</h2>
			<p>
				LegacyLoaderQQNT 是一个开源项目，源代码托管在 GitHub 上。
				你可以在 <a href="https://github.com/QuiltNT/LegacyLoaderQQNT">GitHub 仓库</a> 中查看和贡献代码。
			</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
img {
	display: block;
	margin: 0.5rem 0;
	&+sup {
		position: static;
		display: block;
		text-align: center;
		@media screen and (min-width: 1024px) {
			text-align: initial;
			margin-left: 406px;
		}
	}
}
</style>
