import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(source != null, "Source cannot be null");
        this.name = source;
        this.updateComponentCount();
        this.assertClassInvariant();
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of bounds");
        const components = this.getComponentsAsArray();
        return components[i];
    }

    public setComponent(i: number, c: string): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of bounds");
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const components = this.getComponentsAsArray();
        components[i] = c;
        // join to create new string
        const newNameString = components.join(this.delimiter);
        
        return new StringName(newNameString, this.delimiter);
    }

    public insert(i: number, c: string): Name {
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents, "Index out of bounds");
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const components = this.getComponentsAsArray();
        components.splice(i, 0, c);
        const newNameString = components.join(this.delimiter);

        return new StringName(newNameString, this.delimiter);
    }

    public append(c: string): Name {
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        let newNameString = "";
        if (this.isEmpty()) {
            newNameString = c;
        } else {
            newNameString = this.name + this.delimiter + c;
        }

        return new StringName(newNameString, this.delimiter);
    }

    public remove(i: number): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of bounds");

        const components = this.getComponentsAsArray();
        components.splice(i, 1);
        const newNameString = components.join(this.delimiter);

        return new StringName(newNameString, this.delimiter);
    }

    // helper
    private getComponentsAsArray(): string[] {
        if (this.name === "") {
            return [];
        }
        const regex = new RegExp(`(?<!\\\\)${this.delimiter.replace('.', '\\.')}`);
        return this.name.split(regex);
    }

    private updateComponentCount(): void {
        if (this.name === "") {
            this.noComponents = 0;
        } else {
            this.noComponents = this.getComponentsAsArray().length;
        }
    }
}