var bgm = new Audio("media/bgm.mp3");
bgm.loop = true;
var voices = [
new Audio("media/vo_intro.mp3"),
new Audio("media/vo_item_0.mp3"),
new Audio("media/vo_item_1.mp3"),
new Audio("media/vo_item_2.mp3"),
new Audio("media/vo_item_3.mp3"),
new Audio("media/vo_item_4.mp3"),
new Audio("media/vo_item_5.mp3"),
new Audio("media/vo_item_6.mp3"),
new Audio("media/vo_item_7.mp3"),
new Audio("media/vo_item_8.mp3"),
new Audio("media/vo_item_9.mp3"),
new Audio("media/vo_item_10.mp3"),
new Audio("media/vo_normal_item_0.mp3"),
new Audio("media/vo_normal_item_1.mp3"),
new Audio("media/vo_normal_item_2.mp3")
];

function playSound(newSoundID) {
  voices.forEach(function(voice) {
    if (!voice.ended) {
      voice.pause();
    }
  });
  voices[newSoundID].play();
}

function playRandomItemSound() {
  var index = Math.floor(Math.random() * 3) + 1;
  playSound(voices.length - index);
}

// .play();
// .pause();
// .loop() = true;
// .volume = (more than or less than 1);
