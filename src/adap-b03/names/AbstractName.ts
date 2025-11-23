import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // setting the delimiter for everyone here
        this.delimiter = delimiter;
    }

    
    abstract clone(): Name;
    

    public asString(delimiter: string = this.delimiter): string {
        // refactored logic from b02:
        // we iterate over components using the abstract methods.
        // this way it works for both StringName and StringArrayName automatically.
        const components: string[] = [];
        const n = this.getNoComponents();

        for (let i = 0; i < n; i++) {
            const component = this.getComponent(i);
            
            // perform the unmasking like we learned in the forum
            const escapedDelimiter = ESCAPE_CHARACTER + this.delimiter;
            const escapedEscapeChar = ESCAPE_CHARACTER + ESCAPE_CHARACTER;

            const unmasked = component.replaceAll(escapedDelimiter, this.delimiter)
                                      .replaceAll(escapedEscapeChar, ESCAPE_CHARACTER);
            
            components.push(unmasked);
        }

        return components.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const parts: string[] = [];
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            parts.push(this.getComponent(i));
        }
        return parts.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        // first check: is it null?
        if (!other) return false;

        // check if length is same. if not, cant be equal
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }

        // iterate and compare each component.
        // this works even if one is StringName and the other StringArrayName!
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        // simple hash algo, similar to the coordinate one
        // we use asDataString to get a unique string representation to hash
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}