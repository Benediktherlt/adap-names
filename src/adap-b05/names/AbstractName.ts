import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

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
        // abstract classes cant implement clone directly usually
        throw new Error("needs implementation or deletion");
    }

    public asString(delimiter: string = this.delimiter): string {
        // precondition: check if delimiter is valid
        IllegalArgumentException.assert(delimiter.length === 1, "Delimiter must be a single character");

        // refactored logic from b02/b03
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
        // precondition: other must not be null/undefined for a valid comparison
        // actually, usually isEqual returns false if null, but lets be strict here
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
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        // precondition: other cannot be null
        IllegalArgumentException.assert(other != null, "Other name cannot be null");

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    // helper to check class invariants
    protected assertClassInvariant(): void {
        InvalidStateException.assert(this.delimiter.length === 1, "Invariant failed: Delimiter must be single char");
    }

}