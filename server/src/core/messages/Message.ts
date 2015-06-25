/// <reference path='../../types' />

class Message {
    private opCode : number;
    private opCodeStr : string;
    private data : Object;

    constructor(opCode : number) {
        this.opCode = opCode;
        this.data = {
            'o' : this.opCode
        };

        // Setup opcode
        if (opCode > 126) {
            throw new RangeError("OpCode has reached a limit (opCode: "+opCode+")" )
        }
        this.opCodeStr = String.fromCharCode(opCode);
    }

    public getOpCodeString() : string {
        return this.opCodeStr;
    }

    public getOpCode() : number {
        return this.opCode;
    }

    public setData(data : Object) : void {
        this.data = data;
        data['o'] = this.opCode;
    }

    public getData() : Object {
        return this.data;
    }
}

export = Message;