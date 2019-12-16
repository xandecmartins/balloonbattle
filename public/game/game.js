function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function Game(){

  this.soundMap = {
      'normal': new Audio('balloon-pop-sound-effect.mp3'),
      'special': new Audio('cash-register-kaching-sound-effect-hd.mp3'),
      'surprise_good': new Audio('cash-register-kaching-sound-effect-hd.mp3'),
      'surprise_bad': new Audio('explosion-sound-effect.mp3')

  };

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDj_qwUrYCUsEstUJE9wo2ZpuLD_1LGjVY",
    authDomain: "balloon-battle.firebaseapp.com",
    databaseURL: "https://balloon-battle.firebaseio.com",
    projectId: "balloon-battle",
    storageBucket: "balloon-battle.appspot.com",
    messagingSenderId: "20012671944",
    appId: "1:20012671944:web:751a2fb4a307a7e04196fd"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  this.database = firebase.firestore();
  this.name = null;
  this.id = null;
  this.isPaused = true;
  this.score = null;
  this.speed = null;
  this.balloonSize = null;
  this.balloonInitialWidth = null;
  this.balloonInitialHeight = null;
  this.density = null;
  this.remainingLives = 5;
  this.playElement = document.getElementById('start-btn');
  this.scoreElement = document.getElementById('score-container');
  this.nameElement = document.getElementById('name-container');
  this.livesElement = document.getElementById('lives-container');
  this.canvasElement = document.getElementById('canvas');
  this.timer = null;
  this.startedTime = null; //time from start game
  this.intervalId = null;
  this.updateTime = null;
  this.densityStep = null;
  this.balloonsArray = null;
  var thiz = this;
  this.updater = function(){
    thiz.updateGame();
  };
}
Game.prototype.startGame = function(){
  this.playElement.style.display = "none";
  this.intervalId = setInterval(this.updater, this.updateTime);
  var back = new Audio('top-gear-soundtrack-track-1.mp3');
  back.loop = true;
  back.play();

};
Game.prototype.pauseGame = function(){
  clearInterval(this.intervalId);
};
Game.prototype.updateScore = function(score, type){
  this.scoreElem.innerHTML = score;
  this.database.collection("players").doc(this.id).update({
    score: score
  });
  this.soundMap[type].play();
};

Game.prototype.updateName = function(name){
  this.nameElem.innerHTML = name;
};

Game.prototype.buildBalloon = function(color, type, points){
  var tempBalloon = new Balloon(0, -this.adjustedHeight, color, type, points);
  tempBalloon.positionX = tempBalloon.generateRandomXPos();
  //console.log(tempBalloon.positionX);
  var el = document.createElement('div');
  el.className = 'balloon '+ tempBalloon.color;
  el.style.left = tempBalloon.positionX+'px';
  el.style.bottom = tempBalloon.positionY+'px';
  el.style.backgroundSize= '100% 100%';
  el.style.width = this.adjustedWidth+'px';
  el.style.height = this.adjustedHeight+'px';
  var thiz = this;
  el.onclick = function(){
    thiz.score += points;
    thiz.updateScore(thiz.score, type);
    this.parentNode.removeChild(el);
  };
  this.canvasElement.appendChild(el);
  var tempObj = {};
  tempObj.el = el;
  tempObj.speed = tempBalloon.getRandomSpeed();
  tempObj.points = tempBalloon.points;
  return tempObj;
};

Game.prototype.updateGame = function(){
  this.densityStep += this.density;
  if(this.densityStep >= 1 && this.balloonsArray.length < this.maxBalloon)
  {
    for(var i = 0; i < parseInt(this.densityStep, 10); i++)
    {
      this.balloonsArray.push(this.buildBalloon( 'green', 'normal',150));
      //console.log(tempObj.speed);
    }

    this.densityStep = 0;
  }
  for(var i = 0; i < this.balloonsArray.length; i++)
  {
    this.balloonsArray[i].el.style.bottom = (parseInt(this.balloonsArray[i].el.style.bottom, 10)+(3+this.balloonsArray[i].speed))+'px';
  }
};
Game.prototype.endGame = function(){

};
Game.prototype.initGame = function(){

  this.isPaused = true;
  this.isSpecialBalloonEnable = true;
  this.isSurpriseBalloonEnable = true;
  this.score = 0;
  this.speed = 0.01;
  this.balloonSize = 1;
  this.balloonInitialWidth = 40;
  this.balloonInitialHeight = 53;
  this.adjustedHeight = this.balloonInitialHeight*this.balloonSize;
  this.adjustedWidth = this.balloonInitialWidth*this.balloonSize;
  this.density = 1000/4000;
  this.updateTime = 50;
  this.densityStep = 1;
  this.maxBalloon = 500;
  this.balloonsArray = [];
  this.scoreElem = document.getElementById('score-count');
  this.nameElem = document.getElementById('name-show');

  if(this.isSpecialBalloonEnable){
    this.balloonsArray.push(this.buildBalloon( 'special', 'special', 300));
  }

  if(this.isSurpriseBalloonEnable){
    ;
    let luckyFactor = Math.floor(Math.random() * 10)%2==0?1:-1;
    this.balloonsArray.push(this.buildBalloon( 'surprise', luckyFactor>0?'surprise_good':'surprise_bad',400*luckyFactor));
  }

};
function Balloon(x, y, color, points){
  this.positionX = x;
  this.positionY = y;
  this.color = color;
  this.points = points;
}
Balloon.prototype.getRandomSpeed = function(){
  return Math.floor(Math.random() * 201)/100;
};
Balloon.prototype.generateRandomXPos = function(){
  //console.log('document width = ', Math.floor(Math.random() * 450));
  return Math.floor(Math.random() * 450);
};

window.addEventListener('load',function(){

  var a = new Game();
  a.initGame();
  document.getElementById('start-btn').onclick = function(){
    document.getElementById("modal").style.display = "none";
    document.getElementById("modal-content").style.display = "none";
    a.name = document.getElementById("name").value;
    a.updateName(a.name);
    a.id = createUUID();
    a.database.collection("players").doc(a.id).set({
      name: a.name,
      id: a.id,
      score: 0
    })
      .then(function() {
        a.startGame();
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });

  };
});
