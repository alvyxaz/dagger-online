var SubServerMessageCode;
(function (SubServerMessageCode) {
    SubServerMessageCode[SubServerMessageCode["Error"] = -1] = "Error";
    SubServerMessageCode[SubServerMessageCode["NoHandler"] = 0] = "NoHandler";
    SubServerMessageCode[SubServerMessageCode["RegisterConnector"] = 1] = "RegisterConnector";
    SubServerMessageCode[SubServerMessageCode["GameServerInfo"] = 2] = "GameServerInfo";
    SubServerMessageCode[SubServerMessageCode["AddAccount"] = 3] = "AddAccount";
    SubServerMessageCode[SubServerMessageCode["UserConnected"] = 4] = "UserConnected";
    SubServerMessageCode[SubServerMessageCode["UserDisconnected"] = 5] = "UserDisconnected";
})(SubServerMessageCode || (SubServerMessageCode = {}));
module.exports = SubServerMessageCode;
//# sourceMappingURL=SubServerMessageCode.js.map