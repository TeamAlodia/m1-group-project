// <span>*****<br>*&nbsp;&nbsp;&nbsp;*<br>*&nbsp;&nbsp;&nbsp;*<br>*&nbsp;&nbsp;&nbsp;*<br>*****</span>

var xAxisLength = 9;
var yAxisLength = 9;
var firstFloor = [];
var keys = 99;
var batteries = 0;
var flashlightPower = 100;
var flashlightMeter = "";
var sanity = 100;
var sanityMeter="";
var playerY = 4;
var playerX = 4;
var roomMap = [];
// var roomStructure = ["<span>**" + firstFloor[y][x].doorN + "**",]

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
  if(checkY === -1 && firstFloor[playerY][playerX].doorN === "|"){
    if(firstFloor[playerY + checkY][playerX].doorS === "|"){
      return true;
    }else if(firstFloor[playerY + checkY][playerX].doorS === "-" && keys>0){
      firstFloor[playerY + checkY][playerX].doorS = "|";
      keys -=1;
      return true;
    }
  }else if(checkY === +1 && firstFloor[playerY][playerX].doorS === "|"){
    if(firstFloor[playerY + checkY][playerX].doorN === "|"){
      return true;
    }else if(firstFloor[playerY + checkY][playerX].doorN === "-" && keys>0){
      firstFloor[playerY + checkY][playerX].doorN = "|";
      keys -=1;
      return true;
    }
  }else if(checkX === +1 && firstFloor[playerY][playerX].doorE === "-"){
    if(firstFloor[playerY][playerX + checkX].doorW === "-"){
      return true;
    }else if(firstFloor[playerY][playerX + checkX].doorW === "|" && keys>0){
      firstFloor[playerY][playerX + checkX].doorW = "-";
      keys -=1;
      return true;
    }
  }else if(checkX === -1 && firstFloor[playerY][playerX].doorW === "-"){
    if(firstFloor[playerY][playerX + checkX].doorE === "-"){
      return true;
    }else if(firstFloor[playerY][playerX + checkX].doorE === "|" && keys>0){
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
  firstFloor[playerY][playerX].seenRoom = true;
  $("span").remove();
  drawLevel(false);
}

function playerConsole(userInput) {
  if(userInput === "n" || userInput === "s" || userInput === "e" ||  userInput === "w"){
    movePlayer(userInput)
  }
}

//Draws the level, the doors and the player. Will eventually only draw seen rooms.
function drawLevel(initialDraw) {
  // for(var y = 0; y < yAxisLength; ++y){
  //   for(var x = 0; x < xAxisLength; ++x){
  //     if(firstFloor[y][x].seenRoom && initialDraw === false){
  //       $("#" + y + "-" + x).append("<span>**" + firstFloor[y][x].doorN + "**<br>*&nbsp;&nbsp;&nbsp;*<br>" + firstFloor[y][x].doorW + "&nbsp" + firstFloor[y][x].playerLocation + "&nbsp;" + firstFloor[y][x].doorE + "<br>*&nbsp;&nbsp;&nbsp;*<br>**" + firstFloor[y][x].doorS + "**</span>");
  //     }else if(firstFloor[y][x].seenRoom === false || initialDraw){
  //       $("#" + y + "-" + x).append("<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>")
  //     }
  //   }
  // }

  $("span").remove();
  $("br").remove();

  for(var y = 0; y < yAxisLength; ++y){
    for(var i = 1; i < 6 ; ++i){
      for(var x = 0; x < xAxisLength; ++x){
        if(firstFloor[y][x].seenRoom){
          if(i === 1){
            $("#main_con").append("<span>**" + "<span id=door_span>" + firstFloor[y][x].doorN + "</span>" + "**</span>");
          }else if(i === 3){
            $("#main_con").append( "<span><span id=door_span>" + firstFloor[y][x].doorW + "</span>" + "&nbsp" + "<span id=player_span>" +  "<span id=player_span>" + firstFloor[y][x].playerLocation + "</span>" + "&nbsp;" + "<span id=door_span>" + firstFloor[y][x].doorE + "</span></span>");
          }else if (i === 5){
            $("#main_con").append("<span>**" +  "<span id=door_span>" + firstFloor[y][x].doorS + "</span>" + "**</span>");
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

function buildLevel() {
  //Builds empty floor

  for(var y = 0; y < yAxisLength; ++y){
    firstFloor[y] = [];
    for(var x = 0; x < xAxisLength; ++x){
      firstFloor[y][x] = new Room;
    }
  }

  //Builds map

  // roomMap += [];
  //
  // for(var y = 0; y < yAxisLength; ++y){
  //   for(var i = 0; i < 5 ; ++i){
  //     for(var x = 0; x < xAxisLength; ++x){
  //       if(i === 0){
  //         roomMap.lastIndexOf
  //       }
  //     }
  //     $("#main_con").append("<br>");
  //   }
  // }


//Populates doors. Currently split into separate loops to maintain flexibility. Will eventually be compressed.
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

  //Takes doorResult and uses it to add the data to the room objects, including locked doors.
  for(var y = 0; y < yAxisLength; ++y){
    for(var x = 0; x < xAxisLength; ++x){

      firstFloor[y][x].doorResult.forEach(function(currentDoor) {
        if(currentDoor === "n"){
          firstFloor[y][x].doorN = "|";
          if(y !== 0){
            if(firstFloor[y-1][x].doorS === "*"){
              firstFloor[y-1][x].doorS = "-";
            }
          }
        }else if(currentDoor === "s"){
          firstFloor[y][x].doorS = "|";
          if(y !== 8){
            if(firstFloor[y+1][x].doorN === "*"){
              firstFloor[y+1][x].doorN = "-";
            }
          }
        }else if(currentDoor === "e"){
          firstFloor[y][x].doorE = "-";
          if(x !== 8){
            if(firstFloor[y][x+1].doorW === "*"){
              firstFloor[y][x+1].doorW = "|";
            }
          }
        }else{
          firstFloor[y][x].doorW = "-"
          if(x !== 0){
            if(firstFloor[y][x-1].doorE === "*"){
              firstFloor[y][x-1].doorE = "|";
            }
          }
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
  firstFloor[4][4].seenRoom = true;
}

function findLightLevel() {
  var lightChance = (Math.floor(Math.random() * (100 - 1)) + 1);

  if(lightChance >= 1 && lightChance <= 20){
    firstFloor[playerY][playerX].lightLevel = "dark";
  }else if(lightChance >= 21 && lightChance <= 40){
    firstFloor[playerY][playerX].lightLevel = "flickering";
  }else if(lightChance >= 41 && lightChance <= 80){
    firstFloor[playerY][playerX].lightLevel = "dim";
  }else{
    firstFloor[playerY][playerX].lightLevel = "bright";
  }

}

// function drawHUD(expoOutput) {
//   $("#HUD_expo_output").text(expoOutput);
//   $("#HUD_light_output").text("The light here is " + firstFloor[playerY][playerX].lightLevel);
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

$(document).ready(function() {

  //Submit behavior for user input form
  $("#console_form").submit(function(event) {
    event.preventDefault();
    var userInput = $("#console_input").val().toLowerCase();
    if(userInput === "wake up"){
      buildLevel();
      drawLevel(false);
      findLightLevel();
      // drawHUD("It's cold. That's the first thing you notice. Cold, and wrong. The air smells like ozone and oil, and the light seems... less, somehow. Not as complete. It takes several moments before you realize that you don't know where you are, or how you came to be here.");
    }

    playerConsole(userInput);

    $("#console_form")[0].reset();
  })
})
