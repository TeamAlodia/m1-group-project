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
  var baseSightLength = 10;
  var sightLength = baseSightLength;

// Master floor creation function
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

  // Removes all Xs from the map array and replaces them with "&nbsp;"
  removeDirt();

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

// Removes dirt and replaces it with nbsp
function removeDirt(){
  for(var y = 0; y < yAxis; ++y){
    for(var x = 0; x < xAxis; ++x) {
      if(firstFloor[y][x] === "X"){
        firstFloor[y][x] = "&nbsp;";
      }
    }
  }
};

function drawFloor(){
  // Clears map
  $("span").remove();
  $("br").remove();

  var y = 0;
  var x = 0;
  yMax = yAxis;
  var yMin = 0;
  xMax = xAxis;
  var xMin = 0;

  mapArray = [];

  if(playery - sightLength > 0){
    y = playery - sightLength;
    yMin = y;
  }
  if(playerx - sightLength > 0){
    x = playerx - sightLength;
    xMin = x;
  }
  if(playery + sightLength < yAxis){
    yMax = playery+sightLength;
  }
  if(playerx + sightLength < xAxis){
    xMax = playerx+sightLength;
  }

  for(y = 0; y < yMax - yMin; ++y){
    mapArray[y]=[];
    for(x = 0; x <  xMax - xMin; ++x){
      mapArray[y][x]=firstFloor[playery - sightLength + y][playerx - sightLength + x];
    }
  }

  checkSight(sightLength);
  drawMap();
};

//Begin LoS Functions
function checkSight(offset) {

  var perimeterArray = [];
  for(var x = 0; x <= 20; ++x){
    perimeterArray.push([20,x]);
    perimeterArray.push([0,x]);
    perimeterArray.push([x,20]);
    perimeterArray.push([x,0]);
  }

  for(var i = 0; i < perimeterArray.length; ++i){
      drawline(0,0,perimeterArray[i][1] - offset,perimeterArray[i][0] - offset);
  }

};

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

  for(var x=x0;x<=x1;x++){
  	if(!(steep ? plot(y,sign*x) : plot(sign*x,y))) return;
    err = (err - dy);
    if(err < 0){
    	y+=ystep;
      err+=dx;
    }
  }
}

var plot = function(x,y){
  if(playerx + x >= xMax || playery + y >= yMax || playerx + x < 0 || playery + y < 0){
    return false;
  }else{
    if(mapArray[10+x][10+y].match(/@/g)){
      mapArray[10+x][10+y] = "<span id='player_span'>" + mapArray[10+x][10+y] + "</span>";
      return true;
    }else if(mapArray[10+x][10+y].match(/#/g) === null){
      mapArray[10+x][10+y] = "<span id='visible'>" + mapArray[10+x][10+y] + "</span>";
      return true;
    }
    else{
      mapArray[10+x][10+y] = "<span id='visible'>" + mapArray[10+x][10+y] + "</span>";
      return false;
    }
  }
}

function drawMap() {
  $("#map").text("");
  for(y = 0; y < mapArray.length; ++y){
    for(x = 0; x < mapArray.length; ++x){
      if(mapArray[y][x] === "#"){
        $("#map").append("<span id='block'>" + mapArray[y][x] + "</span>");
      }else if(mapArray[y][x] === "@"){
        $("#map").append("<span id='player_span'>" + mapArray[y][x] + "</span>");
      }else{
        $("#map").append(mapArray[y][x]);
      }
    }
  $("#map").append("<br>");
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
