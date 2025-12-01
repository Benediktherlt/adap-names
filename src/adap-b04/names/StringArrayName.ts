import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        // precondition: source must not be null
        IllegalArgumentException.assert(source != null, "Source cannot be null");
        
        this.components = [...source];
        this.assertClassInvariant();
    }

    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        // precondition: index check
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "Index out of bounds");
        
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        // precondition: index check and c check
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "Index out of bounds");
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        this.components[i] = c;
        
        this.assertClassInvariant();
        // postcondition: value must be set
        MethodFailedException.assert(this.components[i] === c, "Postcondition failed: component not set");
    }

    public insert(i: number, c: string): void {
        // precondition: index can be equal to length (append) but not larger
        IllegalArgumentException.assert(i >= 0 && i <= this.components.length, "Index out of bounds");
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const oldLength = this.components.length;
        
        this.components.splice(i, 0, c);

        this.assertClassInvariant();
        // postcondition: length must increase by 1
        MethodFailedException.assert(this.components.length === oldLength + 1, "Postcondition failed: length did not increase");
    }

    public append(c: string): void {
        // precondition
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const oldLength = this.components.length;

        this.components.push(c);

        this.assertClassInvariant();
        // postcondition
        MethodFailedException.assert(this.components.length === oldLength + 1, "Postcondition failed: length did not increase");
    }

    public remove(i: number): void {
        // precondition
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "Index out of bounds");

        const oldLength = this.components.length;

        this.components.splice(i, 1);

        this.assertClassInvariant();
        // postcondition
        MethodFailedException.assert(this.components.length === oldLength - 1, "Postcondition failed: length did not decrease");
    }
}