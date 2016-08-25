// <span>*****<br>*&nbsp;&nbsp;&nbsp;*<br>*&nbsp;&nbsp;&nbsp;*<br>*&nbsp;&nbsp;&nbsp;*<br>*****</span>

var xAxisLength = 9;
var yAxisLength = 9;
// var firstFloor = [];
var keys = 99;
var batteries = 0;
var flashlightPower = 20  ;
var flashlightMeter = "";
var sanity = 100;
var sanityMeter="";
var playerY = 4;
var playerX = 4;
var vaultArray = [];

// vaultArray[0].floor[y][x]

var Vault = function() {
  this.floor = [];
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

// Returns true if there is a door and it is either unlocked, or locked and the player has a key
function checkIfPassable(checkY, checkX) {
  if(checkY === -1 && vaultArray[0].floor[playerY][playerX].doorN === "|"){
    if(vaultArray[0].floor[playerY + checkY][playerX].doorS === "|"){
      return true;
    }else if(vaultArray[0].floor[playerY + checkY][playerX].doorS === "-" && keys>0){
      vaultArray[0].floor[playerY + checkY][playerX].doorS = "|";
      keys -=1;
      return true;
    }
  }else if(checkY === +1 && vaultArray[0].floor[playerY][playerX].doorS === "|"){
    if(vaultArray[0].floor[playerY + checkY][playerX].doorN === "|"){
      return true;
    }else if(vaultArray[0].floor[playerY + checkY][playerX].doorN === "-" && keys>0){
      vaultArray[0].floor[playerY + checkY][playerX].doorN = "|";
      keys -=1;
      return true;
    }
  }else if(checkX === +1 && vaultArray[0].floor[playerY][playerX].doorE === "-"){
    if(vaultArray[0].floor[playerY][playerX + checkX].doorW === "-"){
      return true;
    }else if(vaultArray[0].floor[playerY][playerX + checkX].doorW === "|" && keys>0){
      vaultArray[0].floor[playerY][playerX + checkX].doorW = "-";
      keys -=1;
      return true;
    }
  }else if(checkX === -1 && vaultArray[0].floor[playerY][playerX].doorW === "-"){
    if(vaultArray[0].floor[playerY][playerX + checkX].doorE === "-"){
      return true;
    }else if(vaultArray[0].floor[playerY][playerX + checkX].doorE === "|" && keys>0){
      vaultArray[0].floor[playerY][playerX + checkX].doorE = "-";
      keys -=1;
      return true;
    }
  }

  return false;
}

function movePlayer(direction) {

  if(direction === "n"){
    if(checkIfPassable(-1,0)){
      vaultArray[0].floor[playerY][playerX].playerLocation = " ";
      playerY -= 1;
    }
  }else if(direction === "s"){
    if(checkIfPassable(+1,0)){
      vaultArray[0].floor[playerY][playerX].playerLocation = " ";
      playerY += 1;
    }
  }else if(direction === "e"){
    if(checkIfPassable(0,+1)){
      vaultArray[0].floor[playerY][playerX].playerLocation = " ";
      playerX += 1;
    }
  }else if(direction === "w"){
    if(checkIfPassable(0,-1)){
      vaultArray[0].floor[playerY][playerX].playerLocation = " ";
      playerX -= 1;
    }
  }

  vaultArray[0].floor[playerY][playerX].playerLocation = "@";
  if(vaultArray[0].floor[playerY][playerX].seenRoom === false){
    findLightLevel();
  }
  vaultArray[0].floor[playerY][playerX].seenRoom = true;
  $("span").remove();

  drawVault();
  drawHUD("");
}

function playerConsole(userInput) {
  if(userInput === "n" || userInput === "s" || userInput === "e" ||  userInput === "w"){
    movePlayer(userInput)
  }
}

//Draws the level, the doors and the player. Will eventually only draw seen rooms.
function drawVault() {
  $("span").remove();
  $("br").remove();

  for(var y = 0; y < yAxisLength; ++y){
    for(var i = 1; i < 6 ; ++i){
      for(var x = 0; x < xAxisLength; ++x){
        if(vaultArray[0].floor[y][x].seenRoom){
          if(i === 1){
            $("#main_con").append("<span>**" + "<span id=door_span>" + vaultArray[0].floor[y][x].doorN + "</span>" + "**</span>");
          }else if(i === 3){
            $("#main_con").append( "<span><span id=door_span>" + vaultArray[0].floor[y][x].doorW + "</span>" + "&nbsp" + "<span id=player_span>" +  "<span id=player_span>" + vaultArray[0].floor[y][x].playerLocation + "</span>" + "&nbsp;" + "<span id=door_span>" + vaultArray[0].floor[y][x].doorE + "</span></span>");
          }else if (i === 5){
            $("#main_con").append("<span>**" +  "<span id=door_span>" + vaultArray[0].floor[y][x].doorS + "</span>" + "**</span>");
          }else{
            $("#main_con").append("<span>*&nbsp;&nbsp;&nbsp;*</span>");
          }
        }else{
          $("#main_con").append("<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>");
        }
      }
      $("#main_con").append("<br>");
    }
  }

}

function buildVault() {
  //Builds empty floor

  vaultArray[0] = new Vault;

  for(var y = 0; y < yAxisLength; ++y){
    vaultArray[0].floor[y] = [];
    for(var x = 0; x < xAxisLength; ++x){
      vaultArray[0].floor[y][x] = new Room;
    }
  }

//Populates doors. Currently split into separate loops to maintain flexibility. Will eventually be compressed.
  for(var y = 0; y < yAxisLength; ++y){
    for(var x = 0; x < xAxisLength; ++x){
      var doorChance = (Math.floor(Math.random() * (13 - 1)) + 1);
      var oneDoor = ["n","s","e","w"];
      var twoDoors = ["ns","ne","nw","se","sw","ew"];
      var threeDoors = ["nse","nsw","nwe","swe"]

      if(doorChance >= 1 && doorChance <= 4){
        vaultArray[0].floor[y][x].doorResult = oneDoor[(Math.floor(Math.random() * (4 - 0)) + 0)].split("");
      }else if(doorChance >= 5 && doorChance <= 8){
        vaultArray[0].floor[y][x].doorResult = twoDoors[(Math.floor(Math.random() * (6 - 0)) + 0)].split("");
      }else if(doorChance >=9 && doorChance <= 11){
        vaultArray[0].floor[y][x].doorResult = threeDoors[(Math.floor(Math.random() * (4 - 0)) + 0)].split("");
      }else{
        vaultArray[0].floor[y][x].doorResult = ["n","s","e","w"];
      }
    }
  }


  //Takes doorResult and uses it to add the data to the room objects, including locked doors.
  for(var y = 0; y < yAxisLength; ++y){
    for(var x = 0; x < xAxisLength; ++x){

      vaultArray[0].floor[y][x].doorResult.forEach(function(currentDoor) {
        if(currentDoor === "n"){
          vaultArray[0].floor[y][x].doorN = "|";
          if(y !== 0){
            if(vaultArray[0].floor[y-1][x].doorS === "*"){
              vaultArray[0].floor[y-1][x].doorS = "-";
            }
          }
        }else if(currentDoor === "s"){
          vaultArray[0].floor[y][x].doorS = "|";
          if(y !== 8){
            if(vaultArray[0].floor[y+1][x].doorN === "*"){
              vaultArray[0].floor[y+1][x].doorN = "-";
            }
          }
        }else if(currentDoor === "e"){
          vaultArray[0].floor[y][x].doorE = "-";
          if(x !== 8){
            if(vaultArray[0].floor[y][x+1].doorW === "*"){
              vaultArray[0].floor[y][x+1].doorW = "|";
            }
          }
        }else{
          vaultArray[0].floor[y][x].doorW = "-"
          if(x !== 0){
            if(vaultArray[0].floor[y][x-1].doorE === "*"){
              vaultArray[0].floor[y][x-1].doorE = "|";
            }
          }
        }
      })

      // // Clears doors from edges of map
      if(y === 0){
        vaultArray[0].floor[y][x].doorN = "*";
      }
      if(x === 0){
        vaultArray[0].floor[y][x].doorW = "*";
      }
      if(y === 8){
        vaultArray[0].floor[y][x].doorS = "*";
      }
      if(x === 8){
        vaultArray[0].floor[y][x].doorE = "*";
      }
    }
  }

  $("#console_input").attr("placeholder", "> (type 'help' for instructions)")

  //Sets player origin. Currently static.
  vaultArray[0].floor[4][4].playerLocation = "@";
  vaultArray[0].floor[4][4].seenRoom = true;
}

function findLightLevel() {
  var lightChance = (Math.floor(Math.random() * (100 - 1)) + 1);

  if(lightChance >= 1 && lightChance <= 20){
    vaultArray[0].floor[playerY][playerX].lightLevel = "dark";
  }else if(lightChance >= 21 && lightChance <= 40){
    vaultArray[0].floor[playerY][playerX].lightLevel = "flickering";
  }else if(lightChance >= 41 && lightChance <= 80){
    vaultArray[0].floor[playerY][playerX].lightLevel = "dim";
  }else{
    vaultArray[0].floor[playerY][playerX].lightLevel = "bright";
  }

}

function drawHUD(expoOutput) {
  $("#HUD_con").append("<span>" + expoOutput + "</span>");
  $("#HUD_con").append("<span> The light here is " + vaultArray[0].floor[playerY][playerX].lightLevel + ".</span><br><br>");
  $("#HUD_con").append("<span>Keys: " + keys + "</span><br>");
  $("#HUD_con").append("<span>Batteries: " + batteries + "</span><br><br>");

  flashlightMeter = "";
  for(var i = 1; i <= flashlightPower/5; ++i){
    flashlightMeter += "/";
  }

  $("#HUD_con").append("<span id='HUD_flashlight_output'>Flashlight: " + flashlightMeter + "</span><br><br>");

  if(flashlightPower/5 <=4){
    $("#HUD_flashlight_output").css("color", "red");
  }else{
    $("#HUD_flashlight_output").css("color", "#00e600");
  }


  sanityMeter = "";
  for(var i = 1; i <= sanity/5; ++i){
    sanityMeter += "/";
  }

  $("#HUD_con").append("<span id='HUD_sanity_output'>Sanity: " + sanityMeter + "</span><br>");

  if(sanity/5 <=4){
    $("#HUD_sanity_output").css("color", "red");
  }else{
    $("#HUD_sanity_output").css("color", "#00e600");
  }
}

$(document).ready(function() {

  //Submit behavior for user input form
  $("#console_form").submit(function(event) {
    event.preventDefault();
    var userInput = $("#console_input").val().toLowerCase();
    if(userInput === "wake up"){
      buildVault();
      drawVault();
      findLightLevel();
      drawHUD("It's cold. That's the first thing you notice. Cold, and wrong. The air smells like ozone and oil, and the light seems... less, somehow. Not as complete. It takes several moments before you realize that you don't know where you are, or how you came to be here.");
    }

    playerConsole(userInput);

    $("#console_form")[0].reset();
  })
})
