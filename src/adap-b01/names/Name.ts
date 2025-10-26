export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        // simple copy of the array so it doesnt get changed from outside
        this.components = [...other];
        if (delimiter) {
            this.delimiter = delimiter;
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        // we need to actively un-escape here
        // create a new array with the unmasked components
        const unmaskedComponents = this.components.map(component => {
            // first, replace the escaped delimiter (e.g., "\.") with the delimiter itself (".")
            // then, replace the escaped escape char ("\\") with the escape char ("\")
            const escapedDelimiter = ESCAPE_CHARACTER + this.delimiter;
            const escapedEscapeChar = ESCAPE_CHARACTER + ESCAPE_CHARACTER;

            return component.replaceAll(escapedDelimiter, this.delimiter)
                            .replaceAll(escapedEscapeChar, ESCAPE_CHARACTER);
        });
        return unmaskedComponents.join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    public asDataString(): string {
        // always use the default one here as the doc says
        return this.components.join(DEFAULT_DELIMITER);
    }

    public getComponent(i: number): string {
        // simple getter, but need to check the index first
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        // gotta check the bounds here too
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        // splice is perfect for this, inserts at index i
        if (i < 0 || i > this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        // push is the easiest way to add at the end
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        // also using splice here to remove one element
        this.components.splice(i, 1);
    }
}