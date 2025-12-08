import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        // 1. Check self via super implementation
        const result = super.findNodes(bn);

        // 2. Recursively check all children
        this.childNodes.forEach((child) => {
            // recursion step
            const childResults = child.findNodes(bn);
            // merge results
            childResults.forEach((foundNode) => {
                result.add(foundNode);
            });
        });

        return result;
    }

}