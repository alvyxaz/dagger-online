/**
 * Created by Alvys on 2015-05-29.
 */
enum SubServerMessageCode {
    Error = -1,
    NoHandler = 0,
    RegisterConnector = 1,
    GameServerInfo = 2,
    AddAccount = 3, // Notifies connector about new user
    UserConnected = 4, // To notify Gameserver about connected user
    UserDisconnected = 5,
}

export = SubServerMessageCode;