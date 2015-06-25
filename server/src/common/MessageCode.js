var MessageCode;
(function (MessageCode) {
    MessageCode[MessageCode["Login"] = 0] = "Login";
    MessageCode[MessageCode["Register"] = 1] = "Register";
    MessageCode[MessageCode["ServerSelect"] = 2] = "ServerSelect";
    MessageCode[MessageCode["Error"] = 3] = "Error";
    MessageCode[MessageCode["AssignConnector"] = 4] = "AssignConnector";
    MessageCode[MessageCode["CredentialsRequest"] = 5] = "CredentialsRequest";
    MessageCode[MessageCode["JoinQueue"] = 6] = "JoinQueue";
    MessageCode[MessageCode["ConfirmQueue"] = 7] = "ConfirmQueue";
})(MessageCode || (MessageCode = {}));
module.exports = MessageCode;
//# sourceMappingURL=MessageCode.js.map