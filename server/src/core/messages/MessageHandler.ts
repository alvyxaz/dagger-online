/**
 * Created by Alvys on 2015-05-29.
 */
/// <reference path='../../types' />
import Message = require('./Message');

interface MessageHandler <T, V> {
    getMessageType() : T;
    handle(message : V, sender: any) : boolean;
    handleAck(message: V, sender: any, callback? : (data: Object) => void) : Object;
}

export = MessageHandler;