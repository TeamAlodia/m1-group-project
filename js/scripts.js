var keys = 99;
var batteries = 0;
var flashlightPower = 100;
var flashlightMeter = "";
var flashlightState = "superlit";
var sanity = 100;
var sanityMeter="";
var vaultArray = [];
var currentVault = -1;
var inVault = false;
var levelArray = [];
var currentExpo;

var Vault = function(yAxisLength, xAxisLength) {
  this.playerX = 4;
  this.playerY = 4;
  this.floor = [];
  this.vaultNumber = 0;
  this.yAxisLength = yAxisLength;
  this.xAxisLength = xAxisLength;
}

Vault.prototype.buildVault = function() {
  for(var y = 0; y < this.yAxisLength; ++y){
    this.floor[y] = [];
    for(var x = 0; x < this.xAxisLength; ++x){
      this.floor[y][x] = new Room;
    }
  }

//Populates doors. Currently split into separate loops to maintain flexibility. Will eventually be compressed.
  for(var y = 0; y < this.yAxisLength; ++y){
    for(var x = 0; x < this.xAxisLength; ++x){
      var doorChance = (Math.floor(Math.random() * (13 - 1)) + 1);
      var oneDoor = ["n","s","e","w"];
      var twoDoors = ["ns","ne","nw","se","sw","ew"];
      var threeDoors = ["nse","nsw","nwe","swe"]

      if(doorChance >= 1 && doorChance <= 4){
        this.floor[y][x].doorResult = oneDoor[(Math.floor(Math.random() * (4 - 0)) + 0)].split("");
      }else if(doorChance >= 5 && doorChance <= 8){
        this.floor[y][x].doorResult = twoDoors[(Math.floor(Math.random() * (6 - 0)) + 0)].split("");
      }else if(doorChance >=9 && doorChance <= 11){
        this.floor[y][x].doorResult = threeDoors[(Math.floor(Math.random() * (4 - 0)) + 0)].split("");
      }else{
        this.floor[y][x].doorResult = ["n","s","e","w"];
      }
    }
  }

  //Takes doorResult and uses it to add the data to the room objects, including locked doors.
  for(var y = 0; y < this.yAxisLength; ++y){
    for(var x = 0; x < this.xAxisLength; ++x){
      for(var i = 0; i < this.floor[y][x].doorResult.length; ++i){
        if(this.floor[y][x].doorResult[i] === "n"){
          this.floor[y][x].doorN = "|";
          if(y !== 0){
            if(this.floor[y-1][x].doorS === "*"){
              this.floor[y-1][x].doorS = "-";
            }
          }
        }else if(this.floor[y][x].doorResult[i] === "s"){
          this.floor[y][x].doorS = "|";
          if(y !== this.yAxisLength - 1){
            if(this.floor[y+1][x].doorN === "*"){
              this.floor[y+1][x].doorN = "-";
            }
          }
        }else if(this.floor[y][x].doorResult[i] === "e"){
          this.floor[y][x].doorE = "-";
          if(x !== this.xAxisLength - 1){
            if(this.floor[y][x+1].doorW === "*"){
              this.floor[y][x+1].doorW = "|";
            }
          }
        }else{
          // debugger;
          this.floor[y][x].doorW = "-"
          if(x !== 0){
            if(this.floor[y][x-1].doorE === "*"){
              this.floor[y][x-1].doorE = "|";
            }
          }
        }
      }

      // Clears doors from edges of map
      if(y === 0){
        this.floor[y][x].doorN = "*";
      }
      if(x === 0){
        this.floor[y][x].doorW = "*";
      }
      if(y === this.yAxisLength - 1){
        this.floor[y][x].doorS = "*";
      }
      if(x === this.xAxisLength - 1){
        this.floor[y][x].doorE = "*";
      }
    }
  }

  $("#console_input").attr("placeholder", "> (type 'help' for instructions)")

  //Sets player origin. Currently static.
  this.floor[4][4].playerLocation = "@";
  this.floor[4][4].seenRoom = true;
  this.floor[this.playerY][this.playerX].findLightLevel();
  this.drawVault();
}

Vault.prototype.drawVault = function() {
  $("span").remove();
  $("br").remove();
  for(var y = 0; y < this.yAxisLength; ++y){
    for(var i = 1; i < 6 ; ++i){
      for(var x = 0; x < this.xAxisLength; ++x){
        if(i === 1){
          $("#main_con").append("<span>**" + "<span id=door_span>" + this.floor[y][x].doorN + "</span>" + "**</span>");
        }else if(i === 3){
          $("#main_con").append( "<span><span id=door_span>" + this.floor[y][x].doorW + "</span>" + "&nbsp" + "<span id=player_span>" +  "<span id=player_span>" + this.floor[y][x].playerLocation + "</span>" + "&nbsp;" + "<span id=door_span>" + this.floor[y][x].doorE + "</span></span>");
        }else if (i === 5){
          $("#main_con").append("<span>**" +  "<span id=door_span>" + this.floor[y][x].doorS + "</span>" + "**</span>");
        }else{
          $("#main_con").append("<span>*&nbsp;&nbsp;&nbsp;*</span>");
        }
      }
      $("#main_con").append("<br>");
    }
  }
}

Vault.prototype.movePlayer = function(direction) {
  if(direction === "n"){
    if(this.checkIfPassable(-1,0)){
      this.floor[this.playerY][this.playerX].playerLocation = " ";
      this.playerY -= 1;
    }
  }else if(direction === "s"){
    if(this.checkIfPassable(+1,0)){
      this.floor[this.playerY][this.playerX].playerLocation = " ";
      this.playerY += 1;
    }
  }else if(direction === "e"){
    if(this.checkIfPassable(0,+1)){
      this.floor[this.playerY][this.playerX].playerLocation = " ";
      this.playerX += 1;
    }
  }else if(direction === "w"){
    if(this.checkIfPassable(0,-1)){
      this.floor[this.playerY][this.playerX].playerLocation = " ";
      this.playerX -= 1;
    }
  }

  this.floor[this.playerY][this.playerX].playerLocation = "@";
  if(this.floor[this.playerY][this.playerX].seenRoom === false){
    this.floor[this.playerY][this.playerX].findLightLevel();
  }
  this.floor[this.playerY][this.playerX].seenRoom = true;
  $("span").remove();
}

Vault.prototype.checkIfPassable = function(checkY, checkX) {
  if(checkY === -1 && this.floor[this.playerY][this.playerX].doorN === "|"){
    if(this.floor[this.playerY + checkY][this.playerX].doorS === "|"){
      return true;
    }else if(this.floor[this.playerY + checkY][this.playerX].doorS === "-" && keys>0){
      this.floor[this.playerY + checkY][this.playerX].doorS = "|";
      keys -=1;
      return true;
    }
  }else if(checkY === +1 && this.floor[this.playerY][this.playerX].doorS === "|"){
    if(this.floor[this.playerY + checkY][this.playerX].doorN === "|"){
      return true;
    }else if(this.floor[this.playerY + checkY][this.playerX].doorN === "-" && keys>0){
      this.floor[this.playerY + checkY][this.playerX].doorN = "|";
      keys -=1;
      return true;
    }
  }else if(checkX === +1 && this.floor[this.playerY][this.playerX].doorE === "-"){
    if(this.floor[this.playerY][this.playerX + checkX].doorW === "-"){
      return true;
    }else if(this.floor[this.playerY][this.playerX + checkX].doorW === "|" && keys>0){
      this.floor[this.playerY][this.playerX + checkX].doorW = "-";
      keys -=1;
      return true;
    }
  }else if(checkX === -1 && this.floor[this.playerY][this.playerX].doorW === "-"){
    if(this.floor[this.playerY][this.playerX + checkX].doorE === "-"){
      return true;
    }else if(this.floor[this.playerY][this.playerX + checkX].doorE === "|" && keys>0){
      this.floor[this.playerY][this.playerX + checkX].doorE = "-";
      keys -=1;
      return true;
    }
  }
}

Vault.prototype.updateSanity = function(){
  if(this.floor[this.playerY][this.playerX].lightLevel === "bright" || flashlightState === "high"){
  }else if(this.floor[this.playerY][this.playerX].lightLevel === "dim" || flashlightState === "on"){
    sanity -= 1;
  }else if(this.floor[this.playerY][this.playerX].lightLevel === "flickering"){
    sanity -= 2;
  }else{
    sanity -= 3;
  }

  if(sanity < 0){
    sanity = 0;
  }
}

var Room = function() {
  this.doorN = "*";
  this.doorS = "*";
  this.doorE = "*";
  this.doorW = "*";
  this.doorResult = "";
  this.playerLocation = " ";
  this.seenRoom = false;
  this.lightLevel = "";
}

Room.prototype.findLightLevel = function() {
  var lightChance = (Math.floor(Math.random() * (100 - 1)) + 1);

  if(lightChance >= 1 && lightChance <= 20){
    this.lightLevel = "dark";
  }else if(lightChance >= 21 && lightChance <= 40){
    this.lightLevel = "flickering";
  }else if(lightChance >= 41 && lightChance <= 80){
    this.lightLevel = "dim";
  }else{
    this.lightLevel = "bright";
  }
}

function initializeVault() {
  currentVault += 1;
  vaultArray[currentVault] = new Vault(9,9);
  vaultArray[currentVault].vaultNumber = currentVault;
  vaultArray[currentVault].buildVault();
}

function drawHUD(expoOutput) {


  console.log("HUD")
  // var xCoord = vaultArray[currentVault].playerX
  // var yCoord = vaultArray[currentVault].playerY
  //
  if(expoOutput){
    $("#log").append("<li class='lit' id='expo'>" + expoOutput + "</li>");
  }
  // $("#HUD_con").append("<span> The light here is " + vaultArray[currentVault].floor[yCoord][xCoord].lightLevel + ".</span><br><br>");
  $("#items").text("Keys: " + keys + " Batteries: " + batteries);
  // $("#HUD_con").text("<span class = 'visible'>Batteries: " + batteries + "</span><br><br>");

  flashlightMeter = "";
  for(var i = 1; i <= flashlightPower/5; ++i){
    flashlightMeter += "/";
  }

  $("#HUD_con").text("<span id='HUD_flashlight'>Flashlight:</span><span id='HUD_flashlight_meter'> " + flashlightMeter + "</span><br><br>");

  if(flashlightPower/5 <=4){
    $("#HUD_flashlight_meter").css("color", "red");
  }else{
    $("#HUD_flashlight_meter").css("color", "#00e600");
  }

  if(flashlightState === "on"){
    $("#HUD_flashlight").css("color", "#00e600");
  }else if(flashlightState === "high"){
    $("#HUD_flashlight").css("color", "white");
  }else {
    $("#HUD_flashlight").css("color", "green");
  }

  sanityMeter = "";
  for(var i = 1; i <= sanity/5; ++i){
    sanityMeter += "/";
  }

  $("#HUD_con").text("Sanity: " + sanityMeter);

  if(sanity/5 <=4){
    $("#HUD_sanity_output").css("color", "red");
  }else{
    $("#HUD_sanity_output").css("color", "#00e600");
  }
}

function updateFlashlight() {
  if(flashlightState === "on"){
    flashlightPower -= 1;
    console.log("Flashlight -1");
  }else if(flashlightState === "high"){
    flashlightPower -= 2;
    console.log("Flashlight -2");
  }

  if(flashlightPower <= 0 && batteries > 0){
    batteries -=1;
    flashlightPower = 100;
  }else if(flashlightPower < 0 && batteries === 0){
    flashlightPower = 0;
    flashlightState = "off";
  }
}

var Level = function(xAxis, yAxis, complexity, hallLengthMin, hallLengthMax, sightLength) {
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
}

var Shadow = function(shadowY, shadowX, strength){
  this.shadowX = shadowX;
  this.shadowY = shadowY;
  this.lastSeen = [];
  this.strength = strength;
}

Level.prototype.createShadows = function(){
  for(var i = 0; i < this.shadowCount; ++i){
    var newOrigin = this.floorList[(Math.floor(Math.random() * (this.floorList.length-1)) + 1)];
    this.yOrigin = newOrigin[0];
    this.xOrigin = newOrigin[1];
    this.shadowsArray.push(new Shadow(this.yOrigin, this.xOrigin, 2));
  }
};

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

    // Updates map with walls
    this.insertWalls();

    // Inserts Special Items
    this.insertSpecial();

    // Inserts Items
    for(var i = 0; i < this.xAxis/10; ++i){
      newOrigin = this.floorList[(Math.floor(Math.random() * (this.floorList.length-1)) + 1)];
      this.insertItems(newOrigin);
    }

    // Insert shadows

    this.createShadows();

    // Inserts player icon.
    this.mapArray[this.playerY][this.playerX] = "@";

    // Removes all Xs from the map array and replaces them with "&nbsp;"
    this.removeDirt();

    // Draws map
    this.checkSight();
    this.drawMap();
  };



// Links keyboard input with actions: currently just movement
function turnLogic(event){

  currentExpo = "";
  // Flashlight Power Settings
  if(event.keyCode === 115 && flashlightState === "off" && flashlightPower > 0){
    flashlightState = "lit";
    console.log("lit")
  }else if(event.keyCode === 115 && flashlightState === "lit" && flashlightPower > 0){
    flashlightState = "superlit";
    console.log("superlit")
  }else if(event.keyCode === 115){
    flashlightState = "off";
    console.log("off")
  }

  if(inVault){
    if (event.keyCode === 119){
      vaultArray[currentVault].movePlayer("n");
    } else if (event.keyCode === 97){
      vaultArray[currentVault].movePlayer("w");
    } else if (event.keyCode === 100){
      vaultArray[currentVault].movePlayer("e");
    } else if (event.keyCode === 120){
      vaultArray[currentVault].movePlayer("s");
    }
    updateFlashlight();
    vaultArray[currentVault].updateSanity();
    vaultArray[currentVault].drawVault();
  }else{
    if (event.keyCode === 119){
      levelArray[0].currentDirection = "n";
      playerMovement(-1, 0);
    } else if (event.keyCode === 97){
      levelArray[0].currentDirection = "w";
      playerMovement(0, -1);
    } else if (event.keyCode === 100){
      levelArray[0].currentDirection = "e";
      playerMovement(0, 1);
    } else if (event.keyCode === 120){
      levelArray[0].currentDirection = "s";
      playerMovement(1, 0);
    }else if (event.keyCode === 113){
      levelArray[0].currentDirection = "nw";
      playerMovement(-1, -1);
    }else if (event.keyCode === 101){
      levelArray[0].currentDirection = "ne";
      playerMovement(-1, 1);
    }else if (event.keyCode === 122){
      levelArray[0].currentDirection = "sw";
      playerMovement(1, -1);
    }else if (event.keyCode === 99){
      levelArray[0].currentDirection = "se";
      playerMovement(1, 1);
    }
  }

  // Draw HUD
  drawHUD(currentExpo);

  // Shadow Movement
  for (var i = 0; i < levelArray[0].shadowsArray.length; ++i) {
    levelArray[0].shadowsArray[i].shadowMovement();
  }

  // Draw Player Sight
  levelArray[0].checkSight();
  levelArray[0].drawMap();

};

function playerMovement(checkY, checkX){
  // Picks up item in target space
  if(levelArray[0].mapArray[levelArray[0].playerY + checkY][levelArray[0].playerX + checkX].match(/[C-L]|A|b|k/)){
    currentExpo = levelArray[0].itemPickUp(levelArray[0].mapArray[levelArray[0].playerY + checkY][levelArray[0].playerX + checkX]);
  }

  // // Encounters a Shadow in target space
  // if(levelArray[0].mapArray[levelArray[0].playerY + checkY][levelArray[0].playerX + checkX].match(/S/)){
  //   levelArray[0].shadowEncounter();
  // }

  // Moves player to new space
  if(levelArray[0].mapArray[levelArray[0].playerY + checkY][levelArray[0].playerX + checkX].match(/[C-L]|A|b|k|\./)){
    levelArray[0].mapArray[levelArray[0].playerY][levelArray[0].playerX] = '.';
    levelArray[0].playerY += checkY;
    levelArray[0].playerX += checkX;
    levelArray[0].mapArray[levelArray[0].playerY][levelArray[0].playerX] = "@";
  }
};

Shadow.prototype.shadowMovement = function(){
  console.log(this.shadowY, this.shadowX);
  // console.log(levelArray[0].playerY, levelArray[0].playerX);
  if(Math.pow(levelArray[0].playerY-this.shadowY,2) + Math.pow(levelArray[0].playerX-this.shadowX,2) <= Math.pow(levelArray[0].sightLength,2)) {
    if(this.shadowY > levelArray[0].playerY){
      this.shadowY -= 1;
    } else {
      this.shadowY += 1;
    }
    if(this.shadowX > levelArray[0].playerX){
      this.shadowX -= 1;
    } else {
      this.shadowX += 1;
    }
  }
};
//
// Level.prototype.shadowEncounter = function(){
//   sanity -= 10;
//   drawHUD("AIEEEEEEEE!");
// };

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
    return specialItemExpo[0];
  } else if (item === "L") {
    return specialItemExpo[1];
  } else if (item === "C") {
    return specialItemExpo[2];
  } else if (item === "D") {
    return specialItemExpo[3];
  } else if (item === "E") {
    return specialItemExpo[4];
  } else if (item === "F") {
    return specialItemExpo[5];
  } else if (item === "G") {
    return specialItemExpo[6];
  } else if (item === "H") {
    return specialItemExpo[7];
  } else if (item === "J") {
    return specialItemExpo[8];
  } else if (item === "K") {
    return specialItemExpo[9];
  } else if (item === "k") {
    keys += 1;
  } else if (item === "b") {
    batteries += 1;
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

// Level.prototype.insertShadows = function(origin) {
//   this.yOrigin = origin[0];
//   this.xOrigin = origin[1];
//   this.shadows.push(origin);
//   this.mapArray[this.yOrigin][this.xOrigin] = "S";
//
// }
//Begin LoS Functions

// Draws only the visible area of the map

Level.prototype.drawMap = function() {
  $("#main_con").text("");

  // Loops through the visible map area

  for(var y = 0; y <= this.sightBound; ++y){
    for(var x = 0; x <= this.sightBound; ++x){

      //Draws visibleArray with appropriate color markups.

      if(this.visibleArray[y][x] === "@"){
          $("#main_con").append("<span id='player'>@<span>");
      }else if(this.visibleArray[y][x].match(/#/) !== null){
        $("#main_con").append("<span class='block'>#<span>");
      }else if(this.visibleArray[y][x] === "B"){
        $("#main_con").append("<span class='lit block'>#<span>");
      }else{
        $("#main_con").append("<span class='unlit'>" + this.visibleArray[y][x] + "</span>");
      }
    }
  $("#main_con").append("<br>");
  }

}

// Determines the coordinates for drawing a line from x0, y0 to x1,y1. Terminates if plot() returns a false.

Level.prototype.drawline = function(x0,y0,x1,y1){
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
  	if(!(steep ? this.plot(y,sign*x) : this.plot(sign*x,y))) {
      return;
    }
    err = (err - dy);
    if(err < 0){
    	y+=ystep;
      err+=dx;
    }
  }
}

//Used by drawline to plot the current coordinates. Checks to see if current coordinates are a wall, and if so, sends back a false and terminates drawline(). Automatically populates visibleArray with the matching data in mapArray for the current coordinates regardless of outcome.

Level.prototype.plot = function(x,y){

  // sightLength is used as the visibleArray reference in order to keep the visible area centered on the player. mapArray also centers on the player when gathering reference data, but uses their actual position to do so.

  if(this.checkLight){
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
}

// Checks all sight vectors and populates visibleArray. The line of sight model used is square, and is dependant upon the level boundaries also being square (but not the traversible area of the level.)

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


}

function between(num, min, max) {
  return num >= min && num <= max;
}

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
    this.drawline(0,0,toX,toY);
  }

  this.checkLight = true;

  for(var i = 0; i < this.flashlightPerimeter.length ; ++i){
    var toY = this.flashlightPerimeter[i][0];
    var toX = this.flashlightPerimeter[i][1];

    // (origin y, origin x, draw to y, draw to x) ??
    this.drawline(0,0,toX,toY);
  }

  for(var i = 0; i < this.shadowsArray.length; ++i){

    var shadowY = this.shadowsArray[i].shadowY;
    var shadowX = this.shadowsArray[i].shadowX;

    if(between(shadowY, this.playerY - this.sightLength, this.playerY + this.sightLength) && between(shadowX, this.playerX - this.sightLength, this.playerX + this.sightLength)) {
      this.visibleArray[this.sightLength + ((shadowY - this.playerY))][this.sightLength + ((shadowX - this.playerX))] = "S";
    }
  }
}

// ----------------------------------

// Always active keyboard input
window.addEventListener("keypress", turnLogic, false);

// Calls map creation
window.onload = function () {

  //(xAxis, yAxis, complexity, hallLengthMin, hallLengthMax, sightLength)
  levelArray[0] = new Level(100, 100, 50, 10, 21, 10);
  levelArray[0].createLevel();
};


// Legacy code

// Legacy code that draws entire floor, being left in for testing purposes.

// function drawFloor(){
//   // Clears map
//   $("span").remove();
//   $("br").remove();
//
//   var y = 0;
//   var x = 0;
//   yMax = yAxis;
//   var yMin = 0;
//   xMax = xAxis;
//   var xMin = 0;
//
//   mapArray = [];
//
//   if(playerY - sightLength > 0){
//     y = playerY - sightLength;
//     yMin = y;
//   }
//   if(playerX - sightLength > 0){
//     x = playerX - sightLength;
//     xMin = x;
//   }
//   if(playerY + sightLength < yAxis){
//     yMax = playerY+sightLength;
//   }
//   if(playerX + sightLength < xAxis){
//     xMax = playerX+sightLength;
//   }
//
//   for(var tempY = 0; tempY < yMax - yMin; ++tempY){
//     mapArray[tempY]=[];
//     for(tempX = 0; tempX <  xMax - xMin; ++tempX){
//       mapArray[tempY][tempX]=firstFloor[y + tempY][x + tempX];
//     }
//   }
//
//   checkSight(sightLength);
//   drawMap();
// };
