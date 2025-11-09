const { contextBridge } = require("electron");


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


(new class {

    async init() {
        const preloadErrors = {}
        for (const slug of topologicalSort(Object.keys(LegacyLoader.plugins))) {
            const plugin = LegacyLoader.plugins[slug];
            if (plugin.disabled || plugin.incompatible || plugin.error) {
                continue;
            }
            if (plugin.path.injects.preload) {
                try {
                    runPreloadScript(await (await fetch(`local:///${plugin.path.injects.preload}`)).text());
                }
                catch (e) {
                    preloadErrors[slug] = { message: `[Preload] ${e.message}`, stack: e.stack };
                }
            }
        }
        contextBridge.exposeInMainWorld("LegacyLoaderPreloadErrors", preloadErrors);
        return this;
    }

}).init();