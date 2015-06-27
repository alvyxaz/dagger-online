# Dagger Online

A stab at making an online game with node.js backend. Why node.js? Because it's fun to use, 
easy to prototype with, easy to scale, and cheap to host

##Development Progress
### Client:
 * Connect to Gateway Server :white_check_mark:
 * Login to Gateway Server :white_check_mark:
 * Connect to Game Server (through Connector) :white_check_mark:
 * Gameplay:
   * Entering a Game World :o: (Waiting for server side to be ready)
 
### Server
* Gateway Server :white_check_mark:
* Connector Server :white_check_mark:
* Game Server 
  * Game Object (Generic entity) :o: 

##Technologies used:

#### Client:
  * Unity
  * Basic Socket.io implementation (websockets)
  
#### Server:
  * Gulp - task runner
  * Typescript - typesafe javascript
  * Mocha / chai - testing framework
  * Socket.io - connection
  * MongoDB / Mongoose - database
  * lodash - functional programming stuff
  * node.js - for all the cool stuff
