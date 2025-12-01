import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        // precondition: file must be closed to be opened
        IllegalArgumentException.assert(this.doGetFileState() === FileState.CLOSED, "Can only open closed files");
        
        // do something (mock implementation)
        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        // precondition: file must be open to read
        IllegalArgumentException.assert(this.doGetFileState() === FileState.OPEN, "Can only read from open files");
        
        // read something
        return new Int8Array();
    }

    public close(): void {
        // precondition: file must be open to be closed
        IllegalArgumentException.assert(this.doGetFileState() === FileState.OPEN, "Can only close open files");
        
        // do something
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}