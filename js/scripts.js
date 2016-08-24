// <span>*****<br>*&nbsp;&nbsp;&nbsp;*<br>*&nbsp;&nbsp;&nbsp;*<br>*&nbsp;&nbsp;&nbsp;*<br>*****</span>

// Alaina's Global Variables
var xAxisLength = 9;
var yAxisLength = 9;
var firstLevel = [];
var playerCoords = [4,4]
var keys = 99;
var batteries = 0;
var flashlightPower = 100;
var flashlightMeter = "";
var sanity = 100;
var sanityMeter="";
var playerY = 4;
var playerX = 4;

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

// Justin's Global Variables
var xAxis = 200;
var yAxis = 100;
var firstFloor = [];
var floorList = [];
var wallList = [];
var complexity = 300;
var playerx = 0;
var playery = 0;

// Creates a blank level of yAxis by xAxis.
function createFloor(){
  for(var y = 0; y < yAxis; ++y){
    firstFloor[y] = [];
    for(var x = 0; x < xAxis; ++x){
      firstFloor[y][x] = 'X';
    }
  }

  // Math.floor(Math.random() * ((max+1) - minimum) + minimum);
  var yOrigin = Math.floor(yAxis/2);
  var xOrigin = Math.floor(xAxis/2);

  // Inserts a random start point
  firstFloor[yOrigin][xOrigin] = '.';

  // Place player
  playery = yOrigin;
  playerx = xOrigin;

  // Creates walls around random start point
  for(var i = 0; i < complexity; ++i){
    drawFloor();

    floorList = createIndex('.');
    drawWalls();

    drawFloor();

    wallList = createIndex('#');

    var newOrigin = wallList[(Math.floor(Math.random() * (wallList.length - 1)) + 1)];

    drawTunnel(newOrigin,i);

    floorList = createIndex('.');
    drawWalls();
  }
  firstFloor[playery][playerx] = "@";

  drawFloor();


};


function drawTunnel(origin, tunnelCheck) {

  var yOrigin = origin[0];
  var xOrigin = origin[1];

  var directionArray = ["n","s","e","w"];
  var direction = (Math.floor(Math.random() * (4 - 0)) + 0);
  var length =  (Math.floor(Math.random() * (21 - 10)) + 10);


  // if(checkViable(directionArray[direction], yOrigin, xOrigin)) {
    if(directionArray[direction] === "n" && yOrigin-length >=0) {
      for(var i = 1; i < length + 1; ++i){
        firstFloor[yOrigin - i][xOrigin] = ".";
      }
      console.log("Tunnel #" + tunnelCheck);
    } else if(directionArray[direction] === "s" && yOrigin + length < yAxis) {
      for(var i = 1; i < length + 1; ++i){
        firstFloor[yOrigin + i][xOrigin] = ".";
      }
      console.log("Tunnel #" + tunnelCheck);
    } else if(directionArray[direction] === "e" && xOrigin + length < xAxis) {
      for(var i = 1; i < length + 1; ++i){
        firstFloor[yOrigin][xOrigin + i] = ".";
      }
      console.log("Tunnel #" + tunnelCheck);
    } else if(xOrigin - length >= 0){
      for(var i = 1; i < length + 1; ++i){
        firstFloor[yOrigin][xOrigin - i] = ".";
      }
      console.log("Tunnel #" + tunnelCheck);
    } else {
      // var newOrigin = wallList[(Math.floor(Math.random() * (wallList.length - 1)) + 1)];
      // drawTunnel(newOrigin, "*")
      console.log("Tunnel aborted")
    }
    firstFloor[yOrigin][xOrigin] = ".";
  // }else{
  //   console.log("Tunnel aborted")
  // }


};

// function checkViable(direction, yOrigin, xOrigin){
//   if(direction === "n"){
//     if(firstFloor[yOrigin - 1][xOrigin] === "X"){
//       return true;
//     }
//   } else if (direction === "s"){
//     if(firstFloor[yOrigin + 1][xOrigin] === "X"){
//       return true;
//     }
//   } else if (direction === "e"){
//     if(firstFloor[yOrigin][xOrigin + 1] === "X"){
//       return true;
//     }
//   } else if (direction === "w"){
//     if(firstFloor[yOrigin][xOrigin - 1] === "X"){
//       return true;
//     }
//   }
//   return false;
// };

function drawFloor(){

  $("span").remove();
  $("br").remove();
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

function drawWalls(){
  var length = floorList.length;
  for(var i = 0; i < length; ++i) {
    var currentY = floorList[i][0];
    var currentX = floorList[i][1];

    for(var y = -1; y <= 1; ++y) {
      for(var x = -1; x <= 1; ++x) {
        // console.log(currentY + y);
        // console.log(currentX + x);
        // console.log(currentY + y >= 0 && currentY + y <= yAxis && currentX + x >= 0 && currentX + x <= xAxis);
        if(currentY + y >= 0 && currentY + y < yAxis && currentX + x >= 0 && currentX + x < xAxis)
        if(firstFloor[currentY + y][currentX + x] === "X"){
          firstFloor[currentY + y][currentX + x] = "#";
        }
      }
    }
  }

  for(var x = 0; x < xAxis; ++x){
    firstFloor[0][x] = "B";
    firstFloor[yAxis-1][x] = "B";
  }

  for(var y = 0; y < yAxis; ++y){
    firstFloor[y][0] = "B";
    firstFloor[y][xAxis-1] = "B";
  }
};

// Keyboard input
window.addEventListener("keypress", doKeyDown, false);

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
// Alaina's Portion

// Returns true if there is a door and it is either unlocked, or locked and the player has a key
// function checkIfPassable(checkY, checkX) {
//   if(checkY === -1 && firstLevel[playerY][playerX].doorN === "|"){
//     if(firstLevel[playerY + checkY][playerX].doorS === "|"){
//       return true;
//     }else if(firstLevel[playerY + checkY][playerX].doorS === "-" && keys>0){
//       firstLevel[playerY + checkY][playerX].doorS = "|";
//       keys -=1;
//       return true;
//     }
//   }else if(checkY === +1 && firstLevel[playerY][playerX].doorS === "|"){
//     if(firstLevel[playerY + checkY][playerX].doorN === "|"){
//       return true;
//     }else if(firstLevel[playerY + checkY][playerX].doorN === "-" && keys>0){
//       firstLevel[playerY + checkY][playerX].doorN = "|";
//       keys -=1;
//       return true;
//     }
//   }else if(checkX === +1 && firstLevel[playerY][playerX].doorE === "-"){
//     if(firstLevel[playerY][playerX + checkX].doorW === "-"){
//       return true;
//     }else if(firstLevel[playerY][playerX + checkX].doorW === "|" && keys>0){
//       firstLevel[playerY][playerX + checkX].doorW = "-";
//       keys -=1;
//       return true;
//     }
//   }else if(checkX === -1 && firstLevel[playerY][playerX].doorW === "-"){
//     if(firstLevel[playerY][playerX + checkX].doorE === "-"){
//       return true;
//     }else if(firstLevel[playerY][playerX + checkX].doorE === "|" && keys>0){
//       firstLevel[playerY][playerX + checkX].doorE = "-";
//       keys -=1;
//       return true;
//     }
//   }
//
//   return false;
// }
//
// function movePlayer(direction) {
//
//   if(direction === "n"){
//     if(checkIfPassable(-1,0)){
//       firstLevel[playerY][playerX].playerLocation = " ";
//       playerY -= 1;
//     }
//   }else if(direction === "s"){
//     if(checkIfPassable(+1,0)){
//       firstLevel[playerY][playerX].playerLocation = " ";
//       playerY += 1;
//     }
//   }else if(direction === "e"){
//     if(checkIfPassable(0,+1)){
//       firstLevel[playerY][playerX].playerLocation = " ";
//       playerX += 1;
//     }
//   }else if(direction === "w"){
//     if(checkIfPassable(0,-1)){
//       firstLevel[playerY][playerX].playerLocation = " ";
//       playerX -= 1;
//     }
//   }
//
//   firstLevel[playerY][playerX].playerLocation = "@";
//   firstLevel[playerY][playerX].seenRoom = true;
//   $("span").remove();
//   drawLevel(false);
// }
//
// function playerConsole(userInput) {
//   if(userInput === "n" || userInput === "s" || userInput === "e" ||  userInput === "w"){
//     movePlayer(userInput)
//   }
// }
//
// //Draws the level, the doors and the player. Will eventually only draw seen rooms.
// function drawLevel(initialDraw) {
//   for(var y = 0; y < yAxisLength; ++y){
//     for(var x = 0; x < xAxisLength; ++x){
//       if(firstLevel[y][x].seenRoom && initialDraw === false){
//         $("#" + y + "-" + x).append("<span>**" + firstLevel[y][x].doorN + "**<br>*&nbsp;&nbsp;&nbsp;*<br>" + firstLevel[y][x].doorW + "&nbsp" + firstLevel[y][x].playerLocation + "&nbsp;" + firstLevel[y][x].doorE + "<br>*&nbsp;&nbsp;&nbsp;*<br>**" + firstLevel[y][x].doorS + "**</span>");
//       }else if(firstLevel[y][x].seenRoom === false || initialDraw){
//         $("#" + y + "-" + x).append("<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>")
//       }
//     }
//   }
// }
//
// function buildLevel() {
//   //Builds empty floor
//
//   for(var y = 0; y < yAxisLength; ++y){
//     firstLevel[y] = [];
//     for(var x = 0; x < xAxisLength; ++x){
//       firstLevel[y][x] = new Room;
//     }
//   }
//
// //Populates doors. Currently split into separate loops to maintain flexibility. Will eventually be compressed.
//   for(var y = 0; y < yAxisLength; ++y){
//     for(var x = 0; x < xAxisLength; ++x){
//       var doorChance = (Math.floor(Math.random() * (13 - 1)) + 1);
//       var oneDoor = ["n","s","e","w"];
//       var twoDoors = ["ns","ne","nw","se","sw","ew"];
//       var threeDoors = ["nse","nsw","nwe","swe"]
//
//       if(doorChance >= 1 && doorChance <= 4){
//         firstLevel[y][x].doorResult = oneDoor[(Math.floor(Math.random() * (4 - 0)) + 0)].split("");
//       }else if(doorChance >= 5 && doorChance <= 8){
//         firstLevel[y][x].doorResult = twoDoors[(Math.floor(Math.random() * (6 - 0)) + 0)].split("");
//       }else if(doorChance >=9 && doorChance <= 11){
//         firstLevel[y][x].doorResult = threeDoors[(Math.floor(Math.random() * (4 - 0)) + 0)].split("");
//       }else{
//         firstLevel[y][x].doorResult = ["n","s","e","w"];
//       }
//     }
//   }
//
//   //Takes doorResult and uses it to add the data to the room objects, including locked doors.
//   for(var y = 0; y < yAxisLength; ++y){
//     for(var x = 0; x < xAxisLength; ++x){
//
//       firstLevel[y][x].doorResult.forEach(function(currentDoor) {
//         if(currentDoor === "n"){
//           firstLevel[y][x].doorN = "|";
//           if(y !== 0){
//             if(firstLevel[y-1][x].doorS === "*"){
//               firstLevel[y-1][x].doorS = "-";
//             }
//           }
//         }else if(currentDoor === "s"){
//           firstLevel[y][x].doorS = "|";
//           if(y !== 8){
//             if(firstLevel[y+1][x].doorN === "*"){
//               firstLevel[y+1][x].doorN = "-";
//             }
//           }
//         }else if(currentDoor === "e"){
//           firstLevel[y][x].doorE = "-";
//           if(x !== 8){
//             if(firstLevel[y][x+1].doorW === "*"){
//               firstLevel[y][x+1].doorW = "|";
//             }
//           }
//         }else{
//           firstLevel[y][x].doorW = "-"
//           if(x !== 0){
//             if(firstLevel[y][x-1].doorE === "*"){
//               firstLevel[y][x-1].doorE = "|";
//             }
//           }
//         }
//       })
//
//       // // Clears doors from edges of map
//       if(y === 0){
//         firstLevel[y][x].doorN = "*";
//       }
//       if(x === 0){
//         firstLevel[y][x].doorW = "*";
//       }
//       if(y === 8){
//         firstLevel[y][x].doorS = "*";
//       }
//       if(x === 8){
//         firstLevel[y][x].doorE = "*";
//       }
//     }
//   }
//
//   $("#console_input").attr("placeholder", "> (type 'help' for instructions)")
//
//   //Sets player origin. Currently static.
//   firstLevel[4][4].playerLocation = "@";
//   firstLevel[4][4].seenRoom = true;
// }
//
// function findLightLevel() {
//   var lightChance = (Math.floor(Math.random() * (100 - 1)) + 1);
//
//   if(lightChance >= 1 && lightChance <= 20){
//     firstLevel[playerY][playerX].lightLevel = "dark";
//   }else if(lightChance >= 21 && lightChance <= 40){
//     firstLevel[playerY][playerX].lightLevel = "flickering";
//   }else if(lightChance >= 41 && lightChance <= 80){
//     firstLevel[playerY][playerX].lightLevel = "dim";
//   }else{
//     firstLevel[playerY][playerX].lightLevel = "bright";
//   }
//
// }
//
// function drawHUD(expoOutput) {
//   $("#HUD_expo_output").text(expoOutput);
//   $("#HUD_light_output").text("The light here is " + firstLevel[playerY][playerX].lightLevel);
//   $("#HUD_keys_output").text("Keys: " + keys);
//   $("#HUD_batteries_output").text("Batteries: " + batteries);
//
//   flashlightMeter = "";
//   for(var i = 1; i <= flashlightPower/5; ++i){
//     flashlightMeter += "/";
//   }
//   if(flashlightPower/5 <=4){
//     $("#HUD_flashlight_output").css("color", "red");
//   }else{
//     $("#HUD_flashlight_output").css("color", "#00e600");
//   }
//   $("#HUD_flashlight_output").text("Flashlight: " + flashlightMeter);
//
//   sanityMeter = "";
//   for(var i = 1; i <= sanity/5; ++i){
//     sanityMeter += "/";
//   }
//   if(sanity/5 <=4){
//     $("#HUD_sanity_output").css("color", "red");
//   }else{
//     $("#HUD_sanity_output").css("color", "#00e600");
//   }
//   $("#HUD_sanity_output").text("Sanity: " + sanityMeter);
// }
//
// $(document).ready(function() {
  // Justin's Portion
window.onload = function () {
   createFloor();

 };
  // Alaina's Portion
  //Submit behavior for user input form
  // $("#console_form").submit(function(event) {
  //   event.preventDefault();
  //   var userInput = $("#console_input").val().toLowerCase();
  //   if(userInput === "wake up"){
  //     buildLevel();
  //     drawLevel(false);
  //     findLightLevel();
  //     drawHUD("It's cold. That's the first thing you notice. Cold, and wrong. The air smells like ozone and oil, and the light seems... less, somehow. Not as complete. It takes several moments before you realize that you don't know where you are, or how you came to be here.");
  //   }
  //
  //   playerConsole(userInput);
  //
  //   $("#console_form")[0].reset();
  // })
// })
