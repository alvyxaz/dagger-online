var GameObjectType;
(function (GameObjectType) {
    GameObjectType[GameObjectType["None"] = 0x0] = "None";
    GameObjectType[GameObjectType["Any"] = 0xf] = "Any";
    GameObjectType[GameObjectType["Character"] = 0x1] = "Character";
    GameObjectType[GameObjectType["Npc"] = 0x2] = "Npc";
    GameObjectType[GameObjectType["Player"] = 0x4] = "Player";
})(GameObjectType || (GameObjectType = {}));
module.exports = GameObjectType;
//# sourceMappingURL=GameObjectType.js.map