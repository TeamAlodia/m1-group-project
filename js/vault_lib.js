var Vault = function(yAxisLength, xAxisLength) {
  this.playerX = 4;
  this.playerY = 4;
  this.floor = [];
  this.vaultNumber = 0;
  this.yAxisLength = yAxisLength;
  this.xAxisLength = xAxisLength;
};

Vault.prototype.buildVault = function() {
  for(var y = 0; y < this.yAxisLength; ++y){
    this.floor[y] = [];
    for(var x = 0; x < this.xAxisLength; ++x){
      this.floor[y][x] = new Room;
    }
  }

  //Populates doors. Currently split into separate loops to maintain flexibility. Will eventually be compressed.
  for(var y = 0; y < this.yAxisLength; ++y){
    for(var x = 0; x < this.xAxisLength; ++x){
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
  for(var y = 0; y < this.yAxisLength; ++y){
    for(var x = 0; x < this.xAxisLength; ++x){
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
          if(y !== this.yAxisLength - 1){
            if(this.floor[y+1][x].doorN === "*"){
              this.floor[y+1][x].doorN = "-";
            }
          }
        }else if(this.floor[y][x].doorResult[i] === "e"){
          this.floor[y][x].doorE = "-";
          if(x !== this.xAxisLength - 1){
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
      if(y === this.yAxisLength - 1){
        this.floor[y][x].doorS = "*";
      }
      if(x === this.xAxisLength - 1){
        this.floor[y][x].doorE = "*";
      }
    }
  }

  $("#console_input").attr("placeholder", "> (type 'help' for instructions)")

  //Sets player origin. Currently static.
  this.floor[4][4].playerLocation = "@";
  this.floor[4][4].seenRoom = true;
  this.floor[this.playerY][this.playerX].findLightLevel();
  this.drawVault();
};

Vault.prototype.drawVault = function() {
  $("span").remove();
  $("br").remove();
  for(var y = 0; y < this.yAxisLength; ++y){
    for(var i = 1; i < 6 ; ++i){
      for(var x = 0; x < this.xAxisLength; ++x){
        if(i === 1){
          $("#main_con").append("<span>**" + "<span id=door_span>" + this.floor[y][x].doorN + "</span>" + "**</span>");
        }else if(i === 3){
          $("#main_con").append( "<span><span id=door_span>" + this.floor[y][x].doorW + "</span>" + "&nbsp" + "<span id=player_span>" +  "<span id=player_span>" + this.floor[y][x].playerLocation + "</span>" + "&nbsp;" + "<span id=door_span>" + this.floor[y][x].doorE + "</span></span>");
        }else if (i === 5){
          $("#main_con").append("<span>**" +  "<span id=door_span>" + this.floor[y][x].doorS + "</span>" + "**</span>");
        }else{
          $("#main_con").append("<span>*&nbsp;&nbsp;&nbsp;*</span>");
        }
      }
      $("#main_con").append("<br>");
    }
  }
};

//---------- Player movement functions ----------//

Vault.prototype.movePlayer = function(direction) {
  if(direction === "n"){
    if(this.checkIfPassable(-1,0)){
      this.floor[this.playerY][this.playerX].playerLocation = " ";
      this.playerY -= 1;
    }
  }else if(direction === "s"){
    if(this.checkIfPassable(+1,0)){
      this.floor[this.playerY][this.playerX].playerLocation = " ";
      this.playerY += 1;
    }
  }else if(direction === "e"){
    if(this.checkIfPassable(0,+1)){
      this.floor[this.playerY][this.playerX].playerLocation = " ";
      this.playerX += 1;
    }
  }else if(direction === "w"){
    if(this.checkIfPassable(0,-1)){
      this.floor[this.playerY][this.playerX].playerLocation = " ";
      this.playerX -= 1;
    }
  }

  this.floor[this.playerY][this.playerX].playerLocation = "@";
  if(this.floor[this.playerY][this.playerX].seenRoom === false){
    this.floor[this.playerY][this.playerX].findLightLevel();
  }
  this.floor[this.playerY][this.playerX].seenRoom = true;
  $("span").remove();
};

Vault.prototype.checkIfPassable = function(checkY, checkX) {
  if(checkY === -1 && this.floor[this.playerY][this.playerX].doorN === "|"){
    if(this.floor[this.playerY + checkY][this.playerX].doorS === "|"){
      return true;
    }else if(this.floor[this.playerY + checkY][this.playerX].doorS === "-" && keys>0){
      this.floor[this.playerY + checkY][this.playerX].doorS = "|";
      keys -=1;
      return true;
    }
  }else if(checkY === +1 && this.floor[this.playerY][this.playerX].doorS === "|"){
    if(this.floor[this.playerY + checkY][this.playerX].doorN === "|"){
      return true;
    }else if(this.floor[this.playerY + checkY][this.playerX].doorN === "-" && keys>0){
      this.floor[this.playerY + checkY][this.playerX].doorN = "|";
      keys -=1;
      return true;
    }
  }else if(checkX === +1 && this.floor[this.playerY][this.playerX].doorE === "-"){
    if(this.floor[this.playerY][this.playerX + checkX].doorW === "-"){
      return true;
    }else if(this.floor[this.playerY][this.playerX + checkX].doorW === "|" && keys>0){
      this.floor[this.playerY][this.playerX + checkX].doorW = "-";
      keys -=1;
      return true;
    }
  }else if(checkX === -1 && this.floor[this.playerY][this.playerX].doorW === "-"){
    if(this.floor[this.playerY][this.playerX + checkX].doorE === "-"){
      return true;
    }else if(this.floor[this.playerY][this.playerX + checkX].doorE === "|" && keys>0){
      this.floor[this.playerY][this.playerX + checkX].doorE = "-";
      keys -=1;
      return true;
    }
  }
};

Vault.prototype.updateSanity = function(){
  if(this.floor[this.playerY][this.playerX].lightLevel === "bright" || flashlightState === "high"){
  }else if(this.floor[this.playerY][this.playerX].lightLevel === "dim" || flashlightState === "on"){
    sanity -= 1;
  }else if(this.floor[this.playerY][this.playerX].lightLevel === "flickering"){
    sanity -= 2;
  }else{
    sanity -= 3;
  }

  if(sanity < 0){
    sanity = 0;
  }
};

//---------- Room functions ----------//

var Room = function() {
  this.doorN = "*";
  this.doorS = "*";
  this.doorE = "*";
  this.doorW = "*";
  this.doorResult = "";
  this.playerLocation = " ";
  this.seenRoom = false;
  this.lightLevel = "";
};

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
};

//---------- Other functions ----------//

function initializeVault() {
  vaultArray[vaultArray.length] = new Vault(9,9);
  vaultArray[vaultArray.length - 1].vaultNumber = vaultArray.length - 1;
  vaultArray[vaultArray.length - 1].buildVault();
};
