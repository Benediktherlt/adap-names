import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.updateComponentCount();
    }

    public clone(): Name {
        //returning a new intance with the same state
        return new StringName(this.name, this.delimiter);
    }


    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const components = this.getComponentsAsArray();
        if (i < 0 || i >= components.length) {
            throw new Error("Index out of bounds");
        }
        return components[i];
    }

    public setComponent(i: number, c: string) {
        const components = this.getComponentsAsArray();
        if (i < 0 || i >= components.length) {
            throw new Error("Index out of bounds");
        }
        components[i] = c;
        this.name = components.join(this.delimiter);
        // count doesn't change
    }

    public insert(i: number, c: string) {
        const components = this.getComponentsAsArray();
        if (i < 0 || i > components.length) {
            throw new Error("Index out of bounds");
        }
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.updateComponentCount();
    }

    public append(c: string) {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.updateComponentCount();
    }

    public remove(i: number) {
        const components = this.getComponentsAsArray();
        if (i < 0 || i >= components.length) {
            throw new Error("Index out of bounds");
        }
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.updateComponentCount();
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