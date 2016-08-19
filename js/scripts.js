// <span>@@@@@<br>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@@@@@</span>

var xAxisLength = 9;
var yAxisLength = 9;
var firstFloor = [];

var Room = function() {
  this.doorN = "|";
  this.doorS = "|";
  this.doorE = "-";
  this.doorW = "-";
}

function drawLevel() {
  for(y = 0; y < yAxisLength; ++y){
    for(x = 0; x < xAxisLength; ++x){

      if(y === 0 && x === 0){
        $("#" + y + "-" + x).append("<span>@@" + firstFloor[y][x].doorN + "@@<br>@&nbsp;&nbsp;&nbsp;@<br>" + firstFloor[y][x].doorW + "&nbsp;&nbsp;&nbsp;" + firstFloor[y][x].doorE + "<br>@&nbsp;&nbsp;&nbsp;@<br>@@" + firstFloor[y][x].doorS + "@@</span>");
      } else if(y === 0 && x > 0){
        $("#" + y + "-" + x).append("<span>@" + firstFloor[y][x].doorN + "@@<br>&nbsp;&nbsp;&nbsp;@<br>&nbsp;&nbsp;&nbsp;" + firstFloor[y][x].doorE + "<br>&nbsp;&nbsp;&nbsp;@<br>@" + firstFloor[y][x].doorS + "@@</span>");
      } else if(y > 0 && x === 0){
        $("#" + y + "-" + x).append("<span>@&nbsp;&nbsp;&nbsp;@<br>" + firstFloor[y][x].doorW + "&nbsp;&nbsp;&nbsp;" + firstFloor[y][x].doorE + "<br>@&nbsp;&nbsp;&nbsp;@<br>@@" + firstFloor[y][x].doorS + "@@</span>");
      } else{
        $("#" + y + "-" + x).append("<span>&nbsp;&nbsp;&nbsp;@<br>&nbsp;&nbsp;&nbsp;" + firstFloor[y][x].doorE + "<br>&nbsp;&nbsp;&nbsp;@<br>@" + firstFloor[y][x].doorS + "@@</span>");
      }

    }
  }
}

function buildLevel() {
  //Builds empty floor

  for(y = 0; y < yAxisLength; ++y){
    firstFloor[y] = [];
    for(x = 0; x < xAxisLength; ++x){
      firstFloor[y][x] = new Room;
    }
  }

}

$(document).ready(function() {
  $("#start_button").click(function() {
    $("button").toggle();
    buildLevel();
    drawLevel();
  })
})
