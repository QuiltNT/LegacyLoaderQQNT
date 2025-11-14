const { ipcRenderer, contextBridge } = require("electron");


function invokeAPI(name, method, args) {
    return ipcRenderer.invoke("LegacyLoader.LegacyLoader.api", name, method, args);
}


// LegacyLoader
/** @type {import('../../types/legacyloader').LegacyLoaderRenderer} LegacyLoader */
const LegacyLoader = {
    ...ipcRenderer.sendSync("LegacyLoader.LegacyLoader.LegacyLoader"),
    api: {
        config: {
            get: (...args) => invokeAPI("config", "get", args),
            set: (...args) => invokeAPI("config", "set", args)
        },
        plugin: {
            install: (...args) => invokeAPI("plugin", "install", args),
            delete: (...args) => invokeAPI("plugin", "delete", args),
            disable: (...args) => invokeAPI("plugin", "disable", args)
        },
        openExternal: (...args) => invokeAPI("openExternal", "openExternal", args),
        openPath: (...args) => invokeAPI("openPath", "openPath", args)
    },
    open_webui: () => ipcRenderer.send('LegacyLoader.open_webui')
}

Object.defineProperties(globalThis, {
    "LegacyLoader": {
        configurable: false,
        get() {
            return LegacyLoader;
        }
    },
    // 兼容 LiteLoader 插件
    "LiteLoader": {
        configurable: false,
        get() {
            return LegacyLoader;
        }
    }
})

contextBridge.exposeInMainWorld("LegacyLoader", LegacyLoader);
contextBridge.exposeInMainWorld("LiteLoader", LegacyLoader);
