import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        // just take the input as is, expecting it to be masked
        this.components = [...source]; 
        if (delimiter) {
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        // this is the tricky un-escaping part from the last homework
        const unmaskedComponents = this.components.map(component => {
            const escapedDelimiter = ESCAPE_CHARACTER + this.delimiter;
            const escapedEscapeChar = ESCAPE_CHARACTER + ESCAPE_CHARACTER;

            return component.replaceAll(escapedDelimiter, this.delimiter)
                            .replaceAll(escapedEscapeChar, ESCAPE_CHARACTER);
        });
        
        // join the clean parts
        return unmaskedComponents.join(delimiter);
    }

    public asDataString(): string {
        // just join with the default delimiter
        return this.components.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        // return the masked component, just as its stored
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        // simple push to the end of the array
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        // program to an interface! get components from the other name one by one
        // doesnt matter if its a StringName or StringArrayName
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}