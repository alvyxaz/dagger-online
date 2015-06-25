var Message = (function () {
    function Message(opCode) {
        this.opCode = opCode;
        this.data = {
            'o': this.opCode
        };
        if (opCode > 126) {
            throw new RangeError("OpCode has reached a limit (opCode: " + opCode + ")");
        }
        this.opCodeStr = String.fromCharCode(opCode);
    }
    Message.prototype.getOpCodeString = function () {
        return this.opCodeStr;
    };
    Message.prototype.getOpCode = function () {
        return this.opCode;
    };
    Message.prototype.setData = function (data) {
        this.data = data;
        data['o'] = this.opCode;
    };
    Message.prototype.getData = function () {
        return this.data;
    };
    return Message;
})();
module.exports = Message;
//# sourceMappingURL=Message.js.map