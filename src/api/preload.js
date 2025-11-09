const { ipcRenderer, contextBridge } = require("electron");


function invokeAPI(name, method, args) {
    return ipcRenderer.invoke("LegacyLoader.LegacyLoader.api", name, method, args);
}


// LegacyLoader
/** @type {import('../../types/legacyloader').LegacyLoaderRenderer} LegacyLoader */
const LegacyLoader = {
    value: {
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
        }
    }
};
Object.defineProperty(globalThis, "LegacyLoader", {
    configurable: false,
    value: LegacyLoader
});

contextBridge.exposeInMainWorld("LegacyLoader", LegacyLoader);
