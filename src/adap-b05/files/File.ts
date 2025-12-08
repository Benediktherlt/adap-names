import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { ServiceFailureException } from "../common/ServiceFailureException";

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
        // do something
    }

    public read(noBytes: number): Int8Array {
        let result: Int8Array = new Int8Array(noBytes);
        
        // try to read bytes, with retry logic
        for (let i: number = 0; i < noBytes; i++) {
            let tries: number = 0;
            let success: boolean = false;

            while (tries < 3 && !success) {
                try {
                    result[i] = this.readNextByte();
                    success = true; // if we reach here, reading worked
                } catch(ex) {
                    tries++;
                    if (ex instanceof MethodFailedException) {
                        // Transient error, we can retry
                        if (tries >= 3) {
                            // escalation
                            throw new ServiceFailureException("Read failed after 3 attempts", ex);
                        }
                    } else {
                        throw ex;
                    }
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        return 0; // stub
    }

    public close(): void {
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}