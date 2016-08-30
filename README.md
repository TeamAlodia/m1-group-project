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
  * removeDirt - replaces all dirt(X) in floor array with blanks
  * drawFloor - takes the floor array and draws it for player. Uses appended spans for each horizontal line.
* doKeyDown - interprets keypresses (currently qweadzxc as direction keys)
  * playerMovement - takes in two integers related to desired movement and checks the map to see if movement is viable. Redraws the map if it is.

  # Specifications

  All of this is contained within the level object

  1. Map Generation
  * create new level object with the following properties
    -hall length: pick random direction. pick random length (by setting min and max). Build a hallway (represented by '.') in that direction for that length.
    sightlength:

  * function that creates randomly placed ladders and hatches and takes argument to determine number of each  
    -stepping on ladders takes you up a level
    -stepping on hatches takes you down a level (no hatches on first level)


  -LOS
  -item Generation
  -shadow spawning/behavior
  -flashlight

  ## Audio

  * Background music plays in a loop with the gameplay.
    * Input: User loads game.
    * Output: Background music starts and plays on repeat at low volume.

  * Background music stops when gameplay ends.
    * Input: Player finishes game.
    * Output: Background music stops.

  * Picking up special items triggers item-specific sounds.
    * Input: Player picks up notebook.
    * Output: Voiceover for notebook plays.

  * Picking up a key or battery triggers one of three sounds.
    * Input: Player picks up a key.
    * Output: Voiceover for "non-special item" plays.
