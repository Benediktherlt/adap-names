import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        // precondition
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
        // precondition
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of bounds");

        const components = this.getComponentsAsArray();
        return components[i];
    }

    public setComponent(i: number, c: string): void {
        // precondition
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of bounds");
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const components = this.getComponentsAsArray();
        components[i] = c;
        this.name = components.join(this.delimiter);
        
        // count doesn't change, but verify invariant
        this.assertClassInvariant();
    }

    public insert(i: number, c: string): void {
        // precondition: allow i == noComponents (append)
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents, "Index out of bounds");
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const oldLength = this.noComponents;

        const components = this.getComponentsAsArray();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.updateComponentCount();

        this.assertClassInvariant();
        // postcondition
        MethodFailedException.assert(this.noComponents === oldLength + 1, "Postcondition failed: length did not increase");
    }

    public append(c: string): void {
        // precondition
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const oldLength = this.noComponents;

        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.updateComponentCount();

        this.assertClassInvariant();
        // postcondition
        MethodFailedException.assert(this.noComponents === oldLength + 1, "Postcondition failed: length did not increase");
    }

    public remove(i: number): void {
        // precondition
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of bounds");

        const oldLength = this.noComponents;

        const components = this.getComponentsAsArray();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.updateComponentCount();

        this.assertClassInvariant();
        // postcondition
        MethodFailedException.assert(this.noComponents === oldLength - 1, "Postcondition failed: length did not decrease");
    }

    // Helper methods
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