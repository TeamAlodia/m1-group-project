var bgm = new Audio("media/bgm.mp3");
bgm.loop = true;
var sfx = [
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
new Audio("media/vo_normal_item_2.mp3"),
new Audio("media/shadow_dealdamage.mp3"),
new Audio("media/shadow_dissolve.mp3"),
new Audio("media/shadow_takedamage.mp3")
];

function playSound(newSoundID) {
  sfx.forEach(function(fx) {
    if (newSoundID < 15 && !fx.ended) {
      fx.pause();
      fx.currentTime = 0;
    }
  });
  sfx[newSoundID].play();
}

function playRandomItemSound() {
  var index = Math.floor(Math.random() * 3) + 3;
  playSound(sfx.length - index);
}

// .play();
// .pause();
// .loop() = true;
// .volume = (more than or less than 1);
