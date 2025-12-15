import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
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
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "Index out of bounds");
        return this.components[i];
    }

    public setComponent(i: number, c: string): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "Index out of bounds");
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        // create copy
        const newComponents = [...this.components];
        // modify copy
        newComponents[i] = c;
        
        // return new object
        return new StringArrayName(newComponents, this.delimiter);
    }

    public insert(i: number, c: string): Name {
        IllegalArgumentException.assert(i >= 0 && i <= this.components.length, "Index out of bounds");
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const newComponents = [...this.components];
        newComponents.splice(i, 0, c);

        return new StringArrayName(newComponents, this.delimiter);
    }

    public append(c: string): Name {
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const newComponents = [...this.components];
        newComponents.push(c);

        return new StringArrayName(newComponents, this.delimiter);
    }

    public remove(i: number): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "Index out of bounds");

        const newComponents = [...this.components];
        newComponents.splice(i, 1);

        return new StringArrayName(newComponents, this.delimiter);
    }
}