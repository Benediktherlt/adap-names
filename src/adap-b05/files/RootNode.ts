import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { Node } from "./Node";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // null operation
    }

    /**
     * Service boundary implementation for findNodes.
     * captures internal errors and escalates them as ServiceFailureException.
     */
    public findNodes(bn: string): Set<Node> {
        try {
            return super.findNodes(bn);
        } catch (error) {
            // according to lecture slides, catch all errors at service boundary
            // and re-throw as ServiceFailureException (checked exception simulation)
            if (error instanceof Exception) {
                throw new ServiceFailureException("Service failed during findNodes lookup", error);
            } else {
                throw new ServiceFailureException("Service failed with unknown error", undefined);
            }
        }
    }

}