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

var visibleArray = [];
var perimeterArray = [];

// Justin's Global Variables
var firstFloor = [];
var firstfirstFloorList = [];
var firstWallList = [];
var playerX = 0;
var playerY = 0;
var mapArray = [];
var yMax;
var xMax;

// Justin's Settings
  // Map Size
  var xAxis = 50;
  var yAxis = 50;
  var complexity = 30;
  // Hallway Size
  var hallLengthMin = 10;
  var hallLengthMax = 21;
  // Line of Sight
  var sightLength = 10
  var sightBound = 2 * sightLength + 1;

// Master floor creation function
function createFloor(){
  for(var y = 0; y < yAxis; ++y){
    mapArray[y] = [];
    for(var x = 0; x < xAxis; ++x){
      mapArray[y][x] = 'X';
    }
  }

  // Inserts a start point in the center of the map
  var yOrigin = Math.floor(yAxis/2);
  var xOrigin = Math.floor(xAxis/2);
  mapArray[yOrigin][xOrigin] = '.';

  // Place player at center of the map
  playerY = yOrigin;
  playerX = xOrigin;

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
  mapArray[playerY][playerX] = "@";

  // Removes all Xs from the map array and replaces them with "&nbsp;"
  removeDirt();

  // Draws map
  checkSight();
  drawMap();
};

// Takes in a character, finds all instances of the character in the map and creates a new array with their locations
function createIndex(char) {
  var index = [];

  for(var y = 0; y < yAxis; ++y){
    for(var x = 0; x < xAxis; ++x){
      if(mapArray[y][x] === char) {
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
        if(mapArray[currentY + y][currentX + x] === "X"){
          mapArray[currentY + y][currentX + x] = "#";
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
    mapArray[0][x] = "B";
    mapArray[yAxis-1][x] = "B";
  }

  for(var y = 0; y < yAxis; ++y){
    mapArray[y][0] = "B";
    mapArray[y][xAxis-1] = "B";
  }
};

// Takes in a wall location(origin) composed of an array [[y,x]] and inserts a line of floor (.) of variable length in a variable direction
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
          mapArray[yOrigin - i][xOrigin] = ".";
        }
        increment = 5;
      } else if(directionArray[direction] === "s" && yOrigin + length < yAxis) {
        for(var i = 1; i < length + 1; ++i){
          mapArray[yOrigin + i][xOrigin] = ".";
        }
        increment = 5;
      } else if(directionArray[direction] === "e" && xOrigin + length < xAxis) {
        for(var i = 1; i < length + 1; ++i){
          mapArray[yOrigin][xOrigin + i] = ".";
        }
        increment = 5;
      } else if(xOrigin - length >= 0){
        for(var i = 1; i < length + 1; ++i){
          mapArray[yOrigin][xOrigin - i] = ".";
        }
        increment = 5;
      } else {
        increment += 1;
      }
    } while(increment < 5);

    // Replace origin wall with dirt.
    mapArray[yOrigin][xOrigin] = ".";
};

// Removes dirt and replaces it with nbsp
function removeDirt(){
  for(var y = 0; y < yAxis; ++y){
    for(var x = 0; x < xAxis; ++x) {
      if(mapArray[y][x] === "X"){
        mapArray[y][x] = "&nbsp;";
      }
    }
  }
};

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

//Begin LoS Functions

// Draws only the visible area of the map

function drawMap() {
  $("#main_con").text("");

  // Loops through the visible map area

  for(var y = 0; y <= sightBound; ++y){
    for(var x = 0; x <= sightBound; ++x){

      //Draws visibleArray with appropriate color markups.

      if(visibleArray[y][x] === "@"){
          $("#main_con").append("<span id='player'>@<span>");
      }else if(visibleArray[y][x] === "#"){
        $("#main_con").append("<span class='block'>#<span>");
      }else if(visibleArray[y][x] === "B"){
        $("#main_con").append("<span class='block'>#<span>");
      }else{
        $("#main_con").append("<span class='visible'>" + visibleArray[y][x] + "</span>");
      }
    }
  $("#main_con").append("<br>");
  }

}

// Determines the coordinates for drawing a line from x0, y0 to x1,y1. Terminates if plot() returns a false.

var drawline = function(x0,y0,x1,y1){
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
  	if(!(steep ? plot(y,sign*x) : plot(sign*x,y))) return;
    err = (err - dy);
    if(err < 0){
    	y+=ystep;
      err+=dx;
    }

  }
}

//Used by drawline to plot the current coordinates. Checks to see if current coordinates are a wall, and if so, sends back a false and terminates drawline(). Automatically populates visibleArray with the matching data in mapArray for the current coordinates regardless of outcome.

var plot = function(x,y){

  // sightLength is used as the visibleArray reference in order to keep the visible area centered on the player. mapArray also centers on the player when gathering reference data, but uses their actual position to do so.

  visibleArray[sightLength+y][sightLength+x] = mapArray[playerY+y][playerX+x];
  if(mapArray[playerY+y][playerX+x] !== "#"){
    return true;
  }
  else{
    return false;
  }
}

// Checks all sight vectors and populates visibleArray. The line of sight model used is square, and is dependant upon the level boundaries also being square (but not the traversible area of the level.)

function checkSight() {

  //These variables are what will prevent plot() from checking undefined array locations.

  var boundNorth;
  var boundSouth;
  var boundEast;
  var boundWest;

// The following for loops are checking for terminal objects (i.e. level boundaries) in each of the cardinal directions and, upon finding them, setting the boundVar to their relative distance from the player. Otherwise, the boundVar will equal the sightLength

  for(var i = 0; i >= sightLength * -1; --i){
    boundNorth = i;
    if(mapArray[playerY + i][playerX].match(/B/) !== null){
      break;
    }
  }

  for(var i = 0; i <= sightLength; ++i){
    boundSouth = i;
    if(mapArray[playerY + i][playerX].match(/B/) !== null){
      break;
    }
  }

  for(var i = 0; i <= sightLength; ++i){
    boundEast = i;
    if(mapArray[playerY][playerX + i].match(/B/) !== null){
      break;
    }
  }

  for(var i = 0; i >= sightLength * -1; --i){
    boundWest = i;
    if(mapArray[playerY][playerX + i].match(/B/) !== null){
      break;
    }
  }

// The following for loops build an array of perimeter coordinates using the boundaries established by the boundVars. This ensures that plot() will never attempt to look outside of mapArray's defined data.  Each loop handles 2 of the 8 octants.

  //    Octants:
  //     \1|2/
  //     8\|/3
  //     --+--
  //     7/|\4
  //     /8|5\

  perimeterArray = [];

  // Builds octant 1 and 6 perimeter values
  for(var i = 0; i >= boundWest; --i){
    perimeterArray.push([boundNorth,i]);
    perimeterArray.push([boundSouth,i]);
  }

  // Builds octant 8 and 3 perimter values
  for(var i = 0; i >= boundNorth; --i){
    perimeterArray.push([i,boundWest]);
    perimeterArray.push([i,boundEast]);
  }

  // Builds octant 2 and 5 perimter values
  for(var i = 0; i <= boundEast; ++i){
    perimeterArray.push([boundNorth, i]);
    perimeterArray.push([boundSouth, i]);
  }

  // Builds octant 4 and 7 perimter values
  for(var i = 0; i <= boundSouth; ++i){
    perimeterArray.push([i, boundWest]);
    perimeterArray.push([i, boundEast]);
  }

  // Resets and builds visibleArray at a constant size, and populates it with blank (i.e. invisible) spaces

  visibleArray = [];

  for(var i = 0; i <= sightBound; ++i) {
    visibleArray[i] = [];
    for(var j = 0; j <= sightBound; ++j){
      visibleArray[i][j] = "&nbsp;";
    }
  }

  // Checks visible area within allowed boundaries.

  for(var i = 0; i < perimeterArray.length ; ++i){
    var toY = perimeterArray[i][0];
    var toX = perimeterArray[i][1];

    // (origin y, origin x, draw to y, draw to x) ??
    drawline(0,0,toX,toY);
  }

}


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
  if(mapArray[playerY + checkY][playerX + checkX] === "."){
    mapArray[playerY][playerX] = '.';
    playerY += checkY;
    playerX += checkX;
    mapArray[playerY][playerX] = "@";
    checkSight();
    drawMap();
  } else{
    console.log("invalid");
  }
};

// Calls map creation
window.onload = function () {
   createFloor();
 };
