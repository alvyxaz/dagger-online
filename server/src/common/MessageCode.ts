enum MessageCode {
    Login = 0,
    Register = 1,
    ServerSelect = 2,
    Error = 3,
    AssignConnector = 4,
    CredentialsRequest = 5, // Sent by connector
    JoinQueue = 6,
    ConfirmQueue = 7,
    GameLoad = 8,
    PositionUpdate = 9,
    PlayerInGame = 10,
    ShowObjects = 11,
    RemoveObjects = 12,
    MoveObjects = 13,
}

export = MessageCode;