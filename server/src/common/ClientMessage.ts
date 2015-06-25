/// <reference path='../types' />

import Message = require('../core/Messages/Message');
import MessageCode = require('./MessageCode');

class SubServerMessage extends Message {
    constructor(type : MessageCode){super(type);}
}

export = SubServerMessage;