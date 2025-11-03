import { File } from "./File";

export class ObjFile implements File {

    protected data: Object[] = [];
    protected length: number = 0;
    // core of this class, track if its open or not
    private _isOpen: boolean = false;

    public isEmpty(): boolean {
      return this.length == 0;
    }

    public isOpen(): boolean {
      return this._isOpen;
    }
  
    public isClosed(): boolean {
        return !this._isOpen;
    }
  
    public open(): void {
      this.assertIsClosedFile();
      this._isOpen = true;
    }

    public read(): Object[] {
      this.assertIsOpenFile();
      // return a copy so the original cant be changed from outside
      return [...this.data];
    }

    public write(data: Object[]): void {
      this.assertIsOpenFile();
      // make a copy of the new data and update length
      this.data = [...data];
      this.length = data.length;
    }
  
    public close(): void {
      this.assertIsOpenFile();
      // just set the state back to closed
      this._isOpen = false;
    }

    public delete(): void {
      this.assertIsClosedFile();
      // wipe everything clean
      this.data = [];
      this.length = 0;
    }

    protected assertIsOpenFile(): void {
        if (!this.isOpen()) {
            throw new Error("File is not open.");
        }
    }

    protected assertIsClosedFile(): void {
        if (!this.isClosed()) {
            throw new Error("File is not closed.");
        }
    }
}