/// <reference path='../../types' />

import Message = require('../../core/Messages/Message');
import SubServerMessageCode = require('./SubServerMessageCode');

class SubServerMessage extends Message {
    constructor(type : SubServerMessageCode){super(type);}
}

export = SubServerMessage;