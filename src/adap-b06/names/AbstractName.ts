import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // precondition: delimiter must be a single character
        IllegalArgumentException.assert(delimiter.length === 1, "Delimiter must be a single character");
        
        this.delimiter = delimiter;
        
        // check invariant after initialization
        this.assertClassInvariant();
    }

    public clone(): Name {
        throw new Error("needs implementation or deletion");
    }

    public asString(delimiter: string = this.delimiter): string {
        // precondition: check if delimiter is valid
        IllegalArgumentException.assert(delimiter.length === 1, "Delimiter must be a single character");

        const components: string[] = [];
        const n = this.getNoComponents();

        for (let i = 0; i < n; i++) {
            const component = this.getComponent(i);
            
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
        // precondition
        if (!other) return false;

        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
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
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {
        // precondition
        IllegalArgumentException.assert(other != null, "Other name cannot be null");

        // immutable now, chain append calls.
        // each append returns a NEW object, so update reference.
        let result: Name = this;

        for (let i = 0; i < other.getNoComponents(); i++) {
            result = result.append(other.getComponent(i));
        }
        
        return result;
    }

    protected assertClassInvariant(): void {
        InvalidStateException.assert(this.delimiter.length === 1, "Invariant failed: Delimiter must be single char");
    }

}