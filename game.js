var canvas = document.getElementById('base');
var context = canvas.getContext("2d");
ctx = canvas.getContext('2d');
WIDTH = canvas.width;
HEIGHT = canvas.height;
ctx.fillRect(0,0,WIDTH,HEIGHT)
var ticks = 0
var mouseX = 0
var mouseY = 0


window.addEventListener('mousemove', initiatePos, false);

function initiatePos(e) {
    var pos = getMousePos(canvas, e);
}

function getMousePos(canvas, evt){
	var rect = canvas.getBoundingClientRect();
    
        mouseX = ((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width)
        mouseY = ((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
	
		
  }


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

var peer = new Peer;
var peerId, conn, connections = [];
peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
  peerId = id
});
peer.on('connection', function(conn){
  console.log('hosting ', conn.id)
  connections.push(conn)
  conn.on('data', function(data) {
    console.log('recieved ', data, ' from ', conn.id)
  });
})


function connectToId(id){
  return peer.connect(id)
}


function collision(a, b){
  return (a.x < b.x + b.width &&
   a.x + a.width > b.x &&
   a.y < b.y + b.height &&
   a.y + a.height > b.y)
}
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
  constructor(img, basicAttackImg){
	this.basicAttackImg = document.getElementById(basicAttackImg)
    this.image = document.getElementById(img)
    this.x = WIDTH/2;
    this.y = HEIGHT/2;
    this.speed = 4
    this.facing = 0
    this.width = 32
    this.height = 42
    this.frameX = 0
	  
	this.basicAttackX = 0
	this.basicAttackDelay = 0
	this.angle = 0
	  
	this.delay = 0
    this.effects = {
      walking:true,
    }
  }

  draw(x, y){
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(this.image,32*this.frameX, 0, 32, 42, x, y, this.width, this.height);

  }
	
  incrementFrame(numFrames) {
    this.frameX += 1
    if(this.frameX >= numFrames){
      this.frameX -= numFrames
    }
  }

  move(){
    let xTemp = this.x+0, yTemp = this.y+0

    if(keys.a in keysDown){
      this.x -= this.speed
      this.image = document.getElementById("p1Left")

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
    let dy = this.y-yTemp
    let dx = this.x-xTemp
    if(dy == 0 && dx == 0){
      this.effects.walking = false
    }else{
      this.effects.walking = true
    }
    this.facing = Math.atan2(this.y-yTemp, this.x-xTemp)
    for(let i = 0; i <game.mapCollision.length; i++){
      if(collision({x:this.x,y:this.y-dy,width:this.width,height:this.height}, game.mapCollision[i])){
        if(dx < 0){
          this.x = game.mapCollision[i].x+game.mapCollision[i].width+2;}
        if(dx > 0){
          this.x = game.mapCollision[i].x-this.width-2}
        console.log('collide horizontally')
      }
      if(collision({x:this.x-dx,y:this.y,width:this.width,height:this.height}, game.mapCollision[i])){
        if(dy < 0){
          this.y = game.mapCollision[i].y+game.mapCollision[i].height+2;}
        if(dy > 0){
          this.y = game.mapCollision[i].y-this.height-2}
        console.log('collide vertically')
      }

    }

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
	 
  basicAttack(){
	  

	  
	  if(keys.q in keysDown){
		  console.log(this.x)
		  ctx.translate(this.x + 16, this.y + 24);
		  
		  ctx.rotate( this.angle * Math.PI / 180)

		  ctx.translate( - (((this.x + this.x + 40) / 2) + 0 ), - (((this.y + this.y + 40)/2) + 20));
		  ctx.drawImage(this.basicAttackImg, (64*this.basicAttackX) + 16, 0, 40, 32, this.x, this.y, this.width + 16, this.height + 16)
		  
		  ctx.setTransform(1, 0, 0, 1, 0, 0);
		  
	  if (this.basicAttackDelay < 1) {
		  this.basicAttackDelay += 1;
		} else {
		  if (this.basicAttackX < 7 ) {
			this.basicAttackX += 1;
		  } else {
			this.basicAttackX = 0; 
		  }
			this.basicAttackDelay = 0
		}
		  

	  
  }
}
	
  mouseAngle(){
	  
	 this.angle = (-((Math.atan2(this.x - mouseX, this.y - mouseY)*180) / 2))/1.5
	  
	  
	  
	  
	
  }
}


class Game{
  constructor(){
    this.player1 = new Player("p1Idle", "playerOneBasicAttack")
    this.state = 1
    this.map = []
    this.mapAdds = []
    this.mapCollision = []
    this.sprites = []
    this.cameraX = WIDTH/2
    this.cameraY = HEIGHT/2
    this.tileSize = 50
  }
  setup(){
    //this.genNewMap(10, 10);
	  this.map = this.listToMap(MAPS[1].tiles)
    this.mapAdds = this.listToMap(MAPS[1].adds)
    this.mapCollision = this.renderCollision(MAPS[1].collision)


  }
  drawMap(map){
    ctx.imageSmoothingEnabled = false

    let cameraMinX = Math.floor((this.cameraX-WIDTH/2)/this.tileSize);
    let cameraMinY = Math.floor((this.cameraY-WIDTH/2)/this.tileSize);


    for(let i = cameraMinX; i < Math.min(map.length, cameraMinX+this.tileSize+1); i++){
      for(let j = cameraMinY; j < Math.min(map[i].length, cameraMinY+this.tileSize+1); j++){
        ctx.drawImage(map[i][j].image, map[i][j].x-this.cameraX+WIDTH/2, map[i][j].y-this.cameraY+HEIGHT/2, this.tileSize, this.tileSize)
      }
    }
  }
  renderCollision(tiles){

    let collideable = false,b = []
    for(let i = 0; i < tiles.length; i++){
	    let c = [];



      for(let j = 0; j < tiles[i].length; j++){

        if(tiles[i][j]===1){
          collideable = true
				  c.push(new Tile(j*this.tileSize/2, i*this.tileSize/2, this.tileSize/2, this.tileSize/2, 'floor', 1))


        }else{
          if(c.length > 0){
          b.push(new Tile(c[0].x, i*this.tileSize/2, c[c.length-1].x-c[0].x+this.tileSize/2, this.tileSize/2))
        }
          c = []
          collideable = false
        }
      if(collideable){
        b.push(new Tile(c[0].x, i*this.tileSize/2, c[c.length-1].x-c[0].x+this.tileSize/2, this.tileSize/2))
      }
      }

    }

    return b

  }
	
  genNewMap(w, h){
    let a = [];

    for(let i = 0; i< w; i++){
      let b = [];

      for(let j = 0; j<h; j++){
        b.push(new Tile(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize,'floor', 0))




      }
      a.push(b)

    }

    this.map = a
  }

  listToMap(tiles){
    console.log(tiles)
    let target = []
    for(let i = 0; i < tiles.length; i++){
	    let b = [];
      for(let j = 0; j < tiles[i].length; j++){
          switch(tiles[i][j]){
            //Tile Class: X, Y, Width, Height, Type (same as image id in html)



			  case 0:
				  break;

			  case 1:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'floor', 0))
			  	break;

			  case 2:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'rightRockWall', 0))
			  	break;

			  case 3:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'leftRockWall', 0))
			  	break;

			  case 4:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'frontRockWall', 0))
			  	break;

			  case 5:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'frontLeftRockWall', 0))
			  	break;

			  case 6:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'frontRightRockWall', 0))
			  	break;

			  case 7:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'topGrass', 0))
			  	break;

			  case 8:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'bottomGrass', 0))
			  	break;

			  case 9:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'leftGrass', 0))
			  	break;

			  case 10:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'rightGrass', 0))
			  	break;

			  case 11:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'topRightGrass', 0))
			  	break;

			  case 12:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'topLeftGrass', 0))
			  	break;

			  case 13:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'bottomRightGrass', 0))
			  	break;

			  case 14:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'bottomLeftGrass', 0))
			  	break;

			  case 15:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'grass', 0))
			  	break;




			  }

      }
    target.push(b)
    }

  return target
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
		this.player1.mouseAngle()
        this.player1.move()
        this.drawMap(this.map);
        this.drawMap(this.mapAdds);
        this.drawMap(this.mapCollision)
        this.drawSprites();
		this.player1.basicAttack()
		
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

  ticks += 1
  if(game.player1.effects.walking && ticks%2 ==0){
    game.player1.incrementFrame(2)
  }
}

var tickCount = setInterval(updateTicks, 100)
requestInterval(update, frameDelay)
