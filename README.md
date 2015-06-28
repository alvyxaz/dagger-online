# Dagger Online

A stab at making an online game with node.js backend. Why node.js? Because it's fun to use, 
easy to prototype with, easy to scale, and cheap to host

##Development Progress

:white_check_mark: - done/ good enough to allow going further
:o: - currently working on

### Connection Related
* :white_check_mark: Player connecting to gateway
* :white_check_mark: Player registration
* :white_check_mark: Player login
* :white_check_mark: Connect player to Game server (through connector)

### Gameplay Related
* :o: Enter a world
  * Server
    * Create basic world -> server -> channel? entities :o:
  * Client
    * Display a zone/map from data received

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
