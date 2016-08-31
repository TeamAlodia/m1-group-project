var Level = function(xAxis, yAxis, complexity, hallLengthMin, hallLengthMax, sightLength, levelNum, numberOfLadders, numberOfHatches, numberOfVaults) {
  this.playerX;
  this.playerY;
  this.vaultArray = [];
  this.xOrigin;
  this.yOrigin;
  this.wallList = [];
  this.floorList = [];
  this.mapArray = [];
  this.xAxis = xAxis;
  this.yAxis = yAxis;
  this.complexity = complexity;
  this.hallLengthMin = hallLengthMin;
  this.hallLengthMax = hallLengthMax;
  this.sightLength = sightLength;
  this.sightBound = 2 * sightLength + 1;
  this.visibleArray = [];
  this.perimeterArray = [];
  this.itemCatalog = ["A","L","C","D","E","F","G","H","J","K"];
  this.shadowCount = complexity / 10;
  this.shadowsArray = [];
  this.flashlightPerimeter = [];
  this.currentDirection = "n";
  this.flashlightArray = [];
  this.checkLight;
  this.levelNum = levelNum;
  this.numberOfLadders = numberOfLadders;
  this.numberOfHatches = numberOfHatches;
  this.numberOfVaults = numberOfVaults
}

//---------- Level creation functions ----------//

Level.prototype.createLevel = function() {
  var newOrigin = 0;

  for(var y = 0; y < this.yAxis; ++y){
    this.mapArray[y] = [];
    for(var x = 0; x < this.xAxis; ++x){
      this.mapArray[y][x] = 'X';
    }
  }

  // Inserts a start point in the center of the map
  this.yOrigin = Math.floor(this.yAxis/2);
  this.xOrigin = Math.floor(this.xAxis/2);
  this.mapArray[this.yOrigin][this.xOrigin] = '.';

  // Place player at center of the map
  this.playerY = this.yOrigin;
  this.playerX = this.xOrigin;

  // Creates walls around random start point
  for(var i = 0; i < this.complexity; ++i){
    // Create array of floor locations.
    this.floorList = this.createIndex('.');

    // Replaces dirt(X) surrounding floors(.) with walls (#)
    this.insertWalls();

    // Create array of wall locations
    this.wallList = this.createIndex('#');

    // Takes a random wall location from the wall list
    newOrigin = this.wallList[(Math.floor(Math.random() * (this.wallList.length - 1)) + 1)];

    // Takes in the random wall location and inserts a tunnel of variable length
    this.insertTunnel(newOrigin);
  }

  // Updates array of floor locations
  this.floorList = this.createIndex('.');

  // Inserts Special Items
  this.insertSpecial();

  // Inserts Items
  for(var i = 0; i < this.xAxis/10; ++i){
    newOrigin = this.floorList[(Math.floor(Math.random() * (this.floorList.length-1)) + 1)];
    this.insertItems(newOrigin);
  }
  //insert ladders
  for(var i = 0; i < this.numberOfLadders; ++i){
    newOrigin = this.floorList[(Math.floor(Math.random() * (this.floorList.length-1)) + 1)];
    this.placeExits(newOrigin,"^");
    for(var y = -1; y <= 1; ++y) {
      for(var x = -1; x <= 1; ++x) {
        if(this.mapArray[newOrigin[0] + y][newOrigin[1] + x] === "#"){
          this.mapArray[newOrigin[0] + y][newOrigin[1] + x] = ".";
          // this.floorList.push(this.mapArray[newOrigin[0] + y][newOrigin[1] + x]);
        }
      }
    }
  }

  //insert hatch and moves player to it
  if (levelArray.length > 1) {
    for(var i = 0; i < this.numberOfHatches; ++i){
      newOrigin = this.floorList[(Math.floor(Math.random() * (this.floorList.length-1)) + 1)];
      this.placeExits(newOrigin,"v");
      for(var y = -1; y <= 1; ++y) {
        for(var x = -1; x <= 1; ++x) {
          if(this.mapArray[newOrigin[0] + y][newOrigin[1] + x] === "#"){
            this.mapArray[newOrigin[0] + y][newOrigin[1] + x] = ".";
            // this.floorList.push(this.mapArray[newOrigin[0] + y][newOrigin[1] + x]);
          }
        }
      }
      this.playerY = newOrigin[0] + 1;
      this.playerX = newOrigin[1] + 1;
    }
  }
    this.floorList = this.createIndex('.');

  // Updates map with walls
  this.insertWalls();

  // Insert vault entrances
  this.placeVaults();


  // Insert shadows
  this.createShadows(this.levelNum);
  console.log("createShadows Executed")

  // Inserts player icon.

  this.mapArray[this.playerY][this.playerX] = "@";

  // Removes all Xs from the map array and replaces them with "&nbsp;"
  this.removeDirt();

  // Draws map
  this.checkSight();
  this.drawMap();
};

Level.prototype.placeVaults = function() {
  var newOrigin;

  for(var i = 0; i <this.numberOfVaults; ++i){
    do{
      newOrigin = this.floorList[(Math.floor(Math.random() * (this.floorList.length-1)) + 1)];
    } while(this.mapArray[newOrigin[0]][newOrigin[1]] !== '.');

    this.mapArray[newOrigin[0]][newOrigin[1]] = 'O';
  }
};

// Takes in a character, finds all instances of the character in the map and creates a new array with their locations
Level.prototype.createIndex = function(char) {
  var index = [];

  for(var y = 0; y < this.yAxis; ++y){
    for(var x = 0; x < this.xAxis; ++x){
      if(this.mapArray[y][x] === char) {
        index.push([y,x]);
      }
    }
  }
  return index
};

// Replaces dirt(X) surrounding floors(.) with walls (#)
Level.prototype.insertWalls = function() {
  // Find the number of floors in game.
  var length = this.floorList.length;

  // Checks every floor location and the surrounding 8 tiles, replacing X with #.
  for(var i = 0; i < length; ++i) {
    var currentY = this.floorList[i][0];
    var currentX = this.floorList[i][1];

    for(var y = -1; y <= 1; ++y) {
      for(var x = -1; x <= 1; ++x) {
        if(currentY + y >= 0 && currentY + y < this.yAxis && currentX + x >= 0 && currentX + x < this.xAxis)
        if(this.mapArray[currentY + y][currentX + x] === "X"){
          this.mapArray[currentY + y][currentX + x] = "#";
        }
      }
    }
  }

  // Redraws the perimeter
  this.drawPerimeter();
};

// Takes in a wall location(origin) composed of an array [[y,x]] and inserts a line of floor (.) of variable length in a variable direction
Level.prototype.insertTunnel = function(origin) {

  this.yOrigin = origin[0];
  this.xOrigin = origin[1];
  var directionArray = ["n","s","e","w"];
  var increment = 0;

  // Try to build a tunnel, allow up to 5 rejections.
  do {
    // Choose a random direction for tunnel
    var direction = (Math.floor(Math.random() * (4 - 0)) + 0);
    // Choose a random length of tunnel
    var length =  (Math.floor(Math.random() * (this.hallLengthMax - this.hallLengthMin)) + this.hallLengthMin);

      if(directionArray[direction] === "n" && this.yOrigin-length >=0) {
        for(var i = 1; i < length + 1; ++i){
          this.mapArray[this.yOrigin - i][this.xOrigin] = ".";
        }
        increment = 5;
      } else if(directionArray[direction] === "s" && this.yOrigin + length < this.yAxis) {
        for(var i = 1; i < length + 1; ++i){
          this.mapArray[this.yOrigin + i][this.xOrigin] = ".";
        }
        increment = 5;
      } else if(directionArray[direction] === "e" && this.xOrigin + length < this.xAxis) {
        for(var i = 1; i < length + 1; ++i){
          this.mapArray[this.yOrigin][this.xOrigin + i] = ".";
        }
        increment = 5;
      } else if(this.xOrigin - length >= 0){
        for(var i = 1; i < length + 1; ++i){
          this.mapArray[this.yOrigin][this.xOrigin - i] = ".";
        }
        increment = 5;
      } else {
        increment += 1;
      }
    } while(increment < 5);

    // Replace origin wall with dirt.
    this.mapArray[this.yOrigin][this.xOrigin] = ".";
};

// Draws bedrock perimeter around map
Level.prototype.drawPerimeter = function() {
  for(var x = 0; x < this.xAxis; ++x){
    this.mapArray[0][x] = "B";
    this.mapArray[this.yAxis-1][x] = "B";
  }

  for(var y = 0; y < this.yAxis; ++y){
    this.mapArray[y][0] = "B";
    this.mapArray[y][this.xAxis-1] = "B";
  }
};

// Removes dirt and replaces it with nbsp
Level.prototype.removeDirt = function() {
  for(var y = 0; y < this.yAxis; ++y){
    for(var x = 0; x < this.xAxis; ++x) {
      if(this.mapArray[y][x] === "X"){
        this.mapArray[y][x] = "&nbsp;";
      }
    }
  }
};

Level.prototype.placeExits = function (origin, type) {
  this.yOrigin = origin[0];
  this.xOrigin = origin[1];

  this.mapArray[this.yOrigin][this.xOrigin] = type;
  };

Level.prototype.itemPickUp = function(item){
  var specialItemExpo = [
    "Water-damaged notebook: A small leatherbound notebook that's definitely seen better days. Nothing in it is legible, but it almost looks like my handwriting...",
    "Emergency ration pack: It's a pack of protein bars and bottles of water. I'd forgotten how hungry I was. And thirsty, too.",
    "Coin of indeterminate origin: This coin probably belongs in a museum.",
    "Carved wooden figurine: I recognize this figure. It's the Hindu god Ganesha.",
    "Small bunch of dried flowers: I've never seen flowers like these.",
    "Broken pocket watch: My grandfather had one of these. It was his grandfather's. Or his great grandfather's?",
    "Empty leather shoulder bag: Well, it's weatherbeaten and worn, but sturdy. And empty. Which is good, because my pockets are full.",
    "Small vial: It's a glass vial. It's not labelled at all, but whatever's in it is glowing.",
    "Card key with no markings: Have card key, will travel.",
    "A pulsing crystal pendant: The pendant is the size of my little finger. There's a crack in the crystal, and it's warm to the touch.",
    "Black feather pen: It looks like it came from a crow? Or maybe a raven?"
  ];

  if(item === "A"){
    playSound(1);
    sanity += 20;
    return specialItemExpo[0];
  } else if (item === "L") {
    playSound(2);
    sanity += 15;
    return specialItemExpo[1];
  } else if (item === "C") {
    playSound(3);
    sanity += 10;
    return specialItemExpo[2];
  } else if (item === "D") {
    playSound(4);
    sanity += 20;
    return specialItemExpo[3];
  } else if (item === "E") {
    playSound(5);
    sanity += 25;
    return specialItemExpo[4];
  } else if (item === "F") {
    playSound(6);
    sanity += 20;
    return specialItemExpo[5];
  } else if (item === "G") {
    playSound(7);
    sanity += 15;
    return specialItemExpo[6];
  } else if (item === "H") {
    playSound(8);
    sanity += 10;
    return specialItemExpo[7];
  } else if (item === "J") {
    playSound(9);
    sanity += 25;
    return specialItemExpo[8];
  } else if (item === "K") {
    playSound(10);
    sanity += 20;
    return specialItemExpo[9];
  } else if (item === "k") {
    playRandomItemSound();
    keys += 1;
  } else if (item === "b") {
    playRandomItemSound();
    console.log(batteries);
    batteries += 1;
    console.log("Picked up battery");
    console.log(batteries);
  }
};

Level.prototype.insertItems = function(origin) {
  this.yOrigin = origin[0];
  this.xOrigin = origin[1];

  if((Math.floor(Math.random() * 2) + 1) === 1){
    this.mapArray[this.yOrigin][this.xOrigin] = "b";
  } else {
    this.mapArray[this.yOrigin][this.xOrigin] = "k";
  }
};

// Inserts special items
Level.prototype.insertSpecial = function() {
  var newOrigin = 0;
  var max = this.floorList.length - 1;

  for(var i = 0; i < this.itemCatalog.length; ++i){
    newOrigin = this.floorList[(Math.floor(Math.random() * (max)) + 1)];

    this.yOrigin = newOrigin[0];
    this.xOrigin = newOrigin[1];

    this.mapArray[this.yOrigin][this.xOrigin] = this.itemCatalog[i];
  }
};

Level.prototype.createShadows = function(onLevel){
  for(var i = 0; i < this.shadowCount; ++i){
    var newOrigin = this.floorList[(Math.floor(Math.random() * (this.floorList.length-1)) + 1)];
    this.yOrigin = newOrigin[0];
    this.xOrigin = newOrigin[1];
    this.shadowsArray.push(new Shadow(this.yOrigin, this.xOrigin, 2, onLevel));
    console.log("Shadow Created");
  }
};

//---------- Level display functions ----------//

// Draws only the visible area of the map
Level.prototype.drawMap = function() {
  $("#main_con").text("");

  // Loops through the visible map area

  for(var y = 0; y <= this.sightBound; ++y){
    for(var x = 0; x <= this.sightBound; ++x){

      //Draws visibleArray with appropriate color markups.

      if(this.visibleArray[y][x] === "@"){
          $("#main_con").append("<span id='player'>@<span>");
      }else if(this.visibleArray[y][x].match(/#/)){
        $("#main_con").append("<span class='block'>#<span>");
      }else if(this.visibleArray[y][x].match(/B/)){
        $("#main_con").append("<span class='block'>#<span>");
      }else if(this.visibleArray[y][x].match(/[C-L]|A/)){
        $("#main_con").append("<span class='item'>" + this.visibleArray[y][x] + "<span>");
      }else if(this.visibleArray[y][x].match(/\^|v/)){
        $("#main_con").append("<span class='exit'>" + this.visibleArray[y][x] + "<span>");
      }else if(this.visibleArray[y][x].match(/b|k/)){
        $("#main_con").append("<span class='consumable'>" + this.visibleArray[y][x] + "<span>");
      }else{
        $("#main_con").append("<span class='unlit'>" + this.visibleArray[y][x] + "</span>");
      }
    }
  $("#main_con").append("<br>");
  }

};

// Checks all sight vectors and populates visibleArray. The line of sight model used is square, and is dependant upon the level boundaries also being square (but not the traversible area of the level.)

Level.prototype.checkSight = function() {

  //These variables are what will prevent plot() from checking undefined array locations.

  var boundNorth;
  var boundSouth;
  var boundEast;
  var boundWest;

// The following for loops are checking for terminal objects (i.e. level boundaries) in each of the cardinal directions and, upon finding them, setting the boundVar to their relative distance from the player. Otherwise, the boundVar will equal the sightLength

  for(var i = 0; i >= this.sightLength * -1; --i){
    boundNorth = i;
    if(this.mapArray[this.playerY + i][this.playerX].match(/B/) !== null){
      break;
    }
  }

  for(var i = 0; i <= this.sightLength; ++i){
    boundSouth = i;
    if(this.mapArray[this.playerY + i][this.playerX].match(/B/) !== null){
      break;
    }
  }

  for(var i = 0; i <= this.sightLength; ++i){
    boundEast = i;
    if(this.mapArray[this.playerY][this.playerX + i].match(/B/) !== null){
      break;
    }
  }

  for(var i = 0; i >= this.sightLength * -1; --i){
    boundWest = i;
    if(this.mapArray[this.playerY][this.playerX + i].match(/B/) !== null){
      break;
    }
  }

// The following for loops build an array of perimeter coordinates using the boundaries established by the boundVars. This ensures that plot() will never attempt to look outside of mapArray's defined data.  Each loop handles 2 of the 8 octants.

  //    Octants:
  //     \1|2/
  //     8\|/3
  //     --+--
  //     7/|\4
  //     /6|5\

  this.perimeterArray = [];

  // Builds octant 1 and 6 perimeter values
  for(var i = 0; i >= boundWest; --i){
    this.perimeterArray.push([boundNorth,i]);
    this.perimeterArray.push([boundSouth,i]);
  }

  // Builds octant 8 and 3 perimter values
  for(var i = 0; i >= boundNorth; --i){
    this.perimeterArray.push([i,boundWest]);
    this.perimeterArray.push([i,boundEast]);
  }

  // Builds octant 2 and 5 perimter values
  for(var i = 0; i <= boundEast; ++i){
    this.perimeterArray.push([boundNorth, i]);
    this.perimeterArray.push([boundSouth, i]);
  }

  // Builds octant 4 and 7 perimter values
  for(var i = 0; i <= boundSouth; ++i){
    this.perimeterArray.push([i, boundWest]);
    this.perimeterArray.push([i, boundEast]);
  }

  // Resets and builds visibleArray at a constant size, and populates it with blank (i.e. invisible) spaces

  this.visibleArray = [];
  this.flashlightPerimeter = this.checkFlashlight(boundNorth, boundSouth, boundEast, boundWest)

  for(var i = 0; i <= this.sightBound; ++i) {
    this.visibleArray[i] = [];
    for(var j = 0; j <= this.sightBound; ++j){
      this.visibleArray[i][j] = "&nbsp;";
    }
  }

  // Checks visible area within allowed boundaries.

  this.checkLight = false;

  for(var i = 0; i < this.perimeterArray.length ; ++i){
    var toY = this.perimeterArray[i][0];
    var toX = this.perimeterArray[i][1];

    // (origin y, origin x, draw to y, draw to x) ??
    this.drawline(0,0,toX,toY,flashlightState);
  }

  for(var i = 0; i < this.shadowsArray.length; ++i){

    var shadowY = this.shadowsArray[i].shadowY;
    var shadowX = this.shadowsArray[i].shadowX;

    if(between(shadowY, this.playerY - this.sightLength, this.playerY + this.sightLength) && between(shadowX, this.playerX - this.sightLength, this.playerX + this.sightLength)) {
      this.visibleArray[this.sightLength + ((shadowY - this.playerY))][this.sightLength + ((shadowX - this.playerX))] = "S";
    }
  }

  this.checkLight = true;

  if(flashlightState !== "off"){
    for(var i = 0; i < this.flashlightPerimeter.length ; ++i){
      var toY = this.flashlightPerimeter[i][0];
      var toX = this.flashlightPerimeter[i][1];

      // (origin y, origin x, draw to y, draw to x) ??
      this.drawline(0,0,toX,toY,flashlightState);
    }
  }
};

Level.prototype.checkFlashlight = function(boundNorth, boundSouth, boundEast, boundWest) {
  var tempArray = [];

  if(this.currentDirection === "n"){
    for(var i = 0; i >= boundWest; --i){
      tempArray.push([boundNorth,i]);
    }
    for(var i = 0; i <= boundEast; ++i){
      tempArray.push([boundNorth,i]);
    }
  }else if(this.currentDirection === "s"){
    for(var i = 0; i >= boundWest; --i){
      tempArray.push([boundSouth,i]);
    }
    for(var i = 0; i <= boundEast; ++i){
      tempArray.push([boundSouth,i]);
    }
  }else if(this.currentDirection === "e"){
    for(var i = 0; i >= boundNorth; --i){
      tempArray.push([i,boundEast]);
    }
    for(var i = 0; i <= boundSouth; ++i){
      tempArray.push([i,boundEast]);
    }
  }else if(this.currentDirection === "w"){
    for(var i = 0; i >= boundNorth; --i){
      tempArray.push([i,boundWest]);
    }
    for(var i = 0; i <= boundSouth; ++i){
      tempArray.push([i,boundWest]);
    }
  }else if(this.currentDirection === "nw"){
    for(var i = 0; i >= boundNorth; --i){
      tempArray.push([boundNorth,i]);
    }
    for(var i = 0; i >= boundWest; --i){
      tempArray.push([i,boundWest]);
    }
  }else if(this.currentDirection === "ne"){
    for(var i = 0; i >= boundNorth; --i){
      tempArray.push([boundNorth,i * -1]);
    }
    for(var i = 0; i <= boundEast; ++i){
      tempArray.push([i * -1,boundEast]);
    }
  }else if(this.currentDirection === "se"){
    for(var i = 0; i <= boundSouth; ++i){
      tempArray.push([boundSouth,i]);
    }
    for(var i = 0; i <= boundEast; ++i){
      tempArray.push([i,boundEast]);
    }
  }else if(this.currentDirection === "sw"){
    for(var i = 0; i <= boundSouth; ++i){
      tempArray.push([boundSouth,i * -1]);
    }
    for(var i = 0; i >= boundWest; --i){
      tempArray.push([i * -1,boundWest]);
    }
  }

  return tempArray;
};

// Determines the coordinates for drawing a line from x0, y0 to x1,y1. Terminates if plot() returns a false.

Level.prototype.drawline = function(x0,y0,x1,y1,flashlightState){
	var tmp;
	var steep = Math.abs(y1-y0) > Math.abs(x1-x0);
  if(steep){
  	//swap x0,y0
  	tmp=x0; x0=y0; y0=tmp;
    //swap x1,y1
    tmp=x1; x1=y1; y1=tmp;
  }

  var sign = 1;
	if(x0>x1){
    sign = -1;
    x0 *= -1;
    x1 *= -1;
  }
  var dx = x1-x0;
  var dy = Math.abs(y1-y0);
  var err = ((dx/2));
  var ystep = y0 < y1 ? 1:-1;
  var y = y0;

  // Goes down the line's coordinates, starting from the origin. If plot returns a false, drawline() terminates

  for(var x=x0;x<=x1;x++){
  	if(!(steep ? this.plot(y,sign*x,flashlightState) : this.plot(sign*x,y,flashlightState))) {
      return;
    }
    err = (err - dy);
    if(err < 0){
    	y+=ystep;
      err+=dx;
    }
  }
};

//Used by drawline to plot the current coordinates. Checks to see if current coordinates are a wall, and if so, sends back a false and terminates drawline(). Automatically populates visibleArray with the matching data in mapArray for the current coordinates regardless of outcome.

Level.prototype.plot = function(x,y,flashlightState){

  // sightLength is used as the visibleArray reference in order to keep the visible area centered on the player. mapArray also centers on the player when gathering reference data, but uses their actual position to do so.
  var newOrigin;
  if(this.checkLight){
    if(this.visibleArray[this.sightLength+y][this.sightLength+x] === "S") {
      for(var i = 0; i < this.shadowsArray.length; ++i){
        if(this.shadowsArray[i].shadowX === this.playerX+x && this.shadowsArray[i].shadowY === this.playerY+y) {
          this.shadowsArray[i].hitThisTurn = true;
        }
      }
    }

    this.visibleArray[this.sightLength+y][this.sightLength+x] = "<span class='" + flashlightState + "'>" +  this.mapArray[this.playerY+y][this.playerX+x] + "<span>";
  }else{
    this.visibleArray[this.sightLength+y][this.sightLength+x] = this.mapArray[this.playerY+y][this.playerX+x];
  }
  if(this.mapArray[this.playerY+y][this.playerX+x] !== "#"){
    return true;
  }
  else{
    return false;
  }
};

//--------------------//

Level.prototype.playerMovement = function(checkY, checkX){


  // Picks up item in target space
  if(this.mapArray[this.playerY + checkY][this.playerX + checkX].match(/[C-L]|A|b|k/)){
    currentExpo = this.itemPickUp(this.mapArray[this.playerY + checkY][this.playerX + checkX]);
  }
  // Moves player to new space
  if(this.mapArray[this.playerY + checkY][this.playerX + checkX].match(/[C-L]|A|b|k|\./)){
    this.mapArray[this.playerY][this.playerX] = '.';
    this.playerY += checkY;
    this.playerX += checkX;
    this.mapArray[this.playerY][this.playerX] = "@";
  } else {
    // Moves player up to new level
    if(this.mapArray[this.playerY + checkY][this.playerX + checkX].match(/\^/g)) {
      currentLevel ++;
      if (!levelArray[currentLevel]) {
        levelArray = initializeLevel(levelArray);
      }
    }
    // Moves player down a level
    if(this.mapArray[this.playerY + checkY][this.playerX + checkX].match(/v/g)) {
      currentLevel --;
    }
  }

};

//---------- Shadow functions ----------//

var Shadow = function(shadowY, shadowX, strength, onLevel){
  this.shadowX = shadowX;
  this.shadowY = shadowY;
  this.lastSeen = [];
  this.strength = strength;
  this.onLevel = onLevel;
  this.hitThisTurn = false;
}

Shadow.prototype.shadowMovement = function(){
  // console.log(this.shadowY, this.shadowX);
  if(Math.pow(levelArray[this.onLevel].playerY-this.shadowY,2) + Math.pow(levelArray[this.onLevel].playerX-this.shadowX,2) <= Math.pow(levelArray[this.onLevel].sightLength,2)) {
    if(this.shadowY > levelArray[this.onLevel].playerY){
      this.shadowY -= 1;
    } else {
      this.shadowY += 1;
    }
    if(this.shadowX > levelArray[this.onLevel].playerX){
      this.shadowX -= 1;
    } else {
      this.shadowX += 1;
    }
  }
};

Level.prototype.shadowResolution = function() {
  var newOrigin;

  for(var i = 0; i < this.shadowsArray.length; ++i) {
    if(this.shadowsArray[i].hitThisTurn === true){
      this.shadowsArray[i].strength -= 1;
      if(this.shadowsArray[i].strength <= 0){
        this.shadowsArray.splice(i, 1);
      } else {
        this.shadowsArray[i].hitThisTurn = false;
        newOrigin = this.floorList[(Math.floor(Math.random() * (this.floorList.length-1)) + 1)];
        this.shadowsArray[i].shadowY = newOrigin[0];
        this.shadowsArray[i].shadowX = newOrigin[1];
      }
    }
  }
  if(this.shadowsArray.length < this.shadowCount) {
    var chance = (this.shadowCount - this.shadowsArray.length);
    var random = Math.floor(Math.random() * (this.shadowCount - 1)) + 1
    if(chance >= random){
      newOrigin = this.floorList[(Math.floor(Math.random() * (this.floorList.length-1)) + 1)];
      this.yOrigin = newOrigin[0];
      this.xOrigin = newOrigin[1];
      this.shadowsArray.push(new Shadow(this.yOrigin, this.xOrigin, 2, this.levelNum));
    }
  }
}

//---------- Other functions ----------//

function initializeLevel(levelArray) {
  levelArray[levelArray.length] = new Level(100, 100, 50, 10, 21, 10,levelArray.length, 10,10, 3);
  levelArray[levelArray.length - 1].levelNumber = levelArray.length - 1;
  levelArray[levelArray.length - 1].createLevel();

  return levelArray;
};

function between(num, min, max) {
  return num >= min && num <= max;
};
