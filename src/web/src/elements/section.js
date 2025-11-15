import { BaseElement } from "../components/element.js";


export class Section extends BaseElement {
    constructor() {
        super();
        this._title = this.shadowRoot.querySelector("h1");
    }

    getTemplate() {
        return /*html*/ `
            <h1></h1>
            <slot></slot>
        `;
    }

    getStyles() {
        return /*css*/ `
            h1 {
                font-weight: bold;
                font-size: 1em;
                line-height: 1.5em;
                padding: 0px 16px;
                margin-top: 0;
                margin-bottom: 8px;
            }
        `;
    }

    update() {
        this._title.textContent = this.getTitle();
    }
}
