function topologicalSort(dependencies) {
    const sorted = [];
    const visited = new Set();
    const visit = (slug) => {
        if (visited.has(slug)) return;
        visited.add(slug);
        const plugin = LegacyLoader.plugins[slug];
        plugin.manifest.dependencies?.forEach(depSlug => visit(depSlug));
        sorted.push(slug);
    }
    dependencies.forEach(slug => visit(slug));
    return sorted;
}


export class RendererLoader {

    #exports = {};

    async init() {
        // 确保preload加载完毕
        if (!window.LegacyLoaderPreloadErrors) {
            await new Promise(resolve => {
                const check = () => (window.LegacyLoaderPreloadErrors ? resolve() : setTimeout(check));
                check();
            });
        }
        // 加载插件
        for (const slug of topologicalSort(Object.keys(LegacyLoader.plugins))) {
            const plugin = LegacyLoader.plugins[slug];
            if (plugin.disabled || plugin.incompatible) {
                continue;
            }
            const error = plugin.error || LegacyLoaderPreloadErrors[slug];
            if (error) {
                this.#exports[slug] = { error };
                continue
            }
            if (plugin.path.injects.renderer) {
                try {
                    this.#exports[slug] = await import(`local:///${plugin.path.injects.renderer}`);
                }
                catch (e) {
                    this.#exports[slug] = { error: { message: `[Renderer] ${e.message}`, stack: e.stack } };
                }
            }
        }
        return this;
    }

    onSettingWindowCreated(settingInterface) {
        for (const slug in this.#exports) {
            const plugin = this.#exports[slug];
            try {
                if (plugin.error) throw plugin.error;
                plugin.onSettingWindowCreated?.(settingInterface.add(LegacyLoader.plugins[slug]));
            }
            catch (e) {
                const view = settingInterface.add(LegacyLoader.plugins[slug]);
                settingInterface.createErrorView(e, slug, view);
            }
        }
    }

    onVueComponentMount(component) {
        for (const slug in this.#exports) {
            const plugin = this.#exports[slug];
            plugin.onVueComponentMount?.(component);
        }
    }

    onVueComponentUnmount(component) {
        for (const slug in this.#exports) {
            const plugin = this.#exports[slug];
            plugin.onVueComponentUnmount?.(component);
        }
    }

}