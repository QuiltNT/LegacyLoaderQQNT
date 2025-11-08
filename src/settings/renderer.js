import { initView, appropriateIcon } from "./view.js";


export class SettingInterface {
    #liteloader_nav_bar = document.createElement("div");
    #liteloader_setting_view = document.createElement("div");
    #setting_view = document.querySelector(".setting-main .q-scroll-view");
    #setting_title = document.querySelector(".setting-main .setting-title");

    constructor() {
        this.#liteloader_nav_bar.classList.add("nav-bar", "liteloader");
        this.#liteloader_setting_view.classList.add("q-scroll-view", "scroll-view--show-scrollbar", "liteloader");
        this.#liteloader_setting_view.style.display = "none";
        document.querySelector(".setting-tab").append(this.#liteloader_nav_bar);
        document.querySelector(".setting-main .setting-main__content").append(this.#liteloader_setting_view);
        document.querySelector(".setting-tab").addEventListener("click", event => {
            const nav_item = event.target.closest(".nav-item");
            if (nav_item) {
                // 内容显示
                if (nav_item.parentElement.classList.contains("liteloader")) {
                    this.#setting_view.style.display = "none";
                    this.#liteloader_setting_view.style.display = "block";
                }
                else {
                    this.#setting_view.style.display = "block";
                    this.#liteloader_setting_view.style.display = "none";
                }
                // 重新设定激活状态
                this.#setting_title.childNodes[1].textContent = nav_item.querySelector(".name").textContent;
                document.querySelectorAll(".setting-tab .nav-item").forEach(element => {
                    element.classList.remove("nav-item-active");
                });
                nav_item.classList.add("nav-item-active");
            }
        });
    }

    add(plugin) {
        const default_thumb = `local://root/src/settings/static/default.svg`;
        const plugin_thumb = `local:///${plugin.path.plugin}/${plugin.manifest?.thumb}`;
        const thumb = plugin.manifest.thumb ? plugin_thumb : default_thumb;
        const nav_item = document.querySelector(".setting-tab .nav-item").cloneNode(true);
        const view = document.createElement("div");
        nav_item.classList.remove("nav-item-active");
        nav_item.setAttribute("data-slug", plugin.manifest.slug);
        appropriateIcon(thumb).then(async text => nav_item.querySelector(".q-icon").innerHTML = text);
        nav_item.querySelector(".name").textContent = plugin.manifest.name;
        nav_item.addEventListener("click", event => {
            if (!event.currentTarget.classList.contains("nav-item-active")) {
                this.#liteloader_setting_view.textContent = null;
                this.#liteloader_setting_view.append(view);
            }
        });
        this.#liteloader_nav_bar.append(nav_item);
        view.classList.add("tab-view", plugin.manifest.slug);
        return view;
    }

    SettingInit() {
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.type = "text/css";
        style.href = "local://root/src/settings/static/style.css";
        document.head.append(style);
        const view = this.add({
            manifest: {
                slug: "config_view",
                name: "LiteLoaderQQNT",
                thumb: "./src/settings/static/default.svg"
            },
            path: {
                plugin: LiteLoader.path.root
            }
        });
        fetch("local://root/src/settings/static/view.html").then(async res => initView(view, await res.text()));
    }

    createErrorView(error, slug, view) {
        const navItem = document.querySelector(`.nav-item[data-slug="${slug}"]`);
        navItem.classList.add("error");
        navItem.title = "插件加载出错";

        view.classList.add("error");
        view.innerHTML =
            `<h2>🙀 插件加载出错！</h2>
            <p>可能是版本不兼容、Bug、冲突或文件损坏等导致的</p>
            🐞 错误信息
            <textarea readonly rows="8">${error.message}\n${error.stack}</textarea>
            🧩 插件信息
            <textarea readonly rows="12">${JSON.stringify(LiteLoader.plugins[slug])}</textarea>
            <textarea readonly rows="3">${JSON.stringify(Object.keys(LiteLoader.plugins))}</textarea>
            🖥️ 环境信息
            <textarea readonly rows="3">${JSON.stringify({ ...LiteLoader.versions, ...LiteLoader.os })}</textarea>
            <small>* 此页面仅在插件加载出现问题出现，不代表插件本身有设置页</small>`; // 没必要格式化json，方便截图
    }
}