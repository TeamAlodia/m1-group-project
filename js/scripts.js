// <span>@@@@@<br>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@@@@@</span>

var xAxisLength = 9;
var yAxisLength = 9;
var firstFloor = [];

var Room = function() {
  this.doors = "nsew";
}

function drawLevel() {
  for(y = 0; y < yAxisLength; ++y){
    for(x = 0; x < xAxisLength; ++x){

      // if(y === 0){
      // $("#" + y + "-" + x).append("<span>@@@@@<br>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@@@@@</span>");
      // }else {
      // $("#" + y + "-" + x).append("<span>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@@@@@</span>");
      // }

      if(y === 0 && x === 0){
        $("#" + y + "-" + x).append("<span>@@@@@<br>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@@@@@</span>");
      } else if(y === 0 && x > 0){
        $("#" + y + "-" + x).append("<span>@@@@<br>&nbsp;&nbsp;&nbsp;@<br>&nbsp;&nbsp;&nbsp;@<br>&nbsp;&nbsp;&nbsp;@<br>@@@@</span>");
      } else if(y > 0 && x === 0){
        $("#" + y + "-" + x).append("<span>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@&nbsp;&nbsp;&nbsp;@<br>@@@@@</span>");
      } else{
        $("#" + y + "-" + x).append("<span>&nbsp;&nbsp;&nbsp;@<br>&nbsp;&nbsp;&nbsp;@<br>&nbsp;&nbsp;&nbsp;@<br>@@@@</span>");
      }

    }
  }
}

function buildLevel() {
  //Builds empty floor
  // for(x = 0; x < xAxisLength; ++x){
  //   firstFloor[x] = [];
  //   for(y = 0; y < yAxisLength; ++y){
  //     firstFloor[x][y] = x + "-" + y;
  //   }
  // }

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
