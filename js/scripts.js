var keys = 0;
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
var winState;

function drawHUD(expoOutput) {
  if(expoOutput){
    $("#log").text(expoOutput);
  }

  $("#items").text("Keys: " + keys + " | Batteries: " + batteries + " | Level: " + (parseInt(currentLevel) + 1));

  flashlightMeter = "";
  for(var i = 1; i <= flashlightPower/5; ++i){
    flashlightMeter += "/";
  }

  $("#HUD_flashlight").text("Flashlight: " + flashlightMeter);

  if(flashlightPower/5 <=4){
    $("#HUD_flashlight").css("color", "red");
  }else{
    $("#HUD_flashlight").css("color", "#00e600");
  }

  sanityMeter = "";
  for(var i = 1; i <= sanity/5; ++i){
    sanityMeter += "/";
  }

  $("#HUD_sanity").text("Sanity: " + sanityMeter);

  if(sanity/5 <=4){
    $("#HUD_sanity").css("color", "red");
  }else{
    $("#HUD_sanity").css("color", "#00e600");
  }

  $("#helpText").text("Press H for help");
}

function updateFlashlight() {
  if(flashlightState === "on"){
    flashlightPower -= 1;
    console.log("Flashlight -1");
  }else if(flashlightState === "high"){
    flashlightPower -= 2;
    console.log("Flashlight -2");
  }

}

function gameOver(){
  drawHUD("You have succumbed to the Shadows. Press 'spacebar' to restart.");

  if(event.keyCode === 32) {
    location.reload();
  }
}

function gameWin() {
  drawHUD("You escape with your sanity intact. Press 'spacebar' to restart.");

  if(event.keyCode === 32) {
    location.reload();
  }
}

// Links keyboard input with actions: currently just movement
function turnLogic(event){
  if(sanity <= 0){
    gameOver();
    return;
  } else if (winState){
    gameWin();
    return;
  }

  if(event.keyCode === 104 ) {
    $("#help").toggle();
    return;
  }

  currentExpo = "";
  // Flashlight Power Settings
  if(flashlightPower <= 0 && batteries > 0){
    batteries -=1;
    flashlightPower = 100;
  }else if(flashlightPower < 0 && batteries === 0){
    flashlightPower = 0;
    flashlightState = "off";
  }
  if(event.keyCode === 115 && flashlightState === "off" && flashlightPower > 0){
    flashlightState = "lit";
    console.log("lit")
    levelArray[currentLevel].checkSight();
    levelArray[currentLevel].drawMap();
    return
  }else if(event.keyCode === 115 && flashlightState === "lit" && flashlightPower > 0){
    flashlightState = "superlit";
    console.log("superlit")
    levelArray[currentLevel].checkSight();
    levelArray[currentLevel].drawMap();
    return
  }else if(event.keyCode === 115){
    flashlightState = "off";
    levelArray[currentLevel].checkSight();
    levelArray[currentLevel].drawMap();
    console.log("off")
    return
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

  //sanity/battery adjustment (light condition)
  if (flashlightPower <= 0) {
    flashlightState = "off";
    flashlightPower = 0;
    console.log("flashlight out of power");
  }
  if (flashlightState === "superlit"){
    flashlightPower -= 2;
    if (sanity < 100) {
      sanity ++;
      console.log("sanity +1");
    }
    console.log("flashlight -2");
  } else if (flashlightState === "lit") {
    flashlightPower --;
    sanity --;
    console.log("flashlight -1 sanity -1");
  } else {
    sanity -= 2;
    console.log("sanity -2");
  }
  //sanity/battery adjustment (shadow touch)

  // Draw HUD
  console.log('sanity: '+ sanity + 'battery: '+ flashlightPower);
  drawHUD(currentExpo);

  // Shadow Movement
  for (var i = 0; i < levelArray[currentLevel].shadowsArray.length; ++i) {
    levelArray[currentLevel].shadowsArray[i].shadowMovement();
  }


  levelArray[currentLevel].checkSight();
  levelArray[currentLevel].shadowResolution();

  // Draw Player Sight
  levelArray[currentLevel].drawMap();

};

// Always active keyboard input
window.addEventListener("keypress", turnLogic, false);

// Calls map creation
window.onload = function () {
  levelArray = initializeLevel(levelArray);
  drawHUD();
};
