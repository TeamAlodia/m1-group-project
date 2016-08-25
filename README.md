# Commands

* Start game: _wake up_
* Movement: _n,s,e,w_

# Environment

* Locked doors can only be opened from one side, and if the player has a key
* The unopenable side of a door is represented by - when on a north or south wall, and a | when on an east or west wall
* The player is currently gifted with unlimited keys, so there is no feedback on the locked/unlocked status of a door if the player approaches it from the openable side.

# Global Settings

* Map Variables
  * xAxis - sets width of map
  * yAxis - sets height of map
  * complexity - roughly determines the number of constructions placed
* Hallway Variables
  * hallLengthMin - sets minimum length of hallways
  * hallLengthMax - sets maximum length of hallways

# Function calls in order

* createFloor - master floor creation function, calls other functions related to floor creation, i.e., floors, tunnels, and walls.
  * createIndex - takes in a character and returns an array detailing all locations in the floor array containing that character.
  * insertWalls - replaces dirt(X) surrounding floors(.) with walls (#) in the floor array
  * insertTunnel - takes in a coordinate of a random wall and digs a hall of variable length related to hallLengthMin and hallLengthMax
  * drawFloor - takes the floor array and draws it for player. Uses appended spans for each horizontal line.
* doKeyDown - interprets keypresses (currently qweadzxc as direction keys)
  * playerMovement - takes in two integers related to desired movement and checks the map to see if movement is viable. Redraws the map if it is.
