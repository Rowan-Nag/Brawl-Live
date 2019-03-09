var canvas = document.getElementById('base');
ctx = canvas.getContext('2d');
WIDTH = canvas.width;
HEIGHT = canvas.height;
ctx.fillRect(0,0,WIDTH,HEIGHT)
var ticks = 0

var keys = {down: 40,
            up: 38,
            left: 37,
            right: 39,
            jump: 32,
            a:65,
            s:83,
            d:68,
            q: 81,
            w: 87,
            e: 69,
            r: 82,},
    keysDown = {},
    frameRate = 1/60,
    frameDelay = frameRate*1000

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);


var requestInterval = function (fn, delay) {
  var requestAnimFrame = (function () {
    return window.requestAnimationFrame || function (callback, element) {
      window.setTimeout(callback,  frameDelay);
    };
  })(),
      start = new Date().getTime(),
      handle = {};
  function loop() {
    handle.value = requestAnimFrame(loop);
    var current = new Date().getTime(),
        delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
  }
  handle.value = requestAnimFrame(loop);
  return handle;
};


class Tile{
  constructor(x, y, width, height, type, collision){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = document.getElementById(type);
    this.collision = collision;
  }
}





class Player{
  constructor(img){
    this.image = document.getElementById(img)
    this.x = WIDTH/2;
    this.y = HEIGHT/2;
    this.speed = 4
    this.facing = 0
    this.width = 50
    this.height =50
  }

  draw(x, y){
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(this.image,0, 128*this.frameX, 128, 128, x, y, this.width, this.height);

  }
  incrementFrame(numFrames, delayAmount) {
    if (this.delay < delayAmount) {
      this.delay += 1;
    } else {
      if (this.frameX < numFrames ) {
        this.frameX += 1;
      } else {
        this.frameX = 0;
        this.delay = 0;
      }
    }
  }

  move(){
    let xTemp = this.x+0, yTemp = this.y+0

    if(keys.a in keysDown){
      this.x -= this.speed
      this.image = document.getElementById("p1Left")
      if(ticks%5===0){
        this.incrementFrame()
      }
    }
    if(keys.d in keysDown){
      this.x += this.speed
      this.image = document.getElementById("p1Right")
    }
    if(keys.w in keysDown){
      this.y -= this.speed
      this.image = document.getElementById("p1Up")
    }
    if(keys.s in keysDown){
      this.y += this.speed
      this.image = document.getElementById("p1Down")
    }
    this.facing = Math.atan2(this.y-yTemp, this.x-xTemp)


    if(this.x < 0){
      this.x = 0
    }
    if(this.y < 0){
      this.y = 0
    }

    if(this.y > (game.map[0].length-1)*game.tileSize){

      this.y = (game.map[0].length-1)*game.tileSize
    }
    if(this.x > (game.map.length-1)*game.tileSize){
      this.x = (game.map.length-1)*game.tileSize
    }

    if(this.x > WIDTH/2 && this.x < game.tileSize*game.map.length-WIDTH/2){
      game.cameraX = this.x
    }
    if(this.y > HEIGHT/2 && this.y < game.tileSize*game.map[0].length-HEIGHT/2){
      game.cameraY = this.y
    }
  }
}

class Game{
  constructor(){
    this.player1 = new Player("p1Idle")
    this.state = 1
    this.map = []
    this.mapAdds = []
    this.sprites = []
    this.cameraX = WIDTH/2
    this.cameraY = HEIGHT/2
    this.tileSize = 50
  }
  setup(){
    this.genNewMap(10, 10);
    setInterval(this.player1.incrementFrame(1,2), 100);
  }
  drawMap(){
    ctx.imageSmoothingEnabled = false
    let cameraMinX = Math.floor((this.cameraX-WIDTH/2)/this.tileSize);
    let cameraMinY = Math.floor((this.cameraY-WIDTH/2)/this.tileSize);

    for(let i = cameraMinX; i < Math.min(this.map.length, cameraMinX+this.tileSize+1); i++){
      for(let j = cameraMinY; j < Math.min(this.map[i].length, cameraMinY+this.tileSize+1); j++){
        ctx.drawImage(this.map[i][j].image, this.map[i][j].x-this.cameraX+WIDTH/2, this.map[i][j].y-this.cameraY+HEIGHT/2, this.tileSize, this.tileSize)
      }
    }
  }
  genNewMap(w, h){
    let a = [];

    for(let i = 0; i< w; i++){
      let b = [];

      for(let j = 0; j<h; j++){
        b.push(new Tile(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize,'floor'))


      }
      a.push(b)

    }

    this.map = a
  }
  listToMap(tiles){
    let a = 0, b = 0
    for(let i = 0; i < tiles.length; i++){
      for(let j = 0; j < tiles[i].length; j++){
          switch(tiles[j][i]){
            //Tile Class: X, Y, Width, Height, Type (same as image id in html)
            case 0:
            b.push(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'floor')
          }
      }
    }
  }


  drawSprites(){
    for(let i = 0; i < this.sprites.length; i++){
      this.sprites[i].draw();
    }
    this.player1.draw(this.player1.x-this.cameraX+WIDTH/2, this.player1.y-this.cameraY+HEIGHT/2)
  }

  stateEngine(){
    switch(this.state){
      case 0:
        break;
      case 1:
        this.player1.move()
        this.drawMap();
        this.drawSprites();
    }
  }

}

var game = new Game();
game.setup();
function update(){
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  game.stateEngine()
}
function updateTicks(){
  console.log(ticks)
  ticks += 1
}
var tickCount = setInterval(updateTicks, 100)
requestInterval(update, frameDelay)
