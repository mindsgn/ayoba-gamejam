var sound = new Audio("./assets/back.wav");
sound.loop = true;

document.getElementById("btnPlay").addEventListener("click", function () {
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "flex";
  sound.play();
});

let timeLeft = 30;

function countdown() {
  if (timeLeft === 0) {
    gameover();
  }

  document.getElementById("timer").innerHTML = timeLeft + " seconds remaining";

  timeLeft--;

  setTimeout(countdown, 1000);
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var camerax,
  cameray = 0;
var mapWidth, mapHeight;
var level = 0;
var lives = 3;
var levels = [
  [
    "x                                       x",
    "x                                       x",
    "x                                       x",
    "x                                       x",
    "x                                       x",
    "x                                       x",
    "x                                       x",
    "x                                       x",
    "x                                       x",
    "x   o                                 O x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  ],
  [
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x   o          e                       O x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  ],
  [
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x               O                        x",
    "x              xxx                xx     x",
    "x                   xxx                  x",
    "x                       xxxxx            x",
    "x   o          xxx             xxx       x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  ],
  [
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                O              e        x",
    "x   o          xxx             xxx       x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  ],
  [
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x   xxx                o                 x",
    "x                     xxx                x",
    "x                               e        x",
    "x   o          xxx             xxx       x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  ],
  [
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x    e                                   x",
    "x   xxx                                  x",
    "x                                        x",
    "x                               O        x",
    "x   o          xxx             xxx       x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  ],
  [
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x                                        x",
    "x     e                                  x",
    "x   xxx                                 Ox",
    "x                                      xxx",
    "x                                   xxxxxx",
    "x   o          xxx             xxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  ],
];

var player, blocks, projs, enemies, end, eblocks;

function reset() {
  countdown();
  timeLeft = 30;
  if (lives < 0) {
    lives = 0;
    level = 0;
  }
  this.map = levels[level];
  if (this.map == null) {
    level = 0;
    this.map = levels[level];
  }
  blocks = [];
  projs = [];
  enemies = [];
  eblocks = [];
  mapWidth = this.map[0].split("").length * 32;
  mapHeight = this.map.length * 32;
  end = player = null;
  for (i = 0; i < this.map.length; i++) {
    for (i1 = 0; i1 < this.map[i].split("").length; i1++) {
      if (this.map[i].split("")[i1] == "x") {
        new Block(i1 * 32, i * 32, "regular");
      }
      if (this.map[i].split("")[i1] == "o") {
        new Player(i1 * 32, i * 32);
      }
      if (this.map[i].split("")[i1] == "e") {
        new Enemy(i1 * 32, i * 32);
        new Block(i1 * 32, i * 32, "enemy");
      }
      if (this.map[i].split("")[i1] == "O") {
        new End(i1 * 32, i * 32);
      }
      if (this.map[i].split("")[i1] == "X") {
        new Block(i1 * 32, i * 32, "enemy");
      }
    }
  }
}

reset();

function collision(rect1, rect2) {
  if (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y
  ) {
    return true;
  }
  return false;
}

function Player(x, y) {
  player = this;
  this.x = x;
  this.y = y;
  this.width = 32;
  this.height = 32;
  this.xvel = 0;
  this.yvel = 8;
  this.onGround = false;
  this.update = function () {
    if (this.yvel < 12) {
      this.yvel += 1;
    }
    if (keysDown[32] && this.onGround) {
      this.yvel = -16;
      keysDown[32] = false;
    }
    if (keysDown[65]) {
      this.xvel = -8;
    } else if (keysDown[68]) {
      this.xvel = 8;
    } else {
      this.xvel = 0;
    }
    if (this.y > mapHeight) {
      lives = lives - 1;
      reset();
    }
    this.onGround = false;
    this.x += this.xvel;
    this.collide(this.xvel, 0);
    this.y += this.yvel;
    this.collide(0, this.yvel);

    if (collision(this, end)) {
      level += 1;
      reset();
    }
  };
  this.render = function () {
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(this.x - camerax, this.y - cameray, this.width, this.height);
  };
  this.collide = function (xvel, yvel) {
    for (i = 0; i < blocks.length; i++) {
      if (collision(this, blocks[i])) {
        if (xvel > 0) {
          this.x = blocks[i].x - this.width;
        }
        if (xvel < 0) {
          this.x = blocks[i].x + blocks[i].width;
        }
        if (yvel > 0) {
          this.y = blocks[i].y - this.height;
          this.onGround = true;
        }
        if (yvel < 0) {
          this.y = blocks[i].y + blocks[i].height;
        }
      }
    }
    for (i = 0; i < projs.length; i++) {
      if (collision(this, projs[i])) {
        lives = lives - 1;
        reset();
      }
    }
  };
}

function Block(x, y, type) {
  blocks.push(this);
  if (type == "enemy") {
    eblocks.push(this);
  }
  this.x = x;
  this.y = y;
  this.width = 32;
  this.height = 32;
  this.type = type;
  this.enemy = null;
  this.render = function () {
    if (this.type == "enemy") {
      ctx.strokeStyle = "#7f7f7f";
      ctx.strokeRect(
        this.x - camerax,
        this.y - cameray,
        this.width,
        this.height
      );
    } else if (this.type == "regular") {
      ctx.fillStyle = "#7f7f7f";
      ctx.fillRect(this.x - camerax, this.y - cameray, this.width, this.height);
    }
  };
}

function Projectile(start, target, type) {
  projs.push(this);
  this.x = start.x;
  this.y = start.y;
  this.width = 10;
  this.height = 10;
  this.speed = 4;
  this.type = type;
  this.angle = Math.atan2(target.x - start.x, target.y - start.y);
  this.sin = Math.sin(this.angle) * this.speed;
  this.cos = Math.cos(this.angle) * this.speed;
  this.update = function () {
    if (this.type == "follow") {
      this.angle = Math.atan2(target.x - this.x, target.y - this.y);
      this.sin = Math.sin(this.angle) * this.speed;
      this.cos = Math.cos(this.angle) * this.speed;
      this.speed = 4;
      this.width = this.height = 15;
    }
    this.x += this.sin;
    this.y += this.cos;
  };
  this.render = function () {
    ctx.fillStyle = "Orange";
    if (this.type == "follow") {
      ctx.fillStyle = "Red";
    }
    ctx.fillRect(this.x - camerax, this.y - cameray, this.width, this.height);
  };
}

function Enemy(x, y) {
  enemies.push(this);
  this.x = x;
  this.y = y;
  this.width = 32;
  this.height = 32;
  this.shootCount = 0;
  this.speed = 12;
  this.target = null;
  this.update = function () {
    this.shootCount += 1;
    if (
      this.shootCount > 60 &&
      this.x - camerax >= 0 &&
      this.x - camerax <= canvas.width
    ) {
      new Projectile(this, player, "direct");
      this.shootCount = 0;
    }
  };
  this.move = function (block) {};
  this.render = function () {
    ctx.fillStyle = "Orange";
    ctx.fillRect(this.x - camerax, this.y - cameray, this.width, this.height);
  };
}

function End(x, y) {
  end = this;
  this.x = x;
  this.y = y;
  this.width = 32;
  this.height = 32;
  this.render = function () {
    ctx.fillStyle = "Lime";
    ctx.fillRect(this.x - camerax, this.y - cameray, this.width, this.height);
  };
}

function gameover() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("gameover").style.display = "flex";
}

var keysDown = {};
addEventListener(
  "keydown",
  function (e) {
    keysDown[e.keyCode] = true;
  },
  false
);
addEventListener(
  "keyup",
  function (e) {
    keysDown[e.keyCode] = false;
  },
  false
);

function update() {
  camerax = player.x + player.width / 2 - canvas.width / 2;
  cameray = player.y + player.height / 2 - canvas.height / 2;
  if (camerax < 0) {
    camerax = 0;
  }
  if (camerax > mapWidth - canvas.width) {
    camerax = mapWidth - canvas.width;
  }
  if (cameray < 0) {
    cameray = 0;
  }
  if (cameray > mapHeight - canvas.height) {
    cameray = mapHeight - canvas.height;
  }
  player.update();
  for (i = 0; i < projs.length; i++) {
    projs[i].update();
  }
  for (i = 0; i < enemies.length; i++) {
    enemies[i].update();
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (i = 0; i < blocks.length; i++) {
    blocks[i].render();
  }
  for (i = 0; i < projs.length; i++) {
    projs[i].render();
  }
  for (i = 0; i < enemies.length; i++) {
    enemies[i].render();
  }
  player.render();
  end.render();
}

function main() {
  update();
  render();
  requestAnimationFrame(main);
}

var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

main();
