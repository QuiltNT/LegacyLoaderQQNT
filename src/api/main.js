const default_config = require("../shared/config.json");
const { ipcMain, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const admZip = require("../shared/admZip.js");


const root_path = path.join(__dirname, "..", "..");
const profile_path = process.env.LITELOADERQQNT_PROFILE ?? root_path;
const data_path = path.join(profile_path, "data");
const plugins_path = path.join(profile_path, "plugins");
const legacyloader_package = require(path.join(root_path, "package.json"));
const liteloader_package = require(path.join(root_path, "src/api/liteloader_package_compat.json"));
const qqnt_package = require(path.join(process.resourcesPath, "app/package.json"))


function setConfig(slug, new_config) {
    try {
        const config_path = path.join(data_path, slug, "config.json");
        fs.mkdirSync(path.dirname(config_path), { recursive: true });
        fs.writeFileSync(config_path, JSON.stringify(new_config, null, 4), "utf-8");
        return true;
    } catch {
        return false;
    }
}


function getConfig(slug, default_config) {
    try {
        const config_path = path.join(data_path, slug, "config.json");
        if (fs.existsSync(config_path)) {
            const config = JSON.parse(fs.readFileSync(config_path, "utf-8"));
            return Object.assign({}, default_config, config);
        }
        else {
            setConfig(slug, default_config);
            return Object.assign({}, default_config, {});
        }
    } catch {
        return default_config;
    }
}


function pluginInstall(plugin_path, undone = false) {
    try {
        if (fs.statSync(plugin_path).isFile()) {
            // 通过 ZIP 格式文件安装插件
            if (path.extname(plugin_path).toLowerCase() == ".zip") {
                const plugin_zip = new admZip(plugin_path);
                for (const entry of plugin_zip.getEntries()) {
                    if (entry.entryName == "manifest.json" && !entry.isDirectory) {
                        const { slug } = JSON.parse(entry.getData());
                        if (slug in LegacyLoader.plugins) LegacyLoader.api.plugin.delete(slug, false, false);
                        const config = LegacyLoader.api.config.get("LegacyLoader", default_config);
                        if (undone) delete config.installing_plugins[slug];
                        else config.installing_plugins[slug] = {
                            plugin_path: plugin_path,
                            plugin_type: "zip"
                        };
                        LegacyLoader.api.config.set("LegacyLoader", config);
                        return true;
                    }
                }
            }
            // 通过 manifest.json 文件安装插件
            if (path.basename(plugin_path) == "manifest.json") {
                const { slug } = JSON.parse(fs.readFileSync(plugin_path));
                if (slug in LegacyLoader.plugins) LegacyLoader.api.plugin.delete(slug, false, false);
                const config = LegacyLoader.api.config.get("LegacyLoader", default_config);
                if (undone) delete config.installing_plugins[slug];
                else config.installing_plugins[slug] = {
                    plugin_path: plugin_path,
                    plugin_type: "json"
                };
                LegacyLoader.api.config.set("LegacyLoader", config);
                return true;
            }
        }
    } catch (error) {
        console.error(error);
    }
    return false;
}


function pluginDelete(slug, delete_data = false, undone = false) {
    if (!(slug in LegacyLoader.plugins)) return true;
    const { plugin, data } = LegacyLoader.plugins[slug].path;
    const config = LegacyLoader.api.config.get("LegacyLoader", default_config);
    if (undone) delete config.deleting_plugins[slug];
    else config.deleting_plugins[slug] = {
        plugin_path: plugin,
        data_path: delete_data ? data : null
    };
    LegacyLoader.api.config.set("LegacyLoader", config);
}


function pluginDisable(slug, undone = false) {
    const config = LegacyLoader.api.config.get("LegacyLoader", default_config);
    if (undone) config.disabled_plugins = config.disabled_plugins.filter(item => item != slug);
    else config.disabled_plugins = config.disabled_plugins.concat(slug);
    LegacyLoader.api.config.set("LegacyLoader", config);
}

/** @type {import('../../types').LegacyLoaderMain} */
const LegacyLoader = {
    path: {
        root: root_path,
        profile: profile_path,
        data: data_path,
        plugins: plugins_path
    },
    versions: {
        qqnt: qqnt_package.version,
        legacyloader: legacyloader_package.version,
        liteloader: '1.3.0-legacyloader_compat',
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },
    os: {
        platform: process.platform
    },
    package: {
        legacyloader: legacyloader_package,
        liteloader: liteloader_package,
        qqnt: qqnt_package
    },
    plugins: {},
    api: {
        config: {
            set: setConfig,
            get: getConfig
        },
        plugin: {
            install: pluginInstall,
            delete: pluginDelete,
            disable: pluginDisable
        },
        openExternal: shell.openExternal,
        openPath: shell.openPath
    }
};


// 将LegacyLoader对象挂载到全局
const whitelist = new Set([
    LegacyLoader.path.root,
    LegacyLoader.path.profile,
    LegacyLoader.path.data,
    LegacyLoader.path.plugins,
]);
try {
    whitelist.add(fs.realpathSync(LegacyLoader.path.root));
    whitelist.add(fs.realpathSync(LegacyLoader.path.profile));
    whitelist.add(fs.realpathSync(LegacyLoader.path.plugins));
    whitelist.add(fs.realpathSync(LegacyLoader.path.data));
} catch { };
whitelist.forEach(item => whitelist.add(item.replace(/\\\\/g, "/")));
Object.defineProperties(globalThis, {
    "LegacyLoader": {
        configurable: false,
        get() {
            const stack = new Error().stack.split("\n")[2];
            if (whitelist.values().some(item => stack.includes(item))) {
                return LegacyLoader;
            }
        }
    },
    // 兼容 LiteLoader 插件
    "LiteLoader": {
        configurable: false,
        get() {
            const stack = new Error().stack.split("\n")[2];
            if (whitelist.values().some(item => stack.includes(item))) {
                return LegacyLoader;
            }
        }
    }
});


// 将LegacyLoader对象挂载到window
ipcMain.on("LegacyLoader.LegacyLoader.LegacyLoader", (event) => {
    event.returnValue = {
        ...LegacyLoader,
        api: void null
    }
});


ipcMain.handle("LegacyLoader.LegacyLoader.api", (event, name, method, args) => {
    try {
        if (name == method) return LegacyLoader.api[method](...args);
        else return LegacyLoader.api[name][method](...args);
    } catch (error) {
        return null;
    }
});
