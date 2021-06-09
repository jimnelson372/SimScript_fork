import { Event } from './event';

/**
 * Throws an Exception if a condition is false.
 * 
 * @param condition Boolean value representing the condition to test.
 * @param msg Message of the Exception thrown if the condition is false.
 */
export function assert(condition: boolean, msg: string) {
    if (!condition) {
        console.error(msg);
        throw msg;
    }
}

/**
 * Formats a number using the current culture.
 * 
 * @param value Number to be formatted.
 * @param decimals Number of decimals to display.
 * @returns A string containing the representation of the given number.
 */
export function format(value: number, decimals = 2) {
    return _getNumberFormat(decimals).format(value);
}
const _numberFormats: any = {};
function _getNumberFormat(decimals: number): Intl.NumberFormat {
    let nf = _numberFormats[decimals];
    if (!nf) {
        nf = _numberFormats[decimals] = new Intl.NumberFormat(navigator.language, {
            useGrouping: true,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }
    return nf;
}

/**
 * Binds an input element to a variable (parameter).
 * 
 * @param id Id of the input element to bind.
 * @param initialValue Initial value applied to the input element.
 * @param onInput Function called when the input value changes.
 * @param suffix String appended to the span element after input range elements.
 */
export function bind(id: string, initialValue: any, onInput: Function, suffix = '') {
    const input = document.getElementById(id) as any;
    const isCheck = input.type == 'checkbox';
    const isNumber = input.type == 'range' || input.type == 'number';
    const isSelect = input instanceof HTMLSelectElement;

    // set initial value
    if (isCheck) {
        input.checked = initialValue as boolean;
    } else if (isSelect) {
        input.selectedIndex = initialValue;
    } else if (isNumber) {
        input.valueAsNumber = initialValue;
    } else {
        input.value = initialValue;
    }

    // show current range value
    const span = input.type == 'range'
        ? input.insertAdjacentElement('afterend', document.createElement('span'))
        : null;
    if (span) {
        span.textContent = ` ${input.value}${suffix}`;
    }
    
    // apply changes
    input.addEventListener('input', e => {
        if (span) {
            span.textContent = ` ${input.value}${suffix}`;
        }
        const value = isCheck ? input.checked :
            isSelect ? input.selectedIndex :
            isNumber ? input.valueAsNumber :
            input.value;
        onInput(value);
    });
}

/**
 * Applies a group of property values and event handlers to an object.
 * 
 * @param obj Object that contains the properties and events.
 * @param options Object that contains the property values and event handlers to apply.
 */
export function setOptions(obj: any, options: any) {
    if (options) {
        for (let key in options) {
            assert(key in obj, `Property ${key} is not defined`);
            if (obj[key] instanceof Event) { // add event handler
                (obj[key] as Event).addEventListener(options[key]);
            } else {
                obj[key] = options[key]; // property assignment
            }
        }
    }
}

/**
 * Gets an HTML element from a query selector.
 *
 * @param selector An HTML element or a query selector string, or a jQuery object.
 */
export function getElement(selector: any): Element {
    let e = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
    assert(e instanceof Element, 'Element not found:' + selector);
    return e;
}

/**
 * Clamps a value to a given range.
 * 
 * @param value Value to clamp.
 * @param min Minimum allowed value, or null of there is no lower bound.
 * @param max Maximum allowed value, or null of there is no upper bound.
 * @returns The clamped value (value >= min && value <= max).
 */
export function clamp(value: number, min: number | null, max: number | null): number {
    return (min != null && value < min) ? min
        : (max != null && value > max) ? max
        : value;
}

/**
 * Defines the properties of point objects.
 */
 export interface IPoint {
    x: number;
    y: number;
    z?: number;
}

/**
 * Represents a point with x, y, and z coordinates.
 */
export class Point implements IPoint {
    x: number;
    y: number;
    z: number;

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone() {
        return new Point(this.x, this.y, this.z);
    }

    static distance(p1: IPoint, p2: IPoint): number {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z || 0 - p2.z || 0;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    static interpolate(p1: IPoint, p2: IPoint, pct: number): IPoint {
        return new Point(
            p1.x + (p2.x - p1.x) * pct,
            p1.y + (p2.y - p1.y) * pct,
            p1.z + (p2.z - p1.z) * pct
        );
    }
    static angle(p1: IPoint, p2: IPoint, radians?: boolean): number {
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return radians? angle : Math.round(angle * 180 / Math.PI);
    }
}
