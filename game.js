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
    frameDelay = frameRate*1000,
    totalMenuButtons = 0,
    mouseDown = false


window.addEventListener('mousemove', initiatePos, false);

function initiatePos(e) {
      var pos = getMousePos(canvas, e);
  }

function getMousePos(canvas, evt){
  	var rect = canvas.getBoundingClientRect();

    mouseX = ((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width)
    mouseY = ((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)


}


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

var mid = document.getElementById('middleP')

var peer = new Peer;
var peerId, mainConn, connections = [], hosting = false, connPosition = -2;


peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
  peerId = id
});


peer.on('connection', function(conn){
  console.log('connected to ', conn.id)
  if(hosting){
    console.log('hosting ', conn.id)
  }
  else if(!hosting){
    console.log('hosted by ', conn.id)

    }
  conn.on('data', function(data){
    //console.log('recieved ', data, ' from ', conn.id)
    switch(data[0]){
    case 0:

		mid.innerHTML=data[1].toString();

		break;

    case 1:
      mainConn=connectToId(data[1])
      mid.innerHTML = "Both Players Have Been Connected!"
      break;

    case 2:
      mainConn.send([4, game.player1.num])
      startGame()
      break;

    case 3:
      game.p2Keys = data[1]
      break;
    case 4:
      this.player2 = new Player(data[1])
      break;
    case 5:
      game.player2.x = data[1][0]
      game.player2.y = data[1][1]
      game.player2.image = data[1][2]


      game.player1.x = data[2][0]
      game.player1.y = data[2][1]
      game.player1.image = data[2][2]
  }
  })
});

function startGame(){

  if(hosting){
    game.switchState(1)
  }else{

    game.switchState(2)
  }
  mainConn.send([4, game.player1.num])


}

function sendData(data, recievers){
  for(let i = 0; i < recievers.length; i++){
    recievers[i].send(data)

  }
}

function connectToId(id){
  let tempConn = peer.connect(id)
  return tempConn
}

function collision(a, b){
  return (a.x < b.x + b.width &&
   a.x + a.width > b.x &&
   a.y < b.y + b.height &&
   a.y + a.height > b.y)
}

function addText(string, x, y, size, color){
  ctx.font = size+"px Arial";
  ctx.fillStyle = color;
  return ctx.strokeText(string, x, y);
}


//Button functions
function hostButton(){
    hosting = true
    console.log('HOSTING')
    mid.innerHTML = "Your ID: " + peerId.toString();
    game.switchMenu(game.menus.host)
}

function joinButton(){
	console.log("JOIN")
	document.getElementById("peerId").style.visibility = "visible";
  hosting = false
    game.switchMenu(game.menus.join)

}

function startButton(){
  if(!game.player2){
    mainConn.send(2)

  }
  else{
	  mid.innerHTML = "No one has connected yet..."
  }
  mainConn.send([2]);
  startGame();
  game.switchState(1)
  mid.innerHTML = ""



}

function readyButton(){

	mainConn.send([1,peerId])
}

function connectButton(){

  console.log("connectButton")

  document.getElementById("peerId").style.visibility = "hidden";

  mainConn = connectToId(document.getElementById('peerId').value)
  mainConn.send([1, peerId])
  console.log(mainConn,mainConn.id, peerId)
  game.switchMenu(game.menus.ping)
  hosting = false
  mid.innerHTML = ""

}

function singlePlayerButton(){
  game.switchState(3)
}

function changeChar(num){

  game.player1 = new Player(num)
  game.switchMenu(game.menus.main)
}

function characterSelect(){
	game.switchMenu(game.menus.charSelect)


}

function howToPlay(){

	game.switchMenu(game.menus.howToPlay)
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

class menuButton{
  constructor(x, y, width, height, text, func, font, size){
    this.x = x;
    this.y = y;
    this.text = document.createTextNode(text);
    this.width = width;
    this.height = height;
    this.func = func;
    this.button = document.createElement('button');
    this.button.appendChild(this.text);
    this.button.style.left = x.toString()+"px";
    this.button.style.bottom = (HEIGHT-y).toString()+"px";
    this.button.style.width = this.width.toString() + "px";
    this.button.style.height = this.height.toString() + "px";
    this.button.classList.add('menuButton')
    this.image = document.getElementById('Nbutton')
    this.buttonNum = totalMenuButtons;
    this.button.onclick=func
    console.log(this.button)
    totalMenuButtons++
    this.deactivate();
    document.getElementById('canvasDiv').appendChild(this.button)
    document.getElementById('canvasDiv').appendChild(document.createElement('p'))
  }
  draw(x, y){
    ctx.drawImage(this.image, x, this.y+5+this.buttonNum*66, this.width, this.height)
  }
  activate(){
    this.button.disabled = false;
    this.button.style.zIndex = 2;
  }
  deactivate(){
    this.button.disabled = true;
    this.button.style.zIndex = -2;
  }

}

class Attack{
  constructor(x, y, rotation, image, size, frames, type){
    this.x = x;//X/Y starting pos
    this.y = y;
    this.size = size; //size scale
    this.rotation = rotation; //rotation in radians
    this.frames = frames; //frames the attack lasts
    this.type = type //type (check attackData in mapData.js)
    this.speed = attackData[type].speed; //speed
    this.moveLock = attackData[type].moveLock //frames you can't move
    this.effects = attackData[type].effects; //effects
    this.properties = attackData[type].properties //other properties
    this.currentFrame = 0; //current frame of animation
    this.image = image
    this.totalFrames = sprites[image].frames; //total frames of the animation
    this.frameX = sprites[image].xs;
    this.frameY = sprites[image].ys;
    this.loop = //sprites[image].loop;
    this.ticksPerFrame = this.frames/this.totalFrames;


  }
  move(){
    if(this.speed > 0){
      this.x += this.speed*Math.cos(this.rotation);
      this.y += this.speed*Math.sin(this.rotation);
    }
  }
  draw(x, y){

    ctx.save();

    ctx.translate(x, y)
    ctx.rotate(this.rotation)
    ctx.translate(-x,-y)
    ctx.drawImage(document.getElementById(this.image), this.frameX*this.currentFrame, 0, this.frameX, this.frameY, x-this.size*this.frameX/2,y-this.size*this.frameY, this.frameX*this.size, this.frameY*this.size)
    //ctx.strokeRect(x-this.frameX/2,y-this.frameY,this.frameX,this.frameY)
    //ctx.stroke();
    ctx.restore();
  }
  incrementFrame(){
    this.currentFrame += 1;
    if(this.currentFrame > this.totalFrames){
      if(this.loop){
        this.currentFrame = 0;
      }else{
        this.currentFrame -=1
      }
    }
  }

}

class Player{
  constructor(num){
    this.num = num
    this.attacks = {};
    this.basicAttackImg = playerData.images[num].attack
    this.image = playerData.images[num].down
    this.x = WIDTH/2;
    this.y = HEIGHT/2;
    this.speed = 4;
    this.facing = 0;
    this.width = 32;
    this.height = 42;
    this.frameX = 0;
    this.activeAttacks = [];

    this.downImg=playerData.images[num].down
    this.upImg=playerData.images[num].up
    this.leftImg=playerData.images[num].left
    this.rightImg=playerData.images[num].right
    this.attackImg= playerData.images[num].attack
    console.log(this.downImg, 500)


    this.basicAttackX = 0

    this.basicAttackDelay = 0
    this.angle = 0

    this.delay = 0

    this.effects = {
      walking:true,
      "moveLock":0,
    }

    this.cooldowns = ["moveLock"]
  }

  draw(x, y){
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(document.getElementById(this.image),32*this.frameX, 0, 32, 42, x, y, this.width, this.height);

  }
  incrementFrame(numFrames) {
    this.frameX += 1
    if(this.frameX >= numFrames){
      this.frameX -= numFrames
    }
  }

  basicAttack(){



	  if(keys.q in keysDown){
		  console.log(this.x)
		  ctx.translate(this.x + 16, this.y + 24);

		  ctx.rotate(-this.angle)

		  ctx.translate( - (((this.x + this.x + 40) / 2) + 0 ), - (((this.y + this.y + 40)/2) + 20));
		  ctx.drawImage(document.getElementById(this.basicAttackImg), (64*this.basicAttackX) + 16, 20, 64, 64, this.x, this.y, this.width + 32, this.height + 32)

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

  reduceCooldowns(){
    for(let i = 0; i < this.cooldowns.length; i++){

      this.effects[this.cooldowns[i]] -= 1;
    }
  }
  mouseAngle(){

	 this.angle = Math.atan2(this.x+this.width/2 - mouseX, this.y+this.height/2 - mouseY)


  }

  move(keyList){
    let xTemp = this.x+0, yTemp = this.y+0

    if(mouseDown){
      this.activeAttacks.push(new Attack(this.x+this.width/2, this.y+this.height/2, -this.angle, this.attackImg,1.3, 1, "melee1"))
      this.effects["moveLock"] = this.activeAttacks[this.activeAttacks.length-1].moveLock;
      game.attacks.push(this.activeAttacks[this.activeAttacks.length-1])
    }


    if(keys.a in keyList){
      this.x -= this.speed
      this.image = this.leftImg

    }

    if(keys.d in keyList){
      this.x += this.speed
      this.image = this.rightImg
    }

    if(keys.w in keyList){
      this.y -= this.speed
      this.image = this.upImg
    }

    if(keys.s in keyList){
      this.y += this.speed
      this.image = this.downImg
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

}

class Game{
  constructor(){
    this.player1 = new Player(1)
    this.player2 = new Player(1);
    this.p2Keys = {};
    this.state = 0;
    this.attacks = [];
    this.map = [];
    this.mapAdds = [];
    this.mapCollision = [];
    this.sprites = [];
    this.cameraX = WIDTH/2;
    this.cameraY = HEIGHT/2;
    this.tileSize = 50;
    this.menus = {};
    this.currentMenu = [];
  }
  setup(){
    //this.genNewMap(10, 10);
	  this.map = this.listToMap(MAPS[1].tiles)
    this.mapAdds = this.listToMap(MAPS[1].adds)
    this.mapCollision = this.renderCollision(MAPS[1].collision)
    this.genMenus();
    this.currentMenu = this.menus.main
    this.switchMenu(this.currentMenu);

  }

  genMenus(){
    //x, y, width, height, text, func, font, size
    this.menus ={
      main:[new menuButton(WIDTH/2-100, HEIGHT*1/2-200, 200, 50, 'How to Play', function(){howToPlay()}, 'arial', 15),
		  	    new menuButton(WIDTH/2-100, HEIGHT*1/2-175, 200, 50, 'Character select', function(){characterSelect()}, 'arial', 15),
            new menuButton(WIDTH/2-100, HEIGHT*1/2-150, 200, 50, 'Solo Game', function(){singlePlayerButton()}, 'arial', 15),
            new menuButton(WIDTH/2-100, HEIGHT*1/2-125, 200, 50, 'Host Game', function(){hostButton()}, 'arial', 15),
            new menuButton(WIDTH/2-100, HEIGHT*1/2-100, 200, 50, 'Join Game', function(){joinButton()}, 'arial', 15)],

	    howToPlay:[new menuButton(WIDTH/2-100, HEIGHT*1/2-200, 200, 50, 'Back', function(){game.switchMenu(game.menus.main)}, 'arial', 15),
				],

	    ping:[new menuButton(WIDTH/2-100, HEIGHT*1/2-200, 200, 50, 'Ready?', function(){mainConn.send([1,peerId])}, 'arial', 15)],

      host:[new menuButton(WIDTH/2-100, HEIGHT*1/2-425, 200, 50, 'Start Game', function(){startButton()}, 'arial', 15)],

      join:[new menuButton(WIDTH/2-100, HEIGHT*1/2-400, 200, 50, 'Connect', function(){connectButton()}, 'arial', 15)],

      charSelect:[new menuButton(50,- WIDTH + 100, 200, 50, 'P1', function(){changeChar(1)}, 'arial', 15),
                  new menuButton(50,- WIDTH + 150, 200, 50, 'P2', function(){changeChar(2)}, 'arial', 15),]

    }
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
    for(let i = 0; i < this.attacks.length; i++){
      this.attacks[i].draw(this.attacks[i].x-this.cameraX+WIDTH/2,this.attacks[i].y-this.cameraY+HEIGHT/2);
      if(this.attacks[i].currentFrame==this.attacks[i].totalFrames){
        this.attacks.splice(i, 1)
        i -= 1
      }
    }
    for(let i = 0; i < this.sprites.length; i++){
      this.sprites[i].draw();
    }
    this.player1.draw(this.player1.x-this.cameraX+WIDTH/2, this.player1.y-this.cameraY+HEIGHT/2)
    if(this.player2){
    this.player2.draw(this.player2.x-this.cameraX+WIDTH/2, this.player2.y-this.cameraY+HEIGHT/2)
  }
  }

  switchMenu(target){
    for(let i = 0; i < this.currentMenu.length; i++){
      this.currentMenu[i].deactivate();
    }
    for(let i = 0; i < target.length; i++){
      target[i].activate();
    }
    this.currentMenu = target;
  }

  drawMenu(menu){
    for(let i = 0;i< menu.length; i++){

      menu[i].draw(menu[i].x, menu[i].y)

    }

  }

  switchState(target){
    ctx.clearRect(0,0,WIDTH,HEIGHT)
    if(this.state == 0){
      for(let i = 0; i< this.currentMenu.length; i++){
        this.currentMenu[i].deactivate();
      }
    }
    if(target == 0){
      for(let i = 0; i< this.currentMenu.length; i++){
        this.currentMenu = this.menus.main;
        this.switchMenu(this.currentMenu);
    }

  }
  this.state = target/1;
}


  stateEngine(){

    switch(this.state){
      case 0:
        ctx.fillRect(0,0,WIDTH,HEIGHT)
        this.drawMenu(this.currentMenu);
        break;
      case 1: //hosting
        this.player1.mouseAngle();
        this.player1.move(keysDown);
        this.player2.move(this.p2Keys)
        this.drawMap(this.map);
        this.drawMap(this.mapAdds);
        this.drawMap(this.mapCollision)
        this.drawSprites();
        //this.player1.basicAttack();
        mainConn.send([5, [this.player1.x,this.player1.y, this.player1.image],[this.player2.x,this.player2.y,this.player2.image]])

        break;
      case 2://joining
        mainConn.send([3, keysDown])
      case 3: //singlePlayer
        this.player1.mouseAngle();
        if(this.player1.effects.moveLock<=0){
          this.player1.move(keysDown);
        }
        this.drawMap(this.map);
        this.drawMap(this.mapAdds);
        this.drawMap(this.mapCollision)
        this.drawSprites();
        //this.player1.basicAttack();
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
  game.player1.reduceCooldowns();
  if(game.player1.effects.walking && ticks%4 ==0){
    game.player1.incrementFrame(2)
  }
  for(let i = 0; i < game.attacks.length; i++){
    if(ticks%game.attacks[i].ticksPerFrame<1){
      game.attacks[i].incrementFrame()
    }else{

    }
  }
}

var tickCount = setInterval(updateTicks, 50)
requestInterval(update, frameDelay)
