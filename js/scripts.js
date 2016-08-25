// Alaina's Global Variables
// var xAxisLength = 9;
// var yAxisLength = 9;
// var firstLevel = [];
// var playerCoords = [4,4]
// var keys = 99;
// var batteries = 0;
// var flashlightPower = 100;
// var flashlightMeter = "";
// var sanity = 100;
// var sanityMeter="";
// var playerY = 4;
// var playerX = 4;
//
// var Room = function() {
//   this.doorN = "*";
//   this.doorS = "*";
//   this.doorE = "*";
//   this.doorW = "*";
//   this.doorResult = "";
//   this.playerLocation = " ";
//   this.seenRoom = false;
//   this.lightLevel = "";
// }

// Justin's Global Variables
var firstFloor = [];
var firstfirstFloorList = [];
var firstWallList = [];
var playerx = 0;
var playery = 0;

// Justin's Settings
  // Map Size
  var xAxis = 200;
  var yAxis = 100;
  var complexity = 300;
  // Hallway Size
  var hallLengthMin = 10;
  var hallLengthMax = 21;
  var hallWidthMin = 1;
  var hallWidthMax = 3;


// Creates a blank level of yAxis by xAxis.
function createFloor(){
  for(var y = 0; y < yAxis; ++y){
    firstFloor[y] = [];
    for(var x = 0; x < xAxis; ++x){
      firstFloor[y][x] = 'X';
    }
  }

  // Inserts a start point in the center of the map
  var yOrigin = Math.floor(yAxis/2);
  var xOrigin = Math.floor(xAxis/2);
  firstFloor[yOrigin][xOrigin] = '.';

  // Place player at center of the map
  playery = yOrigin;
  playerx = xOrigin;

  // Creates walls around random start point
  for(var i = 0; i < complexity; ++i){
    // Create array of floor locations.
    firstFloorList = createIndex('.');

    // Replaces dirt(X) surrounding floors(.) with walls (#)
    insertWalls();

    // Create array of wall locations
    firstWallList = createIndex('#');

    // Takes a random wall location from the wall list
    var newOrigin = firstWallList[(Math.floor(Math.random() * (firstWallList.length - 1)) + 1)];

    // Takes in the random wall location and inserts a tunnel of variable length
    insertTunnel(newOrigin);
  }

  // Updates array of floor locations
  firstFloorList = createIndex('.');

  // Updates map with walls
  insertWalls();

  // Inserts player icon.
  firstFloor[playery][playerx] = "@";

  // Draws map
  drawFloor();
};

// Takes in a character, finds all instances of the character in the map and creates a new array with their locations
function createIndex(char) {
  var index = [];

  for(var y = 0; y < yAxis; ++y){
    for(var x = 0; x < xAxis; ++x){
      if(firstFloor[y][x] === char) {
        index.push([y,x]);
      }
    }
  }
  return index
};

// Replaces dirt(X) surrounding floors(.) with walls (#)
function insertWalls(){
  // Find the number of floors in game.
  var length = firstFloorList.length;

  // Checks every floor location and the surrounding 8 tiles, replacing X with #.
  for(var i = 0; i < length; ++i) {
    var currentY = firstFloorList[i][0];
    var currentX = firstFloorList[i][1];

    for(var y = -1; y <= 1; ++y) {
      for(var x = -1; x <= 1; ++x) {
        if(currentY + y >= 0 && currentY + y < yAxis && currentX + x >= 0 && currentX + x < xAxis)
        if(firstFloor[currentY + y][currentX + x] === "X"){
          firstFloor[currentY + y][currentX + x] = "#";
        }
      }
    }
  }

  // Redraws the perimeter
  drawPerimeter();
};

// Draws bedrock perimeter around map
function drawPerimeter(){
  for(var x = 0; x < xAxis; ++x){
    firstFloor[0][x] = "B";
    firstFloor[yAxis-1][x] = "B";
  }

  for(var y = 0; y < yAxis; ++y){
    firstFloor[y][0] = "B";
    firstFloor[y][xAxis-1] = "B";
  }
};

// Takes in a wall location(origin) and inserts a line of floor (.) of variable length in a variable direction
function insertTunnel(origin) {

  var yOrigin = origin[0];
  var xOrigin = origin[1];
  var directionArray = ["n","s","e","w"];
  var increment = 0;

  // Try to build a tunnel, allow up to 5 rejections.
  do {
    // Choose a random direction for tunnel
    var direction = (Math.floor(Math.random() * (4 - 0)) + 0);
    // Choose a random length of tunnel
    var length =  (Math.floor(Math.random() * (hallLengthMax - hallLengthMin)) + hallLengthMin);

      if(directionArray[direction] === "n" && yOrigin-length >=0) {
        for(var i = 1; i < length + 1; ++i){
          firstFloor[yOrigin - i][xOrigin] = ".";
        }
        increment = 5;
      } else if(directionArray[direction] === "s" && yOrigin + length < yAxis) {
        for(var i = 1; i < length + 1; ++i){
          firstFloor[yOrigin + i][xOrigin] = ".";
        }
        increment = 5;
      } else if(directionArray[direction] === "e" && xOrigin + length < xAxis) {
        for(var i = 1; i < length + 1; ++i){
          firstFloor[yOrigin][xOrigin + i] = ".";
        }
        increment = 5;
      } else if(xOrigin - length >= 0){
        for(var i = 1; i < length + 1; ++i){
          firstFloor[yOrigin][xOrigin - i] = ".";
        }
        increment = 5;
      } else {
        increment += 1;
      }
    } while(increment < 5);

    // Replace origin wall with dirt.
    firstFloor[yOrigin][xOrigin] = ".";
};

// Clears map and recreates it based on the array
function drawFloor(){
  // Clears map
  $("span").remove();
  $("br").remove();

  // Appends map array into HTML
  for(var y = 0; y < yAxis; ++y){
    var lineContent = "";

    for(var x = 0; x < xAxis; ++x) {
      if(firstFloor[y][x] === "X"){
        lineContent += "&nbsp;";
      } else if(firstFloor[y][x] === "@"){
        lineContent += '<span id="player_span">@</span>';
      }else {
      lineContent += firstFloor[y][x];
      }
    }
    $("#map").append("<span id='line" + y +"'>" + lineContent + "</span><br>");
  }
};

// Always active keyboard input
window.addEventListener("keypress", doKeyDown, false);

// Links keyboard input with actions: currently just movement
function doKeyDown(event){
  if (event.keyCode === 119){
    playerMovement(-1, 0);
  } else if (event.keyCode === 97){
    playerMovement(0, -1);
  } else if (event.keyCode === 100){
    playerMovement(0, 1);
  } else if (event.keyCode === 115){
    playerMovement(1, 0);
  }else if (event.keyCode === 113){
    playerMovement(-1, -1);
  }else if (event.keyCode === 101){
    playerMovement(-1, 1);
  }else if (event.keyCode === 122){
    playerMovement(1, -1);
  }else if (event.keyCode === 99){
    playerMovement(1, 1);
  }
};

// Called upon particular keypress: takes in input, checks for viable movement, and redraws map if viable
function playerMovement(checkY, checkX){
  if(firstFloor[playery + checkY][playerx + checkX] === "."){
    firstFloor[playery][playerx] = '.';
    playery += checkY;
    playerx += checkX;
    firstFloor[playery][playerx] = "@";
    drawFloor();
  } else{
    console.log("invalid");
  }
};

// Calls map creation
window.onload = function () {
   createFloor();
 };
