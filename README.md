# Shadowlight

* by Alaina Traxler Ryan Loos, HK Kahng, Justin Kincaid
* with voice acting and script editing by Nancy Novotny

## Description

A "Roguelike" adventure where the player navigates through a sanity-sapping dark cave filled with voracious Shadows. Features procedurally generated terrain, line-of-sight mechanics, and audio components.

## Commands

* Movement:   
 * Q: Move Northwest
 * W: Move North
 * E: Move Northeast
 * A: Move West
 * D: Move East
 * Z: Move Southwest
 * X: Move South
 * C: Move Southeast

* Action:
 * S: Toggle flashlight

## Scripts.js Specifications

  * A. drawHUD:
    Draws the HUD (Heads Up Display) based on the information changes in the following variables.
     * Batteries, Keys, current level the player is on
     * flashlight Meter: display one '/' for every 5 power
     * sets flashlight HUD to change red if flashlight power gets to or below 20
     * sets sanity HUD to change red if sanity gets to or below 20
     * display "press H for help" text perpetually

  * B. updateFlashLight:
    Decrements flashlight power based on usage. If flashlight is on, power decrement by 1. If flashlight is off, decrement power by 2

  * C. gameOver/gameWin:
    Both functions work identically, they stop the game and allow the player to start a new game with the spacebar.

  * D. turnLogic:
  Every time the player moves counts as a turn and this code runs in the following order.
   * 1. Checks victory condition.
     * if player's sanity is at 0 then run gameOver
     * if winState variable is not empty run gameWin
   * 2. If the player presses 'H', display the hidden help div that contains player controls
   * 3. Check if flashlight power is at or below 0
     * if so decrement batteries by one, increase flashlight power to 100
     * if player has no batteries, set flashlight power to zero and turn the flashlight off
   * 4. Check if player changed flashlight state and changes it again based on previous state
    input: 's'
    output: flashlight goes from off to lit
   * 5. Check if player pressed a movement key and if so run playerMovement (level_lib, Q) function on that direction to move the player character.
    input: 'w'
    output: player moves up
   * 6. Check flashlight state and change sanity accordingly
    input: flashlightstate is off
    output: sanity decreases by 2
   * 7. Runs DrawHUD (scripts.js A)
   * 8. Loops through shadow level array and runs shadowMovement(level_lib, S)
   * 9. Runs checkSight(level_lib, M) on levelArray
   * 10. Runs shadowResolution (level_lib, T) on levelArray
   * 11. Runs drawMap (level_lib, L) on levelArray

## level_lib.js Specifications

  * A. createLevel:
    * 1. Pushes one 'X' (dirt) to the empty mapArray for each XY coordinate. Length of X and Y taken from yAxis and xAxis in Level object
    * 2. Creates an X and Y origin point for player in the center of the map and places player on it
    * 3. Creates walls around random start points. Number of walls is based on pre-set complexity variable
     * -uses createIndex (level_lib, B) to create an array of floor locations and replaces them with '.'
     * -uses insertWalls (level_lib, B) to replace dirt surrounding floors with walls (#)
     * -uses createIndex (level_lib, B) to create an array of wall locations
     * - finds a random piece of wall and inserts a tunnel of variable length using insertTunnel (level_lib, D).
    * 4. Updates the floor array with previous information using createIndex (level_lib, B).
    * 5. Adds items to the map at random places using insertSpecial (level_lib, J)
    * 6. Add ladders (^) to random empty spaces using placeExits (level_lib, G)
    * 7. Add hatches (v) to random empty spaces using placeExits (level_lib, G)
    * 8. Updates floorList with createIndex (level_lib, B)
    * 9. adds walls using insertWalls (level_lib, C)
    * 10. adds shadows using createShadows (level_lib, K)
    * 11. inserts player icon (@) at location determined in step 2
    * 12. removes all Xs from the map using removeDirt (level_lib, F)
    * 13. Draws the map using checkSight (level_lib, M) and drawMap (level_lib, L)

  * B. createIndex:
    Takes in a character, loops through every coordinate and creates a new array with the coordinates of each instance of that character.

  * C. insertWalls:
    * 1. finds the number of floor spaces (.)  in the floor array created in (level_lib A,3)
      * -loops through each location and replaces the surrounding 8 tiles of dirt (X) with wall (#)
    * 2. runs drawPerimeter (level_lib, E)

  * D. insertTunnel:
    * -takes a wall (#) coordinate,
    * -chooses a random direction (north, south, east, west)
    * -chooses a random length for the tunnel (between preset hallLengthMin and hallLengthMax)
    * -builds the tunnel allows 5 rejections
    * -replaces initial wall coordinate with dirt? 

  * E. drawPerimeter:
    Creates a perimeter of bedrock (B) around the map

  * F. removeDirt:
    Replaces dirt with &nbsp

  * G. placeExits: (Edit)
    Used to place both ladders and hatches. Takes a location (origin) and replaces that index on the mapArray with the correct exit type

  * H. itemPickUp:
    * -Creates an array literal that stores flavor text for each item the player can find
    * -determines which item is found and plays appropriate audio clip and gives appropriate sanity bonus
     input: player finds "Water-damaged notebook"
     output: + 20 sanity, playSound(corresponding audio)(Media.js)

  * I. insertItems:
    Takes a location and adds either chooses randomly whether to add a battery (b) or a key (k)

  * J. insertSpecial:
    Loops through the item array (level_lib, H) assigning each item a random x and y coordinate then replacing whatever is at that coordinate with the current item

  * K. createShadows:
    Runs a loop once for each shadow in the level that assigns it an x and y coordinate and pushes that information into the shadowsArray

  * L. drawMap:
    Loops through map array appending a unique span to each character type (@,#,B,[C-L],A,^,v,b,k) so that css can apply colors and styling

  * M. checkSight:
    * -checks for terminal (end of array) objects and sets variables equal to each. This is to prevent later code from producing errors by looking at undefined portions of arrays
    * -uses the variables from previous section to build an array of perimeter coordinates that will help define the player's field of view, as well as the necessary range that line of sight must be check in. To do this, the visible area is separated into octants
    * -builds visible array at a constant size, and populates it with blank (i.e. unseen) spaces
    * -uses the perimeter values to check line of sight in all directions
    * -populates visible area with shadows that are in range
    * -uses the flashlight perimeter values established in checkFlashlight to both draw flashlight area and register shadows within said area as hit

  * N. checkFlashlight:
    Uses the player's current direction to select two forward-facing octants to represent the flashlight, and builds an array of appropriate perimeter values

  * O. drawline:
    * -produces the coordinates necessary to draw a line between two points, starting with the first set of coordinates supplied
    * -passes each coordinate in sequence to plot()
    * -terminates if plot() returns a false

  * P. plot:
    * -marks flashlight areas as such in visibleArray
    * -marks any shadows in said area as hit
    * -marks visible spaces as such
    * -returns a false if the space cannot be seen

  * Q. playerMovement:
    * -checks if player is on space of a specialitem or item, if so run itemPickUp(level_lib, H)
    * -moves player to that space, replaces the '.' with a '@'
    * -moves player to the next level if they land on a '^', triggers winState if they move up from level 3
    * -moves player to previous level if they step on a 'v'

  * R. shadowMovement:

  * S. shadowResolution:
    Loops through shadow array to detect if a shadow is on a space that is currently lit or superlit by player.
    * - if the shadow gets hit, subtract one health
     * - if the shadow is at one health and gets it, it disappears
     * - if the shadow is at more than one health and gets hit it is sent to a new random origin point
     * - checks if shadow's coordinates are within 1 space of player coordinates and if so subtracts 5 sanity from the player
     * - chooses randomly whether or not to spawn a new shadow and if so spawns it at a new random coordinate

  * T. initializeLevel:
    Passes parameters into the level object and runs createLevel (level_lib, A)

  * U. between:
    takes a number, a minimum and a maximum and tells if the number is between those two

## Media.js Specifications

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

## Github Link
  * https://github.com/TeamAlodia/m1-group-project

## License
  * This application is published under the MIT License.

  * Copyright (c) 2016 Alaina Traxler Ryan Loos, HK Kahng, Justin Kincaid
