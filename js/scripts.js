var keys = 99;
var batteries = 0;
var flashlightPower = 100;
var flashlightMeter = "";
var flashlightState = "superlit";
var sanity = 100;
var sanityMeter= "";
var vaultArray = [];
var currentVault = 0;
var inVault = false;
var levelArray = [];
var currentLevel = 0;
var currentExpo;

function drawHUD(expoOutput) {
  // var xCoord = vaultArray[currentVault].playerX
  // var yCoord = vaultArray[currentVault].playerY
  //
  if(expoOutput){
    $("#log").append("<li class='lit' id='expo'>" + expoOutput + "</li>");
  }
  // $("#HUD_con").append("<span> The light here is " + vaultArray[currentVault].floor[yCoord][xCoord].lightLevel + ".</span><br><br>");
  $("#items").text("Keys: " + keys + " Batteries: " + batteries);
  // $("#HUD_con").text("<span class = 'visible'>Batteries: " + batteries + "</span><br><br>");

  flashlightMeter = "";
  for(var i = 1; i <= flashlightPower/5; ++i){
    flashlightMeter += "/";
  }

  $("#HUD_con").text("<span id='HUD_flashlight'>Flashlight:</span><span id='HUD_flashlight_meter'> " + flashlightMeter + "</span><br><br>");

  if(flashlightPower/5 <=4){
    $("#HUD_flashlight_meter").css("color", "red");
  }else{
    $("#HUD_flashlight_meter").css("color", "#00e600");
  }

  if(flashlightState === "on"){
    $("#HUD_flashlight").css("color", "#00e600");
  }else if(flashlightState === "high"){
    $("#HUD_flashlight").css("color", "white");
  }else {
    $("#HUD_flashlight").css("color", "green");
  }

  sanityMeter = "";
  for(var i = 1; i <= sanity/5; ++i){
    sanityMeter += "/";
  }

  $("#HUD_con").text("Sanity: " + sanityMeter);

  if(sanity/5 <=4){
    $("#HUD_sanity_output").css("color", "red");
  }else{
    $("#HUD_sanity_output").css("color", "#00e600");
  }
}

function updateFlashlight() {
  if(flashlightState === "on"){
    flashlightPower -= 1;
    console.log("Flashlight -1");
  }else if(flashlightState === "high"){
    flashlightPower -= 2;
    console.log("Flashlight -2");
  }

  if(flashlightPower <= 0 && batteries > 0){
    batteries -=1;
    flashlightPower = 100;
  }else if(flashlightPower < 0 && batteries === 0){
    flashlightPower = 0;
    flashlightState = "off";
  }
}

// Links keyboard input with actions: currently just movement
function turnLogic(event){

  currentExpo = "";
  // Flashlight Power Settings
  if(event.keyCode === 115 && flashlightState === "off" && flashlightPower > 0){
    flashlightState = "lit";
    console.log("lit")
  }else if(event.keyCode === 115 && flashlightState === "lit" && flashlightPower > 0){
    flashlightState = "superlit";
    console.log("superlit")
  }else if(event.keyCode === 115){
    flashlightState = "off";
    console.log("off")
  }

  if(inVault){
    if (event.keyCode === 119){
      vaultArray[currentVault].movePlayer("n");
    } else if (event.keyCode === 97){
      vaultArray[currentVault].movePlayer("w");
    } else if (event.keyCode === 100){
      vaultArray[currentVault].movePlayer("e");
    } else if (event.keyCode === 120){
      vaultArray[currentVault].movePlayer("s");
    }
    updateFlashlight();
    vaultArray[currentVault].updateSanity();
    vaultArray[currentVault].drawVault();
  }else{
    if (event.keyCode === 119){
      levelArray[currentLevel].currentDirection = "n";
      levelArray[currentLevel].playerMovement(-1, 0);
    } else if (event.keyCode === 97){
      levelArray[currentLevel].currentDirection = "w";
      levelArray[currentLevel].playerMovement(0, -1);
    } else if (event.keyCode === 100){
      levelArray[currentLevel].currentDirection = "e";
      levelArray[currentLevel].playerMovement(0, 1);
    } else if (event.keyCode === 120){
      levelArray[currentLevel].currentDirection = "s";
      levelArray[currentLevel].playerMovement(1, 0);
    }else if (event.keyCode === 113){
      levelArray[currentLevel].currentDirection = "nw";
      levelArray[currentLevel].playerMovement(-1, -1);
    }else if (event.keyCode === 101){
      levelArray[currentLevel].currentDirection = "ne";
      levelArray[currentLevel].playerMovement(-1, 1);
    }else if (event.keyCode === 122){
      levelArray[currentLevel].currentDirection = "sw";
      levelArray[currentLevel].playerMovement(1, -1);
    }else if (event.keyCode === 99){
      levelArray[currentLevel].currentDirection = "se";
      levelArray[currentLevel].playerMovement(1, 1);
    }
  }

  // Draw HUD
  drawHUD(currentExpo);

  // Shadow Movement
  for (var i = 0; i < levelArray[currentLevel].shadowsArray.length; ++i) {
    levelArray[currentLevel].shadowsArray[i].shadowMovement();
  }

  // Draw Player Sight
  levelArray[currentLevel].checkSight();
  levelArray[currentLevel].drawMap();

};



// Always active keyboard input
window.addEventListener("keypress", turnLogic, false);

// Calls map creation
window.onload = function () {

  //(xAxis, yAxis, complexity, hallLengthMin, hallLengthMax, sightLength)
  // levelArray[0] = new Level(100, 100, 50, 10, 21, 10);

  levelArray = initializeLevel(levelArray);
  levelArray[currentLevel].createLevel();
};
