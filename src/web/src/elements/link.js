import { BaseElement } from "../components/element.js";


export class Link extends BaseElement {
    constructor() {
        super();
        this.addEventListener("click", () => {
            if (this.getValue()) {
                LegacyLoader.api.openExternal(this.getValue());
            }
        });
    }

    getTemplate() {
        return /*html*/ `
            <slot></slot>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host {
                color: var(--text_link);
                cursor: pointer;
            }
        `;
    }
}
