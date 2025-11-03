import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;
        if (delimiter) {
            this.delimiter = delimiter;
        }
        // calculate number of components once at the beginning
        this.updateComponentCount();
    }

    // helper to split the string into components, respecting escaped delimiters
    private getComponentsAsArray(): string[] {
        if (this.name === "") {
            return [];
        }
        // this regex is splits by the delimiter unless it's escaped
        const regex = new RegExp(`(?<!\\\\)${this.delimiter.replace('.', '\\.')}`);
        return this.name.split(regex);
    }

    // helper to update the cached component count
    private updateComponentCount(): void {
        if (this.name === "") {
            this.noComponents = 0;
        } else {
            this.noComponents = this.getComponentsAsArray().length;
        }
    }
    // same as in b01 
    public asString(delimiter: string = this.delimiter): string {
        const components = this.getComponentsAsArray();
        
        const unmaskedComponents = components.map(component => {
            const escapedDelimiter = ESCAPE_CHARACTER + this.delimiter;
            const escapedEscapeChar = ESCAPE_CHARACTER + ESCAPE_CHARACTER;

            return component.replaceAll(escapedDelimiter, this.delimiter)
                            .replaceAll(escapedEscapeChar, ESCAPE_CHARACTER);
        });

        return unmaskedComponents.join(delimiter);
    }

    public asDataString(): string {
        // if the internal delimiter is the default
        if (this.delimiter === DEFAULT_DELIMITER) {
            return this.name;
        }
        // otherwise, gotta parse and re-join
        const components = this.getComponentsAsArray();
        return components.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        // parse this thing every time
        const components = this.getComponentsAsArray();
        if (i < 0 || i >= components.length) {
            throw new Error("Index out of bounds");
        }
        return components[i];
    }

    public setComponent(i: number, c: string): void {
        const components = this.getComponentsAsArray();
        if (i < 0 || i >= components.length) {
            throw new Error("Index out of bounds");
        }
        components[i] = c;
        this.name = components.join(this.delimiter);
        // no need to update count, it stays the same
    }

    public insert(i: number, c: string): void {
        const components = this.getComponentsAsArray();
        if (i < 0 || i > components.length) {
            throw new Error("Index out of bounds");
        }
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.updateComponentCount();
    }

    public append(c: string): void {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.updateComponentCount();
    }

    public remove(i: number): void {
        const components = this.getComponentsAsArray();
        if (i < 0 || i >= components.length) {
            throw new Error("Index out of bounds");
        }
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.updateComponentCount();
    }

    public concat(other: Name): void {
        // same logic as in StringArrayName, programming to the interface
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }
}