import { BaseElement } from "../components/element.js";


export class Switch extends BaseElement {
    constructor() {
        super();
    }

    getTemplate() {
        return /*html*/ `
            <span>
                <slot></slot>
            </span>
        `;
    }

    getStyles() {
        return /*css*/ `
            :host {
                --pico-background-color: var(--pico-switch-background-color);
                --pico-color: var(--pico-switch-color);
                width: 2.25em;
                height: 1.25em;
                border-top-left-radius: 1.25em;
                border-top-right-radius: 1.25em;
                border-bottom-right-radius: 1.25em;
                border-bottom-left-radius: 1.25em;
                background-color: var(--pico-background-color);
                line-height: 1.25em;
                border: var(--pico-border-width) solid var(--pico-border-color);
            }
            :host([is-active]) {
                --pico-background-color: var(--pico-switch-checked-background-color);
                --pico-border-color: var(--pico-switch-checked-background-color);
                background-image: none;
            }
            :host([is-active]) span {
                transform: translate(1em);
            }
            span {
                border-radius: 100%;
                box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 4px;
                box-sizing: border-box;
                display: inline-block;
                width: 1em;
                height: 1em;
                position: relative;
                transform: translate(0.25em);
                transition-duration: 0.2s;
                transition-timing-function: cubic-bezier(0.38, 0, 0.24, 1);
                transition-delay: 0s;
                transition-property: all;
                z-index: 2;
                background: #fff;
            }
        `;
    }
}
