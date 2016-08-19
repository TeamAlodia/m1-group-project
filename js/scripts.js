// <span>*****<br>*&nbsp;&nbsp;&nbsp;*<br>*&nbsp;&nbsp;&nbsp;*<br>*&nbsp;&nbsp;&nbsp;*<br>*****</span>

var xAxisLength = 9;
var yAxisLength = 9;
var firstFloor = [];
var playerCoords = [4,4]

var Room = function() {
  this.doorN = "*";
  this.doorS = "*";
  this.doorE = "*";
  this.doorW = "*";
  this.doorResult = "";
  this.playerLocation = " ";
}

function movePlayer(direction) {
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

  for(var y = 0; y < yAxisLength; ++y){

    for(var x = 0; x < xAxisLength; ++x){
      var doorChance = (Math.floor(Math.random() * (13 - 1)) + 1);
      var oneDoor = ["n","s","e","w"];
      var twoDoors = ["ns","ne","nw","se","sw","ew"];
      var threeDoors = ["nse","nsw","nwe","swe"]

      if(doorChance >= 1 && doorChance <= 2){
        firstFloor[y][x].doorResult = oneDoor[(Math.floor(Math.random() * (4 - 0)) + 0)].split("");
      }else if(doorChance >= 3 && doorChance <= 7){
        firstFloor[y][x].doorResult = twoDoors[(Math.floor(Math.random() * (6 - 0)) + 0)].split("");
      }else if(doorChance >=8 && doorChance <= 11){
        firstFloor[y][x].doorResult = threeDoors[(Math.floor(Math.random() * (4 - 0)) + 0)].split("");
      }else{
        firstFloor[y][x].doorResult = ["n","s","e","w"];
      }
    }
  }

  //Populates doors
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

    }
  }

  //Sets player origin. Currently static.
  firstFloor[4][4].playerLocation = "@";

  // alert("Exit");

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
    $("#crypto_form")[0].reset();
  })
})
