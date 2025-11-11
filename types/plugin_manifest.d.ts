type PluginManifest = {
	manifest_version: number,
	esm?: boolean,
	type: 'extension' | 'theme' | 'framework',
	name: string,
	slug: string,
	description?: string,
	version: string,
	icon?: string | null,
	thumb?: string | null,
	authors?: {
		name: string,
		link: string
	}[],
	dependencies?: string[],
	platform: string[],
	injects?: {
		renderer?: string;
		main?: string;
		preload?: string;
	},
	repository?: {
		repo: string;
		branch: string;
		release?: {
			tag: string;
			file?: string;
		}
	}
}

export default PluginManifest;
