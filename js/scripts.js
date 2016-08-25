var xAxisLength = 9;
var yAxisLength = 9;
var keys = 99;
var batteries = 0;
var flashlightPower = 20  ;
var flashlightMeter = "";
var sanity = 100;
var sanityMeter="";
var playerY = 4;
var playerX = 4;
var vaultArray = [];
var currentVault = -1;

var Vault = function() {
  this.floor = [];
  this.vaultNumber = 0;
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

Vault.prototype.checkIfPassable = function(checkY, checkX) {
  if(checkY === -1 && this.floor[playerY][playerX].doorN === "|"){
    if(this.floor[playerY + checkY][playerX].doorS === "|"){
      return true;
    }else if(this.floor[playerY + checkY][playerX].doorS === "-" && keys>0){
      this.floor[playerY + checkY][playerX].doorS = "|";
      keys -=1;
      return true;
    }
  }else if(checkY === +1 && this.floor[playerY][playerX].doorS === "|"){
    if(this.floor[playerY + checkY][playerX].doorN === "|"){
      return true;
    }else if(this.floor[playerY + checkY][playerX].doorN === "-" && keys>0){
      this.floor[playerY + checkY][playerX].doorN = "|";
      keys -=1;
      return true;
    }
  }else if(checkX === +1 && this.floor[playerY][playerX].doorE === "-"){
    if(this.floor[playerY][playerX + checkX].doorW === "-"){
      return true;
    }else if(this.floor[playerY][playerX + checkX].doorW === "|" && keys>0){
      this.floor[playerY][playerX + checkX].doorW = "-";
      keys -=1;
      return true;
    }
  }else if(checkX === -1 && this.floor[playerY][playerX].doorW === "-"){
    if(this.floor[playerY][playerX + checkX].doorE === "-"){
      return true;
    }else if(this.floor[playerY][playerX + checkX].doorE === "|" && keys>0){
      this.floor[playerY][playerX + checkX].doorE = "-";
      keys -=1;
      return true;
    }
  }
}

Vault.prototype.buildVault = function() {
  for(var y = 0; y < yAxisLength; ++y){
    this.floor[y] = [];
    for(var x = 0; x < xAxisLength; ++x){
      this.floor[y][x] = new Room;
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
  for(var y = 0; y < yAxisLength; ++y){
    for(var x = 0; x < xAxisLength; ++x){
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
          if(y !== 8){
            if(this.floor[y+1][x].doorN === "*"){
              this.floor[y+1][x].doorN = "-";
            }
          }
        }else if(this.floor[y][x].doorResult[i] === "e"){
          this.floor[y][x].doorE = "-";
          if(x !== 8){
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
      if(y === 8){
        this.floor[y][x].doorS = "*";
      }
      if(x === 8){
        this.floor[y][x].doorE = "*";
      }
    }
  }

  $("#console_input").attr("placeholder", "> (type 'help' for instructions)")

  //Sets player origin. Currently static.
  this.floor[4][4].playerLocation = "@";
  this.floor[4][4].seenRoom = true;
  this.floor[playerY][playerX].findLightLevel();
  this.drawVault();
}

Vault.prototype.drawVault = function() {
  $("span").remove();
  $("br").remove();

  for(var y = 0; y < yAxisLength; ++y){
    for(var i = 1; i < 6 ; ++i){
      for(var x = 0; x < xAxisLength; ++x){
        if(this.floor[y][x].seenRoom){
          if(i === 1){
            $("#main_con").append("<span>**" + "<span id=door_span>" + this.floor[y][x].doorN + "</span>" + "**</span>");
          }else if(i === 3){
            $("#main_con").append( "<span><span id=door_span>" + this.floor[y][x].doorW + "</span>" + "&nbsp" + "<span id=player_span>" +  "<span id=player_span>" + this.floor[y][x].playerLocation + "</span>" + "&nbsp;" + "<span id=door_span>" + this.floor[y][x].doorE + "</span></span>");
          }else if (i === 5){
            $("#main_con").append("<span>**" +  "<span id=door_span>" + this.floor[y][x].doorS + "</span>" + "**</span>");
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

  return false;
}

function initializeVault() {
  currentVault += 1;
  vaultArray[currentVault] = new Vault;
  vaultArray[currentVault].vaultNumber = currentVault;
  vaultArray[currentVault].buildVault();
}

function movePlayer(direction) {

  if(direction === "n"){
    if(vaultArray[currentVault].checkIfPassable(-1,0)){
      vaultArray[currentVault].floor[playerY][playerX].playerLocation = " ";
      playerY -= 1;
    }
  }else if(direction === "s"){
    if(vaultArray[currentVault].checkIfPassable(+1,0)){
      vaultArray[currentVault].floor[playerY][playerX].playerLocation = " ";
      playerY += 1;
    }
  }else if(direction === "e"){
    if(vaultArray[currentVault].checkIfPassable(0,+1)){
      vaultArray[currentVault].floor[playerY][playerX].playerLocation = " ";
      playerX += 1;
    }
  }else if(direction === "w"){
    if(vaultArray[currentVault].checkIfPassable(0,-1)){
      vaultArray[currentVault].floor[playerY][playerX].playerLocation = " ";
      playerX -= 1;
    }
  }

  vaultArray[currentVault].floor[playerY][playerX].playerLocation = "@";
  if(vaultArray[currentVault].floor[playerY][playerX].seenRoom === false){
    vaultArray[currentVault].floor[playerY][playerX].findLightLevel();
  }
  vaultArray[currentVault].floor[playerY][playerX].seenRoom = true;
  $("span").remove();

  vaultArray[currentVault].drawVault();
  drawHUD("");
}

function playerConsole(userInput) {
  if(userInput === "n" || userInput === "s" || userInput === "e" ||  userInput === "w"){
    movePlayer(userInput)
  }
}


function drawHUD(expoOutput) {
  $("#HUD_con").append("<span>" + expoOutput + "</span>");
  $("#HUD_con").append("<span> The light here is " + vaultArray[currentVault].floor[playerY][playerX].lightLevel + ".</span><br><br>");
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
  initializeVault();

  drawHUD("It's cold. That's the first thing you notice. Cold, and wrong. The air smells like ozone and oil, and the light seems... less, somehow. Not as complete. It takes several moments before you realize that you don't know where you are, or how you came to be here.");

  //Submit behavior for user input form
  $("#console_form").submit(function(event) {
    event.preventDefault();
    var userInput = $("#console_input").val().toLowerCase();

    playerConsole(userInput);

    $("#console_form")[0].reset();
  })
})
