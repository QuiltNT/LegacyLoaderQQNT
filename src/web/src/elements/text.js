import { BaseElement } from "../components/element.js";


export class Text extends BaseElement {
    constructor() {
        super();
    }

    getTemplate() {
        return /*html*/ `
            <slot></slot>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host {
                display: -webkit-box;
                word-break: break-all;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }
            :host([data-type="secondary"]) slot {
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.8rem;
                line-height: 1rem;
                margin-top: 4px;
            }
        `;
    }
}
