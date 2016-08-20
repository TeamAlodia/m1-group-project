// <span>*****<br>*&nbsp;&nbsp;&nbsp;*<br>*&nbsp;&nbsp;&nbsp;*<br>*&nbsp;&nbsp;&nbsp;*<br>*****</span>

var xAxisLength = 9;
var yAxisLength = 9;
var firstFloor = [];
var playerCoords = [4,4]
var keys = 99;
var playerY = 4;
var playerX = 4;

var Room = function() {
  this.doorN = "*";
  this.doorS = "*";
  this.doorE = "*";
  this.doorW = "*";
  this.doorResult = "";
  this.playerLocation = " ";
}

// Returns true if there is a door and it is either unlocked, or locked and the player has a key
function checkIfPassable(checkY, checkX) {
  if(checkY === -1 && firstFloor[playerY][playerX].doorN != "*"){
    if(firstFloor[playerY + checkY][playerX].doorS != "*"){
      return true;
    }else if(keys>0){
      firstFloor[playerY + checkY][playerX].doorS = "|";
      keys -=1;
      return true;
    }
  }else if(checkY === +1 && firstFloor[playerY][playerX].doorS != "*"){
    if(firstFloor[playerY + checkY][playerX].doorN != "*"){
      return true;
    }else if(keys>0){
      firstFloor[playerY + checkY][playerX].doorN = "|";
      keys -=1;
      return true;
    }
  }else if(checkX === +1 && firstFloor[playerY][playerX].doorE != "*"){
    if(firstFloor[playerY][playerX + checkX].doorW != "*"){
      return true;
    }else if(keys>0){
      firstFloor[playerY][playerX + checkX].doorW = "-";
      keys -=1;
      return true;
    }
  }else if(checkX === -1 && firstFloor[playerY][playerX].doorW != "*"){
    if(firstFloor[playerY][playerX + checkX].doorE != "*"){
      return true;
    }else if(keys>0){
      firstFloor[playerY][playerX + checkX].doorE = "-";
      keys -=1;
      return true;
    }
  }

  return false;
}

function movePlayer(direction) {

  if(direction === "n"){
    if(checkIfPassable(-1,0)){
      firstFloor[playerY][playerX].playerLocation = " ";
      playerY -= 1;
    }
  }else if(direction === "s"){
    if(checkIfPassable(+1,0)){
      firstFloor[playerY][playerX].playerLocation = " ";
      playerY += 1;
    }
  }else if(direction === "e"){
    if(checkIfPassable(0,+1)){
      firstFloor[playerY][playerX].playerLocation = " ";
      playerX += 1;
    }
  }else if(direction === "w"){
    if(checkIfPassable(0,-1)){
      firstFloor[playerY][playerX].playerLocation = " ";
      playerX -= 1;
    }
  }

  firstFloor[playerY][playerX].playerLocation = "@";
  $("span").remove();
  drawLevel();
}

function playerConsole(userInput) {
  if(userInput === "n" || userInput === "s" || userInput === "e" ||  userInput === "w"){
    movePlayer(userInput)
  }
}

//Draws the level, the doors and the player. Will eventually only draw seen rooms.
function drawLevel() {
  for(var y = 0; y < yAxisLength; ++y){
    for(var x = 0; x < xAxisLength; ++x){

      $("#" + y + "-" + x).append("<span>**" + firstFloor[y][x].doorN + "**<br>*&nbsp;&nbsp;&nbsp;*<br>" + firstFloor[y][x].doorW + "&nbsp" + firstFloor[y][x].playerLocation + "&nbsp;" + firstFloor[y][x].doorE + "<br>*&nbsp;&nbsp;&nbsp;*<br>**" + firstFloor[y][x].doorS + "**</span>");

    }
  }
}

function buildLevel() {
  //Builds empty floor

  for(var y = 0; y < yAxisLength; ++y){
    firstFloor[y] = [];
    for(var x = 0; x < xAxisLength; ++x){
      firstFloor[y][x] = new Room;
    }
  }

//Populates doors
  for(var y = 0; y < yAxisLength; ++y){
    for(var x = 0; x < xAxisLength; ++x){
      var doorChance = (Math.floor(Math.random() * (13 - 1)) + 1);
      var oneDoor = ["n","s","e","w"];
      var twoDoors = ["ns","ne","nw","se","sw","ew"];
      var threeDoors = ["nse","nsw","nwe","swe"]

      if(doorChance >= 1 && doorChance <= 4){
        firstFloor[y][x].doorResult = oneDoor[(Math.floor(Math.random() * (4 - 0)) + 0)].split("");
      }else if(doorChance >= 5 && doorChance <= 8){
        firstFloor[y][x].doorResult = twoDoors[(Math.floor(Math.random() * (6 - 0)) + 0)].split("");
      }else if(doorChance >=9 && doorChance <= 11){
        firstFloor[y][x].doorResult = threeDoors[(Math.floor(Math.random() * (4 - 0)) + 0)].split("");
      }else{
        firstFloor[y][x].doorResult = ["n","s","e","w"];
      }
    }
  }

  for(var y = 0; y < yAxisLength; ++y){
    for(var x = 0; x < xAxisLength; ++x){

      firstFloor[y][x].doorResult.forEach(function(currentDoor) {
        if(currentDoor === "n"){
          firstFloor[y][x].doorN = "|";
        }else if(currentDoor === "s"){
          firstFloor[y][x].doorS = "|";
        }else if(currentDoor === "e"){
          firstFloor[y][x].doorE = "-";
        }else{
          firstFloor[y][x].doorW = "-"
        }
      })

      // // Clears doors from edges of map
      if(y === 0){
        firstFloor[y][x].doorN = "*";
      }
      if(x === 0){
        firstFloor[y][x].doorW = "*";
      }
      if(y === 8){
        firstFloor[y][x].doorS = "*";
      }
      if(x === 8){
        firstFloor[y][x].doorE = "*";
      }
    }
  }

  $("#console_input").attr("placeholder", "> (type 'help' for instructions)")

  //Sets player origin. Currently static.
  firstFloor[4][4].playerLocation = "@";
}

$(document).ready(function() {

  //Submit behavior for user input form
  $("#console_form").submit(function(event) {
    event.preventDefault();
    var userInput = $("#console_input").val().toLowerCase();

    if(userInput === "wake up"){
      buildLevel();
      drawLevel();
    }

    playerConsole(userInput);

    $("#console_form")[0].reset();
  })
})
